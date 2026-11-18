-- Search keywords on services: up to 7 words or short phrases (Arabic or English, up to 30 characters
-- each) that the company adds in the provider app. Customers never see them; the customer app's search
-- matches them along with names, titles and the service and project descriptions.

create or replace function public.keywords_ok(k text[]) returns boolean
language sql immutable set search_path = public as $$
  select coalesce(cardinality(k), 0) <= 7
     and not exists (select 1 from unnest(k) x where length(btrim(x)) not between 1 and 30)
$$;

alter table public.services add column if not exists keywords text[] not null default '{}';
alter table public.services drop constraint if exists services_keywords_ok;
alter table public.services add constraint services_keywords_ok check (public.keywords_ok(keywords));

-- Admin: each service of a company with its keywords (to spot unrelated ones).
create or replace function public.admin_company_keywords(cid text)
returns table (id text, title_ar text, title_en text, category_id int, keywords text[])
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select s.id, s.title_ar, s.title_en, s.category_id, s.keywords
  from services s where s.company_id = cid order by s.position, s.title_ar;
end $$;
revoke execute on function public.admin_company_keywords(text) from public, anon;
grant execute on function public.admin_company_keywords(text) to authenticated;
