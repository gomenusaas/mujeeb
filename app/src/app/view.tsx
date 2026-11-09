import type { CSSProperties, ReactNode } from 'react';
import { AppBar, Button, Icon } from '../ds';
import { logoUrl, photo } from '../data/api';
import type { Album, Company, Service } from '../data/types';
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

export const QuoteCta = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <BottomBar><Button size="lg" fullWidth iconLeft="file-text" onClick={onClick}>{label}</Button></BottomBar>
);

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

/** The 3–4 contact buttons on company & service pages. */
export function ContactGrid({ a, co }: { a: App; co: Company }) {
  const { t } = a;
  const items = [
    { icon: 'message-circle', label: t.whatsapp, tone: 'green', go: () => openWhatsApp(a, co) },
    { icon: 'messages-square', label: t.message, tone: 'violet', go: () => a.openChat(co.id) },
    { icon: 'phone', label: t.call, tone: 'sky', go: () => callPhone(a, co.phone) },
    ...(co.book ? [{ icon: 'calendar-check', label: t.bookVisit, tone: 'amber', go: () => a.startBk(co.id) }] : []),
  ];
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: 8 }}>
      {items.map(x => (
        <button key={x.icon} type="button" className="mj-press" onClick={x.go}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xs)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--cat-' + x.tone + '-100)', color: 'var(--cat-' + x.tone + '-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={x.icon} size={20} /></span>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-primary)' }}>{x.label}</span>
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
export function callPhone(a: App, phone: string) {
  a.showToast(a.t.calling + ' ' + phone, 'info');
  window.location.href = 'tel:' + digits(phone).replace(/^/, '+');
}

export const card: CSSProperties = { borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' };
