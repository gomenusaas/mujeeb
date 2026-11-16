# MUJEEB admin (مجيب · الإدارة)

Platform administration for MUJEEB admins only: review and manage companies, manage every account
(customers and company accounts), and manage admins. Companies use the provider app (`../provider`);
customers use the customer app (`../app`).

- Runs only against Supabase (no demo mode). Copy `.env.example` to `.env.local` and fill in the project URL and publishable key.
- Sign-in is email + password. Only accounts listed in `public.platform_admins` get in; everyone else sees "not an admin".
- Every action calls an `admin_*` database function (migration `app/supabase/migrations/20261120000000_admin_app.sql`)
  that checks the caller is an admin, so no secret key is ever shipped in the browser.
- Add the first admin from the Supabase SQL editor:
  `insert into public.platform_admins (user_id) select id from auth.users where email = 'you@example.com';`

```bash
npm install
npm run dev      # http://localhost:5176
npm run build
```
