-- Remove the «أنظمة الحريق والإنذار» category (id 7) for good, at the owner's request (2026-11-21):
-- the six companies that only worked in it (with everything that belongs to them), the other company's services and
-- projects in it, its sub-services and home tile (cascade), and the category itself.
delete from public.companies c
where exists (select 1 from public.company_categories x where x.company_id = c.id and x.category_id = 7)
  and not exists (select 1 from public.company_categories x where x.company_id = c.id and x.category_id <> 7);
delete from public.portfolio_albums where category_id = 7;
delete from public.services where category_id = 7;
delete from public.company_categories where category_id = 7;
delete from public.categories where id = 7;

-- Keep the home grid full (8 tiles + «المزيد»): gardens takes the freed place.
insert into public.home_services (category_id, label_ar, label_en, position)
select 8, short_ar, coalesce(short_en, ''), 7 from public.categories where id = 8
  and not exists (select 1 from public.home_services where category_id = 8);

-- The grid shows 9 tiles and no «المزيد» (2026-11-21): kitchens takes the ninth place.
insert into public.home_services (category_id, label_ar, label_en, position)
select 9, short_ar, coalesce(short_en, ''), 8 from public.categories where id = 9
  and not exists (select 1 from public.home_services where category_id = 9);
