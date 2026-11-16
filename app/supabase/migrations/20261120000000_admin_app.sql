-- MUJEEB admin app: platform-wide management for platform admins only.
--
-- Every function checks is_platform_admin() first and runs as security definer, so the admin app
-- needs no secret key: it signs in like any user and calls these functions. Non-admins get an error.

create function public.assert_admin() returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Admins only' using errcode = '42501'; end if;
end $$;
revoke execute on function public.assert_admin() from public, anon;
grant execute on function public.assert_admin() to authenticated;

-- ───────────────────────── Overview ─────────────────────────

create function public.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return jsonb_build_object(
    'approved', (select count(*) from companies where status = 'approved' and is_published),
    'pending', (select count(*) from companies where status = 'pending'),
    'rejected', (select count(*) from companies where status = 'rejected'),
    'hidden', (select count(*) from companies where status = 'approved' and not is_published),
    'customers', (select count(*) from profiles where kind = 'customer'),
    'providers', (select count(*) from profiles where kind = 'provider'),
    'new_users_7d', (select count(*) from profiles where created_at > now() - interval '7 days'),
    'events_7d', (select count(*) from company_events where created_at > now() - interval '7 days'),
    'contacts_7d', (select count(*) from company_events where created_at > now() - interval '7 days' and kind in ('whatsapp', 'call', 'directions')),
    'follows', (select count(*) from customer_follows),
    'favorites', (select count(*) from customer_favorites),
    'services', (select count(*) from services),
    'projects', (select count(*) from portfolio_albums),
    'live_stories', (select count(*) from stories where expires_at > now())
  );
end $$;

-- ───────────────────────── Companies ─────────────────────────

-- All companies, newest first. status: 'pending' | 'approved' (live) | 'rejected' | 'hidden' (approved but unpublished).
create function public.admin_companies(q text default null, st text default null)
returns table (id text, name_ar text, name_en text, status text, is_verified boolean, is_published boolean,
               city_ar text, city_en text, governorate text, phone text, description_ar text, description_en text,
               owner_email text, categories int[], services bigint, projects bigint, followers bigint,
               logo_url text, cover_photo text, review_note text, created_at timestamptz, submitted_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select c.id, c.name_ar, c.name_en, c.status, c.is_verified, c.is_published, c.city_ar, c.city_en, c.governorate, c.phone,
         c.description_ar, c.description_en,
         (select u.email::text from company_members m join auth.users u on u.id = m.user_id
           where m.company_id = c.id order by m.created_at limit 1),
         array(select cc.category_id from company_categories cc where cc.company_id = c.id order by cc.position),
         (select count(*) from services s where s.company_id = c.id),
         (select count(*) from portfolio_albums a where a.company_id = c.id),
         (select count(*) from customer_follows f where f.company_id = c.id),
         c.logo_url, c.cover_photo, c.review_note, c.created_at, c.submitted_at
  from companies c
  where (st is null or (st = 'hidden' and c.status = 'approved' and not c.is_published)
         or (st = 'approved' and c.status = 'approved' and c.is_published) or (st not in ('hidden', 'approved') and c.status = st))
    and (q is null or q = '' or c.name_ar ilike '%' || q || '%' or c.name_en ilike '%' || q || '%' or c.phone ilike '%' || q || '%' or c.id = q)
  order by (c.status = 'pending') desc, coalesce(c.submitted_at, c.created_at) desc
  limit 500;
end $$;

-- Verified badge and visibility (hidden companies disappear from the customer app).
create function public.admin_set_company_flags(cid text, verified boolean default null, published boolean default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  update companies set is_verified = coalesce(verified, is_verified), is_published = coalesce(published, is_published) where id = cid;
end $$;

-- Basic profile fields (companies edit the rest themselves).
create function public.admin_update_company(cid text, p_name_ar text, p_name_en text, p_phone text, p_city_ar text, p_city_en text,
  p_governorate text, p_description_ar text, p_description_en text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if coalesce(trim(p_name_ar), '') = '' or coalesce(trim(p_name_en), '') = '' then raise exception 'Name is required'; end if;
  update companies set name_ar = trim(p_name_ar), name_en = trim(p_name_en), phone = trim(p_phone), city_ar = trim(p_city_ar),
    city_en = trim(p_city_en), governorate = p_governorate, description_ar = coalesce(p_description_ar, ''), description_en = coalesce(p_description_en, '')
  where id = cid;
end $$;

-- Categories (1–3, the first is the main one). Companies can't change these themselves.
create function public.admin_set_company_categories(cid text, cats int[])
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if coalesce(array_length(cats, 1), 0) not between 1 and 3 then raise exception 'Choose 1 to 3 categories'; end if;
  delete from company_categories where company_id = cid;
  insert into company_categories (company_id, category_id, position)
    select cid, c, (o - 1)::int from unnest(cats) with ordinality as t(c, o);
end $$;

-- Deletes a company and everything that belongs to it (services, projects, stories, branches, hours, followers).
create function public.admin_delete_company(cid text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  delete from companies where id = cid;
end $$;

-- ───────────────────────── Company teams ─────────────────────────

create function public.admin_company_members(cid text)
returns table (user_id uuid, email text, full_name text, role text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select m.user_id, u.email::text, coalesce(p.full_name, ''), m.role, m.created_at
  from company_members m join auth.users u on u.id = m.user_id left join profiles p on p.id = m.user_id
  where m.company_id = cid order by m.created_at;
end $$;

-- Adds an existing account (it must have signed up already) to a company's team.
create function public.admin_add_member(cid text, p_email text, p_role text default 'editor')
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  perform public.assert_admin();
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then raise exception 'No account with this email' using errcode = 'P0002'; end if;
  insert into company_members (user_id, company_id, role) values (uid, cid, case when p_role = 'owner' then 'owner' else 'editor' end)
    on conflict (user_id, company_id) do update set role = excluded.role;
  update profiles set kind = 'provider' where id = uid;
end $$;

create function public.admin_remove_member(cid text, uid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  delete from company_members where company_id = cid and user_id = uid;
end $$;

-- ───────────────────────── Users ─────────────────────────

-- Every account (customers and company accounts), newest first.
create function public.admin_users(q text default null, p_kind text default null)
returns table (id uuid, email text, full_name text, kind text, sign_in_with text, created_at timestamptz, last_sign_in_at timestamptz,
               confirmed boolean, blocked boolean, is_admin boolean, companies text[])
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select u.id, u.email::text, coalesce(p.full_name, ''), coalesce(p.kind, 'customer'),
         coalesce(u.raw_app_meta_data ->> 'provider', 'email'), u.created_at, u.last_sign_in_at,
         u.email_confirmed_at is not null, coalesce(u.banned_until > now(), false),
         exists (select 1 from platform_admins a where a.user_id = u.id),
         array(select coalesce(nullif(c.name_ar, ''), c.name_en) from company_members m join companies c on c.id = m.company_id where m.user_id = u.id)
  from auth.users u left join profiles p on p.id = u.id
  where not coalesce(u.is_anonymous, false)
    and (p_kind is null or p_kind = '' or coalesce(p.kind, 'customer') = p_kind)
    and (q is null or q = '' or u.email ilike '%' || q || '%' or p.full_name ilike '%' || q || '%')
  order by u.created_at desc
  limit 500;
end $$;

-- Blocked accounts can't sign in (their current session ends within the hour).
create function public.admin_set_blocked(uid uuid, blocked boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if uid = auth.uid() then raise exception 'You can’t block your own account'; end if;
  update auth.users set banned_until = case when blocked then 'infinity'::timestamptz else null end where id = uid;
  if blocked then delete from auth.sessions where user_id = uid; end if;
end $$;

-- Deletes an account with its favorites and follows, plus any company where it is the only member.
create function public.admin_delete_user(uid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if uid = auth.uid() then raise exception 'You can’t delete your own account here'; end if;
  delete from companies c
  where exists (select 1 from company_members m where m.company_id = c.id and m.user_id = uid)
    and not exists (select 1 from company_members m where m.company_id = c.id and m.user_id <> uid);
  delete from auth.users where id = uid;
end $$;

-- ───────────────────────── Admins ─────────────────────────

create function public.admin_list_admins()
returns table (user_id uuid, email text, full_name text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select a.user_id, u.email::text, coalesce(p.full_name, ''), a.created_at, u.last_sign_in_at
  from platform_admins a join auth.users u on u.id = a.user_id left join profiles p on p.id = a.user_id
  order by a.created_at;
end $$;

create function public.admin_add_admin(p_email text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  perform public.assert_admin();
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then raise exception 'No account with this email' using errcode = 'P0002'; end if;
  insert into platform_admins (user_id) values (uid) on conflict do nothing;
end $$;

create function public.admin_remove_admin(uid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if uid = auth.uid() then raise exception 'Ask another admin to remove you'; end if;
  delete from platform_admins where user_id = uid;
end $$;

-- Only signed-in users can call these; each one then checks for an admin.
do $$ declare f text; begin
  foreach f in array array[
    'admin_overview()', 'admin_companies(text, text)', 'admin_set_company_flags(text, boolean, boolean)',
    'admin_update_company(text, text, text, text, text, text, text, text, text)', 'admin_set_company_categories(text, int[])',
    'admin_delete_company(text)', 'admin_company_members(text)', 'admin_add_member(text, text, text)', 'admin_remove_member(text, uuid)',
    'admin_users(text, text)', 'admin_set_blocked(uuid, boolean)', 'admin_delete_user(uuid)',
    'admin_list_admins()', 'admin_add_admin(text)', 'admin_remove_admin(uuid)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
