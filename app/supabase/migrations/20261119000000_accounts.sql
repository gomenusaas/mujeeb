-- Accounts for both apps.
--
-- Customers: sign up with email + password or Google; they need an account only to save favorites
-- and follow companies. Browsing works signed out.
-- Providers: sign up with email + password in the provider app, then register their company.
-- A new company stays hidden from customers (status 'pending') until a platform admin approves it.
-- Platform admins: listed in platform_admins; add yourself once, after signing up:
--   insert into public.platform_admins (user_id) select id from auth.users where email = 'you@example.com';

-- ───────────────────────── Profiles ─────────────────────────

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  kind text not null default 'customer' check (kind in ('customer', 'provider')),
  full_name text not null default '',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Every new account gets a profile. The name comes from sign-up (full_name) or Google (name).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce((to_jsonb(new) ->> 'is_anonymous')::boolean, false) then return new; end if;
  insert into profiles (id, kind, full_name) values (
    new.id,
    case when new.raw_user_meta_data ->> 'kind' = 'provider' then 'provider' else 'customer' end,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 120))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────── Platform admins ─────────────────────────

create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;
create policy "own row" on public.platform_admins for select to authenticated using (user_id = auth.uid());

create function public.is_platform_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from platform_admins where user_id = auth.uid());
$$;
revoke execute on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

-- ───────────────────────── Company approval ─────────────────────────

alter table public.companies
  add column status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  add column review_note text,
  add column submitted_at timestamptz;

-- Customers see a company, and everything that belongs to it, only once it is approved and published.
create function public.company_is_live(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from companies where id = cid and status = 'approved' and is_published);
$$;
grant execute on function public.company_is_live(text) to anon, authenticated;

drop policy "public read" on public.companies;
create policy "public read" on public.companies for select using (is_published and status = 'approved');
drop policy "public read" on public.company_categories;
create policy "public read" on public.company_categories for select using (public.company_is_live(company_id));
drop policy "public read" on public.company_service_areas;
create policy "public read" on public.company_service_areas for select using (public.company_is_live(company_id));
drop policy "public read" on public.company_branches;
create policy "public read" on public.company_branches for select using (public.company_is_live(company_id));
drop policy "public read" on public.services;
create policy "public read" on public.services for select using (is_published and public.company_is_live(company_id));
drop policy "public read" on public.portfolio_albums;
create policy "public read" on public.portfolio_albums for select using (is_published and public.company_is_live(company_id));
drop policy "public read" on public.company_hours;
create policy "public read" on public.company_hours for select using (public.company_is_live(company_id));
drop policy "public read live" on public.stories;
create policy "public read live" on public.stories for select using (expires_at > now() and public.company_is_live(company_id));

-- A company's own team still sees its categories and coverage while it waits for approval.
create policy "members read" on public.company_categories for select to authenticated using (public.is_company_member(company_id));
create policy "members read" on public.company_service_areas for select to authenticated using (public.is_company_member(company_id));

-- ───────────────────────── Company sign-up ─────────────────────────

-- Called by the provider app right after sign-up. Creates the company (pending), its categories
-- (1–3; the first is the main one), its home governorate as coverage, and makes the caller its owner.
create function public.register_company(
  p_name_ar text, p_name_en text, p_phone text, p_governorate text, p_city_ar text, p_city_en text, p_categories int[],
  p_description_ar text default '', p_description_en text default ''
) returns text
language plpgsql security definer set search_path = public as $$
declare cid text;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Sign in first';
  end if;
  if exists (select 1 from company_members where user_id = auth.uid()) then
    raise exception 'This account already has a company';
  end if;
  if coalesce(trim(p_name_ar), '') = '' or coalesce(trim(p_name_en), '') = '' or coalesce(trim(p_phone), '') = ''
     or coalesce(trim(p_city_ar), '') = '' or coalesce(trim(p_city_en), '') = '' then
    raise exception 'Name, phone and city are required';
  end if;
  if coalesce(array_length(p_categories, 1), 0) not between 1 and 3 then
    raise exception 'Choose 1 to 3 categories';
  end if;
  cid := 'co-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into companies (id, name_ar, name_en, description_ar, description_en, city_ar, city_en, governorate,
                         cover_photo, phone, is_verified, status, submitted_at)
  values (cid, trim(p_name_ar), trim(p_name_en), coalesce(p_description_ar, ''), coalesce(p_description_en, ''),
          trim(p_city_ar), trim(p_city_en), p_governorate, '', trim(p_phone), false, 'pending', now());
  insert into company_categories (company_id, category_id, position)
    select cid, c, (o - 1)::int from unnest(p_categories) with ordinality as t(c, o);
  insert into company_service_areas (company_id, location_id) values (cid, p_governorate);
  insert into company_members (user_id, company_id, role) values (auth.uid(), cid, 'owner');
  insert into profiles (id, kind) values (auth.uid(), 'provider')
    on conflict (id) do update set kind = 'provider';
  return cid;
end $$;
revoke execute on function public.register_company(text, text, text, text, text, text, int[], text, text) from public, anon;
grant execute on function public.register_company(text, text, text, text, text, text, int[], text, text) to authenticated;

-- After a rejection the company fixes its profile and asks for another review.
create function public.resubmit_company(cid text) returns void
language sql security definer set search_path = public as $$
  update companies set status = 'pending', submitted_at = now()
  where id = cid and status = 'rejected' and public.is_company_member(cid);
$$;
revoke execute on function public.resubmit_company(text) from public, anon;
grant execute on function public.resubmit_company(text) to authenticated;

-- ───────────────────────── Admin review ─────────────────────────

-- Companies waiting for review (and rejected ones), newest first, with the owner's email.
create function public.admin_company_queue()
returns table (id text, name_ar text, name_en text, phone text, city_ar text, city_en text, governorate text,
               status text, review_note text, submitted_at timestamptz, owner_email text, categories int[],
               services bigint, projects bigint, has_cover boolean, has_logo boolean)
language sql stable security definer set search_path = public as $$
  select c.id, c.name_ar, c.name_en, c.phone, c.city_ar, c.city_en, c.governorate, c.status, c.review_note,
         c.submitted_at,
         (select u.email::text from company_members m join auth.users u on u.id = m.user_id
           where m.company_id = c.id order by m.created_at limit 1),
         array(select cc.category_id from company_categories cc where cc.company_id = c.id order by cc.position),
         (select count(*) from services s where s.company_id = c.id),
         (select count(*) from portfolio_albums a where a.company_id = c.id),
         c.cover_photo <> '', coalesce(c.logo_url, '') <> ''
  from companies c
  where public.is_platform_admin() and c.status <> 'approved'
  order by (c.status = 'pending') desc, c.submitted_at desc nulls last;
$$;
revoke execute on function public.admin_company_queue() from public, anon;
grant execute on function public.admin_company_queue() to authenticated;

-- Approve (optionally marking the company verified) or reject with a note the company can read.
create function public.admin_review_company(cid text, approve boolean, note text default null, verified boolean default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Admins only'; end if;
  update companies set
    status = case when approve then 'approved' else 'rejected' end,
    review_note = case when approve then null else note end,
    is_verified = coalesce(verified, is_verified)
  where id = cid;
end $$;
revoke execute on function public.admin_review_company(text, boolean, text, boolean) from public, anon;
grant execute on function public.admin_review_company(text, boolean, text, boolean) to authenticated;

-- ───────────────────────── Activity from signed-out visitors ─────────────────────────
-- Browsing needs no account, so visits and taps are logged without one (user_id stays empty).

drop policy "log own events" on public.company_events;
create policy "log events" on public.company_events for insert to anon, authenticated
  with check (user_id is not distinct from auth.uid() and public.company_is_live(company_id));

-- ───────────────────────── Delete my account ─────────────────────────
-- Required by the App Store and Google Play. Removes the account and everything tied to it
-- (favorites, follows, profile). A company whose only member is this account is deleted too.

create function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Sign in first'; end if;
  delete from companies c
  where exists (select 1 from company_members m where m.company_id = c.id and m.user_id = me)
    and not exists (select 1 from company_members m where m.company_id = c.id and m.user_id <> me);
  delete from auth.users where id = me;
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
