-- MUJEEB customer app: catalog (public read) + customer-owned records (RLS).
-- Photos are stored as Unsplash photo ids; the client builds the CDN URL.

create extension if not exists pgcrypto;

-- ───────────────────────── Catalog ─────────────────────────

create table public.locations (
  id text primary key,                         -- 'all', 'muscat', 'batinah', …
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table public.categories (
  id int primary key,
  name_ar text not null,
  name_en text not null,
  short_ar text not null,
  short_en text not null,
  icon text not null,                          -- Lucide icon name
  color text not null,                         -- category hue token, e.g. 'orange'
  art_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table public.companies (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  city_ar text not null,
  city_en text not null,
  governorate text not null references public.locations(id),
  cover_photo text not null,
  logo_url text,
  phone text not null,
  founded_year int,
  is_verified boolean not null default false,
  accepts_bookings boolean not null default true,
  accepts_quotations boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.company_categories (
  company_id text not null references public.companies(id) on delete cascade,
  category_id int not null references public.categories(id),
  position int not null default 0,             -- 0 = primary category
  primary key (company_id, category_id)
);

-- Service coverage is stored separately from physical branches.
create table public.company_service_areas (
  company_id text not null references public.companies(id) on delete cascade,
  location_id text not null references public.locations(id),
  primary key (company_id, location_id)
);

create table public.company_branches (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  is_primary boolean not null default false,
  position int not null default 0
);

create table public.services (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  category_id int not null references public.categories(id),
  title_ar text not null,
  title_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  photos text[] not null default '{}',         -- ordered; first is the cover
  position int not null default 0,
  is_published boolean not null default true
);

create table public.portfolio_albums (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  category_id int not null references public.categories(id),
  title_ar text not null,
  title_en text not null,
  place_ar text,
  place_en text,
  photo_count int not null default 0,
  cover_photo text not null,
  photos text[] not null default '{}',
  position int not null default 0,
  is_published boolean not null default true
);

create table public.working_hours (
  id int primary key,
  days_ar text not null,
  days_en text not null,
  hours text                                   -- null = closed
);

create index on public.company_categories (category_id);
create index on public.services (company_id);
create index on public.portfolio_albums (company_id);

-- ─────────────────────── Customer records ───────────────────────

create sequence public.rfq_ref_seq start 128;
create sequence public.booking_ref_seq start 57;

create table public.customer_favorites (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_id text not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

create table public.quotation_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('MJB-RFQ-' || lpad(nextval('public.rfq_ref_seq')::text, 6, '0')),
  customer_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_id text not null references public.companies(id),
  service_id text references public.services(id),
  title text not null,
  description text not null,
  governorate text not null references public.locations(id),
  city text not null,
  address text,
  budget_range int,                            -- index into the app's budget options
  preferred_start int,                         -- index into the app's start options
  contact_name text not null,
  contact_phone text not null,
  attachments jsonb not null default '[]',     -- [{name, kind, size}]; files live in storage
  status text not null default 'submitted'
    check (status in ('submitted','review','moreinfo','received','declined','closed','cancelled')),
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('MJB-BK-' || lpad(nextval('public.booking_ref_seq')::text, 6, '0')),
  customer_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_id text not null references public.companies(id),
  purpose text not null check (purpose in ('inspect','measure','consult','maint')),
  governorate text not null references public.locations(id),
  city text not null,
  starts_at timestamptz not null,              -- stored in UTC, shown in Asia/Muscat
  proposed_starts_at timestamptz,              -- set by the company with status 'reschedule'
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','reschedule','cancelled','rejected','completed','noshow')),
  created_at timestamptz not null default now()
);

-- Quotations sent by companies in reply to a request (written by the provider side).
create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.quotation_requests(id) on delete cascade,
  number text not null unique,
  status text not null default 'sent' check (status in ('draft','sent','viewed','accepted','rejected','expired','withdrawn')),
  valid_until date not null,
  discount numeric(12,3) not null default 0,
  vat_rate numeric(5,4) not null default 0.05,
  currency text not null default 'OMR',
  created_at timestamptz not null default now()
);
create table public.quotation_line_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  quantity numeric(12,3) not null,
  unit_price numeric(12,3) not null,
  position int not null default 0
);

-- One conversation per customer and company.
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company_id text not null references public.companies(id),
  reference text,
  created_at timestamptz not null default now(),
  unique (customer_id, company_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) default auth.uid(),  -- null = company side
  body text not null,
  created_at timestamptz not null default now()
);

-- Global feature switches (Super Admin). Global switch overrides provider settings.
create table public.platform_settings (
  key text primary key,
  value jsonb not null
);
insert into public.platform_settings (key, value) values
  ('quotations_enabled', 'true'), ('bookings_enabled', 'true');

-- Block new bookings / RFQs server-side when the company or the platform has them off.
create function public.enforce_feature_switches() returns trigger language plpgsql security definer set search_path = public as $$
declare on_global boolean; on_company boolean;
begin
  if tg_table_name = 'bookings' then
    select (value)::boolean into on_global from platform_settings where key = 'bookings_enabled';
    select accepts_bookings into on_company from companies where id = new.company_id;
  else
    select (value)::boolean into on_global from platform_settings where key = 'quotations_enabled';
    select accepts_quotations into on_company from companies where id = new.company_id;
  end if;
  if not coalesce(on_global, true) or not coalesce(on_company, false) then
    raise exception 'This company is not accepting % right now', tg_table_name;
  end if;
  return new;
end $$;
create trigger bookings_feature_switch before insert on public.bookings for each row execute function public.enforce_feature_switches();
create trigger rfq_feature_switch before insert on public.quotation_requests for each row execute function public.enforce_feature_switches();

-- ───────────────────────── RLS ─────────────────────────

alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.companies enable row level security;
alter table public.company_categories enable row level security;
alter table public.company_service_areas enable row level security;
alter table public.company_branches enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_albums enable row level security;
alter table public.working_hours enable row level security;
alter table public.platform_settings enable row level security;
alter table public.customer_favorites enable row level security;
alter table public.quotation_requests enable row level security;
alter table public.bookings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_line_items enable row level security;

create policy "public read" on public.locations for select using (is_active);
create policy "public read" on public.categories for select using (is_active);
create policy "public read" on public.companies for select using (is_published);
create policy "public read" on public.company_categories for select using (true);
create policy "public read" on public.company_service_areas for select using (true);
create policy "public read" on public.company_branches for select using (true);
create policy "public read" on public.services for select using (is_published);
create policy "public read" on public.portfolio_albums for select using (is_published);
create policy "public read" on public.working_hours for select using (true);
create policy "public read" on public.platform_settings for select using (true);

create policy "own favorites" on public.customer_favorites for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own requests read" on public.quotation_requests for select to authenticated using (customer_id = auth.uid());
create policy "own requests insert" on public.quotation_requests for insert to authenticated with check (customer_id = auth.uid());

create policy "own bookings read" on public.bookings for select to authenticated using (customer_id = auth.uid());
create policy "own bookings insert" on public.bookings for insert to authenticated with check (customer_id = auth.uid());
create policy "own bookings cancel" on public.bookings for update to authenticated
  using (customer_id = auth.uid() and status in ('pending','confirmed','reschedule'))
  with check (customer_id = auth.uid() and status = 'cancelled');

create policy "own quotations read" on public.quotations for select to authenticated
  using (exists (select 1 from public.quotation_requests r where r.id = request_id and r.customer_id = auth.uid()));
create policy "own quotation lines read" on public.quotation_line_items for select to authenticated
  using (exists (select 1 from public.quotations q join public.quotation_requests r on r.id = q.request_id
                 where q.id = quotation_id and r.customer_id = auth.uid()));

-- Customers accept a proposed time or answer a quotation only through these functions.
create function public.accept_booking_reschedule(booking_ref text) returns void
language sql security definer set search_path = public as $$
  update bookings set starts_at = proposed_starts_at, proposed_starts_at = null, status = 'confirmed'
  where reference = booking_ref and customer_id = auth.uid() and status = 'reschedule' and proposed_starts_at is not null;
$$;
create function public.respond_to_quotation(quotation_number text, accept boolean) returns void
language sql security definer set search_path = public as $$
  update quotations q set status = case when accept then 'accepted' else 'rejected' end
  from quotation_requests r
  where q.request_id = r.id and q.number = quotation_number and r.customer_id = auth.uid() and q.status in ('sent','viewed');
$$;
revoke execute on function public.accept_booking_reschedule(text) from public, anon;
revoke execute on function public.respond_to_quotation(text, boolean) from public, anon;
grant execute on function public.accept_booking_reschedule(text) to authenticated;
grant execute on function public.respond_to_quotation(text, boolean) to authenticated;

create policy "own conversations" on public.conversations for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy "own messages read" on public.messages for select to authenticated
  using (exists (select 1 from public.conversations c where c.id = conversation_id and c.customer_id = auth.uid()));
create policy "own messages insert" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and c.customer_id = auth.uid()));
