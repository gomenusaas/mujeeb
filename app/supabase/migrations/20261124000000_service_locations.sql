-- Service locations customers pick from («موقع الخدمة»): governorates and their wilayats, in the
-- order the platform admin sets in the admin app. Everyone reads the active ones; only platform
-- admins add, edit, reorder or hide them. `region` links a governorate to the app's simplified
-- coverage regions (public.locations) where there is one.

create table public.governorates (
  id text primary key,
  country text not null default 'OM',
  name_ar text not null,
  name_en text not null,
  region text references public.locations(id) on delete set null,
  position int not null default 0,
  is_active boolean not null default true
);

create table public.wilayats (
  id text primary key,
  governorate_id text not null references public.governorates(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  position int not null default 0,
  is_active boolean not null default true
);
create index wilayats_governorate_idx on public.wilayats (governorate_id, position);

alter table public.governorates enable row level security;
alter table public.wilayats enable row level security;

create policy "public read" on public.governorates for select using (is_active);
create policy "public read" on public.wilayats for select
  using (is_active and exists (select 1 from public.governorates g where g.id = governorate_id and g.is_active));
-- Platform admins see everything (hidden ones too) and can change it.
create policy "admins read" on public.governorates for select to authenticated using (public.is_platform_admin());
create policy "admins write" on public.governorates for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy "admins read" on public.wilayats for select to authenticated using (public.is_platform_admin());
create policy "admins write" on public.wilayats for all to authenticated using (public.is_platform_admin()) with check (public.is_platform_admin());

grant select on public.governorates, public.wilayats to anon, authenticated;
grant insert, update, delete on public.governorates, public.wilayats to authenticated;

-- Oman's 11 governorates and 61 wilayats.
insert into public.governorates (id, name_ar, name_en, region, position) values
  ('muscat', 'مسقط', 'Muscat', 'muscat', 0),
  ('dhofar', 'ظفار', 'Dhofar', 'dhofar', 1),
  ('musandam', 'مسندم', 'Musandam', null, 2),
  ('buraimi', 'البريمي', 'Al Buraimi', null, 3),
  ('dakhiliyah', 'الداخلية', 'Ad Dakhiliyah', 'dakhiliyah', 4),
  ('north-batinah', 'شمال الباطنة', 'North Al Batinah', 'batinah', 5),
  ('south-batinah', 'جنوب الباطنة', 'South Al Batinah', 'batinah', 6),
  ('south-sharqiyah', 'جنوب الشرقية', 'South Ash Sharqiyah', 'sharqiyah', 7),
  ('north-sharqiyah', 'شمال الشرقية', 'North Ash Sharqiyah', 'sharqiyah', 8),
  ('dhahirah', 'الظاهرة', 'Ad Dhahirah', null, 9),
  ('wusta', 'الوسطى', 'Al Wusta', null, 10)
on conflict (id) do nothing;

insert into public.wilayats (id, governorate_id, name_ar, name_en, position) values
  ('muscat', 'muscat', 'مسقط', 'Muscat', 0),
  ('muttrah', 'muscat', 'مطرح', 'Muttrah', 1),
  ('bawshar', 'muscat', 'بوشر', 'Bawshar', 2),
  ('seeb', 'muscat', 'السيب', 'As Seeb', 3),
  ('amerat', 'muscat', 'العامرات', 'Al Amerat', 4),
  ('qurayyat', 'muscat', 'قريات', 'Qurayyat', 5),
  ('salalah', 'dhofar', 'صلالة', 'Salalah', 0),
  ('taqah', 'dhofar', 'طاقة', 'Taqah', 1),
  ('mirbat', 'dhofar', 'مرباط', 'Mirbat', 2),
  ('rakhyut', 'dhofar', 'رخيوت', 'Rakhyut', 3),
  ('thumrait', 'dhofar', 'ثمريت', 'Thumrait', 4),
  ('dhalkut', 'dhofar', 'ضلكوت', 'Dhalkut', 5),
  ('mazyunah', 'dhofar', 'المزيونة', 'Al Mazyunah', 6),
  ('muqshin', 'dhofar', 'مقشن', 'Muqshin', 7),
  ('shalim', 'dhofar', 'شليم وجزر الحلانيات', 'Shalim and the Hallaniyat Islands', 8),
  ('sadah', 'dhofar', 'سدح', 'Sadah', 9),
  ('khasab', 'musandam', 'خصب', 'Khasab', 0),
  ('dibba', 'musandam', 'دبا', 'Dibba', 1),
  ('bukha', 'musandam', 'بخا', 'Bukha', 2),
  ('madha', 'musandam', 'مدحاء', 'Madha', 3),
  ('buraimi', 'buraimi', 'البريمي', 'Al Buraimi', 0),
  ('mahdah', 'buraimi', 'محضة', 'Mahdah', 1),
  ('sunaynah', 'buraimi', 'السنينة', 'As Sunaynah', 2),
  ('nizwa', 'dakhiliyah', 'نزوى', 'Nizwa', 0),
  ('bahla', 'dakhiliyah', 'بهلاء', 'Bahla', 1),
  ('manah', 'dakhiliyah', 'منح', 'Manah', 2),
  ('hamra', 'dakhiliyah', 'الحمراء', 'Al Hamra', 3),
  ('adam', 'dakhiliyah', 'أدم', 'Adam', 4),
  ('izki', 'dakhiliyah', 'إزكي', 'Izki', 5),
  ('samail', 'dakhiliyah', 'سمائل', 'Samail', 6),
  ('bidbid', 'dakhiliyah', 'بدبد', 'Bidbid', 7),
  ('sohar', 'north-batinah', 'صحار', 'Sohar', 0),
  ('shinas', 'north-batinah', 'شناص', 'Shinas', 1),
  ('liwa', 'north-batinah', 'لوى', 'Liwa', 2),
  ('saham', 'north-batinah', 'صحم', 'Saham', 3),
  ('khaburah', 'north-batinah', 'الخابورة', 'Al Khaburah', 4),
  ('suwaiq', 'north-batinah', 'السويق', 'As Suwaiq', 5),
  ('rustaq', 'south-batinah', 'الرستاق', 'Ar Rustaq', 0),
  ('awabi', 'south-batinah', 'العوابي', 'Al Awabi', 1),
  ('nakhal', 'south-batinah', 'نخل', 'Nakhal', 2),
  ('wadi-maawil', 'south-batinah', 'وادي المعاول', 'Wadi Al Ma''awil', 3),
  ('barka', 'south-batinah', 'بركاء', 'Barka', 4),
  ('musanaah', 'south-batinah', 'المصنعة', 'Al Musana''ah', 5),
  ('sur', 'south-sharqiyah', 'صور', 'Sur', 0),
  ('kamil', 'south-sharqiyah', 'الكامل والوافي', 'Al Kamil Wal Wafi', 1),
  ('jbb-hassan', 'south-sharqiyah', 'جعلان بني بو حسن', 'Jalan Bani Bu Hassan', 2),
  ('jbb-ali', 'south-sharqiyah', 'جعلان بني بو علي', 'Jalan Bani Bu Ali', 3),
  ('masirah', 'south-sharqiyah', 'مصيرة', 'Masirah', 4),
  ('ibra', 'north-sharqiyah', 'إبراء', 'Ibra', 0),
  ('mudhaibi', 'north-sharqiyah', 'المضيبي', 'Al Mudhaibi', 1),
  ('bidiyah', 'north-sharqiyah', 'بدية', 'Bidiyah', 2),
  ('qabil', 'north-sharqiyah', 'القابل', 'Al Qabil', 3),
  ('wadi-bani-khalid', 'north-sharqiyah', 'وادي بني خالد', 'Wadi Bani Khalid', 4),
  ('dima', 'north-sharqiyah', 'دماء والطائيين', 'Dima Wa At Taiyyin', 5),
  ('ibri', 'dhahirah', 'عبري', 'Ibri', 0),
  ('yanqul', 'dhahirah', 'ينقل', 'Yanqul', 1),
  ('dhank', 'dhahirah', 'ضنك', 'Dhank', 2),
  ('haima', 'wusta', 'هيماء', 'Haima', 0),
  ('mahout', 'wusta', 'محوت', 'Mahout', 1),
  ('duqm', 'wusta', 'الدقم', 'Ad Duqm', 2),
  ('jazir', 'wusta', 'الجازر', 'Al Jazir', 3)
on conflict (id) do nothing;
