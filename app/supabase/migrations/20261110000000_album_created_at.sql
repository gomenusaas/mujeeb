-- When each portfolio album was added to the platform. Home shows the newest six.
alter table public.portfolio_albums
  add column if not exists created_at timestamptz not null default now();

create index if not exists portfolio_albums_created_at_idx on public.portfolio_albums (created_at desc);
