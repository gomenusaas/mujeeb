-- Offers: a company's time-limited deals (e.g. «خصم ٢٠٪ على تصميم المجالس»), posted from the provider app and shown
-- in the customer app (company page, the «العروض» tab). Each one is about one of the company's services and is drawn
-- as an advert in one of 30 designs (style 0–29) in a colour the company picks (see app/src/ds/offer.tsx).
-- Customers see an offer while it's active, until its end date (Oman time), and only for live companies.

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  service_id text not null references public.services(id) on delete cascade,
  kicker_ar text not null default '',      -- above the value: «خصم»
  kicker_en text not null default '',
  headline_ar text not null,               -- the value in big type: «٢٠٪», «مجانًا»
  headline_en text not null default '',
  subline_ar text not null default '',     -- what it's on: «على تصميم المجالس»
  subline_en text not null default '',
  terms_ar text not null default '',       -- conditions, one per line (optional)
  terms_en text not null default '',
  style smallint not null default 0 check (style between 0 and 29),
  color text not null default '#6C3FD1' check (color ~ '^#[0-9a-fA-F]{6}$'),
  photo text,                              -- photo URL (or a demo photo id); null = the service's photo
  ends_on date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint offers_text_ok check (
    char_length(btrim(headline_ar)) between 1 and 12 and char_length(headline_en) <= 12
    and char_length(kicker_ar) <= 24 and char_length(kicker_en) <= 24
    and char_length(subline_ar) <= 48 and char_length(subline_en) <= 48
    and char_length(terms_ar) <= 600 and char_length(terms_en) <= 600
  )
);
create index offers_company_idx on public.offers (company_id, created_at);
create index offers_live_idx on public.offers (ends_on) where is_active;

alter table public.offers enable row level security;
-- Customers: active offers that haven't ended, from live companies.
create policy "public read live" on public.offers for select
  using (is_active and ends_on >= (now() at time zone 'Asia/Muscat')::date and public.company_is_live(company_id));
-- The company's team: all of its offers; the service must be one of the company's own.
create policy "members manage" on public.offers for all to authenticated
  using (public.is_company_member(company_id))
  with check (public.is_company_member(company_id)
    and exists (select 1 from public.services s where s.id = service_id and s.company_id = offers.company_id));
grant select on public.offers to anon, authenticated;
grant insert, update, delete on public.offers to authenticated;
