import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Avatar, Badge, BottomSheet, Button, EmptyState, Icon, IconButton, ListItem, SearchBar, SectionHeader } from '../ds';
import { useApp, type Filters, type ListView, type SheetKey } from '../app/store';
import { ContactGrid, Img, MetaLine, TopBar, albumMedia, callPhone, card, companyGallery, helpers, listingCompanies, openDirections, openWhatsApp, serviceGallery, serviceImage, type Media } from '../app/view';
import { logoUrl, photo, remote } from '../data/api';
import type { Album, Company } from '../data/types';
import { WEEK_ORDER, dayName, fmtTime, isOpenNow, muscatToday, shifts } from '../app/hours';

const VIEWS: { v: ListView; icon: string; label: 'viewLarge' | 'viewRows' }[] = [
  { v: 'large', icon: 'gallery-vertical', label: 'viewLarge' }, { v: 'rows', icon: 'layout-list', label: 'viewRows' },
];

/** Height of the photo at the top of the company page and its service pages (kept the same on both). */
const HERO_H = 250;

/** A photo (cropped to `ratio`, or at its natural height) or a silent looping video with a play badge. */
function MediaTile({ m, w, ratio, onOpen, style, small }: { m: Media; w: number; ratio?: string; onOpen: () => void; style?: CSSProperties; small?: boolean }) {
  return (
    <button type="button" onClick={onOpen} aria-label={m.video ? 'video' : 'photo'}
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, border: 'none', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'zoom-in', ...style }}>
      {m.video
        ? <video src={m.src + '#t=0.1'} muted loop playsInline autoPlay preload="metadata" style={{ width: '100%', display: 'block', minHeight: 120, objectFit: 'cover' }} />
        : <img src={photo(m.src, w)} alt="" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', minHeight: 80, ...(ratio ? { aspectRatio: ratio, objectFit: 'cover' } : {}) }} />}
      {m.video && (
        <span style={{ position: 'absolute', top: small ? 5 : 8, insetInlineEnd: small ? 5 : 8, width: small ? 20 : 26, height: small ? 20 : 26, borderRadius: '50%', background: 'oklch(0 0 0 / 0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="play" size={small ? 10 : 13} />
        </span>
      )}
    </button>
  );
}

/** Photo shapes down each gallery column, so the two columns stagger (Pinterest-style). Videos keep their own shape. */
const MASONRY_RATIOS = ['3/4', '1/1', '4/5', '4/3', '3/4', '1/1', '4/5'];

/** How many gallery items load at a time; more load as the customer nears the end. */
const GALLERY_BATCH = 30;

/**
 * Two staggered columns of photos and videos, loaded GALLERY_BATCH at a time.
 * Tiles show only the work; the viewer names the company. Remount (change `key`) to start over.
 */
export function Masonry({ items, onOpen, cols = 2 }: { items: Media[]; onOpen: (k: number) => void; cols?: number }) {
  const [limit, setLimit] = useState(GALLERY_BATCH);
  const end = useRef<HTMLDivElement>(null);
  const more = items.length > limit;
  useEffect(() => {
    const el = end.current;
    if (!el || !more) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) setLimit(n => n + GALLERY_BATCH); }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [more, limit]);
  const shown = items.slice(0, limit);
  // Three columns (company page) are tighter: smaller gaps, corners and play badges.
  const small = cols > 2, gap = small ? 6 : 8;
  const columns = Array.from({ length: cols }, (_, c) => shown.map((m, k) => ({ m, k })).filter(x => x.k % cols === c));
  return (
    <>
      <div style={{ display: 'flex', gap, alignItems: 'flex-start' }}>
        {columns.map((col, c) => (
          <div key={c} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap }}>
            {col.map(({ m, k }, j) => <MediaTile key={k} m={m} w={small ? 360 : 500} small={small} style={small ? { borderRadius: 12 } : undefined}
              ratio={MASONRY_RATIOS[(j * 2 + c * 3) % MASONRY_RATIOS.length]} onOpen={() => onOpen(k)} />)}
          </div>
        ))}
      </div>
      {more && <div ref={end} aria-hidden="true" style={{ height: 1 }} />}
    </>
  );
}

/** Two-icon switch for the company list layout (large cards or compact rows); sits beside the sort control and matches its height. */
function ViewSwitch() {
  const a = useApp();
  return (
    <div role="radiogroup" aria-label={a.t.viewAs} style={{ flex: 'none', display: 'flex', gap: 4, padding: 4, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)' }}>
      {VIEWS.map(x => {
        const on = a.listView === x.v;
        return (
          <button key={x.v} type="button" role="radio" aria-checked={on} aria-label={a.t[x.label]} title={a.t[x.label]} onClick={() => a.setListView(x.v)}
            style={{ width: 38, height: 38, border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--brand)' : 'transparent', color: on ? '#fff' : 'var(--text-secondary)', transition: 'all var(--dur-base) var(--ease-out)' }}>
            <Icon name={x.icon} size={18} />
          </button>
        );
      })}
    </div>
  );
}

type Sort = Filters['sort'];
const SORTS: { v: Sort; icon: string }[] = [{ v: 'rel', icon: 'star' }, { v: 'near', icon: 'map-pin' }, { v: 'recent', icon: 'clock' }, { v: 'verified', icon: 'badge-check' }];
const sortLabel = (t: ReturnType<typeof useApp>['t'], v: Sort) => (v === 'near' ? t.nearest : v === 'recent' ? t.recent : v === 'verified' ? t.verifiedSort : t.relevance);

/** Bottom sheet listing the sort options for the company list (opened from the sort button). */
export function SortSheet() {
  const a = useApp();
  const { t, f, setF, sheet, setSheet } = a;
  return (
    <BottomSheet open={sheet === 'sort'} onClose={() => setSheet(null)} title={t.sortBy}>
      {SORTS.map(s => {
        const on = f.sort === s.v;
        return (
          <ListItem key={s.v} icon={s.icon} color={on ? 'violet' : undefined} title={sortLabel(t, s.v)} chevron={false}
            trailing={on ? <Icon name="check" size={20} color="var(--brand)" /> : null}
            onClick={() => { setF(x => ({ ...x, sort: s.v })); setSheet(null); }} />
        );
      })}
    </BottomSheet>
  );
}

/** Company name with a small verified tick, for the compact list layouts. */
const CoName = ({ name, verified, size }: { name: string; verified: boolean; size: number }) => (
  <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
    <span style={{ font: '700 ' + size + 'px/' + (size + 4) + 'px var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    {verified && <Icon name="badge-check" size={size} color="var(--brand)" style={{ flex: 'none' }} />}
  </span>
);

export function Listing() {
  const a = useApp();
  const { t, catalog, f, setF, page: top } = a;
  const h = helpers(a);
  const c = top.cat;
  const set = (p: Partial<Filters>) => setF(x => ({ ...x, ...p }));
  const res = listingCompanies(a, c);
  const color = c == null ? 'violet' : catalog.cats[c].color;
  // Opening a company from here lands on this category's activity.
  const results = res.map(co => ({ ...h.coV(co), open: () => a.go('company', { id: co.id, ...(c != null ? { act: c } : {}) }) }));

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: 'var(--top-inset) 0 4px', background: 'var(--cat-' + color + '-600)', borderRadius: '0 0 28px 28px', color: '#fff' }}>
        <span style={{ position: 'absolute', insetInlineEnd: -50, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(1 0 0 / 0.14)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={() => a.sharePage(top, c == null ? t.allServices : h.cname(c))} />
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '6px 20px 18px' }}>
          <span style={{ flex: 'none', width: 52, height: 52, borderRadius: 'var(--radius-tile)', background: 'oklch(1 0 0 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={c == null ? 'layout-grid' : catalog.cats[c].icon} size={26} color="#fff" />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ font: 'var(--type-h1)' }}>{c == null ? t.allServices : h.cname(c)}</span>
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, opacity: 0.9 }}>{res.length} {t.results}</span>
          </div>
        </div>
        <div style={{ position: 'relative', padding: '0 20px 20px' }}>
          <SearchBar placeholder={t.search} value={f.q} onChange={e => set({ q: e.target.value })} onFilter={null} elevated />
        </div>
      </div>
      <div style={{ padding: '8px 20px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
        <ViewSwitch />
        <button type="button" aria-haspopup="dialog" aria-label={t.sortBy + ': ' + sortLabel(t, f.sort)} onClick={() => a.setSheet('sort')}
          style={{ marginInlineStart: 'auto', height: 46, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', border: 'none', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', color: 'var(--text-primary)', font: 'var(--type-body-sm)', fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
          <Icon name="arrow-down-up" size={16} />{sortLabel(t, f.sort)}<Icon name="chevron-down" size={16} color="var(--text-secondary)" />
        </button>
      </div>
      {!res.length && (
        <>
          <EmptyState icon="search-x" color={color} title={t.noResults} body={t.noResultsBody} />
          <div style={{ display: 'flex', justifyContent: 'center' }}><Button variant="secondary" onClick={() => set({ gov: 'all', verified: false, q: '' })}>{t.clear}</Button></div>
        </>
      )}
      {a.listView === 'large' && (
        <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {results.map(co => (
            <div key={co.id} onClick={co.open} style={{ ...card, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', maxHeight: 200, width: '100%', background: co.c100 }}>
                <Img src={co.cover} />
              </div>
              <div style={{ padding: '14px 16px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar name={co.name} src={co.logo} size={48} verified={co.verified} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ font: 'var(--type-title)' }}>{co.name}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{co.cats}</span>
                  <MetaLine icon="map-pin">{co.city}</MetaLine>
                  <MetaLine icon="route">{co.covers}</MetaLine>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {a.listView === 'rows' && (
        <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.map(co => (
            <div key={co.id} onClick={co.open} style={{ ...card, overflow: 'hidden', cursor: 'pointer', display: 'flex', minHeight: 96 }}>
              <div style={{ position: 'relative', flex: 'none', width: '36%', background: co.c100 }}><Img src={co.cover} style={{ position: 'absolute', inset: 0 }} /></div>
              <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={co.name} src={co.logo} size={24} />
                  <CoName name={co.name} verified={co.verified} size={14} />
                </span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{co.cat}</span>
                <MetaLine icon="map-pin" size={12}>{co.city}</MetaLine>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The activity on screen for a company with several: the one asked for (e.g. the category page the
 * customer came from), otherwise its main (first) category. There's no "all" choice. Null when the
 * company has a single activity (nothing to narrow).
 */
const activeAct = (co: Company, r: { act?: number }) => (co.cats.length < 2 ? null : r.act != null && co.cats.includes(r.act) ? r.act : co.cats[0]);

/** "4 services" with Arabic number agreement (1 خدمة واحدة, 2 خدمتان, 3–10 خدمات, 11+ خدمة). */
type Words = { ar: [string, string, string, string]; en: [string, string] };
const SVC_W: Words = { ar: ['خدمة واحدة', 'خدمتان', 'خدمات', 'خدمة'], en: ['service', 'services'] };
const PRJ_W: Words = { ar: ['مشروع واحد', 'مشروعان', 'مشاريع', 'مشروعًا'], en: ['project', 'projects'] };
function countOf(a: ReturnType<typeof useApp>, n: number, w: Words) {
  if (!a.ar) return n + ' ' + (n === 1 ? w.en[0] : w.en[1]);
  return n === 1 ? w.ar[0] : n === 2 ? w.ar[1] : helpers(a).num(n) + ' ' + (n <= 10 ? w.ar[2] : w.ar[3]);
}

const EmptyLine = ({ children }: { children: React.ReactNode }) => (
  <span style={{ padding: '20px 0', textAlign: 'center', font: 'var(--type-body-sm)', color: 'var(--text-tertiary)' }}>{children}</span>
);

/**
 * «النشاط» under the company description. With several activities it's a button (like the sort
 * button, with an arrow) that opens the activity sheet; with one it's a plain line.
 */
function ActivityPicker({ co, act }: { co: Company; act: number | null }) {
  const a = useApp();
  const { t } = a;
  const h = helpers(a);
  const many = co.cats.length > 1;
  const cur = act ?? co.cats[0];
  const box: CSSProperties = { minWidth: 0, minHeight: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', color: 'var(--text-primary)', font: 'var(--type-body)', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans)', textAlign: 'start' };
  const inner = (
    <>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.cname(cur)}</span>
      {/* A round tinted button so it reads as tappable at a glance (solid purple is kept for "Followed"). */}
      {many && (
        <span aria-hidden="true" style={{ flex: 'none', width: 26, height: 26, borderRadius: '50%', background: 'var(--brand-tint-strong)', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      )}
    </>
  );
  // A divider with the selector in the middle: a hairline from each screen edge to the centred box.
  // It separates the company info from its work and filters the services and gallery below.
  const line = <span aria-hidden="true" style={{ flex: 1, minWidth: 16, height: 1, background: 'var(--border-default)' }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px -20px' }}>
      {line}
      {many
        ? <button type="button" aria-haspopup="dialog" aria-label={t.activity + ': ' + h.cname(cur)} onClick={() => a.setSheet('activity')} style={{ ...box, flex: '0 1 auto', cursor: 'pointer', paddingInlineEnd: 9 }}>{inner}</button>
        : <div role="note" aria-label={t.activity + ': ' + h.cname(cur)} style={{ ...box, flex: '0 1 auto' }}>{inner}</div>}
      {line}
    </div>
  );
}

/**
 * Bottom sheet of a company's activities, each with its count of services and projects; one is always
 * chosen. The chosen one is listed first. The order is fixed when the sheet opens, so rows don't jump
 * while it closes after a pick; the new choice moves to the top the next time it opens.
 */
export function ActivitySheet() {
  const a = useApp();
  const { t, catalog, page, sheet, setSheet } = a;
  const h = helpers(a);
  const co = page.id ? a.idx.co.get(page.id) : undefined;
  const cur = co ? activeAct(co, page) : null;
  const open = sheet === 'activity';
  const key = (co?.id ?? '') + '|' + cur;
  const [order, setOrder] = useState<{ key: string; cats: number[] } | null>(null);
  if (open && co && order?.key !== key) setOrder({ key, cats: [...co.cats].sort((x, y) => Number(y === cur) - Number(x === cur)) });
  if (!co || co.cats.length < 2) return null;
  const cats = order && order.key.startsWith(co.id + '|') ? order.cats : co.cats;
  const counts = (c: number) => {
    const s = catalog.services.filter(x => x.co === co.id && x.cat === c).length;
    const p = catalog.albums.filter(x => x.co === co.id && x.cat === c).length;
    return [s ? countOf(a, s, SVC_W) : '', p ? countOf(a, p, PRJ_W) : ''].filter(Boolean).join(' · ') || t.nothingYet;
  };
  const pick = (v: number) => {
    setSheet(null);
    if (v !== cur) a.replace('company', { id: co.id, act: v });
  };
  const check = (on: boolean) => (on ? <Icon name="check" size={20} color="var(--brand)" /> : null);
  return (
    <BottomSheet open={open} onClose={() => setSheet(null)} title={t.activity}>
      {cats.map(c => (
        <ListItem key={c} icon={catalog.cats[c].icon} color={catalog.cats[c].color} title={h.cname(c)} subtitle={counts(c)} chevron={false} trailing={check(cur === c)} onClick={() => pick(c)} />
      ))}
    </BottomSheet>
  );
}

/**
 * A company's services as cards in a sideways strip, like the categories on the home page: two rows
 * that scroll together (one row for 1–3 services), the next column peeking in.
 */
function ServiceStrip({ items, all }: { items: ReturnType<ReturnType<typeof helpers>['svcV']>[]; all?: { label: string; open: () => void } }) {
  const a = useApp();
  const rows = items.length > 3 ? 2 : 1;
  // Under each service: how many completed projects are linked to it.
  const projects = (id: string) => { const n = a.catalog.albums.filter(al => al.svc === id).length; return n ? countOf(a, n, PRJ_W) : a.t.nothingYet; };
  return (
    <div className="mj-s" style={{ display: 'grid', gridTemplateRows: 'repeat(' + rows + ', auto)', gridAutoFlow: 'column', gridAutoColumns: 'calc(100% - 64px)', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, padding: '4px 20px 12px', margin: '-4px 0 -12px', scrollbarWidth: 'none' }}>
      {items.map(s => (
        <button key={s.id} type="button" className="mj-press-sm" onClick={s.open}
          style={{ ...card, overflow: 'hidden', height: 92, border: 'none', padding: 0, cursor: 'pointer', scrollSnapAlign: 'start', display: 'flex', alignItems: 'stretch', fontFamily: 'var(--font-sans)', textAlign: 'start' }}>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '0 16px' }}>
            <span style={{ font: 'var(--type-title)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{projects(s.id)}</span>
          </span>
          <img src={s.img} alt="" loading="lazy" style={{ flex: 'none', width: '38%', height: '100%', objectFit: 'cover' }} />
        </button>
      ))}
      {/* Last card: all the services as a list («كل الخدمات · ١٢»). */}
      {all && (
        <button type="button" className="mj-press-sm" onClick={all.open}
          style={{ ...card, height: 92, border: 'none', padding: '0 16px', cursor: 'pointer', scrollSnapAlign: 'start', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'var(--font-sans)', font: 'var(--type-title)', color: 'var(--brand)' }}>
          {all.label}<Icon name="chevron-right" size={18} />
        </button>
      )}
    </div>
  );
}

/** «عرض الكل» from the company page: all of its services (in the chosen activity) as a plain list. */
/** A plain service row: small square photo, name, arrow; a hairline above every row but the first. */
function ServiceLine({ title, img, open, first }: { title: string; img: string; open: () => void; first?: boolean }) {
  return (
    <div onClick={open} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: first ? 'none' : '1px solid var(--border-default)', cursor: 'pointer' }}>
      <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)' }}><Img src={img} /></span>
      <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
      <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
    </div>
  );
}

export function ServiceList() {
  const a = useApp();
  const { t, catalog, page } = a;
  const h = helpers(a);
  const co = a.idx.co.get(page.id!)!;
  const act = activeAct(co, page);
  const services = catalog.services.filter(s => s.co === co.id && (act == null || s.cat === act)).map(h.svcV);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      <TopBar title={t.services + ' · ' + h.num(services.length)} subtitle={h.coName(co) + (act != null ? ' · ' + h.cname(act) : '')} onBack={a.back} />
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column' }}>
        {services.map((s, k) => <ServiceLine key={s.id} title={s.title} img={s.img} open={s.open} first={!k} />)}
      </div>
    </div>
  );
}

/**
 * «١٢ متابعًا» under the company name (Follow itself is with the contact buttons). The count from the
 * server leaves out the viewer, so their own follow is added here and the number moves when they tap.
 */
function FollowLine({ co }: { co: Company }) {
  const a = useApp();
  const n = (a.catalog.followers?.[co.id] ?? 0) + (a.follows[co.id] ? 1 : 0);
  return (
    <span style={{ font: 'var(--type-body)', fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>
      {n ? countOf(a, n, { ar: ['متابع واحد', 'متابعان', 'متابعين', 'متابعًا'], en: ['follower', 'followers'] }) : a.t.firstFollower}
    </span>
  );
}

export function CompanyPage() {
  const a = useApp();
  const { t, catalog, page: top } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.id!)!;
  const cv = h.coV(co);
  // «النشاط»: a company in several categories can be narrowed to one (the category the customer came from).
  const act = activeAct(co, top);
  const services = catalog.services.filter(s => s.co === co.id && (act == null || s.cat === act)).map(h.svcV);
  const allMedia = companyGallery(a, co.id);
  const gallery = act == null ? allMedia : companyGallery(a, co.id, act);
  useEffect(() => { remote.track(co.id, 'profile_view'); }, [co.id]);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: HERO_H, background: cv.c100 }}>
        <img src={photo(co.img, 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton icon="share-2" variant="glass" size={40} onClick={() => a.sharePage(top, cv.name, a.ar ? co.dar : co.den)} label={t.share} />
            {/* Directions, like «الاتجاهات»: branch picker when there are several branches. */}
            <IconButton icon="navigation" variant="glass" size={40} label={t.directions}
              onClick={() => (co.branches.length > 1 ? a.setSheet('directions') : openDirections(a, co, co.branches[0]))} />
            <IconButton icon="menu" variant="glass" size={40} onClick={() => a.setSheet('menu')} label={t.menu} />
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        {/* Centred: the logo, the name, then the follower count. */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: -42 }}>
          <Avatar name={cv.name} src={cv.logo} size={84} verified={cv.verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-app)' }} />
          <span style={{ font: 'var(--type-h1)', textAlign: 'center' }}>{cv.name}</span>
          <FollowLine co={co} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Where the company is, then where it works. */}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={14} style={{ flex: 'none' }} />{cv.city}</span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}><Icon name="route" size={14} style={{ flex: 'none', marginTop: 2 }} /><span>{t.workArea}: {h.covText(co)}</span></span>
          </span>
          <ClampedAbout text={a.ar ? co.dar : co.den} />
        </div>
        <ContactGrid a={a} co={co} />
        <ActivityPicker co={co} act={act} />
        {/* Services as a sideways strip (two rows from 4 services), then the gallery below; no titles. */}
        <section aria-label={t.services} style={{ display: 'flex', flexDirection: 'column', margin: '0 -20px' }}>
          {services.length
            ? <ServiceStrip items={services} all={services.length > 3 ? { label: t.allServices + ' · ' + h.num(services.length), open: () => a.go('svcList', { id: co.id, ...(act != null ? { act } : {}) }) } : undefined} />
            : <div style={{ padding: '0 20px' }}><EmptyLine>{t.actNoSvc}</EmptyLine></div>}
        </section>
        {allMedia.length > 0 && (
          <section aria-label={t.gallery} style={{ display: 'flex', flexDirection: 'column', marginTop: 6 }}>
            {/* The gallery reaches closer to the screen edges (6px, like Explore) than the rest of the page. */}
            {gallery.length
              ? <div style={{ margin: '0 -14px' }}><Masonry key={act ?? 'all'} cols={3} items={gallery} onOpen={k => a.go('photo', { src: 'gallery', id: co.id, i: k, ...(act != null ? { act } : {}) })} /></div>
              : <EmptyLine>{t.actNoMedia}</EmptyLine>}
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Company description cut to two lines, ending in "… Read more" that opens the About sheet
 * (which also has the founding year and working hours, so the link shows even for short text).
 */
function ClampedAbout({ text }: { text: string }) {
  const a = useApp();
  const ref = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setCut(el.scrollHeight > el.clientHeight + 1);
  }, [text]);
  const more = (
    <button type="button" onClick={() => a.setSheet('about')}
      style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', fontWeight: 700, color: 'var(--brand)' }}>
      {a.t.readMore}
    </button>
  );
  return (
    <span style={{ position: 'relative', marginTop: 4, font: 'var(--type-body)', color: 'var(--text-secondary)' }}>
      <span ref={ref} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textWrap: 'pretty' }}>
        {text}{!cut && <> {more}</>}
      </span>
      {cut && (
        <span style={{ position: 'absolute', insetInlineEnd: 0, bottom: 0, paddingInlineStart: 28, background: 'linear-gradient(' + (a.ar ? 'to left' : 'to right') + ', transparent, var(--bg-app) 28px)' }}>
          … {more}
        </span>
      )}
    </span>
  );
}

/** The company's week (Saturday first) with today highlighted and an open-now status; platform hours as a fallback. */
function HoursSheet({ co }: { co: Company }) {
  const a = useApp();
  const { t, ar, catalog } = a;
  if (!co.hrs) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 'var(--radius-card)', background: 'var(--surface-sunken)' }}>
        {catalog.hours.map((hr, k) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-body)', color: 'var(--text-secondary)' }}>
            <span>{ar ? hr[0] : hr[1]}</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }} dir="ltr">{hr[2] || t.closed}</span>
          </div>
        ))}
      </div>
    );
  }
  const week = co.hrs;
  const open = isOpenNow(week);
  const today = muscatToday();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 999, background: open ? 'var(--success-tint)' : 'var(--danger-tint)', color: open ? 'var(--success)' : 'var(--danger)', font: 'var(--type-body-sm)', fontWeight: 700 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: 'currentColor' }} />{open ? t.openNow : t.closedNow}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-card)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
        {WEEK_ORDER.map(day => {
          const sh = shifts(week[day]);
          const isToday = day === today;
          return (
            <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '12px 16px', background: isToday ? 'var(--brand-tint)' : undefined, font: 'var(--type-body)', color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isToday ? 700 : 400 }}>
              <span>{dayName(day, ar)}{isToday && <span style={{ marginInlineStart: 8, font: 'var(--type-caption)', color: 'var(--brand)' }}>{t.today}</span>}</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, color: sh.length ? 'var(--text-primary)' : 'var(--danger)', fontWeight: 600 }}>
                {sh.length ? sh.map(([o, c], k) => <span key={k}>{fmtTime(o, ar) + ' – ' + fmtTime(c, ar)}</span>) : t.closed}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const CatTag = ({ color, children, h = 28, pad = 12 }: { color: string; children: React.ReactNode; h?: number; pad?: number }) => (
  <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: h, padding: '0 ' + pad + 'px', borderRadius: 'var(--radius-pill)', background: 'var(--cat-' + color + '-100)', color: 'var(--cat-' + color + '-800)', font: 'var(--type-caption)' }}>{children}</span>
);

/** «عرض الكل» from a service page: all of the service's photos and videos in the two-column gallery. */
export function ServiceGallery() {
  const a = useApp();
  const { t, ar, page } = a;
  const h = helpers(a);
  const s = a.idx.svc.get(page.id!)!;
  const co = a.idx.co.get(s.co)!;
  const items = serviceGallery(a, s.id);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      <TopBar title={(ar ? s.ar : s.en)} subtitle={t.svcPhotos + ' · ' + h.coName(co)} onBack={a.back} />
      <div style={{ padding: '8px 20px 0' }}>
        {items.length
          ? <Masonry items={items} onOpen={k => a.go('photo', { src: 'service', id: s.id, i: k })} />
          : <EmptyLine>{t.actNoMedia}</EmptyLine>}
      </div>
    </div>
  );
}

/**
 * A hairline from screen edge to screen edge with a centred white pill (same look as the company page's
 * activity box). The project page puts its number there.
 */
function PillDivider({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const line = <span aria-hidden="true" style={{ flex: 1, minWidth: 16, height: 1, background: 'var(--border-default)' }} />;
  const pill: CSSProperties = { flex: 'none', minHeight: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', color: 'var(--text-primary)', font: 'var(--type-body)', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans)' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 -20px' }}>
      {line}
      {onClick ? <button type="button" onClick={onClick} style={{ ...pill, cursor: 'pointer' }}>{children}</button> : <span style={pill}>{children}</span>}
      {line}
    </div>
  );
}

/** «مشاريع منجزة» on a service page: a two-column grid or large cards (the choice is kept while the app is open). */
type ProjView = 'grid' | 'large';
let projViewMemo: ProjView = 'grid';
function ProjectsBlock({ albums }: { albums: Album[] }) {
  const a = useApp();
  const { t, ar } = a;
  const h = helpers(a);
  const [view, setView] = useState<ProjView>(projViewMemo);
  const pick = (v: ProjView) => { projViewMemo = v; setView(v); };
  const month = (al: Album) => al.done ? new Date(al.done + 'T12:00:00').toLocaleDateString(ar ? 'ar-OM' : 'en-GB', { month: 'long', year: 'numeric' }) : '';
  const opts: { v: ProjView; icon: string; label: string }[] = [{ v: 'grid', icon: 'layout-grid', label: t.viewGrid }, { v: 'large', icon: 'gallery-vertical', label: t.viewLarge }];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ font: 'var(--type-h3)' }}>{t.related}</span>
        <div role="radiogroup" aria-label={t.viewAs} style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)' }}>
          {opts.map(o => (
            <button key={o.v} type="button" role="radio" aria-checked={view === o.v} aria-label={o.label} title={o.label} onClick={() => pick(o.v)}
              style={{ width: 32, height: 32, border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'grid', placeItems: 'center', background: view === o.v ? 'var(--brand)' : 'transparent', color: view === o.v ? '#fff' : 'var(--text-secondary)', transition: 'all var(--dur-base) var(--ease-out)' }}>
              <Icon name={o.icon} size={16} />
            </button>
          ))}
        </div>
      </div>
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 10px' }}>
          {albums.map(al => {
            const v = h.albV(al);
            return (
              <div key={al.id} onClick={v.open} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                <div style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: v.c100 }}><Img src={v.img} /></div>
                <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</span>
                {v.place && <MetaLine icon="map-pin" size={12}>{v.place}</MetaLine>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {albums.map(al => {
            const v = h.albV(al);
            return (
              <div key={al.id} onClick={v.open} style={{ ...card, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ aspectRatio: '4/3', maxHeight: 200, width: '100%', background: v.c100 }}><Img src={v.img} /></div>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ font: 'var(--type-title)' }}>{v.title}</span>
                  {v.place && <MetaLine icon="map-pin">{v.place}</MetaLine>}
                  {al.done && <MetaLine icon="calendar-check">{t.completedIn} {month(al)}</MetaLine>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ServicePage() {
  const a = useApp();
  const { t, ar, catalog, page: top } = a;
  const h = helpers(a);
  const s = a.idx.svc.get(top.id!)!;
  const co = a.idx.co.get(s.co)!;
  const color = catalog.cats[s.cat].color;
  // «مشاريع منجزة»: the projects linked to this service, newest first.
  const albums = catalog.albums.filter(al => al.svc === s.id).sort((x, y) => (y.added || '').localeCompare(x.added || ''));
  // «خدمات ذات صلة»: the company's other services in this service's category.
  const more = catalog.services.filter(x => x.co === co.id && x.id !== s.id && x.cat === s.cat).map(h.svcV);
  useEffect(() => { remote.track(co.id, 'service_view', s.id); }, [co.id, s.id]);
  // The description shows 3 lines with «اقرأ المزيد» when it's longer.
  const desc = (ar ? s.dar : s.den) || '';
  const [full, setFull] = useState(false);
  useEffect(() => setFull(false), [s.id]);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* The service's cover: a still picture (no swiping or tapping); its photos are in a row further down. */}
      <div style={{ position: 'relative', height: HERO_H, background: 'var(--cat-' + color + '-100)' }}>
        <img src={photo(serviceImage(a, s), 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton icon="share-2" variant="glass" size={40} onClick={() => a.sharePage(top, (ar ? s.ar : s.en) + ' · ' + h.coName(co))} label={t.share} />
            <IconButton icon="navigation" variant="glass" size={40} label={t.directions}
              onClick={() => (co.branches.length > 1 ? a.setSheet('directions') : openDirections(a, co, co.branches[0]))} />
            <IconButton icon="menu" variant="glass" size={40} onClick={() => a.setSheet('menu')} label={t.menu} />
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Who offers it, as on the project page: logo, name and category (the row opens the company). */}
        <div onClick={() => a.go('company', { id: co.id, act: s.cat })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={44} verified={co.verified} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{h.coName(co)}</span>
            <span style={{ marginTop: 4 }}><CatTag color={color} h={24} pad={10}>{h.cname(s.cat)}</CatTag></span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
        </div>
        <ContactGrid a={a} co={co} />
        <div aria-hidden="true" style={{ height: 1, background: 'var(--border-default)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--type-caption)', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: -6 }}>{t.serviceLabel}</span>
          <span style={{ font: 'var(--type-h1)', fontSize: 22 }}>{ar ? s.ar : s.en}</span>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty', ...(full ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>{desc}</span>
          {desc.length > 140 && (
            <button type="button" onClick={() => setFull(m => !m)} style={{ alignSelf: 'flex-start', border: 'none', padding: 0, background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--brand)' }}>{full ? t.showLess : t.readMore}</button>
          )}
        </div>
        {albums.length > 0 && <ProjectsBlock albums={albums} />}
        {/* «خدمات ذات صلة»: a plain list of the first 3 (small photo, name, arrow), «عرض الكل» opens the rest. */}
        {more.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionHeader title={t.relatedServices} action={more.length > 3 ? t.viewAll : null} onAction={() => a.go('svcList', { id: co.id, act: s.cat })} />
            {more.slice(0, 3).map((m, k) => <ServiceLine key={m.id} title={m.title} img={m.img} open={m.open} first={!k} />)}
          </div>
        )}
      </div>
    </div>
  );
}


const ALB_RATIOS = ['4/5', '1/1', '3/4', '1/1', '4/5', '3/4'];
export function AlbumPage() {
  const a = useApp();
  const { t, ar, page: top } = a;
  const h = helpers(a);
  const al = a.idx.alb.get(top.id!)!;
  const co = a.idx.co.get(al.co)!;
  const svc = al.svc ? a.idx.svc.get(al.svc) : undefined;
  const media = albumMedia(al);
  const title = ar ? al.ar : al.en;
  const desc = (ar ? al.dAr : al.dEn) || '';
  const [more, setMore] = useState(false);
  const color = a.catalog.cats[al.cat]?.color ?? 'violet';
  const done = al.done ? new Date(al.done + 'T12:00:00').toLocaleDateString(ar ? 'ar-OM' : 'en-GB', { month: 'long', year: 'numeric' }) : '';
  const photos = media.filter(m => !m.video).length, vids = media.length - photos;
  // The project's number among this company's projects, oldest first (the first project they added is no. 1).
  const projNo = a.catalog.albums.filter(x => x.co === al.co).sort((x, y) => x.added.localeCompare(y.added) || x.id.localeCompare(y.id)).findIndex(x => x.id === al.id) + 1;
  // WhatsApp opens with a message naming this project and linking back to it.
  const link = location.origin + '/album/' + al.id;
  const waText = t.waProject.replace('{p}', title).replace('{url}', link);
  const chip = (icon: string, text: string) => (
    <span key={icon} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
      <Icon name={icon} size={15} />{text}
    </span>
  );
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header: the project's cover, with back and share. */}
      <div style={{ position: 'relative', height: HERO_H, background: 'var(--cat-' + color + '-100)' }}>
        <img src={photo(al.img || al.imgs[0], 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={() => a.sharePage(top, title + ' · ' + h.coName(co), desc || undefined)} />
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Who did it and which of their services, at the top of the sheet (the row opens the company, the tag the service). */}
        <div onClick={() => a.go('company', { id: co.id, act: al.cat })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={44} verified={co.verified} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{h.coName(co)}</span>
            {svc && (
              <button type="button" onClick={e => { e.stopPropagation(); a.go('service', { id: svc.id }); }} style={{ alignSelf: 'flex-start', marginTop: 4, border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}>
                <CatTag color={color} h={24} pad={10}>{ar ? svc.ar : svc.en}</CatTag>
              </button>
            )}
          </span>
          <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
        </div>
        {/* How to reach them about this project, right under who did it. */}
        <ContactGrid a={a} co={co} waText={waText} />
        <PillDivider>{t.projectNo.replace('{n}', h.num(projNo))}</PillDivider>
        {/* What the project is: title, where and when, description, facts. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: 'var(--type-h1)', fontSize: 22 }}>{title}</span>
          <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 12px', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
            {(ar ? al.pAr : al.pEn) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={14} />{ar ? al.pAr : al.pEn}</span>}
            {done && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar-check" size={14} />{t.completedIn} {done}</span>}
          </span>
          {desc && (
            <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty', ...(more ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>{desc}</span>
          )}
          {desc.length > 140 && (
            <button type="button" onClick={() => setMore(m => !m)} style={{ alignSelf: 'flex-start', border: 'none', padding: 0, background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--brand)' }}>{more ? t.showLess : t.readMore}</button>
          )}
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {al.area ? chip('ruler', h.num(al.area) + ' ' + t.areaM2) : null}
            {al.weeks ? chip('hourglass', weeksText(a, al.weeks)) : null}
            {chip('images', countOf(a, photos, { ar: ['صورة واحدة', 'صورتان', 'صور', 'صورة'], en: ['photo', 'photos'] }) + (vids ? ' · ' + countOf(a, vids, { ar: ['فيديو واحد', 'فيديوهان', 'فيديوهات', 'فيديو'], en: ['video', 'videos'] }) : ''))}
          </span>
        </div>
        <div style={{ columns: 2, columnGap: 10, marginTop: 4 }}>
          {media.map((m, k) => m.video
            ? <MediaTile key={k} m={m} w={600} onOpen={() => a.go('photo', { src: 'album', id: al.id, i: k })} style={{ breakInside: 'avoid', marginBottom: 10 }} />
            : <div key={k} onClick={() => a.go('photo', { src: 'album', id: al.id, i: k })} style={{ breakInside: 'avoid', marginBottom: 10, aspectRatio: ALB_RATIOS[k % ALB_RATIOS.length], borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'zoom-in' }}><Img src={photo(m.src, 600)} /></div>)}
        </div>
      </div>
    </div>
  );
}

/** "6 weeks" with Arabic number agreement (أسبوع واحد، أسبوعان، ٣–١٠ أسابيع، ١١+ أسبوعًا). */
function weeksText(a: ReturnType<typeof useApp>, n: number) {
  return countOf(a, n, { ar: ['أسبوع واحد', 'أسبوعان', 'أسابيع', 'أسبوعًا'], en: ['week', 'weeks'] });
}

/* ── Company menu bottom sheet (About, Branches, Address, Coverage, Contact, Website, Social) ── */

const MENU: [Exclude<SheetKey, null | 'menu' | 'sort' | 'directions'>, string, string, 'about' | 'hours' | 'branches' | 'coAddress' | 'svcAreas' | 'contact' | 'website' | 'social'][] = [
  ['about', 'info', 'violet', 'about'], ['hours', 'clock', 'gold', 'hours'], ['branches', 'building-2', 'sky', 'branches'], ['address', 'map-pin', 'teal', 'coAddress'],
  ['coverage', 'route', 'green', 'svcAreas'], ['contact', 'phone', 'amber', 'contact'], ['website', 'globe', 'indigo', 'website'], ['social', 'at-sign', 'pink', 'social'],
];

/** Branch picker behind the directions button when a company has several branches. */
export function ReachSheets({ co }: { co: Company }) {
  const a = useApp();
  const { t, ar, sheet, setSheet } = a;
  const close = (fn: () => void) => () => { setSheet(null); fn(); };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
      <BottomSheet open={sheet === 'directions'} onClose={() => setSheet(null)} title={t.chooseBranch}>
        {sheet === 'directions' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {co.branches.map((b, k) => (
              <ListItem key={k} icon="map-pin" color={b[2] ? 'teal' : 'sky'} title={ar ? b[0] : b[1]} subtitle={b[2] ? t.primary : t.branch}
                trailing={<Icon name="navigation" size={18} color="var(--brand)" />} chevron={false} onClick={close(() => openDirections(a, co, b))} />
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export function CompanySheet({ co }: { co: Company }) {
  const a = useApp();
  const { t, ar, sheet, setSheet } = a;
  const h = helpers(a);
  const slug = co.en.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cur = MENU.find(m => m[0] === sheet);
  const ok = (m: string) => () => a.showToast(m);
  type Row = { icon: string; color: string; title: string; sub?: string; chev: boolean; go: (() => void) | null };
  const rows: Partial<Record<string, Row[]>> = {
    branches: co.branches.map(b => ({ icon: 'building-2', color: 'sky', title: ar ? b[0] : b[1], sub: b[2] ? t.primary : t.branch, chev: false, go: null })),
    address: [{ icon: 'map-pin', color: 'teal', title: h.city(co), sub: t.openMaps, chev: true, go: () => window.open('https://www.google.com/maps/search/' + encodeURIComponent(co.en + ' ' + co.cityEn + ' Oman'), '_blank', 'noopener') }],
    contact: [
      { icon: 'phone', color: 'teal', title: t.call, sub: co.phone, chev: true, go: () => callPhone(a, co.phone, co.id) },
      { icon: 'message-circle', color: 'green', title: t.whatsapp, sub: co.phone, chev: true, go: () => openWhatsApp(a, co) },
      // Placeholder address built from the demo company's name.
      { icon: 'mail', color: 'sky', title: t.email, sub: 'info@' + slug + '.om', chev: true, go: ok(t.email) },
    ],
    website: [{ icon: 'globe', color: 'indigo', title: 'www.' + slug + '.om', sub: t.website, chev: true, go: ok(t.website) }],
    social: ([['instagram', 'pink', 'Instagram'], ['twitter', 'sky', 'X'], ['facebook', 'indigo', 'Facebook'], ['linkedin', 'teal', 'LinkedIn']] as const)
      .map(([icon, color, title]) => ({ icon, color, title, sub: '@' + slug + (icon === 'linkedin' ? '' : '.om'), chev: true, go: ok(title) })),
  };
  const list = sheet ? rows[sheet] : undefined;
  const cov = co.cov.includes('all') ? [h.gname('all')] : co.cov.map(h.gname);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
      <BottomSheet open={sheet === 'menu' || !!cur} onClose={() => setSheet(null)} title={cur ? t[cur[3]] : t.menu}>
        {cur && (
          <button type="button" onClick={() => setSheet('menu')} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '-4px 0 8px', padding: '6px 0', border: 'none', background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)' }}>
            <Icon name="arrow-left" size={16} />{t.menu}
          </button>
        )}
        {sheet === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {MENU.map(([k, icon, color, label]) => <ListItem key={k} icon={icon} color={color} title={t[label]} onClick={() => setSheet(k)} />)}
          </div>
        )}
        {sheet === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{ar ? co.dar : co.den}</span>
            <div style={{ display: 'flex', gap: 6 }}><Badge tone="neutral" size="sm" icon="calendar">{t.since + ' ' + co.since}</Badge></div>
          </div>
        )}
        {sheet === 'hours' && <HoursSheet co={co} />}
        {list && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {list.map((r, k) => <ListItem key={k} icon={r.icon} color={r.color} title={r.title} subtitle={r.sub} chevron={r.chev} onClick={r.go} />)}
          </div>
        )}
        {sheet === 'coverage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.covIntro}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{cov.map(g => <Badge key={g} tone="neutral" icon="route">{g}</Badge>)}</div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
