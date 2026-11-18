-- Project page details (all optional, set by the company in the provider app): a description,
-- the month the project was completed (stored as the 1st of that month), the area in m², and
-- how many weeks it took.
alter table public.portfolio_albums
  add column if not exists description_ar text not null default '',
  add column if not exists description_en text not null default '',
  add column if not exists completed_on date,
  add column if not exists area_m2 int check (area_m2 is null or area_m2 > 0),
  add column if not exists duration_weeks int check (duration_weeks is null or duration_weeks > 0);
