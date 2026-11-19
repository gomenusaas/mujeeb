-- Sub-services: a fixed list per category, managed by platform admins in the admin app (e.g. interior design:
-- «الصالات», «غرف النوم», «المجالس»). When a company adds a service in the provider app it picks the sub-services
-- it covers (up to 5) and may also type up to 3 of its own (custom_subs) when the list doesn't have them.
-- The customer app turns the list into a category page's chips (filter) and searches both.

create table public.sub_services (
  id text primary key,
  category_id int not null references public.categories(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  position int not null default 0,
  is_active boolean not null default true
);
create index sub_services_category_idx on public.sub_services (category_id, position);

alter table public.sub_services enable row level security;
create policy "public read" on public.sub_services for select using (is_active);
-- Platform admins see everything (hidden ones too) and can change it.
create policy "admins read" on public.sub_services for select to authenticated using (public.is_platform_admin());
create policy "admins write" on public.sub_services for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
grant select on public.sub_services to anon, authenticated;
grant insert, update, delete on public.sub_services to authenticated;

alter table public.services
  add column if not exists sub_services text[] not null default '{}',
  add column if not exists custom_subs text[] not null default '{}';
alter table public.services drop constraint if exists services_subs_ok;
alter table public.services add constraint services_subs_ok check (
  cardinality(sub_services) <= 5
  and cardinality(custom_subs) <= 3
  and public.keywords_ok(custom_subs)
);

-- A service's picked sub-services must be in the fixed list of its own category (unknown or other-category ids
-- are refused). Runs as definer so hidden sub-services still count as known.
create or replace function public.check_service_subs() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from unnest(new.sub_services) x
    where not exists (select 1 from sub_services s where s.id = x and s.category_id = new.category_id)
  ) then
    raise exception 'sub_services_invalid' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.check_service_subs() from public, anon, authenticated;
drop trigger if exists services_check_subs on public.services;
create trigger services_check_subs before insert or update of sub_services, category_id on public.services
  for each row execute function public.check_service_subs();

-- Admin: the sub-services companies typed themselves, with how many services use each (to add good ones to the list).
create or replace function public.admin_custom_subs()
returns table (category_id int, name text, uses bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select s.category_id, btrim(x) as name, count(*) as uses
  from services s, unnest(s.custom_subs) x
  group by s.category_id, btrim(x) order by count(*) desc, btrim(x);
end $$;
revoke execute on function public.admin_custom_subs() from public, anon;
grant execute on function public.admin_custom_subs() to authenticated;

-- Deleting a sub-service takes it off the services that picked it.
create or replace function public.drop_deleted_sub() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update services set sub_services = array_remove(sub_services, old.id) where old.id = any (sub_services);
  return old;
end $$;
revoke execute on function public.drop_deleted_sub() from public, anon, authenticated;
drop trigger if exists sub_services_cleanup on public.sub_services;
create trigger sub_services_cleanup after delete on public.sub_services
  for each row execute function public.drop_deleted_sub();
