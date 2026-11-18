-- Each project (portfolio album) belongs to one of the company's services. The service page in the
-- customer app shows the photos and videos of its projects (minus what the company hid from its
-- galleries), so companies don't upload the same photos twice. Optional: deleting a service keeps
-- its projects, unlinked.
alter table public.portfolio_albums
  add column if not exists service_id text references public.services(id) on delete set null;

create index if not exists portfolio_albums_service_id_idx on public.portfolio_albums (service_id);

comment on column public.portfolio_albums.service_id is
  'The service this project shows under (service page photo strip). Null = not linked to a service.';
