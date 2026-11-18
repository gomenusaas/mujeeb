import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Booking, Catalog, Company, CustomerSeed, GovId, Lang } from '../data/types';
import { auth, remote, type Me } from '../data/api';
import { strings, STR, type T } from '../i18n/strings';
import { bookingDays, type BookingDay } from './dates';
import { pathToStack, routeToPath, shareLink } from './links';
import { STORIES } from '../data/stories';
import { DEFAULT_WILAYAT, OMAN, findWilayat, wilayatLabel } from '../data/oman';

export type Screen = 'home' | 'categories' | 'explore' | 'profile' | 'listing' | 'company' | 'service' | 'album'
  | 'booking' | 'bkDone' | 'bookings' | 'notifs' | 'story' | 'photo' | 'svcGallery' | 'svcList';
export type RootTab = 'home' | 'categories' | 'explore' | 'profile';
/** `src` + `i`: which photo a `photo` route shows (of the album or service `id`). */
export interface Route { s: Screen; id?: string; cat?: number; co?: string; src?: 'album' | 'service' | 'gallery' | 'explore'; i?: number;
  /** Company page (and its gallery viewer): the activity (category) shown; missing = all activities. */
  act?: number;
  /** Kept on a page while another page covers it, so Back returns to it as it was: */
  y?: number;      // scroll position
  f?: Filters }    // category page: search, filters and sort
/** Pages that exist once in the back trail: opening one that's already there goes back to it. */
const SINGLE: Screen[] = ['company', 'service', 'album', 'listing', 'svcGallery', 'svcList'];
const samePage = (x: Route, y: Route) => x.s === y.s && (x.id ?? '') === (y.id ?? '') && (x.cat ?? '') === (y.cat ?? '');
/** Story and full-screen photo open over the page they were tapped on. */
export const isOverlay = (r: Route) => r.s === 'story' || r.s === 'photo';
export interface Filters { gov: 'all' | GovId; verified: boolean; sort: 'rel' | 'near' | 'recent' | 'verified'; q: string }
/** How the company list is laid out: big cards or thin rows. */
export type ListView = 'large' | 'rows';
export type SheetKey = null | 'menu' | 'about' | 'hours' | 'branches' | 'address' | 'coverage' | 'contact' | 'website' | 'social' | 'sort' | 'directions' | 'activity' | 'location';
/** Sign-in sheet steps: sign in, create account, forgot password, choose a new password (from the reset email). */
export type AuthStep = 'signin' | 'signup' | 'reset' | 'newpw';
export interface BookingDraft { co: string; purpose: string; city: string; gov: GovId; day: number; time: string; notes: string; step: number }

const DEFAULT_F: Filters = { gov: 'all', verified: false, sort: 'rel', q: '' };
const LS = 'mujeeb.v1';
const TRAIL = 'mujeeb.trail';

/** The back trail saved for this tab, if it still ends on the page in the address bar. */
function restoreTrail(catalog: Catalog): { stack: Route[]; tab: RootTab } | null {
  try {
    const t = JSON.parse(sessionStorage.getItem(TRAIL) || 'null') as { stack: Route[]; tab: RootTab } | null;
    if (!t?.stack?.length) return null;
    const here = location.pathname.replace(/\/+$/, '') || '/';
    if (routeToPath(t.stack[t.stack.length - 1]) !== here) return null;
    // Every page in it must still exist (a company, service or project may have been removed since).
    const has = (list: { id: string }[], id?: string) => !!id && list.some(x => x.id === id);
    const ok = (r: Route) =>
      r.s === 'company' || r.s === 'svcList' ? has(catalog.companies, r.id)
      : r.s === 'service' || r.s === 'svcGallery' ? has(catalog.services, r.id)
      : r.s === 'album' ? has(catalog.albums, r.id)
      : r.s === 'photo' ? (r.src === 'explore' || (r.src === 'gallery' ? has(catalog.companies, r.id) : r.src === 'service' ? has(catalog.services, r.id) : has(catalog.albums, r.id)))
      : r.s !== 'story' && r.s !== 'booking' && r.s !== 'bkDone';
    return t.stack.every(ok) ? t : null;
  } catch { return null; }
}

interface Persisted { lang: Lang; fav: Record<string, boolean>; bookings: Booking[]; seq: { bk: number }; seen: Record<string, boolean>; listView: ListView; follows: Record<string, boolean>; wilayat: string }

function readPersisted(): Partial<Persisted> {
  try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; }
}

export function useAppState(catalog: Catalog, seed: CustomerSeed) {
  const saved = useRef(readPersisted()).current;
  const [lang, setLang] = useState<Lang>(saved.lang || 'ar');
  // Opening a shared link (e.g. /company/c4) starts on that screen.
  // After a reload in the same tab, pick the back trail up where it was (kept in sessionStorage); a new
  // tab or a shared link builds one from the address instead.
  const initial = useRef(restoreTrail(catalog) ?? pathToStack(location.pathname, catalog, catalog.stories ?? STORIES)).current;
  const [stack, setStack] = useState<Route[]>(initial.stack);
  const [tab, setTabState] = useState<RootTab>(initial.tab);
  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);
  // With Supabase, favorites and follows belong to the signed-in account (loaded after sign-in);
  // in demo mode they stay on the phone.
  const [fav, setFav] = useState<Record<string, boolean>>(auth.enabled ? {} : saved.fav || { c2: true, c4: true });
  const [f, setF] = useState<Filters>(DEFAULT_F);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [exCat, setExCat] = useState(-1);
  const [bookings, setBookings] = useState<Booking[]>(saved.bookings || seed.bookings);
  const [seq, setSeq] = useState({ bk: saved.seq?.bk ?? 57 });
  /** Story ids the customer has opened. */
  const [seen, setSeen] = useState<Record<string, boolean>>(saved.seen || {});
  /** The customer's service location (a wilayat id; see data/oman.ts). */
  const [wilayat, setWilayat] = useState<string>(saved.wilayat || DEFAULT_WILAYAT);
  /** Governorates and wilayats to pick from (the admin's list, or the bundled one). */
  const places = catalog.places ?? OMAN;
  const [listView, setListView] = useState<ListView>(saved.listView === 'rows' ? 'rows' : 'large'); // an old saved 'grid' becomes large cards
  /** Companies the customer follows (also sent to Supabase when it's configured). */
  const [follows, setFollows] = useState<Record<string, boolean>>(auth.enabled ? {} : saved.follows || {});
  /** The signed-in customer (null when signed out, and always in demo mode). */
  const [me, setMe] = useState<Me | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep | null>(null);
  /** A Favorite or Follow tap that asked the customer to sign in first; done once they have. */
  const pending = useRef<{ kind: 'fav' | 'follow'; id: string } | null>(null);
  const markSeen = useCallback((id: string) => setSeen(x => (x[id] ? x : { ...x, [id]: true })), []);
  const [bk, setBk] = useState<BookingDraft | null>(null);
  const days = useMemo<BookingDay[]>(() => bookingDays(), []);

  const ar = lang === 'ar';
  const t: T = useMemo(() => strings(ar), [ar]);
  const top = stack[stack.length - 1];
  /** The page being shown (under a story or full-screen photo, the page it opened over). Screens read their route from here. */
  const page = isOverlay(top) ? stack[stack.length - 2] ?? { s: 'home' as const } : top;
  /** The screen's scroll area (set by the app shell); its position is saved when another page covers it. */
  const scroller = useRef<HTMLDivElement | null>(null);
  const fRef = useRef(f);
  fRef.current = f;

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ lang, fav, bookings, seq, seen, listView, follows, wilayat } satisfies Persisted)); } catch { /* storage unavailable */ }
  }, [lang, fav, bookings, seq, seen, listView, follows, wilayat]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? 'مجيب' : 'MUJEEB';
  }, [lang, ar]);

  // Keep the back trail for this tab, so a reload doesn't lose it.
  useEffect(() => {
    try { sessionStorage.setItem(TRAIL, JSON.stringify({ stack, tab })); } catch { /* storage unavailable */ }
  }, [stack, tab]);

  // The address bar follows the screen on top, so the URL is always shareable.
  useEffect(() => {
    const path = routeToPath(top);
    if (location.pathname !== path) history.replaceState(history.state, '', path);
  }, [top]);

  const tt = useRef<number>(0);
  const showToast = useCallback((msg: string, tone = 'success') => {
    clearTimeout(tt.current);
    setToast({ msg, tone });
    tt.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* ── Navigation. The browser/phone back gesture pops one screen: we keep a single
   *  "guard" history entry and re-arm it after each pop, so history never drifts
   *  from the in-app stack. At the root screen, back leaves the app as usual. ── */
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;
  useEffect(() => {
    if (history.state?.mj !== 'guard') {
      history.replaceState({ mj: 'root' }, '');
      history.pushState({ mj: 'guard' }, '');
    }
    const onPop = () => {
      if (sheetRef.current) setSheet(null);
      else if (stackRef.current.length > 1) popTo(stackRef.current.length - 2);
      else { history.back(); return; }
      history.pushState({ mj: 'guard' }, '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /** The trail with the page now on screen remembering its scroll position (and a category page its filters). */
  const remembered = (st: Route[]): Route[] => {
    const k = st.length - 1 - (isOverlay(st[st.length - 1]) ? 1 : 0);
    if (k < 0 || isOverlay(st[k])) return st;
    const r: Route = { ...st[k], y: scroller.current?.scrollTop ?? 0, ...(st[k].s === 'listing' ? { f: fRef.current } : {}) };
    return [...st.slice(0, k), r, ...st.slice(k + 1)];
  };
  /** Back to the page at index k of the trail, as it was left. */
  function popTo(k: number) {
    const st = stackRef.current.slice(0, k + 1);
    const r = st[st.length - 1];
    if (r.s === 'listing') setF(r.f ?? DEFAULT_F);
    setStack(st);
  }
  const go = useCallback((s: Screen, p: Omit<Route, 's'> & { q?: string } = {}) => {
    setSheet(null);
    const { q, ...rest } = p;
    const next: Route = { s, ...rest };
    const st = remembered(stackRef.current);
    // Already in the trail (e.g. company → service → the company's logo): go back to it instead of adding a copy.
    const k = SINGLE.includes(s) && q == null ? st.findIndex(r => samePage(r, next)) : -1;
    if (k >= 0) {
      // Coming back to a company from a category page switches it to that activity.
      if (next.act != null) st[k] = { ...st[k], act: next.act };
      stackRef.current = st;
      popTo(k);
      return;
    }
    if (s === 'listing') setF({ ...DEFAULT_F, q: q || '' });
    setStack([...st, next]);
  }, []);
  const replace = useCallback((s: Screen, p: Omit<Route, 's'> = {}) => setStack(st => [...st.slice(0, -1), { s, ...p }]), []);
  const back = useCallback(() => {
    setSheet(null);
    if (stackRef.current.length > 1) popTo(stackRef.current.length - 2);
  }, []);
  const reset = useCallback((routes: Route[], tb: RootTab) => {
    setSheet(null);
    setTabState(tb);
    setStack(routes);
  }, []);
  const setTab = useCallback((id: RootTab) => reset([{ s: id }], id), [reset]);

  /* ── Lookups ── */
  const idx = useMemo(() => ({
    co: new Map(catalog.companies.map(c => [c.id, c])),
    svc: new Map(catalog.services.map(s => [s.id, s])),
    alb: new Map(catalog.albums.map(a => [a.id, a])),
  }), [catalog]);

  /* ── Actions ── */
  const toggleFav = useCallback((id: string) => {
    if (auth.enabled && !me) { pending.current = { kind: 'fav', id }; setAuthStep('signin'); return; }
    const on = !fav[id];
    setFav(x => ({ ...x, [id]: on }));
    showToast(ar ? STR[on ? 'savedT' : 'unsavedT'][0] : STR[on ? 'savedT' : 'unsavedT'][1]);
    remote.setFavorite(id, on).catch(() => {});
  }, [fav, ar, showToast, me]);

  const toggleFollow = useCallback((id: string) => {
    if (auth.enabled && !me) { pending.current = { kind: 'follow', id }; setAuthStep('signin'); return; }
    const on = !follows[id];
    setFollows(x => ({ ...x, [id]: on }));
    showToast(STR[on ? 'followedT' : 'unfollowedT'][ar ? 0 : 1]);
    remote.setFollow(id, on).catch(() => {});
  }, [follows, ar, showToast, me]);

  /* ── Account ── */
  useEffect(() => {
    if (!auth.enabled) return;
    let live = true;
    auth.current().then(m => { if (live) setMe(m); });
    const off = auth.onChange((m, recovery) => {
      setMe(m);
      if (recovery) setAuthStep('newpw');
    });
    return () => { live = false; off(); };
  }, []);
  // Signed in: load the account's favorites and follows, then finish the tap that asked for sign-in.
  // Signed out: clear them from the screen.
  const meId = me?.id;
  useEffect(() => {
    if (!auth.enabled) return;
    if (!meId) { setFav({}); setFollows({}); return; }
    let live = true;
    auth.lists().then(l => {
      if (!live) return;
      const fv = Object.fromEntries(l.fav.map(id => [id, true]));
      const fw = Object.fromEntries(l.follows.map(id => [id, true]));
      const p = pending.current;
      pending.current = null;
      if (p?.kind === 'fav' && !fv[p.id]) { fv[p.id] = true; remote.setFavorite(p.id, true).catch(() => {}); }
      if (p?.kind === 'follow' && !fw[p.id]) { fw[p.id] = true; remote.setFollow(p.id, true).catch(() => {}); }
      setFav(fv);
      setFollows(fw);
      if (p) showToast(STR[p.kind === 'fav' ? 'savedT' : 'followedT'][ar ? 0 : 1]);
    });
    return () => { live = false; };
  }, [meId]); // eslint-disable-line react-hooks/exhaustive-deps
  const closeAuth = useCallback(() => { setAuthStep(null); pending.current = null; }, []);
  const signOut = useCallback(async () => {
    await auth.signOut();
    showToast(STR.signedOutT[ar ? 0 : 1]);
  }, [ar, showToast]);

  const startBk = useCallback((coId: string) => {
    // The visit starts at the customer's service location (its region, or Muscat where the app has none yet).
    const { w: wl, g } = findWilayat(places, wilayat);
    setBk({ co: coId, purpose: 'measure', city: ar ? wl.ar : wl.en, gov: g.region ?? 'muscat', day: 0, time: '09:00', notes: '', step: 0 });
    go('booking');
  }, [go, wilayat, ar, places]);

  const submitBooking = useCallback(async () => {
    if (!bk) return;
    const d = days[bk.day];
    let id = 'MJB-BK-' + String(seq.bk).padStart(6, '0');
    try {
      const ref = await remote.submitBooking({ company_id: bk.co, purpose: bk.purpose, governorate: bk.gov, city: bk.city.trim(), starts_at: d.iso(bk.time), notes: bk.notes.trim() || undefined });
      if (ref) id = ref;
    } catch { showToast(ar ? 'تعذر الحفظ على الخادم، حُفظ الحجز على جهازك' : 'Could not reach the server; saved on this device', 'error'); }
    setSeq(s => ({ ...s, bk: s.bk + 1 }));
    setBookings(bs => [{ id, co: bk.co, p: bk.purpose, dAr: d.longAr, dEn: d.longEn, time: bk.time, st: 'pending' }, ...bs]);
    replace('bkDone', { id, co: bk.co });
  }, [bk, days, seq.bk, replace, showToast, ar]);

  /** Share a page or photo by its link (share sheet, or copy the link where there is none). */
  const sharePage = useCallback((route: Route, title: string, text?: string) => {
    shareLink(routeToPath(route), title, text, () => showToast(STR.linkCopied[ar ? 0 : 1], 'info'));
  }, [ar, showToast]);

  const coById = useCallback((id?: string): Company | undefined => (id ? idx.co.get(id) : undefined), [idx]);

  return {
    catalog, idx, coById, sharePage, lang, setLang, ar, t, stack, top, page, scroller, tab, setTab, go, back, replace, reset, toast, showToast,
    fav, toggleFav, f, setF, sheet, setSheet, exCat, setExCat,
    bookings, setBookings,
    bk, setBk, startBk, submitBooking, days, seen, markSeen, listView, setListView, follows, toggleFollow,
    wilayat, setWilayat, places, locLabel: wilayatLabel(places, wilayat, ar),
    me, authStep, setAuthStep, closeAuth, signOut,
  };
}

export type App = ReturnType<typeof useAppState>;
const Ctx = createContext<App | null>(null);
export const AppProvider = ({ value, children }: { value: App; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}
