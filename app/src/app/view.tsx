import type { CSSProperties, ReactNode } from 'react';
import { AppBar, Icon } from '../ds';
import { logoUrl, photo, remote } from '../data/api';
import type { Album, Branch, Company, Service } from '../data/types';
import type { App } from './store';
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
  const city = (co: Company) => (ar ? co.cityAr : co.cityEn);
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
  const svcV = (s: Service) => ({ id: s.id, title: ar ? s.ar : s.en, cat: cname(s.cat), img: photo(s.cover || s.imgs[0], 400), n: s.imgs.length, open: () => a.go('service', { id: s.id }) });
  return { cat, cname, cshort, gname, covText, num, coName, city, coV, albV, svcV };
}

/** Photos shown on a project page (the demo pads short albums to six). The photo viewer uses the same list. */
export const albumPhotos = (al: Album) => al.imgs.concat(al.imgs).slice(0, 6);

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
 * Companies on a category page (all categories when `c` is empty) after the customer's
 * search and filters, in the chosen sort order. The category gallery uses the same companies.
 */
export function listingCompanies(a: App, c: number | undefined): Company[] {
  const { catalog, f } = a;
  const q = f.q.trim().toLowerCase();
  let res = catalog.companies.filter(co =>
    (c == null || co.cats.includes(c)) &&
    // Coverage, not branch location, decides whether a company appears for a governorate.
    (f.gov === 'all' || co.cov.includes('all') || co.cov.includes(f.gov)) &&
    (!f.verified || co.verified) &&
    (!q || [co.ar, co.en, ...co.cats.map(i => catalog.cats[i].ar + ' ' + catalog.cats[i].en),
      ...catalog.services.filter(s => s.co === co.id).map(s => s.ar + ' ' + s.en)].join(' ').toLowerCase().includes(q)));
  if (f.sort === 'near') res = res.slice().sort((x, y) => Number(y.gov === 'muscat') - Number(x.gov === 'muscat'));
  if (f.sort === 'recent') res = res.slice().reverse();
  // Verified companies first; the rest keep their relevance order.
  if (f.sort === 'verified') res = res.slice().sort((x, y) => Number(y.verified) - Number(x.verified));
  return res;
}

/** Projects added within this many days count as new and move toward the top of the category gallery. */
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
 * The category gallery («المعرض» on a category page): photos and videos from the projects that
 * companies filed under this category, for the companies the customer's filters leave on the page,
 * minus anything a company hid from its galleries.
 *
 * Order (the company page gallery does NOT use this; it stays newest project first for everyone):
 *  - shuffled once a day (Oman date), so it stays the same all day and changes the next;
 *  - each customer's order differs a little (20% of the shuffle comes from a per-device seed);
 *  - media from projects added in the last FRESH_DAYS days comes before older media;
 *  - companies take turns (one item from each company per round) so none fills the screen.
 * Paid "pinned" slots can later be inserted into the returned list at fixed positions.
 */
export function categoryGallery(a: App, c: number | undefined): Media[] {
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' });
  const me = customerSeed();
  const score = (key: string) => 0.8 * rand(day + '|' + key) + 0.2 * rand(day + '|' + me + '|' + key);
  const freshSince = Date.now() - FRESH_DAYS * 864e5;
  const cos = new Set(listingCompanies(a, c).map(co => co.id));
  const seen = new Set<string>(); // the same photo used in two projects shows once
  const queues = new Map<string, { m: Media; s: number }[]>();
  for (const al of a.catalog.albums) {
    if ((c != null && al.cat !== c) || !cos.has(al.co)) continue;
    const hide = new Set(al.hide || []);
    const boost = Date.parse(al.added) > freshSince ? 1 : 0;
    const q = queues.get(al.co) ?? [];
    queues.set(al.co, q);
    for (const m of al.imgs.map(src => ({ src, video: false, al })).concat((al.vids || []).map(src => ({ src, video: true, al })))) {
      if (hide.has(m.src) || seen.has(m.src)) continue;
      seen.add(m.src);
      q.push({ m, s: boost + score(m.src) });
    }
  }
  const qs = [...queues.values()].filter(q => q.length).map(q => q.sort((x, y) => y.s - x.s));
  const out: Media[] = [];
  for (let r = 0; qs.some(q => q.length > r); r++) {
    qs.filter(q => q.length > r).map(q => q[r]).sort((x, y) => y.s - x.s).forEach(x => out.push(x.m));
  }
  return out;
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

export const Img = ({ src, style }: { src: string; style?: CSSProperties }) => (
  <img src={src} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
);

export const MetaLine = ({ icon, children, size = 13, style }: { icon: string; children: ReactNode; size?: number; style?: CSSProperties }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-caption)', color: 'var(--text-tertiary)', ...style }}>
    <Icon name={icon} size={size} />{children}
  </span>
);

/** WhatsApp, Call and Follow on company & service pages. Directions live in the company page's top bar. */
export function ContactGrid({ a, co }: { a: App; co: Company }) {
  const { t } = a;
  const items = [
    { icon: 'message-circle', label: t.whatsapp, tone: 'green', go: () => openWhatsApp(a, co) },
    { icon: 'phone', label: t.call, tone: 'sky', go: () => callPhone(a, co.phone, co.id) },
    { icon: a.follows[co.id] ? 'user-check' : 'user-plus', label: a.follows[co.id] ? t.following : t.follow, tone: 'amber', on: !!a.follows[co.id], go: () => a.toggleFollow(co.id) },
  ];
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: 8 }}>
      {items.map(x => (
        <button key={x.label} type="button" className="mj-press" onClick={x.go} aria-pressed={'on' in x ? x.on : undefined}
          style={{ minWidth: 0, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 8px', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', font: 'var(--type-body-sm)', fontWeight: 700, whiteSpace: 'nowrap',
            background: 'on' in x && x.on ? 'var(--brand)' : 'var(--cat-' + x.tone + '-100)', color: 'on' in x && x.on ? '#fff' : 'var(--cat-' + x.tone + '-800)', transition: 'background var(--dur-base), color var(--dur-base)' }}>
          <Icon name={x.icon} size={18} style={{ flex: 'none' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.label}</span>
        </button>
      ))}
    </div>
  );
}

/* Deep links. Each tap is logged for the company's stats (Supabase only); clicks are interactions, not confirmed business. */
const digits = (p: string) => p.replace(/[^\d]/g, '');
export function openWhatsApp(a: App, co: Company) {
  a.showToast(a.t.opening, 'info');
  remote.track(co.id, 'whatsapp');
  window.open('https://wa.me/' + digits(co.phone), '_blank', 'noopener');
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
