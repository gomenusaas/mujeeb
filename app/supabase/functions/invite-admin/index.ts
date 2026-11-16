// invite-admin: lets a platform admin add another admin by email from the admin app.
//
// - Existing account: it is given admin access straight away.
// - New email: Supabase emails an invite; the link opens the admin app to set a password,
//   and the account already has admin access.
//
// Runs on Supabase's servers, where the service-role key is available as an environment variable.
// The key never reaches a browser. The caller must be signed in and already be a platform admin.
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply({ error: 'method' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const service = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

  // Who is calling? Their own session token, checked with Supabase Auth.
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: me } = await service.auth.getUser(token);
  if (!me?.user) return reply({ error: 'signin' }, 401);
  const { data: isAdmin } = await service.from('platform_admins').select('user_id').eq('user_id', me.user.id).maybeSingle();
  if (!isAdmin) return reply({ error: 'admins_only' }, 403);

  const { email, name, redirectTo } = await req.json().catch(() => ({}));
  const addr = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return reply({ error: 'bad_email' }, 400);

  // Already has an account? Just grant admin access.
  const { data: existing } = await service.rpc('admin_user_id_by_email', { p_email: addr });
  let uid = existing as string | null;
  let invited = false;
  if (!uid) {
    const { data, error } = await service.auth.admin.inviteUserByEmail(addr, {
      redirectTo: typeof redirectTo === 'string' ? redirectTo : undefined,
      data: { full_name: String(name || '').slice(0, 120) },
    });
    if (error) return reply({ error: error.code === 'email_address_not_authorized' ? 'email_not_allowed' : 'invite_failed', detail: error.message }, 400);
    uid = data.user.id;
    invited = true;
  }
  const { error } = await service.from('platform_admins').upsert({ user_id: uid });
  if (error) return reply({ error: 'failed', detail: error.message }, 500);
  return reply({ ok: true, invited });
});
