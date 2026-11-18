import { createClient } from '@supabase/supabase-js';

/*
 * Everything the admin app reads or changes goes through admin_* database functions
 * (migration 20261120000000_admin_app.sql). Each one checks the caller is a platform admin,
 * so the browser only holds the public key, like the other two apps.
 */

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const sb = URL_ && KEY ? createClient(URL_, KEY) : null;
/** Where "Open in customer app" links go. */
export const CUSTOMER_URL = (import.meta.env.VITE_CUSTOMER_URL as string | undefined) || 'https://mujeeb-xi.vercel.app';
/** Where company accounts' password-reset links go. */
export const PROVIDER_URL = (import.meta.env.VITE_PROVIDER_URL as string | undefined) || 'https://mujeeb-provider.vercel.app';

export interface Category { id: number; name_ar: string; name_en: string; color: string; icon: string }
export interface Location { id: string; name_ar: string; name_en: string }
export interface Refs { categories: Category[]; locations: Location[] }

export interface Overview {
  approved: number; pending: number; rejected: number; hidden: number; customers: number; providers: number;
  new_users_7d: number; events_7d: number; contacts_7d: number; follows: number; favorites: number;
  services: number; projects: number; live_stories: number;
}
export type CompanyFilter = 'pending' | 'approved' | 'hidden' | 'rejected' | null;
export interface AdminCompany {
  id: string; name_ar: string; name_en: string; status: 'pending' | 'approved' | 'rejected'; is_verified: boolean; is_published: boolean;
  city_ar: string; city_en: string; governorate: string; phone: string; description_ar: string; description_en: string;
  owner_email: string | null; categories: number[]; services: number; projects: number; followers: number;
  logo_url: string | null; cover_photo: string; review_note: string | null; created_at: string; submitted_at: string | null;
}
/** A project the company shows in «مشاريع مميزة» on its page (at most 7). */
export interface FeaturedProject { id: string; title_ar: string; title_en: string; cover_photo: string; category_id: number; is_published: boolean; completed_on: string | null }
/** Display URL for a photo: demo data stores Unsplash ids, uploads are full URLs. */
export const photoUrl = (id: string, w = 200) => (/^(https?:|blob:|data:)/.test(id) ? id
  : 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&q=70&auto=format&fit=crop');
export interface Member { user_id: string; email: string; full_name: string; role: 'owner' | 'editor'; created_at: string }
export interface AdminUser {
  id: string; email: string; full_name: string; kind: 'customer' | 'provider'; sign_in_with: string; created_at: string;
  last_sign_in_at: string | null; confirmed: boolean; blocked: boolean; is_admin: boolean; companies: string[];
}
export interface AdminRow { user_id: string; email: string; full_name: string; created_at: string; last_sign_in_at: string | null }
export interface CompanyDetails {
  name_ar: string; name_en: string; phone: string; city_ar: string; city_en: string; governorate: string; description_ar: string; description_en: string;
}

/** Display URL for a company logo: uploads are full URLs; the demo companies ship logos with the app. */
export const logoOf = (c: { id: string; logo_url: string | null }) => c.logo_url || (/^(c\d+|g\d+-\d+)$/.test(c.id) ? '/logos/' + c.id + '.png' : '');

/** A database error, with the message the admin functions raise (e.g. "No account with this email"). */
export class ApiError extends Error {}
function client() {
  if (!sb) throw new ApiError('Supabase is not configured');
  return sb;
}
async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await client().rpc(fn, args);
  if (error) throw new ApiError(error.message);
  return data as T;
}

/** A governorate with its wilayats, as the admin sees them (hidden ones included). */
export interface PlaceGov { id: string; name_ar: string; name_en: string; region: string | null; position: number; is_active: boolean; wilayats: PlaceWil[] }
export interface PlaceWil { id: string; governorate_id: string; name_ar: string; name_en: string; position: number; is_active: boolean }

/** New ids for places the admin adds (the customer app keeps a picked wilayat by id). */
const newId = (prefix: string) => prefix + '-' + Math.random().toString(36).slice(2, 8);
async function ok<T>(p: PromiseLike<{ data: T; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw new ApiError(error.message);
  return data;
}

export const api = {
  /* ── Service locations (tables governorates / wilayats; only platform admins may write) ── */
  async places(): Promise<PlaceGov[]> {
    const [g, w] = await Promise.all([
      ok(client().from('governorates').select('id, name_ar, name_en, region, position, is_active').order('position')),
      ok(client().from('wilayats').select('id, governorate_id, name_ar, name_en, position, is_active').order('position')),
    ]);
    return (g as Omit<PlaceGov, 'wilayats'>[]).map(x => ({ ...x, wilayats: (w as PlaceWil[]).filter(y => y.governorate_id === x.id) }));
  },
  async saveGov(x: { id?: string; name_ar: string; name_en: string; region: string | null; is_active: boolean; position?: number }) {
    if (x.id) await ok(client().from('governorates').update({ name_ar: x.name_ar, name_en: x.name_en, region: x.region, is_active: x.is_active }).eq('id', x.id));
    else await ok(client().from('governorates').insert({ id: newId('g'), name_ar: x.name_ar, name_en: x.name_en, region: x.region, is_active: x.is_active, position: x.position ?? 999 }));
  },
  async saveWil(x: { id?: string; governorate_id: string; name_ar: string; name_en: string; is_active: boolean; position?: number }) {
    if (x.id) await ok(client().from('wilayats').update({ name_ar: x.name_ar, name_en: x.name_en, is_active: x.is_active }).eq('id', x.id));
    else await ok(client().from('wilayats').insert({ id: newId('w'), governorate_id: x.governorate_id, name_ar: x.name_ar, name_en: x.name_en, is_active: x.is_active, position: x.position ?? 999 }));
  },
  deleteGov: async (id: string) => { await ok(client().from('governorates').delete().eq('id', id)); },
  deleteWil: async (id: string) => { await ok(client().from('wilayats').delete().eq('id', id)); },
  /** Saves a new order: each id gets its index as its position. */
  async reorder(table: 'governorates' | 'wilayats', ids: string[]) {
    await Promise.all(ids.map((id, k) => ok(client().from(table).update({ position: k }).eq('id', id))));
  },

  /* Session */
  async session() { return (await client().auth.getSession()).data.session?.user ?? null; },
  async signIn(email: string, password: string): Promise<'ok' | 'bad' | 'unconfirmed'> {
    const { error } = await client().auth.signInWithPassword({ email, password });
    if (!error) return 'ok';
    return error.code === 'email_not_confirmed' || /not confirmed/i.test(error.message) ? 'unconfirmed' : 'bad';
  },
  async signOut() { await client().auth.signOut(); },
  /** Sends a reset link that comes back to this app (sign-in recovery or for any user from the Users page). */
  async sendReset(email: string, back = location.origin) {
    const { error } = await client().auth.resetPasswordForEmail(email, { redirectTo: back });
    if (error) throw new ApiError(error.message);
  },
  /** Arrived from a password-reset or admin-invite email: choose a password first. */
  recovering: () => /type=(recovery|invite)/.test(location.hash),
  async setPassword(password: string) {
    const { error } = await client().auth.updateUser({ password });
    if (error) throw new ApiError(error.message);
    history.replaceState(null, '', location.pathname);
  },
  isAdmin: () => rpc<boolean>('is_platform_admin'),
  async refs(): Promise<Refs> {
    const [c, l] = await Promise.all([
      client().from('categories').select('id, name_ar, name_en, color, icon').order('sort_order'),
      client().from('locations').select('id, name_ar, name_en').order('sort_order'),
    ]);
    return { categories: (c.data || []) as Category[], locations: ((l.data || []) as Location[]).filter(x => x.id !== 'all') };
  },

  /* Overview */
  overview: () => rpc<Overview>('admin_overview'),

  /* Companies */
  companies: (q: string, st: CompanyFilter) => rpc<AdminCompany[]>('admin_companies', { q: q.trim() || null, st }),
  review: (cid: string, approve: boolean, note?: string, verified?: boolean) =>
    rpc<void>('admin_review_company', { cid, approve, note: note ?? null, verified: verified ?? null }),
  setFlags: (cid: string, f: { verified?: boolean; published?: boolean }) =>
    rpc<void>('admin_set_company_flags', { cid, verified: f.verified ?? null, published: f.published ?? null }),
  updateCompany: (cid: string, d: CompanyDetails) => rpc<void>('admin_update_company', {
    cid, p_name_ar: d.name_ar, p_name_en: d.name_en, p_phone: d.phone, p_city_ar: d.city_ar, p_city_en: d.city_en,
    p_governorate: d.governorate, p_description_ar: d.description_ar, p_description_en: d.description_en,
  }),
  setCategories: (cid: string, cats: number[]) => rpc<void>('admin_set_company_categories', { cid, cats }),
  deleteCompany: (cid: string) => rpc<void>('admin_delete_company', { cid }),
  members: (cid: string) => rpc<Member[]>('admin_company_members', { cid }),
  featured: (cid: string) => rpc<FeaturedProject[]>('admin_company_featured', { cid }),
  setFeatured: (aid: string, on: boolean) => rpc<void>('admin_set_featured', { aid, on_: on }),
  addMember: (cid: string, email: string, role: 'owner' | 'editor') => rpc<void>('admin_add_member', { cid, p_email: email, p_role: role }),
  removeMember: (cid: string, uid: string) => rpc<void>('admin_remove_member', { cid, uid }),

  /* Users */
  users: (q: string, kind: 'customer' | 'provider' | null) => rpc<AdminUser[]>('admin_users', { q: q.trim() || null, p_kind: kind }),
  setBlocked: (uid: string, blocked: boolean) => rpc<void>('admin_set_blocked', { uid, blocked }),
  deleteUser: (uid: string) => rpc<void>('admin_delete_user', { uid }),

  /* Admins */
  admins: () => rpc<AdminRow[]>('admin_list_admins'),
  addAdmin: (email: string) => rpc<void>('admin_add_admin', { p_email: email }),
  /**
   * Gives admin access by email. An existing account gets it right away; a new email gets an invite
   * to set a password (Edge Function invite-admin, which holds the secret key on Supabase's side).
   */
  async inviteAdmin(email: string, name: string): Promise<{ invited: boolean }> {
    const { data, error } = await client().functions.invoke('invite-admin', { body: { email, name, redirectTo: location.origin } });
    if (error) {
      const body = await (error as { context?: Response }).context?.json?.().catch(() => null);
      throw new ApiError(body?.error || error.message);
    }
    return { invited: !!data?.invited };
  },
  removeAdmin: (uid: string) => rpc<void>('admin_remove_admin', { uid }),
};
