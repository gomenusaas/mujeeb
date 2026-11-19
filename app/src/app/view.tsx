import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { AppBar, Icon } from '../ds';
import { logoUrl, photo, remote } from '../data/api';
import type { Album, Branch, Catalog, Company, GovId, Service } from '../data/types';
import type { App } from './store';
import { findWilayat } from '../data/oman';
import { isOpenNow } from './hours';
import { arDigits } from '../i18n/strings';

/** Bilingual field helpers bound to the current language. */
export function helpers(a: App) {
  const { ar, t, catalog } = a;
  const cat = (i: number) => catalog.cats[i];
  const cname = (i: number) => (ar ? cat(i).ar : cat(i).en);
  const cshort = (i: number) => (ar ? cat(i).sar : cat(i).sen);
  const gname = (g: string) => (catalog.gov as Record<string, [string, string]>)[g]?.[ar ? 0 : 1] ?? g;
  const covText = (co: Company) => (co.cov.includes('all') ? gname('all') : co.cov.map(gname).join(ar ? '، ' : ', '));
  const num = (n: number) => (ar ? arDigits(n) : String(n));
  const coName = (co: Company) => (ar ? co.ar : co.en);
  // A company's town with its governorate, e.g. «ولاية السيب، محافظة مسقط» / "As Seeb Wilayat, Muscat Governorate",
  // looked up in the wilayat list; names that already carry an area («الخوير، مسقط») or aren't a wilayat stay as they are.
  const city = (co: Company) => {
    const name = ar ? co.cityAr : co.cityEn;
    if (/[،,]/.test(name)) return name;
    for (const g of a.places) for (const w of g.wilayats) if (w.ar === co.cityAr || w.en === co.cityEn)
      return ar ? 'ولاية ' + w.ar + '، محافظة ' + g.ar : w.en + ' Wilayat, ' + g.en + ' Governorate';
    return name;
  };
  const coV = (co: Company) => ({
    id: co.id, logo: logoUrl(co.id), name: coName(co), cats: co.cats.map(cname).join(' · '), cat: cname(co.cats[0]),
    city: city(co), covers: t.covers + ' ' + covText(co), cover: photo(co.img, 700), c100: 'var(--cat-' + cat(co.cats[0]).color + '-100)',
    verified: co.verified, fav: !!a.fav[co.id], onFav: () => a.toggleFav(co.id), open: () => a.go('company', { id: co.id }),
  });
  const albV = (al: Album) => {
    const co = a.idx.co.get(al.co)!;
    return {
      id: al.id, title: ar ? al.ar : al.en, company: coName(co), place: ar ? al.pAr : al.pEn, count: al.n + ' ' + t.photos,
      img: photo(al.img, 600), c100: 'var(--cat-' + cat(al.cat).color + '-100)', open: () => a.go('album', { id: al.id }),
    };
  };
  const svcV = (s: Service) => ({ id: s.id, title: ar ? s.ar : s.en, cat: cname(s.cat), img: photo(serviceImage(a, s), 400), n: s.imgs.length, open: () => a.go('service', { id: s.id }) });
  return { cat, cname, cshort, gname, covText, num, coName, city, coV, albV, svcV };
}

/** Photos shown on a project page (each once). The photo viewer uses the same list. */
export const albumPhotos = (al: Album) => al.imgs;

/** One photo or video. `src` is an Unsplash id (demo) or a full URL; `al` is the project it belongs to. */
export interface Media { src: string; video: boolean; al?: Album }

/** Everything on a project page: its photos, then its videos. */
export const albumMedia = (al: Album): Media[] => [
  ...albumPhotos(al).map(src => ({ src, video: false, al })),
  ...(al.vids || []).map(src => ({ src, video: true, al })),
];

/**
 * A company's gallery: photos and videos from all of its projects (or only those of activity
 * `cat`), newest project first, minus anything the company hid from the gallery in the provider app.
 */
export function companyGallery(a: App, coId: string, cat?: number): Media[] {
  const seen = new Set<string>(); // the same photo used in two projects shows once
  return a.catalog.albums.filter(al => al.co === coId && (cat == null || al.cat === cat)).sort((x, y) => (y.added || '').localeCompare(x.added || ''))
    .flatMap(al => {
      const hide = new Set(al.hide || []);
      return al.imgs.map(src => ({ src, video: false, al }))
        .concat((al.vids || []).map(src => ({ src, video: true, al })))
        .filter(m => !hide.has(m.src) && !seen.has(m.src) && !!seen.add(m.src));
    });
}

/**
 * Text in one comparable form for search: lower case, no Arabic diacritics or tatweel, letter variants folded
 * (أ إ آ ٱ → ا, ة → ه, ى → ي, ؤ → و, ئ → ي), Arabic digits as 0–9 and single spaces. So «الحدايق» finds «الحدائق».
 */
export const fold = (s: string) => s.toLowerCase()
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
  .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660)).replace(/\s+/g, ' ');

/**
 * Each company's searchable text, built once per catalog. `strong`: its names, categories, service titles,
 * the services' keywords and sub-services (from the list and typed). `weak`: service descriptions and its projects' titles and descriptions.
 */
const searchIndexes = new WeakMap<Catalog, Map<string, { strong: string; weak: string }>>();
function searchIndex(catalog: Catalog) {
  let idx = searchIndexes.get(catalog);
  if (idx) return idx;
  idx = new Map();
  const subName = new Map(catalog.subs.map(x => [x.id, x.ar + ' ' + x.en]));
  for (const co of catalog.companies) {
    const svcs = catalog.services.filter(s => s.co === co.id);
    const albs = catalog.albums.filter(al => al.co === co.id);
    idx.set(co.id, {
      strong: fold([co.ar, co.en, ...co.cats.map(i => catalog.cats[i].ar + ' ' + catalog.cats[i].en),
        ...svcs.map(s => [s.ar, s.en, ...(s.kw || []), ...(s.sub || []).map(id => subName.get(id) || ''), ...(s.csub || [])].join(' '))].join(' | ')),
      weak: fold([...svcs.map(s => s.dar + ' ' + s.den), ...albs.map(al => [al.ar, al.en, al.dAr || '', al.dEn || ''].join(' '))].join(' | ')),
    });
  }
  searchIndexes.set(catalog, idx);
  return idx;
}
/** The words of a search, folded. A leading «ال» is dropped from longer words, so «المطابخ» also finds «مطابخ». */
const searchWords = (q: string) => fold(q).trim().split(' ').filter(Boolean).map(w => (w.length > 4 && w.startsWith('ال') ? w.slice(2) : w));

/** The governorate of the customer's service location (what company coverage is checked against); null when unknown. */
export function myGov(a: App): GovId | null {
  return findWilayat(a.places, a.wilayat).g.region ?? null;
}
/** The company works in this governorate. */
export const covers = (co: Company, g: GovId | null) => !!g && (co.cov.includes('all') || co.cov.includes(g));

/**
 * The chips a category page can be narrowed by: its sub-services (the admin's fixed list, in order) that at least
 * one of the category's companies offers, with how many do. `key` is the sub-service id.
 */
export function categoryServiceChips(a: App, c: number | undefined): { key: string; label: string; n: number }[] {
  if (c == null) return [];
  const { catalog, ar } = a;
  const cos = new Map<string, Set<string>>();
  for (const s of catalog.services) if (s.cat === c) for (const id of s.sub || []) cos.set(id, (cos.get(id) ?? new Set()).add(s.co));
  return catalog.subs.filter(x => x.cat === c && cos.has(x.id)).map(x => ({ key: x.id, label: ar ? x.ar : x.en, n: cos.get(x.id)!.size }));
}

/**
 * Companies on a category page (all categories when `c` is empty) after the customer's search and filters,
 * in the chosen order. A search matches when every word appears in the company's text (see searchIndex).
 * «الأنسب»: search hits in names, titles or keywords first, then companies that cover the customer's area,
 * then verified ones, then those with more projects in the category; ties keep the catalogue order.
 */
export function listingCompanies(a: App, c: number | undefined): Company[] {
  const { catalog, f } = a;
  const words = searchWords(f.q);
  const idx = words.length ? searchIndex(catalog) : null;
  const g = myGov(a);
  const score = new Map<string, number>();
  // Sub-service chips: companies that cover every selected one (each by some service in this category).
  const coversSub = (co: Company, id: string) => catalog.services.some(s => s.co === co.id && (c == null || s.cat === c) && s.sub?.includes(id));
  let res = catalog.companies.filter(co => {
    if (!((c == null || co.cats.includes(c)) &&
      // Coverage, not branch location, decides whether a company appears for a governorate.
      (f.gov === 'all' || co.cov.includes('all') || co.cov.includes(f.gov)) &&
      (!f.verified || co.verified) &&
      (!f.mine || covers(co, g)) &&
      (!f.open || (!!co.hrs && isOpenNow(co.hrs))) &&
      f.svcs.every(id => coversSub(co, id)))) return false;
    if (!idx) return true;
    const { strong, weak } = idx.get(co.id)!;
    if (!words.every(w => strong.includes(w) || weak.includes(w))) return false;
    score.set(co.id, words.filter(w => strong.includes(w)).length);
    return true;
  });
  const projects = (co: Company) => catalog.albums.filter(al => al.co === co.id && (c == null || al.cat === c)).length;
  const by = (...keys: ((co: Company) => number)[]) => (x: Company, y: Company) => { for (const k of keys) { const d = k(y) - k(x); if (d) return d; } return 0; };
  // «الأحدث أعمالًا»: the company with the latest project in this category first.
  const latest = (co: Company) => { let d = ''; for (const al of catalog.albums) if (al.co === co.id && (c == null || al.cat === c) && (al.added || '') > d) d = al.added || ''; return d; };
  if (f.sort === 'recent') { const l = new Map(res.map(co => [co.id, latest(co)])); return res.slice().sort((x, y) => l.get(y.id)!.localeCompare(l.get(x.id)!)); }
  if (f.sort === 'projects') return res.slice().sort(by(projects, co => Number(covers(co, g))));
  if (f.sort === 'followers') return res.slice().sort(by(co => catalog.followers?.[co.id] ?? 0, projects));
  // «الأنسب» (also for an order saved by an older version).
  return res.slice().sort(by(co => score.get(co.id) ?? 0, co => Number(covers(co, g)), co => Number(co.verified), projects));
}

/** Projects added within this many days count as new and move toward the top of Explore. */
const FRESH_DAYS = 14;

/** A random id kept on this device, so each customer's gallery order differs a little from everyone else's. */
let deviceSeed = '';
function customerSeed(): string {
  if (deviceSeed) return deviceSeed;
  const K = 'mujeeb.seed';
  try { deviceSeed = localStorage.getItem(K) || ''; } catch { /* storage unavailable */ }
  if (!deviceSeed) {
    deviceSeed = Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem(K, deviceSeed); } catch { /* storage unavailable */ }
  }
  return deviceSeed;
}

/** A repeatable random number in [0, 1) for a piece of text. */
function rand(s: string): number {
  let h = 2166136261;
  for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); }
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12;
  return (h >>> 0) / 4294967296;
}

/**
 * «استكشف الأعمال» (Explore): photos and videos from inside every published project (or one
 * category's), minus what companies hid from their galleries, in the daily mix order.
 */
export function exploreMedia(a: App, cat: number | null | undefined): Media[] {
  return mixedMedia(a.catalog.albums.filter(al => cat == null || al.cat === cat));
}

/**
 * A company's work for a quick look from a category page: photos and videos from its projects in the category
 * (all when null), minus what it hid from its gallery, in the daily mix order (so it changes daily, not on every look).
 */
export function companyPreview(a: App, coId: string, cat: number | null | undefined): Media[] {
  // The company is part of each key, so two companies that share a photo don't come out in the same order.
  return mixedMedia(a.catalog.albums.filter(al => al.co === coId && (cat == null || al.cat === cat)), coId + '|');
}

/** The photos and videos of these projects (each once, minus hidden ones) in the daily mix order. */
function mixedMedia(albums: Album[], keyPrefix = ''): Media[] {
  const seen = new Set<string>(); // the same photo used in two projects shows once
  const entries: MixEntry<Media>[] = [];
  for (const al of albums) {
    const hide = new Set(al.hide || []);
    for (const m of al.imgs.map(src => ({ src, video: false, al })).concat((al.vids || []).map(src => ({ src, video: true, al })))) {
      if (hide.has(m.src) || seen.has(m.src)) continue;
      seen.add(m.src);
      entries.push({ item: m, key: keyPrefix + m.src, company: al.co, added: al.added });
    }
  }
  return dailyMix(entries);
}

/** One thing to order with `dailyMix`: a stable `key`, its company, and when its project was added. */
interface MixEntry<T> { item: T; key: string; company: string; added: string }

/**
 * The "daily mix" order (Explore): shuffled once a day (Oman date) with a
 * 20% per-customer twist, things from projects added in the last FRESH_DAYS days first, and companies
 * taking turns (one item from each company per round) so none fills the screen.
 */
function dailyMix<T>(entries: MixEntry<T>[]): T[] {
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' });
  const me = customerSeed();
  const score = (key: string) => 0.8 * rand(day + '|' + key) + 0.2 * rand(day + '|' + me + '|' + key);
  const freshSince = Date.now() - FRESH_DAYS * 864e5;
  const queues = new Map<string, { item: T; s: number }[]>();
  for (const e of entries) {
    const q = queues.get(e.company) ?? [];
    queues.set(e.company, q);
    q.push({ item: e.item, s: (Date.parse(e.added) > freshSince ? 1 : 0) + score(e.key) });
  }
  const qs = [...queues.values()].map(q => q.sort((x, y) => y.s - x.s));
  const out: T[] = [];
  for (let r = 0; qs.some(q => q.length > r); r++) {
    qs.filter(q => q.length > r).map(q => q[r]).sort((x, y) => y.s - x.s).forEach(x => out.push(x.item));
  }
  return out;
}

/**
 * A service's photos and videos: everything in the projects linked to it (newest project first),
 * minus what the company hid from its galleries, then any photos uploaded on the service itself
 * before projects were linked (those don't belong to a project).
 */
export function serviceGallery(a: App, svcId: string): Media[] {
  const seen = new Set<string>();
  const fromProjects = a.catalog.albums.filter(al => al.svc === svcId).sort((x, y) => (y.added || '').localeCompare(x.added || ''))
    .flatMap(al => {
      const hide = new Set(al.hide || []);
      return al.imgs.map(src => ({ src, video: false, al } as Media)).concat((al.vids || []).map(src => ({ src, video: true, al })))
        .filter(m => !hide.has(m.src) && !seen.has(m.src) && !!seen.add(m.src));
    });
  const own = (a.idx.svc.get(svcId)?.imgs || []).filter(src => !seen.has(src) && !!seen.add(src)).map(src => ({ src, video: false }));
  return fromProjects.concat(own);
}

/** A service's picture: its cover, else its first photo (own or from a project), else the company cover. */
export function serviceImage(a: App, s: Service): string {
  return s.cover || s.imgs[0] || serviceGallery(a, s.id).find(m => !m.video)?.src || a.idx.co.get(s.co)?.img || '';
}

export const stop = (e: React.SyntheticEvent) => e.stopPropagation();

/** Horizontal, snap-scrolling carousel row with hidden scrollbar (mouse-draggable, see useDragScroll). */
export function HScroll({ children, style, snap = true }: { children: ReactNode; style?: CSSProperties; snap?: boolean }) {
  return (
    <div className="mj-s" style={{ display: 'flex', gap: 12, overflowX: 'auto', ...(snap ? { scrollSnapType: 'x mandatory', scrollPaddingInline: 20 } : {}), padding: '4px 20px 12px', margin: '-4px 0 -12px', scrollbarWidth: 'none', ...style }}>
      {children}
    </div>
  );
}

const blurBg: CSSProperties = { backdropFilter: 'var(--blur-bar)', WebkitBackdropFilter: 'var(--blur-bar)' };

/** Sticky top app bar used by pushed screens. */
export function TopBar({ title, subtitle, onBack, children }: { title?: ReactNode; subtitle?: ReactNode; onBack: () => void; children?: ReactNode }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 5, paddingTop: 'var(--top-inset)', background: 'oklch(0.985 0.004 285 / 0.86)', ...blurBg }}>
      <AppBar title={title} subtitle={subtitle} onBack={onBack} />
      {children}
    </div>
  );
}

/** Sticky bottom action bar. */
export function BottomBar({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: 'sticky', bottom: 0, marginTop: 'auto', padding: '14px 20px calc(26px + var(--safe-bottom))', background: 'oklch(1 0 0 / 0.94)', boxShadow: 'var(--shadow-up)', ...blurBg, ...style }}>
      {children}
    </div>
  );
}

export function StepBars({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 20px 10px' }}>
      {[0, 1, 2].map(k => <span key={k} style={{ flex: 1, height: 4, borderRadius: 4, background: k <= step ? 'var(--brand)' : 'var(--neutral-200)', transition: 'background var(--dur-slow)' }} />)}
    </div>
  );
}

/** A photo filling its box. `eager`: load it now instead of when the browser decides it's close to the screen. */
export const Img = ({ src, style, eager }: { src: string; style?: CSSProperties; eager?: boolean }) => (
  <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
);

/**
 * True once the element comes within `margin` px of the visible part of the page's scroller (and stays true).
 * Used to start loading photos well before they scroll into view: Safari's own lazy loading starts late,
 * so photos popped in a moment after scrolling to them.
 */
export function useNear(ref: { current: Element | null }, margin = 900): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setNear(true); io.disconnect(); } },
      { root: el.closest('.mj-scroll'), rootMargin: margin + 'px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}

/** Starts downloading photos now (e.g. a sheet's first photos as the finger touches what opens it). */
export function preloadPhotos(urls: string[]) {
  for (const u of urls) { const im = new Image(); im.decoding = 'async'; im.src = u; }
}

export const MetaLine = ({ icon, children, size = 13, style }: { icon: string; children: ReactNode; size?: number; style?: CSSProperties }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-tertiary)', ...style }}>
    <Icon name={icon} size={size} />{children}
  </span>
);

/** WhatsApp, Call and Follow on company & service pages (Followed: light purple, so contacting stays the main action). Directions live in the company page's top bar. */
export function ContactGrid({ a, co, waText, follow = true }: { a: App; co: Company; waText?: string; follow?: boolean }) {
  const { t } = a;
  const items = [
    { icon: 'message-circle', label: t.whatsapp, tone: 'green', go: () => openWhatsApp(a, co, waText) },
    { icon: 'phone', label: t.call, tone: 'sky', go: () => callPhone(a, co.phone, co.id) },
    ...(follow ? [{ icon: a.follows[co.id] ? 'user-check' : 'user-plus', label: a.follows[co.id] ? t.following : t.follow, tone: 'amber', on: !!a.follows[co.id], go: () => a.toggleFollow(co.id) }] : []),
  ];
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: 8 }}>
      {items.map(x => (
        <button key={x.label} type="button" className="mj-press" onClick={x.go} aria-pressed={'on' in x ? x.on : undefined}
          style={{ minWidth: 0, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0 8px', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-sans)', font: 'var(--type-body-sm)', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
            background: 'on' in x && x.on ? 'var(--brand-tint-strong)' : 'var(--cat-' + x.tone + '-100)', color: 'on' in x && x.on ? 'var(--brand)' : 'var(--cat-' + x.tone + '-800)', transition: 'background var(--dur-base), color var(--dur-base)' }}>
          <Icon name={x.icon} size={15} style={{ flex: 'none' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.label}</span>
        </button>
      ))}
    </div>
  );
}

/* Deep links. Each tap is logged for the company's stats (Supabase only); clicks are interactions, not confirmed business. */
const digits = (p: string) => p.replace(/[^\d]/g, '');
/** Opens a WhatsApp chat with the company, optionally with a ready-made message. */
export function openWhatsApp(a: App, co: Company, text?: string) {
  a.showToast(a.t.opening, 'info');
  remote.track(co.id, 'whatsapp');
  window.open('https://wa.me/' + digits(co.phone) + (text ? '?text=' + encodeURIComponent(text) : ''), '_blank', 'noopener');
}
/**
 * Opens the phone's maps app with directions to a branch: to its map pin when the company has set one in
 * the provider app, otherwise to a search for "company, branch area, Oman". Apple Maps on iPhone/iPad, Google Maps elsewhere.
 */
export function openDirections(a: App, co: Company, branch?: Branch) {
  const lat = branch?.[3], lng = branch?.[4];
  const q = lat != null && lng != null ? lat + ',' + lng : encodeURIComponent(co.en + ', ' + (branch ? branch[1] : co.cityEn) + ', Oman');
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  a.showToast(a.t.openingMaps, 'info');
  remote.track(co.id, 'directions');
  window.open(ios ? 'https://maps.apple.com/?daddr=' + q + '&dirflg=d' : 'https://www.google.com/maps/dir/?api=1&destination=' + q, '_blank', 'noopener');
}
export function callPhone(a: App, phone: string, companyId?: string) {
  a.showToast(a.t.calling + ' ' + phone, 'info');
  if (companyId) remote.track(companyId, 'call');
  window.location.href = 'tel:' + digits(phone).replace(/^/, '+');
}

export const card: CSSProperties = { borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' };
