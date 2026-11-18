-- Public follower counts for the company page («١٢ متابعًا» + Follow). Returns only numbers per
-- live company, never who follows. The caller's own follow is left out, so the app can add it back
-- from its own state and the count updates the moment they tap Follow.
create or replace function public.follower_counts()
returns table (company_id text, n int)
language sql stable security definer set search_path = public as $$
  select f.company_id, count(*)::int
  from customer_follows f
  where f.user_id is distinct from auth.uid() and company_is_live(f.company_id)
  group by f.company_id;
$$;

revoke execute on function public.follower_counts() from public;
grant execute on function public.follower_counts() to anon, authenticated;
