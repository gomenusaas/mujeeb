-- Working hours per company and weekday, set by the company in the provider app.
-- day: 0 = Sunday … 6 = Saturday (JavaScript's getDay()). Times are Asia/Muscat local time.
-- A second shift (opens2/closes2) covers split hours such as 08:00–13:00 and 16:00–21:00.
-- A closing time earlier than the opening time means the shift ends after midnight.

create table public.company_hours (
  company_id text not null references public.companies(id) on delete cascade,
  day smallint not null check (day between 0 and 6),
  is_closed boolean not null default false,
  opens time,
  closes time,
  opens2 time,
  closes2 time,
  primary key (company_id, day),
  check (is_closed or (opens is not null and closes is not null)),
  check ((opens2 is null) = (closes2 is null))
);
alter table public.company_hours enable row level security;
create policy "public read" on public.company_hours for select using (true);
create policy "members manage" on public.company_hours for all to authenticated
  using (public.is_company_member(company_id)) with check (public.is_company_member(company_id));
