import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Refs } from './api';
import { arDigits, strings, type T } from './i18n';

export type Section = 'overview' | 'companies' | 'users' | 'subServices' | 'locations' | 'admins';
export const SECTIONS: { id: Section; icon: string; label: keyof T }[] = [
  { id: 'overview', icon: 'layout-dashboard', label: 'overview' },
  { id: 'companies', icon: 'building-2', label: 'companies' },
  { id: 'users', icon: 'user-round', label: 'users' },
  { id: 'subServices', icon: 'layout-list', label: 'subServices' },
  { id: 'locations', icon: 'map-pin', label: 'locations' },
  { id: 'admins', icon: 'shield-check', label: 'admins' },
];

const LS = 'mujeeb.admin.v1';
export const readLang = (): 'ar' | 'en' => { try { return JSON.parse(localStorage.getItem(LS) || '{}').lang === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } };
export const saveLang = (lang: 'ar' | 'en') => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  try { localStorage.setItem(LS, JSON.stringify({ lang })); } catch { /* storage unavailable */ }
};
const fromHash = (): Section => {
  const s = location.hash.replace(/^#\/?/, '').split('?')[0] as Section;
  return SECTIONS.some(x => x.id === s) ? s : 'overview';
};

export function useAdminState(refs: Refs, me: { id: string; email: string }) {
  const [lang, setLang] = useState<'ar' | 'en'>(readLang);
  const ar = lang === 'ar';
  const t = useMemo(() => strings(ar), [ar]);
  const [section, setSection] = useState<Section>(fromHash);
  /** Companies page filter, so "Review all" on the Overview can open the pending list. */
  const [companyFilter, setCompanyFilter] = useState<'pending' | 'approved' | 'hidden' | 'rejected' | null>('pending');
  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);

  useEffect(() => {
    saveLang(lang);
    document.title = ar ? 'مجيب · الإدارة' : 'MUJEEB · Admin';
  }, [lang, ar]);
  useEffect(() => {
    const on = () => setSection(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((s: Section) => { if (location.hash !== '#/' + s) location.hash = '/' + s; setSection(s); window.scrollTo({ top: 0 }); }, []);

  const tt = useRef(0);
  const showToast = useCallback((msg: string, tone = 'success') => {
    clearTimeout(tt.current);
    setToast({ msg, tone });
    tt.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const num = useCallback((n: number) => (ar ? arDigits(Number(n).toLocaleString('en-US')) : Number(n).toLocaleString('en-US')), [ar]);
  const pick = useCallback(<X,>(a: X, b: X) => (ar ? a : b), [ar]);
  const when = useCallback((iso: string | null) => (iso ? new Date(iso).toLocaleString(ar ? 'ar-OM' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Muscat' }) : ''), [ar]);
  const catName = useCallback((id: number) => { const c = refs.categories.find(x => x.id === id); return c ? (ar ? c.name_ar : c.name_en) : String(id); }, [refs, ar]);
  const govName = useCallback((id: string) => { const l = refs.locations.find(x => x.id === id); return l ? (ar ? l.name_ar : l.name_en) : id; }, [refs, ar]);

  return { lang, setLang, ar, t, refs, me, section, go, companyFilter, setCompanyFilter, toast, showToast, num, pick, when, catName, govName };
}

export type AState = ReturnType<typeof useAdminState>;
const Ctx = createContext<AState | null>(null);
export const StateProvider = ({ value, children }: { value: AState; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export function useA() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useA outside StateProvider');
  return v;
}

/** Loads data, exposes it with a reload and an error flag. */
export function useLoad<X>(load: () => Promise<X>, deps: unknown[]) {
  const [data, setData] = useState<X | null>(null);
  const [error, setError] = useState(false);
  const reload = useCallback(() => {
    setError(false);
    load().then(setData).catch(() => setError(true));
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [reload]);
  return { data, error, reload };
}
