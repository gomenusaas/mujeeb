-- Project videos and the company gallery.
--
-- A project (portfolio album) now holds videos next to its photos. The company page can show a
-- gallery of photos and videos from all of the company's projects; the company picks what appears there.
-- Everything is in the gallery unless its URL is listed in gallery_hidden.

alter table public.portfolio_albums
  add column videos text[] not null default '{}',
  add column gallery_hidden text[] not null default '{}';
