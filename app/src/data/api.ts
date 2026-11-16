import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Album, Branch, Catalog, Category, Company, CustomerSeed, GovId, Pair, Service, Story } from './types';

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
export const logoUrl = (companyId: string) => LOGOS.get(companyId) || '/logos/' + companyId + '.png';

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
  const brBy = by(branches, 'company_id', r => [r.name_ar, r.name_en, r.is_primary, r.lat, r.lng] as Branch);
  for (const c of cos) if (c.logo_url) LOGOS.set(c.id, c.logo_url);
  const gov = Object.fromEntries(locs.map(l => [l.id, [l.name_ar, l.name_en] as Pair])) as Record<GovId, Pair>;
  // Keep the demo's ordering: original companies (c*) first, then generated ones.
  const companies: Company[] = cos.map(c => ({
    id: c.id, ar: c.name_ar, en: c.name_en, cats: catsBy[c.id] || [], cityAr: c.city_ar, cityEn: c.city_en,
    gov: c.governorate, cov: covBy[c.id] || [], img: c.cover_photo, verified: c.is_verified, book: c.accepts_bookings,
    phone: c.phone, since: c.founded_year, dar: c.description_ar, den: c.description_en,
    branches: brBy[c.id] || [],
  })).sort((a, b) => sortKey(a.id) - sortKey(b.id));
  const categories: Category[] = cats.map(c => ({ i: c.id, ar: c.name_ar, en: c.name_en, sar: c.short_ar, sen: c.short_en, icon: c.icon, color: c.color, art: c.art_url }));
  const services: Service[] = svcs.map(s => ({ id: s.id, co: s.company_id, cat: s.category_id, ar: s.title_ar, en: s.title_en, imgs: s.photos, dar: s.description_ar, den: s.description_en }));
  const albums: Album[] = albs.map(a => ({ id: a.id, co: a.company_id, cat: a.category_id, ar: a.title_ar, en: a.title_en, pAr: a.place_ar, pEn: a.place_en, n: a.photo_count, img: a.cover_photo, imgs: a.photos, added: a.created_at }));
  // Live stories (RLS only returns ones that haven't expired). A video without a poster uses the company cover.
  const { data: st } = await sb.from('stories').select('*').order('created_at', { ascending: false });
  const coverOf = new Map(companies.map(c => [c.id, c.img]));
  const stories: Story[] = (st || []).map((r: Row) => ({
    id: r.id, co: r.company_id, kind: r.kind, src: r.media_url,
    poster: r.poster_url || (r.kind === 'image' ? r.media_url : photo(coverOf.get(r.company_id) || '', 540)),
    ar: r.caption_ar, en: r.caption_en, h: Math.max(1, Math.round((Date.now() - Date.parse(r.created_at)) / 36e5)),
  }));
  return { cats: categories, gov, hours: hours.map(h => [h.days_ar, h.days_en, h.hours]), companies, services, albums, stories };
}

function sortKey(id: string) {
  const m = /^c(\d+)$/.exec(id);
  if (m) return +m[1];
  const g = /^g(\d+)-(\d+)$/.exec(id);
  return g ? 1000 + +g[1] * 10 + +g[2] : 1e6;
}

/* ───────────── Writes (only when Supabase is configured) ─────────────
 * The customer is signed in anonymously so RLS can scope rows to them.
 * Enable "Anonymous sign-ins" in Supabase Auth settings. Failures are
 * reported to the caller but the local state stays authoritative for the UI. */

let session: Promise<boolean> | null = null;
function ensureUser(): Promise<boolean> {
  if (!supabase) return Promise.resolve(false);
  const sb = supabase;
  return session ||= (async () => {
    const { data } = await sb.auth.getSession();
    if (data.session) return true;
    const { error } = await sb.auth.signInAnonymously();
    if (error) { session = null; console.warn('[mujeeb] anonymous sign-in failed:', error.message); return false; }
    return true;
  })();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- result shape varies per call
async function run(label: string, fn: (sb: SupabaseClient) => PromiseLike<{ error: unknown; data?: any }>) {
  if (!supabase || !(await ensureUser())) return null;
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
