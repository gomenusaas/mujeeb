import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Governorate } from './oman';
import type { Album, Branch, Catalog, Category, Company, CustomerSeed, GovId, Pair, Service, Story, WeekHours } from './types';

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Null when the app runs without Supabase configured (bundled demo data only). */
export const supabase: SupabaseClient | null = URL_ && KEY ? createClient(URL_, KEY) : null;
export const dataSource: 'supabase' | 'demo' = supabase ? 'supabase' : 'demo';

/** Photos are Unsplash ids in the demo data, or full URLs once a company uploads its own. */
export const photo = (id: string, w = 600) => (/^https?:/.test(id) ? id
  : 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&q=70&auto=format&fit=crop');
/** Logos uploaded by companies (Supabase), by company id; the bundled demo logos are the fallback. */
const LOGOS = new Map<string, string>();
/** Bundled logos exist only for the demo companies (c1, g0-2, …); others show their initials until they upload a logo. */
export const DEMO_LOGO = /^(c\d+|g\d+-\d+)$/;
export const logoUrl = (companyId: string) => LOGOS.get(companyId) || (DEMO_LOGO.test(companyId) ? '/logos/' + companyId + '.png' : '');

async function demo() {
  return (await import('./demo.json')).default as unknown as Catalog & CustomerSeed;
}

/** Demo history for the signed-in customer (bookings). */
export async function loadCustomerSeed(): Promise<CustomerSeed> {
  const d = await demo();
  return { bookings: d.bookings };
}

export async function loadCatalog(): Promise<Catalog> {
  if (!supabase) {
    const d = await demo();
    return { cats: d.cats, gov: d.gov, hours: d.hours, companies: d.companies, services: d.services, albums: d.albums };
  }
  const sb = supabase;
  const get = async <R,>(table: string, order?: string) => {
    let req = sb.from(table).select('*');
    if (order) req = req.order(order);
    const { data, error } = await req;
    if (error) throw error;
    return data as R[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped DB rows mapped field-by-field below
  type Row = Record<string, any>;
  const [locs, cats, hours, cos, cc, areas, branches, svcs, albs] = await Promise.all([
    get<Row>('locations', 'sort_order'), get<Row>('categories', 'sort_order'), get<Row>('working_hours', 'id'),
    get<Row>('companies', 'created_at'), get<Row>('company_categories', 'position'), get<Row>('company_service_areas'),
    get<Row>('company_branches', 'position'), get<Row>('services', 'position'), get<Row>('portfolio_albums', 'position'),
  ]);
  const by = <T,>(rows: Row[], key: string, map: (r: Row) => T) => {
    const m: Record<string, T[]> = {};
    for (const r of rows) (m[r[key]] ||= []).push(map(r));
    return m;
  };
  const catsBy = by(cc, 'company_id', r => r.category_id as number);
  const covBy = by(areas, 'company_id', r => r.location_id as GovId);
  // Company working hours (optional table from migration 20261117000000_company_hours.sql).
  const { data: hrsRows } = await sb.from('company_hours').select('*');
  const hrsBy: Record<string, WeekHours> = {};
  for (const r of (hrsRows || []) as Row[]) {
    const w = (hrsBy[r.company_id] ||= Array(7).fill(null));
    const t = (v: string | null) => (v ? v.slice(0, 5) : null);
    w[r.day] = r.is_closed ? null : [t(r.opens), t(r.closes), t(r.opens2), t(r.closes2)].filter(Boolean) as string[];
  }
  const brBy = by(branches, 'company_id', r => [r.name_ar, r.name_en, r.is_primary, r.lat, r.lng] as Branch);
  for (const c of cos) if (c.logo_url) LOGOS.set(c.id, c.logo_url);
  const gov = Object.fromEntries(locs.map(l => [l.id, [l.name_ar, l.name_en] as Pair])) as Record<GovId, Pair>;
  // Keep the demo's ordering: original companies (c*) first, then generated ones.
  const companies: Company[] = cos.map(c => ({
    id: c.id, ar: c.name_ar, en: c.name_en, cats: catsBy[c.id] || [], cityAr: c.city_ar, cityEn: c.city_en,
    gov: c.governorate, cov: covBy[c.id] || [], img: c.cover_photo, verified: c.is_verified, book: c.accepts_bookings,
    phone: c.phone, since: c.founded_year, dar: c.description_ar, den: c.description_en,
    branches: brBy[c.id] || [], hrs: hrsBy[c.id],
  })).sort((a, b) => sortKey(a.id) - sortKey(b.id));
  const categories: Category[] = cats.map(c => ({ i: c.id, ar: c.name_ar, en: c.name_en, sar: c.short_ar, sen: c.short_en, icon: c.icon, color: c.color, art: c.art_url }));
  const services: Service[] = svcs.map(s => ({ id: s.id, co: s.company_id, cat: s.category_id, ar: s.title_ar, en: s.title_en, imgs: s.photos, dar: s.description_ar, den: s.description_en, cover: s.cover_url || undefined }));
  const albums: Album[] = albs.map(a => ({ id: a.id, co: a.company_id, cat: a.category_id, ar: a.title_ar, en: a.title_en, pAr: a.place_ar, pEn: a.place_en, n: a.photo_count, img: a.cover_photo, imgs: a.photos, added: a.created_at, vids: a.videos || [], hide: a.gallery_hidden || [], svc: a.service_id || undefined,
    dAr: a.description_ar || '', dEn: a.description_en || '', done: a.completed_on || undefined, area: a.area_m2 ?? undefined, weeks: a.duration_weeks ?? undefined, feat: a.is_featured || undefined }));
  // Live stories (RLS only returns ones that haven't expired). A video without a poster uses the company cover.
  const { data: st } = await sb.from('stories').select('*').order('created_at', { ascending: false });
  const coverOf = new Map(companies.map(c => [c.id, c.img]));
  const stories: Story[] = (st || []).map((r: Row) => ({
    id: r.id, co: r.company_id, kind: r.kind, src: r.media_url,
    poster: r.poster_url || (r.kind === 'image' ? r.media_url : photo(coverOf.get(r.company_id) || '', 540)),
    ar: r.caption_ar, en: r.caption_en, h: Math.max(1, Math.round((Date.now() - Date.parse(r.created_at)) / 36e5)),
  }));
  // Service locations in the admin's order (only active ones come back); the bundled list if none.
  const [{ data: gRows }, { data: wRows }] = await Promise.all([
    sb.from('governorates').select('id, name_ar, name_en, region').order('position'),
    sb.from('wilayats').select('id, governorate_id, name_ar, name_en').order('position'),
  ]);
  const places: Governorate[] = ((gRows || []) as Row[]).map(g => ({
    id: g.id, ar: g.name_ar, en: g.name_en, region: g.region,
    wilayats: ((wRows || []) as Row[]).filter(w => w.governorate_id === g.id).map(w => ({ id: w.id, ar: w.name_ar, en: w.name_en })),
  })).filter(g => g.wilayats.length);
  // Follower counts per company (numbers only; the viewer's own follow is added back by the app).
  const { data: fc } = await sb.rpc('follower_counts');
  const followers = Object.fromEntries(((fc || []) as Row[]).map(r => [r.company_id as string, r.n as number]));
  return { cats: categories, gov, hours: hours.map(h => [h.days_ar, h.days_en, h.hours]), companies, services, albums, stories, followers, ...(places.length ? { places } : {}) };
}

function sortKey(id: string) {
  const m = /^c(\d+)$/.exec(id);
  if (m) return +m[1];
  const g = /^g(\d+)-(\d+)$/.exec(id);
  return g ? 1000 + +g[1] * 10 + +g[2] : 1e6;
}

/* ───────────── Accounts ─────────────
 * Browsing needs no account. Favorites and follows belong to a signed-in customer
 * (email + password, or Google). Without Supabase (demo data) they stay on the phone. */

export interface Me { id: string; email: string; name: string }
export type AuthError = 'badLogin' | 'emailTaken' | 'notConfirmed' | 'weakPassword' | 'badEmail' | 'tooMany' | 'emailNotAllowed' | 'failed';

const toMe = (u: User | null | undefined): Me | null => (u && !u.is_anonymous
  ? { id: u.id, email: u.email || '', name: String(u.user_metadata?.full_name || u.user_metadata?.name || '') } : null);

/** Supabase's messages, reduced to the few cases the sign-in sheet explains. */
function authError(e: { message?: string; code?: string } | null): AuthError | undefined {
  if (!e) return undefined;
  const c = e.code || '', m = (e.message || '').toLowerCase();
  if (c === 'invalid_credentials' || m.includes('invalid login')) return 'badLogin';
  if (c === 'user_already_exists' || c === 'email_exists' || m.includes('already registered')) return 'emailTaken';
  if (c === 'email_not_confirmed' || m.includes('not confirmed')) return 'notConfirmed';
  if (c === 'weak_password' || m.includes('password should')) return 'weakPassword';
  if (c === 'email_address_invalid' || m.includes('invalid format') || m.includes('is invalid')) return 'badEmail';
  if (c === 'email_address_not_authorized') return 'emailNotAllowed';
  if (c.startsWith('over_') || m.includes('rate limit')) return 'tooMany';
  return 'failed';
}

/** Where links in account emails (confirm, reset password) come back to. */
const returnUrl = () => location.origin + '/profile';

export const auth = {
  enabled: !!supabase,
  /** Google sign-in needs a Google web client id (Google Cloud → Credentials). */
  googleClientId: (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '',
  async current(): Promise<Me | null> {
    if (!supabase) return null;
    return toMe((await supabase.auth.getSession()).data.session?.user);
  },
  /** Calls back on sign-in, sign-out and when a reset-password link was opened ('recovery'). */
  onChange(cb: (me: Me | null, recovery: boolean) => void) {
    if (!supabase) return () => {};
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      // Run outside Supabase's lock: callbacks may call Supabase again.
      setTimeout(() => cb(toMe(s?.user), event === 'PASSWORD_RECOVERY'), 0);
    });
    return () => data.subscription.unsubscribe();
  },
  /** `confirm`: Supabase sent a confirmation email; the account works once the link is opened. */
  async signUp(email: string, password: string, name: string): Promise<{ error?: AuthError; confirm?: boolean }> {
    if (!supabase) return { error: 'failed' };
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim(), kind: 'customer' }, emailRedirectTo: returnUrl() } });
    if (error) return { error: authError(error) };
    // An existing, confirmed address comes back as a user with no identities (Supabase hides that it exists).
    if (data.user && !data.user.identities?.length) return { error: 'emailTaken' };
    return { confirm: !data.session };
  },
  async signIn(email: string, password: string): Promise<AuthError | undefined> {
    if (!supabase) return 'failed';
    return authError((await supabase.auth.signInWithPassword({ email: email.trim(), password })).error);
  },
  /** Google One Tap / Sign in with Google: the ID token Google returned, and the raw nonce sent with the request. */
  async google(idToken: string, nonce: string): Promise<AuthError | undefined> {
    if (!supabase) return 'failed';
    return authError((await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken, nonce })).error);
  },
  async sendReset(email: string): Promise<AuthError | undefined> {
    if (!supabase) return 'failed';
    return authError((await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: returnUrl() })).error);
  },
  async setPassword(password: string): Promise<AuthError | undefined> {
    if (!supabase) return 'failed';
    return authError((await supabase.auth.updateUser({ password })).error);
  },
  async signOut() { await supabase?.auth.signOut(); },
  /** Deletes the account and its favorites and follows (required by the app stores). */
  async deleteAccount(): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.rpc('delete_my_account');
    if (error) return false;
    await supabase.auth.signOut({ scope: 'local' });
    return true;
  },
  /** The signed-in customer's favorites and follows. */
  async lists(): Promise<{ fav: string[]; follows: string[] }> {
    if (!supabase) return { fav: [], follows: [] };
    const [f, w] = await Promise.all([
      supabase.from('customer_favorites').select('company_id'),
      supabase.from('customer_follows').select('company_id'),
    ]);
    return { fav: (f.data || []).map(r => r.company_id as string), follows: (w.data || []).map(r => r.company_id as string) };
  },
};

/* ───────────── Writes (only when Supabase is configured) ─────────────
 * Favorites and follows need a signed-in customer (the store asks them to sign in first);
 * activity events are logged with or without an account. Failures are reported to the
 * caller, but the local state stays authoritative for the UI. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- result shape varies per call
async function run(label: string, fn: (sb: SupabaseClient) => PromiseLike<{ error: unknown; data?: any }>) {
  if (!supabase) return null;
  const { data, error } = await fn(supabase);
  if (error) { console.warn('[mujeeb] ' + label + ' failed:', error); throw error; }
  return data;
}

export const remote = {
  enabled: !!supabase,
  setFavorite: (companyId: string, on: boolean) => run('favorite', sb => on
    ? sb.from('customer_favorites').upsert({ company_id: companyId })
    : sb.from('customer_favorites').delete().eq('company_id', companyId)),
  submitBooking: async (b: { company_id: string; purpose: string; governorate: string; city: string; starts_at: string; notes?: string }) =>
    (await run('booking', sb => sb.from('bookings').insert(b).select('reference').single()))?.reference as string | null ?? null,
  cancelBooking: (reference: string) => run('cancel booking', sb => sb.from('bookings').update({ status: 'cancelled' }).eq('reference', reference)),
  acceptReschedule: (reference: string) => run('accept reschedule', sb => sb.rpc('accept_booking_reschedule', { booking_ref: reference })),
  setFollow: (companyId: string, on: boolean) => run('follow', sb => on
    ? sb.from('customer_follows').upsert({ company_id: companyId })
    : sb.from('customer_follows').delete().eq('company_id', companyId)),
  /** Activity for the company's stats in the provider app. Fire-and-forget; never blocks the UI. */
  track: (companyId: string, kind: EventKind, refId?: string) => {
    run('event', sb => sb.from('company_events').insert({ company_id: companyId, kind, ref_id: refId ?? null })).catch(() => {});
  },
};

export type EventKind = 'profile_view' | 'service_view' | 'story_view' | 'whatsapp' | 'call' | 'directions';
