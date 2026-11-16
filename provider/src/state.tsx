import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Category, Company, Location, Repo } from './data';
import { arDigits, strings, type T } from './i18n';

export type Section = 'dashboard' | 'profile' | 'hours' | 'branches' | 'services' | 'projects' | 'stories' | 'approvals';
/** `admin`: only for MUJEEB admins. */
export const SECTIONS: { id: Section; icon: string; label: keyof T; admin?: boolean }[] = [
  { id: 'dashboard', icon: 'layout-dashboard', label: 'dashboard' },
  { id: 'stories', icon: 'circle-play', label: 'stories' },
  { id: 'services', icon: 'briefcase', label: 'services' },
  { id: 'projects', icon: 'images', label: 'projects' },
  { id: 'profile', icon: 'building-2', label: 'profile' },
  { id: 'hours', icon: 'clock', label: 'hours' },
  { id: 'branches', icon: 'map-pin', label: 'branches' },
  { id: 'approvals', icon: 'shield-check', label: 'approvals', admin: true },
];

const LS = 'mujeeb.provider.v1';
const readLang = (): 'ar' | 'en' => { try { return JSON.parse(localStorage.getItem(LS) || '{}').lang === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } };
const sectionFromHash = (): Section => {
  const s = location.hash.replace(/^#\/?/, '') as Section;
  return SECTIONS.some(x => x.id === s) ? s : 'dashboard';
};

export function useProviderState(repo: Repo, initial: Company, refs: { categories: Category[]; locations: Location[] }, email: string, isAdmin: boolean) {
  const [lang, setLang] = useState<'ar' | 'en'>(readLang);
  const ar = lang === 'ar';
  const t = useMemo(() => strings(ar), [ar]);
  const [company, setCompany] = useState(initial);
  const [section, setSection] = useState<Section>(() => { const s = sectionFromHash(); return s === 'approvals' && !isAdmin ? 'dashboard' : s; });
  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.title = (ar ? 'مجيب · لوحة الشركة' : 'MUJEEB · Company dashboard');
    try { localStorage.setItem(LS, JSON.stringify({ lang })); } catch { /* storage unavailable */ }
  }, [lang, ar]);

  useEffect(() => {
    const on = () => setSection(sectionFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((s: Section) => { if (location.hash !== '#/' + s) location.hash = '/' + s; setSection(s); window.scrollTo({ top: 0 }); }, []);

  const tt = useRef(0);
  const showToast = useCallback((msg: string, tone = 'success') => {
    clearTimeout(tt.current);
    setToast({ msg, tone });
    tt.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const cat = useCallback((id: number) => refs.categories.find(c => c.id === id), [refs.categories]);
  const num = useCallback((n: number) => (ar ? arDigits(n.toLocaleString('en-US')) : n.toLocaleString('en-US')), [ar]);
  const pick = useCallback(<X,>(arV: X, enV: X) => (ar ? arV : enV), [ar]);

  return {
    repo, email, isAdmin, lang, setLang, ar, t, company, setCompany, refs, cat, section, go, toast, showToast,
    num, pick,
  };
}

export type PState = ReturnType<typeof useProviderState>;
const Ctx = createContext<PState | null>(null);
export const StateProvider = ({ value, children }: { value: PState; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export function useP() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useP outside StateProvider');
  return v;
}

/** Loads a list for the current company and exposes it with a reload. */
export function useList<X>(load: () => Promise<X[]>, deps: unknown[]) {
  const [items, setItems] = useState<X[] | null>(null);
  const [error, setError] = useState(false);
  const reload = useCallback(() => {
    load().then(x => { setItems(x); setError(false); }).catch(() => setError(true));
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [reload]);
  return { items, setItems, error, reload };
}
