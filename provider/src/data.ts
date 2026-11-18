import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* ───────────────────────── Types (database rows) ───────────────────────── */

export interface Category { id: number; name_ar: string; name_en: string; color: string; icon: string }
export interface Location { id: string; name_ar: string; name_en: string }
export interface Company {
  id: string; name_ar: string; name_en: string; description_ar: string; description_en: string;
  city_ar: string; city_en: string; governorate: string; cover_photo: string; logo_url: string | null;
  phone: string; founded_year: number | null; is_verified: boolean; categories: number[];
  /** 'pending' until a MUJEEB admin approves it; customers see only approved companies. */
  status: 'pending' | 'approved' | 'rejected';
  /** Why it was rejected (from the admin), shown to the company. */
  review_note: string | null;
}
/** What a company fills in when it signs up. */
export interface NewCompany {
  name_ar: string; name_en: string; phone: string; governorate: string; city_ar: string; city_en: string; categories: number[];
}
export type SignInResult = 'ok' | 'bad' | 'unconfirmed';
export type CompanyPatch = Partial<Pick<Company, 'name_ar' | 'name_en' | 'description_ar' | 'description_en' | 'city_ar' | 'city_en' | 'governorate' | 'cover_photo' | 'logo_url' | 'phone' | 'founded_year'>>;
export interface Branch {
  id?: string; company_id: string; name_ar: string; name_en: string; address_ar: string | null; address_en: string | null;
  lat: number | null; lng: number | null; is_primary: boolean; position: number;
}
export interface Service {
  id?: string; company_id: string; category_id: number; title_ar: string; title_en: string;
  description_ar: string; description_en: string; photos: string[]; is_published: boolean; position: number;
  /** Header image of the service page, already cropped to the header shape. Null = first photo, then the company cover. */
  cover_url: string | null;
  /** Search keywords (up to 7, each up to 30 characters; the database enforces it). Customers don't see them. */
  keywords: string[];
}
export interface Album {
  id?: string; company_id: string; category_id: number; title_ar: string; title_en: string; place_ar: string | null; place_en: string | null;
  photos: string[]; cover_photo: string; is_published: boolean; position: number; created_at?: string;
  /** Project videos (uploaded files). */
  videos: string[];
  /** Photos and videos kept out of the company's galleries (company page, service page, Explore). */
  gallery_hidden: string[];
  /** The service this project belongs to on the customer app. Null = none. */
  service_id: string | null;
  /** Project page details (all optional). completed_on is the 1st of the month it was completed. */
  description_ar: string; description_en: string; completed_on: string | null; area_m2: number | null; duration_weeks: number | null;
  /** Shown in «مشاريع مميزة» on the company page (at most FEATURED_MAX per company; the database enforces it). */
  is_featured: boolean;
}
/** Most projects a company can feature. */
export const FEATURED_MAX = 7;
/** True when a save failed because the company already features FEATURED_MAX projects. */
export const isFeaturedLimit = (e: unknown) => /featured_limit/.test(String((e as { message?: string })?.message ?? e));
export interface Story {
  id?: string; company_id: string; kind: 'image' | 'video'; media_url: string; poster_url: string | null;
  caption_ar: string; caption_en: string; created_at?: string; expires_at?: string;
}
/** One weekday's hours. day: 0 = Sunday … 6 = Saturday. Times are "HH:MM" (Oman time). */
export interface DayHours { day: number; is_closed: boolean; opens: string | null; closes: string | null; opens2: string | null; closes2: string | null }
export type StatKind = 'profile_view' | 'service_view' | 'story_view' | 'whatsapp' | 'call' | 'directions' | 'follow';
export interface Stats {
  /** Count in the last 14 days and in the 14 days before. */
  totals: Record<StatKind, { cur: number; prev: number }>;
  /** Profile views per day for the last 14 days (oldest first). */
  daily: { day: string; n: number }[];
  followers: number;
}

export interface Repo {
  mode: 'supabase' | 'demo';
  session(): Promise<string | null>;
  signIn(email: string, password: string): Promise<SignInResult>;
  /** New company account. `confirm`: Supabase emailed a confirmation link first. */
  signUp(email: string, password: string, name: string): Promise<{ error?: 'taken' | 'weak' | 'email' | 'failed'; confirm?: boolean }>;
  /** Creates the signed-in user's company (pending review) and returns its id. */
  registerCompany(c: NewCompany): Promise<string>;
  /** Asks for another review after a rejection. */
  resubmit(cid: string): Promise<void>;
  /** Deletes the account (and the company, when this account is its only member). */
  deleteAccount(): Promise<void>;
  signOut(): Promise<void>;
  sendReset(email: string): Promise<void>;
  /** True when the user arrived from a password-reset email and should choose a new password. */
  recovering(): boolean;
  setPassword(pw: string): Promise<void>;
  myCompanyIds(): Promise<string[]>;
  refs(): Promise<{ categories: Category[]; locations: Location[] }>;
  company(id: string): Promise<Company>;
  saveCompany(id: string, patch: CompanyPatch): Promise<void>;
  branches(cid: string): Promise<Branch[]>;
  saveBranch(b: Branch): Promise<Branch>;
  deleteBranch(id: string): Promise<void>;
  services(cid: string): Promise<Service[]>;
  saveService(s: Service): Promise<Service>;
  deleteService(id: string): Promise<void>;
  albums(cid: string): Promise<Album[]>;
  saveAlbum(a: Album): Promise<Album>;
  deleteAlbum(id: string): Promise<void>;
  stories(cid: string): Promise<Story[]>;
  createStory(s: Story): Promise<Story>;
  deleteStory(id: string): Promise<void>;
  /** Uploads to the company's media folder and returns a public URL. */
  /** All 7 days, Sunday first; days not set yet come back closed. */
  hours(cid: string): Promise<DayHours[]>;
  saveHours(cid: string, week: DayHours[]): Promise<void>;
  upload(cid: string, file: File | Blob, name: string): Promise<string>;
  stats(cid: string): Promise<Stats>;
}

/** Display URL for a photo: demo data stores Unsplash ids, uploads are full URLs. */
export const photoUrl = (id: string, w = 600) => (/^(https?:|blob:|data:)/.test(id) ? id
  : 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&q=70&auto=format&fit=crop');
/** Uploaded logo, or the bundled one for demo companies; empty (initials) otherwise. */
export const logoOf = (c: Pick<Company, 'id' | 'logo_url'>) => c.logo_url || (/^(c\d+|g\d+-\d+)$/.test(c.id) ? '/logos/' + c.id + '.png' : '');

const closedDay = (day: number): DayHours => ({ day, is_closed: true, opens: null, closes: null, opens2: null, closes2: null });
const hm = (v: string | null) => (v ? v.slice(0, 5) : null);
const fullWeek = (rows: DayHours[]) => Array.from({ length: 7 }, (_, d) => {
  const r = rows.find(x => x.day === d);
  return r ? { ...r, opens: hm(r.opens), closes: hm(r.closes), opens2: hm(r.opens2), closes2: hm(r.closes2) } : closedDay(d);
});

const KINDS: StatKind[] = ['profile_view', 'service_view', 'story_view', 'whatsapp', 'call', 'directions', 'follow'];
const emptyTotals = () => Object.fromEntries(KINDS.map(k => [k, { cur: 0, prev: 0 }])) as Stats['totals'];
const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' });
const last14 = () => Array.from({ length: 14 }, (_, k) => dayKey(new Date(Date.now() - (13 - k) * 864e5)));

/* ───────────────────────── Supabase ───────────────────────── */

function supabaseRepo(sb: SupabaseClient): Repo {
  const ok = <T,>(r: { data: T | null; error: unknown }): T => { if (r.error) throw r.error; return r.data as T; };
  const recovery = /type=recovery/.test(location.hash);
  return {
    mode: 'supabase',
    async session() { return (await sb.auth.getSession()).data.session?.user.email ?? null; },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (!error) return 'ok';
      return error.code === 'email_not_confirmed' || /not confirmed/i.test(error.message) ? 'unconfirmed' : 'bad';
    },
    async signUp(email, password, name) {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name, kind: 'provider' }, emailRedirectTo: location.origin } });
      if (error) {
        const c = error.code || '';
        return { error: c === 'user_already_exists' || c === 'email_exists' ? 'taken' : c === 'weak_password' ? 'weak' : c === 'email_address_invalid' || c === 'email_address_not_authorized' ? 'email' : 'failed' };
      }
      if (data.user && !data.user.identities?.length) return { error: 'taken' };
      return { confirm: !data.session };
    },
    async registerCompany(c) {
      return ok(await sb.rpc('register_company', {
        p_name_ar: c.name_ar, p_name_en: c.name_en, p_phone: c.phone, p_governorate: c.governorate,
        p_city_ar: c.city_ar, p_city_en: c.city_en, p_categories: c.categories,
      })) as string;
    },
    async resubmit(cid) { ok(await sb.rpc('resubmit_company', { cid })); },
    async deleteAccount() { ok(await sb.rpc('delete_my_account')); await sb.auth.signOut({ scope: 'local' }); },
    async signOut() { await sb.auth.signOut(); },
    async sendReset(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin })); },
    recovering: () => recovery,
    async setPassword(password) {
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw error;
      history.replaceState(null, '', location.pathname);
    },
    async myCompanyIds() { return ok(await sb.from('company_members').select('company_id')).map(r => r.company_id as string); },
    async refs() {
      const [c, l] = await Promise.all([sb.from('categories').select('id, name_ar, name_en, color, icon').order('sort_order'), sb.from('locations').select('id, name_ar, name_en').order('sort_order')]);
      return { categories: ok(c) as Category[], locations: (ok(l) as Location[]).filter(x => x.id !== 'all') };
    },
    async company(id) {
      const [c, cc] = await Promise.all([sb.from('companies').select('*').eq('id', id).single(), sb.from('company_categories').select('category_id').eq('company_id', id).order('position')]);
      return { ...(ok(c) as Company), categories: (ok(cc) as { category_id: number }[]).map(r => r.category_id) };
    },
    async saveCompany(id, patch) { ok(await sb.from('companies').update(patch).eq('id', id)); },
    async branches(cid) { return ok(await sb.from('company_branches').select('*').eq('company_id', cid).order('position')) as Branch[]; },
    async saveBranch(b) {
      // Only one main branch per company.
      if (b.is_primary) {
        let q = sb.from('company_branches').update({ is_primary: false }).eq('company_id', b.company_id);
        if (b.id) q = q.neq('id', b.id);
        ok(await q);
      }
      return ok(await sb.from('company_branches').upsert(b).select().single()) as Branch;
    },
    async deleteBranch(id) { ok(await sb.from('company_branches').delete().eq('id', id)); },
    async services(cid) { return ok(await sb.from('services').select('*').eq('company_id', cid).order('position')) as Service[]; },
    async saveService(s) { return ok(await sb.from('services').upsert(s).select().single()) as Service; },
    async deleteService(id) { ok(await sb.from('services').delete().eq('id', id)); },
    async albums(cid) { return ok(await sb.from('portfolio_albums').select('*').eq('company_id', cid).order('created_at', { ascending: false })) as Album[]; },
    async saveAlbum(a) { return ok(await sb.from('portfolio_albums').upsert({ ...a, photo_count: a.photos.length }).select().single()) as Album; },
    async deleteAlbum(id) { ok(await sb.from('portfolio_albums').delete().eq('id', id)); },
    async stories(cid) {
      const since = new Date(Date.now() - 7 * 864e5).toISOString();
      return ok(await sb.from('stories').select('*').eq('company_id', cid).gte('created_at', since).order('created_at', { ascending: false })) as Story[];
    },
    async createStory(s) { return ok(await sb.from('stories').insert(s).select().single()) as Story; },
    async deleteStory(id) { ok(await sb.from('stories').delete().eq('id', id)); },
    async hours(cid) { return fullWeek(ok(await sb.from('company_hours').select('day, is_closed, opens, closes, opens2, closes2').eq('company_id', cid)) as DayHours[]); },
    async saveHours(cid, week) { ok(await sb.from('company_hours').upsert(week.map(d => ({ ...d, company_id: cid })), { onConflict: 'company_id,day' })); },
    async upload(cid, file, name) {
      const path = cid + '/' + Date.now() + '-' + name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      ok(await sb.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false }));
      return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    },
    async stats(cid) {
      const [rows, fol] = await Promise.all([
        sb.rpc('company_stats', { cid, days: 14 }),
        sb.from('customer_follows').select('user_id', { count: 'exact', head: true }).eq('company_id', cid),
      ]);
      const data = ok(rows) as { kind: StatKind; day: string; n: number }[];
      const days = last14(), first = days[0];
      const totals = emptyTotals();
      const daily = new Map(days.map(d => [d, 0]));
      for (const r of data) {
        const t = totals[r.kind]; if (!t) continue;
        if (r.day >= first) t.cur += Number(r.n); else t.prev += Number(r.n);
        if (r.kind === 'profile_view' && daily.has(r.day)) daily.set(r.day, daily.get(r.day)! + Number(r.n));
      }
      return { totals, daily: days.map(day => ({ day, n: daily.get(day)! })), followers: fol.count ?? 0 };
    },
  };
}

/* ───────────────────────── Demo (in memory) ─────────────────────────
 * Runs when no Supabase keys are set: a sample company from the bundled demo data,
 * edits kept in memory for this tab only. */

type DemoData = {
  cats: { i: number; ar: string; en: string; color: string; icon: string }[];
  gov: Record<string, [string, string]>;
  companies: { id: string; ar: string; en: string; cats: number[]; hrs?: (string[] | null)[]; cityAr: string; cityEn: string; gov: string; img: string; verified: boolean; phone: string; since: number; dar: string; den: string; branches: [string, string, boolean][] }[];
  services: { id: string; co: string; cat: number; ar: string; en: string; imgs: string[]; dar: string; den: string; cover?: string; kw?: string[] }[];
  albums: { svc?: string; dAr?: string; dEn?: string; done?: string; area?: number; weeks?: number; feat?: boolean; id: string; co: string; cat: number; ar: string; en: string; pAr: string; pEn: string; img: string; imgs: string[]; vids?: string[]; added: string }[];
};

async function demoRepo(): Promise<Repo> {
  const d = (await import('./shared/demo.json')).default as unknown as DemoData;
  const CID = 'c4';
  const co = d.companies.find(c => c.id === CID)!;
  const uid = () => Math.random().toString(36).slice(2, 10);
  const iso = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();
  let company: Company = {
    id: co.id, name_ar: co.ar, name_en: co.en, description_ar: co.dar, description_en: co.den, city_ar: co.cityAr, city_en: co.cityEn,
    governorate: co.gov, cover_photo: co.img, logo_url: null, phone: co.phone, founded_year: co.since, is_verified: co.verified, categories: co.cats,
    status: 'approved', review_note: null,
  };
  let branches: Branch[] = co.branches.map((b, k) => ({
    id: uid(), company_id: CID, name_ar: b[0], name_en: b[1], address_ar: null, address_en: null,
    lat: k === 0 ? 23.6143 : null, lng: k === 0 ? 58.4734 : null, is_primary: b[2], position: k,
  }));
  let services: Service[] = d.services.filter(s => s.co === CID).map((s, k) => ({
    id: s.id, company_id: CID, category_id: s.cat, title_ar: s.ar, title_en: s.en, description_ar: s.dar, description_en: s.den, photos: s.imgs, is_published: true, position: k, cover_url: s.cover ?? null, keywords: s.kw || [],
  }));
  let albums: Album[] = d.albums.filter(a => a.co === CID).map((a, k) => ({
    id: a.id, company_id: CID, category_id: a.cat, title_ar: a.ar, title_en: a.en, place_ar: a.pAr, place_en: a.pEn, photos: a.imgs, cover_photo: a.img, is_published: true, position: k, created_at: a.added,
    videos: a.vids || [], gallery_hidden: [], service_id: a.svc ?? null,
    description_ar: a.dAr || '', description_en: a.dEn || '', completed_on: a.done ?? null, area_m2: a.area ?? null, duration_weeks: a.weeks ?? null, is_featured: !!a.feat,
  }));
  let week: DayHours[] = Array.from({ length: 7 }, (_, d) => {
    const h = co.hrs?.[d];
    return h ? { day: d, is_closed: false, opens: h[0], closes: h[1], opens2: h[2] ?? null, closes2: h[3] ?? null } : closedDay(d);
  });
  let stories: Story[] = [
    { id: uid(), company_id: CID, kind: 'video', media_url: 'https://assets.mixkit.co/videos/43033/43033-720.mp4', poster_url: 'https://assets.mixkit.co/videos/43033/43033-thumb-720-0.jpg', caption_ar: 'مطبخ مفتوح سلّمناه هذا الأسبوع', caption_en: 'Open kitchen handed over this week', created_at: iso(6 * 36e5), expires_at: iso(-18 * 36e5) },
    { id: uid(), company_id: CID, kind: 'image', media_url: photoUrl('1600566753190-17f0baa2a6c3', 1080), poster_url: null, caption_ar: 'خزائن داكنة بلمسة نحاسية', caption_en: 'Dark cabinets with brass details', created_at: iso(30 * 36e5), expires_at: iso(6 * 36e5) },
  ];
  // Random but stable-looking demo stats.
  const seeded = (n: number) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const stat = (k: number, base: number) => ({ cur: Math.round(base * (0.9 + seeded(k))), prev: Math.round(base * (0.7 + seeded(k + 50))) });
  const wait = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 120));
  const upsert = <X extends { id?: string }>(list: X[], x: X): [X[], X] => {
    const item = { ...x, id: x.id || uid() };
    return [list.some(y => y.id === item.id) ? list.map(y => (y.id === item.id ? item : y)) : [...list, item], item];
  };
  return {
    mode: 'demo',
    session: async () => 'demo@mujeeb.om', signIn: async () => 'ok', signOut: async () => {}, sendReset: async () => {},
    signUp: async () => ({}), registerCompany: async () => CID, resubmit: async () => { company = { ...company, status: 'pending' }; },
    deleteAccount: async () => {},
    recovering: () => false, setPassword: async () => {},
    myCompanyIds: async () => [CID],
    refs: async () => ({
      categories: d.cats.map(c => ({ id: c.i, name_ar: c.ar, name_en: c.en, color: c.color, icon: c.icon })),
      locations: Object.entries(d.gov).filter(([k]) => k !== 'all').map(([id, [ar, en]]) => ({ id, name_ar: ar, name_en: en })),
    }),
    company: async () => wait(company),
    saveCompany: async (_id, patch) => { company = { ...company, ...patch }; await wait(0); },
    branches: async () => wait(branches),
    saveBranch: async b => {
      if (b.is_primary) branches = branches.map(x => ({ ...x, is_primary: false }));
      const [l, item] = upsert(branches, b); branches = l; return wait(item);
    },
    deleteBranch: async id => { branches = branches.filter(b => b.id !== id); },
    services: async () => wait(services),
    saveService: async s => { const [l, item] = upsert(services, s); services = l; return wait(item); },
    deleteService: async id => { services = services.filter(s => s.id !== id); },
    albums: async () => wait([...albums].sort((x, y) => (y.created_at || '').localeCompare(x.created_at || ''))),
    saveAlbum: async a => {
      if (a.is_featured && !albums.find(x => x.id === a.id)?.is_featured && albums.filter(x => x.is_featured && x.id !== a.id).length >= FEATURED_MAX) throw new Error('featured_limit');
      const [l, item] = upsert(albums, { ...a, cover_photo: a.photos.includes(a.cover_photo) ? a.cover_photo : a.photos[0], created_at: a.created_at || new Date().toISOString() }); albums = l; return wait(item);
    },
    deleteAlbum: async id => { albums = albums.filter(a => a.id !== id); },
    stories: async () => wait(stories),
    createStory: async s => { const item = { ...s, id: uid(), created_at: iso(0), expires_at: iso(-24 * 36e5) }; stories = [item, ...stories]; return wait(item); },
    deleteStory: async id => { stories = stories.filter(s => s.id !== id); },
    hours: async () => wait(week),
    saveHours: async (_cid, w) => { week = w; await wait(0); },
    upload: async (_cid, file) => wait(URL.createObjectURL(file)),
    stats: async () => {
      const keys: [StatKind, number][] = [['profile_view', 420], ['service_view', 610], ['story_view', 980], ['whatsapp', 48], ['call', 21], ['directions', 33], ['follow', 26]];
      const totals = Object.fromEntries(keys.map(([k, b], i) => [k, stat(i, b)])) as Stats['totals'];
      return wait({ totals, daily: last14().map((day, k) => ({ day, n: Math.round(18 + 22 * seeded(k + 7) + k * 0.8) })), followers: 312 });
    },
  };
}

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Supabase when its keys are set, otherwise the in-memory demo. */
export const repoPromise: Promise<Repo> = URL_ && KEY ? Promise.resolve(supabaseRepo(createClient(URL_, KEY))) : demoRepo();
