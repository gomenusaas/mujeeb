-- Featured projects: a company picks up to 7 of its projects for «مشاريع مميزة» on its page in the
-- customer app (provider app: the star on each project). Admins can see them and take one off.

alter table public.portfolio_albums add column if not exists is_featured boolean not null default false;
create index if not exists portfolio_albums_featured on public.portfolio_albums (company_id) where is_featured;

-- At most 7 featured projects per company. Counts every project of the company (published or not),
-- so it runs as definer to see past row security.
create or replace function public.limit_featured_projects() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.is_featured and (tg_op = 'INSERT' or not old.is_featured or new.company_id is distinct from old.company_id) then
    perform pg_advisory_xact_lock(hashtext('featured:' || new.company_id));
    if (select count(*) from portfolio_albums where company_id = new.company_id and is_featured and id <> new.id) >= 7 then
      raise exception 'featured_limit' using errcode = 'P0001', hint = 'A company can feature at most 7 projects';
    end if;
  end if;
  return new;
end $$;
revoke execute on function public.limit_featured_projects() from public, anon, authenticated;

drop trigger if exists portfolio_albums_limit_featured on public.portfolio_albums;
create trigger portfolio_albums_limit_featured before insert or update of is_featured, company_id on public.portfolio_albums
  for each row execute function public.limit_featured_projects();

-- ───────────────────────── Admin ─────────────────────────

-- A company's featured projects, newest completed first.
create or replace function public.admin_company_featured(cid text)
returns table (id text, title_ar text, title_en text, cover_photo text, category_id int, is_published boolean, completed_on date)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return query
  select a.id, a.title_ar, a.title_en, a.cover_photo, a.category_id, a.is_published, a.completed_on
  from portfolio_albums a where a.company_id = cid and a.is_featured
  order by coalesce(a.completed_on, a.created_at::date) desc, a.created_at desc;
end $$;

-- Takes a project off (or puts it on) the company's featured list.
create or replace function public.admin_set_featured(aid text, on_ boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  update portfolio_albums set is_featured = on_ where id = aid;
end $$;

revoke execute on function public.admin_company_featured(text) from public, anon;
grant execute on function public.admin_company_featured(text) to authenticated;
revoke execute on function public.admin_set_featured(text, boolean) from public, anon;
grant execute on function public.admin_set_featured(text, boolean) to authenticated;
