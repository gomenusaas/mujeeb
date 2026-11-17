-- Each service gets its own cover image: the photo at the top of the service page in the
-- customer app (already cropped to the header shape by the provider app). Optional: without
-- one, the app shows the service's first work photo, then the company's cover.
alter table public.services add column if not exists cover_url text;

comment on column public.services.cover_url is
  'Header image of the service page (cropped to about 39:25). Null = first work photo, then the company cover.';
