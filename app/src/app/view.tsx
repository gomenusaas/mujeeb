import type { CSSProperties, ReactNode } from 'react';
import { AppBar, Icon } from '../ds';
import { logoUrl, photo } from '../data/api';
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
  const svcV = (s: Service) => ({ id: s.id, title: ar ? s.ar : s.en, cat: cname(s.cat), img: photo(s.imgs[0], 400), n: s.imgs.length, open: () => a.go('service', { id: s.id }) });
  return { cat, cname, cshort, gname, covText, num, coName, city, coV, albV, svcV };
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

/** Contact, Directions and Follow on company & service pages. Contact and multi-branch directions open sheets (ReachSheets). */
export function ContactGrid({ a, co }: { a: App; co: Company }) {
  const { t } = a;
  const items = [
    { icon: 'headset', label: t.reach, tone: 'green', go: () => a.setSheet('reach') },
    { icon: 'navigation', label: t.directions, tone: 'sky', go: () => (co.branches.length > 1 ? a.setSheet('directions') : openDirections(a, co, co.branches[0])) },
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

/* Deep links. Clicks are tracked separately from confirmed business (not implemented server-side yet). */
const digits = (p: string) => p.replace(/[^\d]/g, '');
export function openWhatsApp(a: App, co: Company) {
  a.showToast(a.t.opening, 'info');
  window.open('https://wa.me/' + digits(co.phone), '_blank', 'noopener');
}
/**
 * Opens the phone's maps app with directions to a branch. Branches have no coordinates yet, so the
 * destination is a search for "company, branch area, Oman". Apple Maps on iPhone/iPad, Google Maps elsewhere.
 */
export function openDirections(a: App, co: Company, branch?: Branch) {
  const q = encodeURIComponent(co.en + ', ' + (branch ? branch[1] : co.cityEn) + ', Oman');
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  a.showToast(a.t.openingMaps, 'info');
  window.open(ios ? 'https://maps.apple.com/?daddr=' + q + '&dirflg=d' : 'https://www.google.com/maps/dir/?api=1&destination=' + q, '_blank', 'noopener');
}
export function callPhone(a: App, phone: string) {
  a.showToast(a.t.calling + ' ' + phone, 'info');
  window.location.href = 'tel:' + digits(phone).replace(/^/, '+');
}

export const card: CSSProperties = { borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' };
