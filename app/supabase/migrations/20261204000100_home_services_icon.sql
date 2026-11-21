-- A home tile's icon, picked by the platform admin: the name of a flat icon the customer app ships in
-- public/art/flat (e.g. 'snowflake'). Null = the category's own icon.
alter table public.home_services
  add column icon text check (icon ~ '^[a-z_]{1,40}$');
