-- Demo only: a number added to a company's real follower count (set back to 0 before launch).
alter table public.companies add column if not exists followers_offset int not null default 0;

create or replace function public.follower_counts()
returns table (company_id text, n int)
language sql stable security definer set search_path = public as $$
  select c.id, (coalesce(f.n, 0) + c.followers_offset)::int
  from companies c
  left join (
    select company_id, count(*) as n from customer_follows
    where user_id is distinct from auth.uid()
    group by company_id
  ) f on f.company_id = c.id
  where company_is_live(c.id) and (f.n is not null or c.followers_offset > 0);
$$;

update public.companies set followers_offset = 175 where id = 'g1-1';
