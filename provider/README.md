# MUJEEB · مجيب — company dashboard (provider app)

The web app service providers use to manage their company on MUJEEB. It shares the Supabase database with
the customer app in `../app`, so everything a company changes here shows up for customers.

| Section | What the company does | Where it shows in the customer app |
|---|---|---|
| Dashboard | Profile views, WhatsApp / call / directions taps, story views, followers — last 14 days vs the 14 before | — |
| Stories | Posts a photo or video with an Arabic/English caption; it expires after 24 h | Stories row on Home |
| Services | Adds / edits / hides services with photos (first photo = cover) | Company page, service pages, listings |
| Projects | Adds / edits / hides portfolio projects | «آخر المشاريع» on Home, Explore, related work |
| Company profile | Names, about text, phone (used for Call and WhatsApp), city, governorate, founding year, logo, cover | Company page and cards |
| Working hours | Open/closed per weekday, one or two shifts, “apply to all days” | «ساعات العمل» in the company menu, with an open-now status |
| Branches & locations | Branch names, addresses, main branch, **map pin** | «الاتجاهات» opens the maps app at the pin |

Arabic (RTL) and English. Sidebar on desktop; top bar and slide-out menu on phones.
Categories, verification and publishing a company stay with the MUJEEB team (Super Admin).

## Run

```bash
cd provider
npm install
npm run dev        # http://localhost:5174
npm run build      # type-check + production build into dist/
```

`npm run dev` / `npm run build` first copy the design system and demo data from `../app/src`
into `src/shared/` (generated, git-ignored), so the customer app stays the single source of truth.
Public assets (logos, icons) are served from `../app/public`.

## Demo mode

Without Supabase keys the app opens straight into a **demo** of Qimmah Kitchens (company `c4` from the demo
data), with a yellow banner. Edits and uploads work but only live in that browser tab.

## Connect Supabase

1. In the Supabase SQL editor, run the files in `../app/supabase/migrations/` in order, then `../app/supabase/seed.sql`:
   `20261109000000_customer_app.sql`, `20261110000000_album_created_at.sql`, `20261116000000_provider_app.sql`,
   `20261117000000_company_hours.sql`.
   The last one adds company accounts, editing rights, stories, the `media` storage bucket, followers
   and activity stats; the next adds per-company working hours. On a fresh database run all migrations, then the
   seed (it includes demo hours). On a database that already has the seed, just run the new migrations; companies
   without hours show the platform's general hours until they set their own.
2. **Authentication → Providers:** keep **Email** on (providers sign in with email + password) and
   **Anonymous sign-ins** on (for customers). Add the provider site's URL under
   **Authentication → URL Configuration → Redirect URLs** so password-reset links work.
3. **Create a provider account:** Authentication → Users → *Add user* (email + password), then link it to
   its company in the SQL editor:
   ```sql
   insert into public.company_members (user_id, company_id)
   select id, 'c4' from auth.users where email = 'owner@example.com';
   ```
4. Put the project URL and anon key in `provider/.env.local` (copy `.env.example`), or in the Netlify site's
   environment variables. The customer app needs the same two values to read what providers publish.

Rules are enforced in the database (row-level security), not in the app: a provider can only edit their own
company, branches, services, projects and stories, and upload to their own `media/<company id>/` folder.
Customers can't read company stats or log activity as someone else.

## Deploy on Netlify

Create a **second** Netlify site from the same GitHub repo with **Base directory = `provider`**.
Netlify then uses `provider/netlify.toml` (build `npm ci && npm run build`, publish `dist`, SPA redirect).
Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to that site. Without them it deploys in demo mode.

## Structure

```
src/data.ts         Types, the Repo interface, Supabase implementation and in-memory demo
src/state.tsx       Session-wide state: language, company, section, toast
src/Shell.tsx       Sidebar / phone drawer layout
src/ui.tsx          Cards, fields, select, toggle, modal, confirm, photo editor
src/screens/        Auth, Dashboard, Company (profile + branches), Hours, Catalog (services + projects), Stories
src/i18n.ts         All strings, Arabic + English
src/shared/         Generated copy of ../app/src/ds and demo.json (do not edit)
```
