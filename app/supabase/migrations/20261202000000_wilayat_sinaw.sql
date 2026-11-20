-- Adds Sinaw («سناو») to North Sharqiyah, right after Al Mudhaibi (the wilayats after it move down one place).
update public.wilayats set position = position + 1 where governorate_id = 'north-sharqiyah' and position >= 2;
insert into public.wilayats (id, governorate_id, name_ar, name_en, position)
values ('sinaw', 'north-sharqiyah', 'سناو', 'Sinaw', 2)
on conflict (id) do nothing;
