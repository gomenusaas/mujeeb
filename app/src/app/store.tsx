import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Booking, Catalog, Company, CustomerSeed, GovId, Lang } from '../data/types';
import { auth, remote, type Me } from '../data/api';
import { strings, STR, type T } from '../i18n/strings';
import { bookingDays, type BookingDay } from './dates';
import { pathToStack, routeToPath, shareLink } from './links';
import { STORIES } from '../data/stories';

export type Screen = 'home' | 'categories' | 'explore' | 'profile' | 'listing' | 'company' | 'service' | 'album'
  | 'booking' | 'bkDone' | 'bookings' | 'favs' | 'notifs' | 'story' | 'photo';
export type RootTab = 'home' | 'categories' | 'explore' | 'profile';
/** `src` + `i`: which photo a `photo` route shows (of the album or service `id`). */
export interface Route { s: Screen; id?: string; cat?: number; co?: string; src?: 'album' | 'service' | 'gallery'; i?: number }
export interface Filters { gov: 'all' | GovId; verified: boolean; sort: 'rel' | 'near' | 'recent' | 'verified'; q: string }
/** How the company list is laid out: big cards, two per row, or thin rows. */
export type ListView = 'large' | 'grid' | 'rows';
/** Company page: its services as a list, or a gallery of its project photos and videos. */
export type CoView = 'list' | 'gallery';
export type SheetKey = null | 'menu' | 'about' | 'hours' | 'branches' | 'address' | 'coverage' | 'contact' | 'website' | 'social' | 'sort' | 'directions';
/** Sign-in sheet steps: sign in, create account, forgot password, choose a new password (from the reset email). */
export type AuthStep = 'signin' | 'signup' | 'reset' | 'newpw';
export interface BookingDraft { co: string; purpose: string; city: string; gov: GovId; day: number; time: string; notes: string; step: number }

const DEFAULT_F: Filters = { gov: 'all', verified: false, sort: 'rel', q: '' };
const LS = 'mujeeb.v1';

interface Persisted { lang: Lang; fav: Record<string, boolean>; bookings: Booking[]; seq: { bk: number }; seen: Record<string, boolean>; listView: ListView; follows: Record<string, boolean> }

function readPersisted(): Partial<Persisted> {
  try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; }
}

export function useAppState(catalog: Catalog, seed: CustomerSeed) {
  const saved = useRef(readPersisted()).current;
  const [lang, setLang] = useState<Lang>(saved.lang || 'ar');
  // Opening a shared link (e.g. /company/c4) starts on that screen.
  const initial = useRef(pathToStack(location.pathname, catalog, catalog.stories ?? STORIES)).current;
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
  const [listView, setListView] = useState<ListView>(saved.listView || 'large');
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

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ lang, fav, bookings, seq, seen, listView, follows } satisfies Persisted)); } catch { /* storage unavailable */ }
  }, [lang, fav, bookings, seq, seen, listView, follows]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? 'مجيب' : 'MUJEEB';
  }, [lang, ar]);

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
      else if (stackRef.current.length > 1) setStack(st => st.slice(0, -1));
      else { history.back(); return; }
      history.pushState({ mj: 'guard' }, '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((s: Screen, p: Omit<Route, 's'> & { q?: string } = {}) => {
    setSheet(null);
    const { q, ...rest } = p;
    if (s === 'listing') setF({ ...DEFAULT_F, q: q || '' });
    setStack(st => [...st, { s, ...rest }]);
  }, []);
  const replace = useCallback((s: Screen, p: Omit<Route, 's'> = {}) => setStack(st => [...st.slice(0, -1), { s, ...p }]), []);
  const back = useCallback(() => {
    setSheet(null);
    setStack(st => (st.length > 1 ? st.slice(0, -1) : st));
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
    setBk({ co: coId, purpose: 'measure', city: t.loc, gov: 'muscat', day: 0, time: '09:00', notes: '', step: 0 });
    go('booking');
  }, [go, t.loc]);

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
    catalog, idx, coById, sharePage, lang, setLang, ar, t, stack, top, tab, setTab, go, back, replace, reset, toast, showToast,
    fav, toggleFav, f, setF, sheet, setSheet, exCat, setExCat,
    bookings, setBookings,
    bk, setBk, startBk, submitBooking, days, seen, markSeen, listView, setListView, follows, toggleFollow,
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
