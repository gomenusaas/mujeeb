-- The customer app's home «الخدمات» grid: which services show, in what order, under what name.
-- Each tile opens its category's page. Platform admins edit it in the admin app («الصفحة الرئيسية»);
-- with no rows the app falls back to the first categories and their short names.
create table public.home_services (
  id bigint generated always as identity primary key,
  category_id integer not null references public.categories (id) on delete cascade,
  label_ar text not null check (length(trim(label_ar)) between 1 and 40),
  label_en text not null default '' check (length(label_en) <= 40),
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index home_services_position_idx on public.home_services (position);

alter table public.home_services enable row level security;
create policy "public read" on public.home_services for select using (true);
create policy "admins write" on public.home_services for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());
grant select on public.home_services to anon, authenticated;
grant insert, update, delete on public.home_services to authenticated;

-- Start from what the grid shows today: the first 8 categories with their short names.
insert into public.home_services (category_id, label_ar, label_en, position)
select id, short_ar, coalesce(short_en, ''), (row_number() over (order by sort_order, id)) - 1
from public.categories
order by sort_order, id
limit 8;
