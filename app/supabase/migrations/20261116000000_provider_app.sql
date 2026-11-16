-- MUJEEB provider app: company accounts, editing their own company, stories, media uploads,
-- followers and activity stats.
--
-- Provider accounts are normal Supabase Auth users (email + password). A Super Admin links an
-- account to a company by adding a row to company_members, e.g.
--   insert into public.company_members (user_id, company_id)
--   select id, 'c4' from auth.users where email = 'owner@example.com';

-- ───────────────────────── Company accounts ─────────────────────────

create table public.company_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id text not null references public.companies(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);
create index on public.company_members (company_id);
alter table public.company_members enable row level security;
create policy "own memberships" on public.company_members for select to authenticated using (user_id = auth.uid());

-- Used by the policies below. security definer so it can read company_members under RLS.
create function public.is_company_member(cid text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from company_members where company_id = cid and user_id = auth.uid());
$$;
revoke execute on function public.is_company_member(text) from public, anon;
grant execute on function public.is_company_member(text) to authenticated;

-- ───────────────────────── Company profile ─────────────────────────

create policy "members read" on public.companies for select to authenticated using (public.is_company_member(id));
create policy "members update" on public.companies for update to authenticated
  using (public.is_company_member(id)) with check (public.is_company_member(id));
-- Providers edit their profile; verification, publishing and feature switches stay with the Super Admin.
revoke update on public.companies from authenticated;
grant update (name_ar, name_en, description_ar, description_en, city_ar, city_en, governorate, cover_photo, logo_url, phone, founded_year)
  on public.companies to authenticated;

-- ───────────────────────── Branches (with map location) ─────────────────────────

alter table public.company_branches
  add column address_ar text,
  add column address_en text,
  add column lat double precision check (lat between -90 and 90),
  add column lng double precision check (lng between -180 and 180);

create policy "members manage" on public.company_branches for all to authenticated
  using (public.is_company_member(company_id)) with check (public.is_company_member(company_id));

-- ───────────────────────── Services and projects ─────────────────────────

alter table public.services alter column id set default gen_random_uuid()::text;
alter table public.portfolio_albums alter column id set default gen_random_uuid()::text;

-- Services and projects can only use categories the Super Admin approved for the company.
create function public.company_has_category(cid text, cat int) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from company_categories where company_id = cid and category_id = cat);
$$;
revoke execute on function public.company_has_category(text, int) from public, anon;
grant execute on function public.company_has_category(text, int) to authenticated;

create policy "members manage" on public.services for all to authenticated
  using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id) and public.company_has_category(company_id, category_id));
create policy "members manage" on public.portfolio_albums for all to authenticated
  using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id) and public.company_has_category(company_id, category_id));

-- Keep a project's photo count and cover in step with its photos.
create function public.sync_album_photos() returns trigger language plpgsql as $$
begin
  new.photo_count := coalesce(array_length(new.photos, 1), 0);
  if new.photo_count > 0 and (new.cover_photo is null or new.cover_photo = '' or not new.cover_photo = any (new.photos)) then
    new.cover_photo := new.photos[1];
  end if;
  return new;
end $$;
create trigger portfolio_albums_sync_photos before insert or update on public.portfolio_albums
  for each row execute function public.sync_album_photos();

-- ───────────────────────── Stories (24 hours) ─────────────────────────

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  media_url text not null,
  poster_url text,                              -- still frame for video thumbnails
  caption_ar text not null default '',
  caption_en text not null default '',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
create index on public.stories (company_id, created_at desc);
create index on public.stories (expires_at);
alter table public.stories enable row level security;
create policy "public read live" on public.stories for select using (expires_at > now());
create policy "members manage" on public.stories for all to authenticated
  using (public.is_company_member(company_id)) with check (public.is_company_member(company_id));

-- ───────────────────────── Media uploads ─────────────────────────
-- Files live in the public "media" bucket under <company id>/…; only that company's members can write there.

do $$ begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('media', 'media', true, 157286400, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'])
    on conflict (id) do nothing;

    create policy "media members insert" on storage.objects for insert to authenticated
      with check (bucket_id = 'media' and public.is_company_member((storage.foldername(name))[1]));
    create policy "media members update" on storage.objects for update to authenticated
      using (bucket_id = 'media' and public.is_company_member((storage.foldername(name))[1]));
    create policy "media members delete" on storage.objects for delete to authenticated
      using (bucket_id = 'media' and public.is_company_member((storage.foldername(name))[1]));
  end if;
end $$;

-- ───────────────────────── Followers ─────────────────────────

create table public.customer_follows (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_id text not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);
create index on public.customer_follows (company_id);
alter table public.customer_follows enable row level security;
create policy "own follows" on public.customer_follows for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "members read followers" on public.customer_follows for select to authenticated
  using (public.is_company_member(company_id));

-- ───────────────────────── Activity (for provider stats) ─────────────────────────
-- Logged by the customer app. Clicks are interactions, not confirmed business.

create table public.company_events (
  id bigint generated always as identity primary key,
  company_id text not null references public.companies(id) on delete cascade,
  kind text not null check (kind in ('profile_view', 'service_view', 'story_view', 'whatsapp', 'call', 'directions')),
  ref_id text,                                  -- service or story id, when relevant
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index on public.company_events (company_id, created_at desc);
alter table public.company_events enable row level security;
create policy "log own events" on public.company_events for insert to authenticated with check (user_id = auth.uid());
create policy "members read" on public.company_events for select to authenticated using (public.is_company_member(company_id));

-- ───────────────────────── Stats ─────────────────────────
-- Daily counts per kind for the last 2 × `days` days (the current period and the one before),
-- including new followers. Members of the company only.

create function public.company_stats(cid text, days int default 14)
returns table (kind text, day date, n bigint)
language sql stable security definer set search_path = public as $$
  with since as (select now() - make_interval(days => days * 2) as t)
  select e.kind, (e.created_at at time zone 'Asia/Muscat')::date, count(*)
  from (
    select ev.kind, ev.created_at from company_events ev, since where ev.company_id = cid and ev.created_at >= since.t
    union all
    select 'follow', f.created_at from customer_follows f, since where f.company_id = cid and f.created_at >= since.t
  ) e
  where public.is_company_member(cid)
  group by 1, 2;
$$;
revoke execute on function public.company_stats(text, int) from public, anon;
grant execute on function public.company_stats(text, int) to authenticated;
