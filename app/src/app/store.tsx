import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Booking, Catalog, Chat, Company, CustomerSeed, GovId, Lang, QuoteRequest } from '../data/types';
import { remote } from '../data/api';
import { strings, STR, type T } from '../i18n/strings';
import { bookingDays, nowHHMM, todayLabel, type BookingDay } from './dates';

export type Screen = 'home' | 'categories' | 'explore' | 'messages' | 'profile' | 'listing' | 'company' | 'service' | 'album'
  | 'rfq' | 'rfqDone' | 'booking' | 'bkDone' | 'chat' | 'quotes' | 'quote' | 'bookings' | 'favs' | 'notifs' | 'story';
export type RootTab = 'home' | 'categories' | 'explore' | 'messages' | 'profile';
export interface Route { s: Screen; id?: string; cat?: number; co?: string }
export interface Filters { gov: 'all' | GovId; verified: boolean; sort: 'rel' | 'near' | 'recent'; view: 'list' | 'map'; q: string }
export type SheetKey = null | 'menu' | 'about' | 'branches' | 'address' | 'coverage' | 'contact' | 'website' | 'social';
export interface RfqFile { kind: 'img' | 'doc'; name: string; size: string }
export interface RfqDraft {
  co: string; svc?: string; title: string; desc: string; gov: GovId; city: string; address: string;
  budget: number; start: number; files: RfqFile[]; name: string; phone: string; step: number;
}
export interface BookingDraft { co: string; purpose: string; city: string; gov: GovId; day: number; time: string; notes: string; step: number }

const DEFAULT_F: Filters = { gov: 'all', verified: false, sort: 'rel', view: 'list', q: '' };
const LS = 'mujeeb.v1';

interface Persisted { lang: Lang; fav: Record<string, boolean>; quotes: QuoteRequest[]; bookings: Booking[]; chats: Record<string, Chat>; seq: { rfq: number; bk: number }; seen: Record<string, boolean> }

function readPersisted(): Partial<Persisted> {
  try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; }
}

export function useAppState(catalog: Catalog, seed: CustomerSeed) {
  const saved = useRef(readPersisted()).current;
  const [lang, setLang] = useState<Lang>(saved.lang || 'ar');
  const [stack, setStack] = useState<Route[]>([{ s: 'home' }]);
  const [tab, setTabState] = useState<RootTab>('home');
  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);
  const [fav, setFav] = useState<Record<string, boolean>>(saved.fav || { c2: true, c4: true });
  const [f, setF] = useState<Filters>(DEFAULT_F);
  const [ctab, setCtab] = useState<'services' | 'portfolio'>('services');
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [exCat, setExCat] = useState(-1);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(saved.quotes || seed.quotes);
  const [bookings, setBookings] = useState<Booking[]>(saved.bookings || seed.bookings);
  const [chats, setChats] = useState<Record<string, Chat>>(saved.chats || seed.chats);
  const [seq, setSeq] = useState(saved.seq || { rfq: 128, bk: 57 });
  /** Story ids the customer has opened. */
  const [seen, setSeen] = useState<Record<string, boolean>>(saved.seen || {});
  const markSeen = useCallback((id: string) => setSeen(x => (x[id] ? x : { ...x, [id]: true })), []);
  const [draft, setDraft] = useState('');
  const [rfq, setRfq] = useState<RfqDraft | null>(null);
  const [bk, setBk] = useState<BookingDraft | null>(null);
  const days = useMemo<BookingDay[]>(() => bookingDays(), []);

  const ar = lang === 'ar';
  const t: T = useMemo(() => strings(ar), [ar]);
  const top = stack[stack.length - 1];

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ lang, fav, quotes, bookings, chats, seq, seen } satisfies Persisted)); } catch { /* storage unavailable */ }
  }, [lang, fav, quotes, bookings, chats, seq, seen]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? 'مجيب' : 'MUJEEB';
  }, [lang, ar]);

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
    if (s === 'company') setCtab('services');
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
    const on = !fav[id];
    setFav(x => ({ ...x, [id]: on }));
    showToast(ar ? STR[on ? 'savedT' : 'unsavedT'][0] : STR[on ? 'savedT' : 'unsavedT'][1]);
    remote.setFavorite(id, on).catch(() => {});
  }, [fav, ar, showToast]);

  const openChat = useCallback((coId: string) => {
    setChats(c => ({ ...c, [coId]: c[coId] ? { ...c[coId], unread: 0 } : { unread: 0, ref: null, msgs: [] } }));
    go('chat', { id: coId });
  }, [go]);

  const replyTimer = useRef(0);
  const send = useCallback(() => {
    const txt = draft.trim();
    const id = top.id;
    if (!txt || !id) return;
    const tm = nowHHMM();
    const add = (m: Chat['msgs'][number]) => setChats(c => ({ ...c, [id]: { ...c[id], msgs: [...(c[id]?.msgs || []), m] } }));
    add({ mine: true, ar: txt, en: txt, time: tm });
    setDraft('');
    remote.sendMessage(id, txt).catch(() => {});
    // Simulated company reply until the provider inbox is connected.
    clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => add({ mine: false, ar: STR.autoReply[0], en: STR.autoReply[1], time: tm }), 1400);
  }, [draft, top.id]);

  const startRfq = useCallback((coId: string, svcId?: string) => {
    const svcs = catalog.services.filter(s => s.co === coId);
    setRfq({ co: coId, svc: svcId || svcs[0]?.id, title: '', desc: '', gov: 'muscat', city: '', address: '', budget: -1, start: -1, files: [], name: t.userName, phone: '+968 9123 4567', step: 0 });
    go('rfq');
  }, [catalog.services, go, t.userName]);

  const startBk = useCallback((coId: string) => {
    setBk({ co: coId, purpose: 'measure', city: t.loc, gov: 'muscat', day: 0, time: '09:00', notes: '', step: 0 });
    go('booking');
  }, [go, t.loc]);

  const submitRfq = useCallback(async () => {
    if (!rfq) return;
    let id = 'MJB-RFQ-' + String(seq.rfq).padStart(6, '0');
    try {
      const ref = await remote.submitRfq({
        company_id: rfq.co, service_id: rfq.svc, title: rfq.title.trim(), description: rfq.desc.trim(), governorate: rfq.gov,
        city: rfq.city.trim(), address: rfq.address.trim() || undefined, budget_range: rfq.budget >= 0 ? rfq.budget : undefined,
        preferred_start: rfq.start >= 0 ? rfq.start : undefined, contact_name: rfq.name.trim(), contact_phone: rfq.phone.trim(), attachments: rfq.files,
      });
      if (ref) id = ref;
    } catch { showToast(ar ? 'تعذر الحفظ على الخادم، حُفظ الطلب على جهازك' : 'Could not reach the server; saved on this device', 'error'); }
    setSeq(s => ({ ...s, rfq: s.rfq + 1 }));
    setQuotes(qs => [{ id, co: rfq.co, svc: rfq.svc || '', tAr: rfq.title, tEn: rfq.title, st: 'submitted', date: todayLabel() }, ...qs]);
    replace('rfqDone', { id, co: rfq.co });
  }, [rfq, seq.rfq, replace, showToast, ar]);

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

  const coById = useCallback((id?: string): Company | undefined => (id ? idx.co.get(id) : undefined), [idx]);

  return {
    catalog, idx, coById, lang, setLang, ar, t, stack, top, tab, setTab, go, back, replace, reset, toast, showToast,
    fav, toggleFav, f, setF, ctab, setCtab, sheet, setSheet, exCat, setExCat,
    quotes, setQuotes, bookings, setBookings, chats, openChat, draft, setDraft, send,
    rfq, setRfq, startRfq, submitRfq, bk, setBk, startBk, submitBooking, days, seen, markSeen,
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
