import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Avatar, Badge, BottomSheet, Button, EmptyState, Icon, IconButton, ListItem, SearchBar, SectionHeader } from '../ds';
import { useApp, type CoView, type Filters, type ListView, type SheetKey } from '../app/store';
import { ContactGrid, HScroll, Img, MetaLine, TopBar, albumMedia, callPhone, card, categoryGallery, companyGallery, helpers, listingCompanies, openDirections, openWhatsApp, stop, type Media } from '../app/view';
import { logoUrl, photo, remote } from '../data/api';
import type { Company } from '../data/types';
import { WEEK_ORDER, dayName, fmtTime, isOpenNow, muscatToday, shifts } from '../app/hours';

const VIEWS: { v: ListView; icon: string; label: 'viewLarge' | 'viewRows' }[] = [
  { v: 'large', icon: 'gallery-vertical', label: 'viewLarge' }, { v: 'rows', icon: 'layout-list', label: 'viewRows' },
];

/** Height of the photo at the top of the company page and its service pages (kept the same on both). */
const HERO_H = 250;

type TabLabel = 'services' | 'gallery' | 'companiesTab';
const CO_TABS: { v: CoView; label: TabLabel }[] = [{ v: 'list', label: 'services' }, { v: 'gallery', label: 'gallery' }];
type CatView = 'companies' | 'gallery';
const CAT_TABS: { v: CatView; label: TabLabel }[] = [{ v: 'companies', label: 'companiesTab' }, { v: 'gallery', label: 'gallery' }];

/**
 * Two tabs with an underline: «الخدمات» / «المعرض» on a company page, «الشركات» / «المعرض» on a
 * category page. Only the purple underline moves, gliding slowly to the tab you pick.
 */
function UnderlineTabs<V extends string>({ tabs, value, onPick }: { tabs: { v: V; label: TabLabel }[]; value: V; onPick: (v: V) => void }) {
  const a = useApp();
  const k = tabs.findIndex(x => x.v === value);
  const ease = '480ms cubic-bezier(0.65, 0, 0.35, 1)';
  return (
    <div role="tablist" aria-label={a.t.viewAs} style={{ position: 'relative', display: 'flex', boxShadow: 'inset 0 -1px 0 var(--border-subtle)' }}>
      {tabs.map(x => {
        const on = value === x.v;
        return (
          <button key={x.v} type="button" role="tab" aria-selected={on} onClick={() => onPick(x.v)}
            style={{ flex: 1, height: 46, padding: 0, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', font: 'var(--type-title)', fontWeight: on ? 800 : 600,
              color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', transition: 'color ' + ease }}>
            {a.t[x.label]}
          </button>
        );
      })}
      <span aria-hidden="true" style={{ position: 'absolute', bottom: 0, insetInlineStart: k * 50 + '%', width: '50%', height: 3, display: 'flex', justifyContent: 'center', transition: 'inset-inline-start ' + ease, pointerEvents: 'none' }}>
        <span style={{ width: '56%', height: '100%', borderRadius: 3, background: 'var(--brand)' }} />
      </span>
    </div>
  );
}

/** The nearest scrolling ancestor (the screen's scroll area). */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

/**
 * Keeps the page still when a section switches between two views: the section's top stays put on
 * screen, and the section keeps at least enough height below it that a shorter view can't pull the
 * page up. Call `prepare()` just before switching; put `ref` and `minHeight` on the section.
 */
function useSteadySwitch(id: string, view: string) {
  const ref = useRef<HTMLDivElement>(null);
  const anchor = useRef<number | null>(null);
  const [hold, setHold] = useState<{ id: string; h: number } | null>(null);
  const prepare = () => {
    const el = ref.current, sc = scrollParent(el);
    if (!el || !sc) return;
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    anchor.current = top;
    setHold({ id, h: Math.max(0, sc.clientHeight - top) });
  };
  useLayoutEffect(() => {
    const el = ref.current, sc = scrollParent(el), want = anchor.current;
    if (!el || !sc || want == null) return;
    anchor.current = null;
    sc.scrollTop += el.getBoundingClientRect().top - sc.getBoundingClientRect().top - want;
  }, [view]);
  return { ref, minHeight: hold?.id === id ? hold.h : undefined, prepare };
}

/** A photo (cropped to `ratio`, or at its natural height) or a silent looping video with a play badge. */
function MediaTile({ m, w, ratio, onOpen, style }: { m: Media; w: number; ratio?: string; onOpen: () => void; style?: CSSProperties }) {
  return (
    <button type="button" onClick={onOpen} aria-label={m.video ? 'video' : 'photo'}
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, border: 'none', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'zoom-in', ...style }}>
      {m.video
        ? <video src={m.src + '#t=0.1'} muted loop playsInline autoPlay preload="metadata" style={{ width: '100%', display: 'block', minHeight: 120, objectFit: 'cover' }} />
        : <img src={photo(m.src, w)} alt="" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', minHeight: 80, ...(ratio ? { aspectRatio: ratio, objectFit: 'cover' } : {}) }} />}
      {m.video && (
        <span style={{ position: 'absolute', top: 8, insetInlineEnd: 8, width: 26, height: 26, borderRadius: '50%', background: 'oklch(0 0 0 / 0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="play" size={13} />
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
function Masonry({ items, onOpen }: { items: Media[]; onOpen: (k: number) => void }) {
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
  const cols = [0, 1].map(c => shown.map((m, k) => ({ m, k })).filter(x => x.k % 2 === c));
  return (
    <>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {cols.map((col, c) => (
          <div key={c} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {col.map(({ m, k }, j) => <MediaTile key={k} m={m} w={500} ratio={MASONRY_RATIOS[(j * 2 + c * 3) % MASONRY_RATIOS.length]} onOpen={() => onOpen(k)} />)}
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
  const results = res.map(h.coV);
  // «المعرض» tab: shown when any company has media filed under this category (filters may still empty it).
  const hasMedia = catalog.albums.some(al => (c == null || al.cat === c) && al.imgs.length + (al.vids?.length ?? 0) > (al.hide?.length ?? 0));
  const view: CatView = hasMedia && top.tab === 'gallery' ? 'gallery' : 'companies';
  const steady = useSteadySwitch('cat' + c, view);
  // The tab lives in the route, so the back button and links return to it.
  const pickView = (v: CatView) => {
    if (v === view) return;
    steady.prepare();
    a.replace('listing', { cat: c, ...(v === 'gallery' ? { tab: 'gallery' as const } : {}) });
  };
  const gallery = view === 'gallery' ? categoryGallery(a, c) : [];

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
      <div ref={steady.ref} style={{ display: 'flex', flexDirection: 'column', minHeight: steady.minHeight }}>
      {hasMedia && <div style={{ padding: '4px 20px 0' }}><UnderlineTabs tabs={CAT_TABS} value={view} onPick={pickView} /></div>}
      {view === 'gallery' ? (
        <div style={{ padding: '14px 20px 0' }}>
          {gallery.length
            ? <Masonry key={[c, f.q, f.gov, f.verified, f.sort].join('|')} items={gallery} onOpen={k => a.go('photo', { src: 'category', cat: c, i: k })} />
            : <>
                <EmptyState icon="images" color={color} title={t.noResults} body={t.noResultsBody} />
                <div style={{ display: 'flex', justifyContent: 'center' }}><Button variant="secondary" onClick={() => set({ gov: 'all', verified: false, q: '' })}>{t.clear}</Button></div>
              </>}
        </div>
      ) : (<>
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
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
                <span style={{ position: 'absolute', top: 10, insetInlineEnd: 10 }} onClick={stop}><IconButton icon="heart" variant="glass" size={38} active={co.fav} onClick={co.onFav} label={t.favorites} /></span>
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
      </>)}
      </div>
    </div>
  );
}

export function CompanyPage() {
  const a = useApp();
  const { t, catalog, page: top } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.id!)!;
  const cv = h.coV(co);
  const services = catalog.services.filter(s => s.co === co.id).map(h.svcV);
  const gallery = companyGallery(a, co.id);
  // Every visit opens on the services list; the gallery tab is kept only for this visit (in the route,
  // so Back from a photo or project returns to it). Without gallery items there's nothing to switch to.
  const view: CoView = gallery.length && top.tab === 'gallery' ? 'gallery' : 'list';
  useEffect(() => { remote.track(co.id, 'profile_view'); }, [co.id]);

  // Switching list ⇄ gallery keeps the page where it is.
  const steady = useSteadySwitch(co.id, view);
  const pickView = (v: CoView) => {
    if (v === view) return;
    steady.prepare();
    a.replace('company', { id: co.id, ...(v === 'gallery' ? { tab: 'gallery' as const } : {}) });
  };
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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -36 }}>
          <Avatar name={cv.name} src={cv.logo} size={84} verified={cv.verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-app)' }} />
          <FavButton id={co.id} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: 'var(--type-h1)' }}>{cv.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}><Icon name="map-pin" size={14} />{cv.city} · {cv.covers}</span>
          <ClampedAbout text={a.ar ? co.dar : co.den} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {co.cats.map(i => <CatTag key={i} color={catalog.cats[i].color}>{h.cname(i)}</CatTag>)}
        </div>
        <ContactGrid a={a} co={co} />
        <div ref={steady.ref} style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: steady.minHeight }}>
          {/* With project photos there are two tabs; otherwise just the services heading. */}
          {gallery.length > 0 ? <UnderlineTabs tabs={CO_TABS} value={view} onPick={pickView} /> : <SectionHeader title={t.services} />}
          {view === 'gallery'
            ? <Masonry items={gallery} onOpen={k => a.go('photo', { src: 'gallery', id: co.id, i: k })} />
            : services.map(s => <ServiceRow key={s.id} {...s} thumb={96} />)}
        </div>
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

/** Round favorite button beside the company logo (company and service pages): grey outline heart, filled red once saved. */
function FavButton({ id }: { id: string }) {
  const a = useApp();
  const on = !!a.fav[id];
  return (
    <button type="button" className="mj-press" aria-label={a.t.favorites} title={a.t.favorites} aria-pressed={on} onClick={() => a.toggleFav(id)}
      style={{ flex: 'none', alignSelf: 'center', width: 46, height: 46, borderRadius: '50%', border: 'none', background: 'var(--surface-card)', color: on ? 'var(--danger)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px var(--bg-app), var(--shadow-sm)', transition: 'color var(--dur-base)' }}>
      <Icon name="heart" size={26} filled={on} />
    </button>
  );
}

export const CatTag = ({ color, children, h = 28, pad = 12 }: { color: string; children: React.ReactNode; h?: number; pad?: number }) => (
  <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: h, padding: '0 ' + pad + 'px', borderRadius: 'var(--radius-pill)', background: 'var(--cat-' + color + '-100)', color: 'var(--cat-' + color + '-800)', font: 'var(--type-caption)' }}>{children}</span>
);

function ServiceRow({ title, cat, img, open, thumb }: { title: string; cat?: string; img: string; open: () => void; thumb: number }) {
  return (
    <div onClick={open} style={{ display: 'flex', gap: 14, padding: 12, ...card, cursor: 'pointer', alignItems: 'center' }}>
      <span style={{ flex: 'none', width: thumb, aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)' }}><Img src={img} /></span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: 'var(--type-title)' }}>{title}</span>
        {cat && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{cat}</span>}
      </span>
      <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
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
  const albums = catalog.albums.filter(al => al.co === co.id).map(h.albV);
  const more = catalog.services.filter(x => x.co === co.id && x.id !== s.id).map(h.svcV);
  useEffect(() => { remote.track(co.id, 'service_view', s.id); }, [co.id, s.id]);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* The service's cover: a still picture (no swiping or tapping); its photos are in a row further down. */}
      <div style={{ position: 'relative', height: HERO_H, background: 'var(--cat-' + color + '-100)' }}>
        <img src={photo(s.cover || s.imgs[0] || co.img, 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        {/* Company logo overlapping the photo, as on the company page. */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -36, marginBottom: -6 }}>
          <button type="button" onClick={() => a.go('company', { id: co.id })} aria-label={h.coName(co)}
            style={{ padding: 0, border: 'none', background: 'none', borderRadius: '50%', cursor: 'pointer' }}>
            <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={84} verified={co.verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-app)' }} />
          </button>
          <FavButton id={co.id} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CatTag color={color} h={26} pad={10}>{h.cname(s.cat)}</CatTag>
          <span style={{ font: 'var(--type-h1)' }}>{ar ? s.ar : s.en}</span>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{ar ? s.dar : s.den}</span>
        </div>
        <ContactGrid a={a} co={co} />
        {s.imgs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '0 -20px' }}>
            <div style={{ padding: '0 20px' }}><SectionHeader title={t.svcPhotos} action={null} /></div>
            <HScroll>
              {s.imgs.map((im, k) => (
                <button key={k} type="button" aria-label={t.svcPhotos + ' ' + h.num(k + 1)} onClick={() => a.go('photo', { src: 'service', id: s.id, i: k })}
                  style={{ flex: 'none', width: 132, aspectRatio: '4/3', padding: 0, border: 'none', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--cat-' + color + '-100)', scrollSnapAlign: 'start', cursor: 'zoom-in' }}>
                  <Img src={photo(im, 300)} />
                </button>
              ))}
            </HScroll>
          </div>
        )}
        {albums.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '0 -20px' }}>
            <div style={{ padding: '0 20px' }}><SectionHeader title={t.related} action={null} /></div>
            <HScroll>
              {albums.map(al => (
                <div key={al.id} onClick={al.open} style={{ flex: 'none', width: 200, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                  <div style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: al.c100 }}><Img src={al.img} /></div>
                  <span style={{ font: 'var(--type-body-sm)', fontWeight: 700 }}>{al.title}</span>
                </div>
              ))}
            </HScroll>
          </div>
        )}
        {more.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ font: 'var(--type-h3)' }}>{t.moreServices}</span>
            {more.map(m => <ServiceRow key={m.id} title={m.title} img={m.img} open={m.open} thumb={80} />)}
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
  const media = albumMedia(al);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={ar ? al.ar : al.en} subtitle={al.n + ' ' + t.photos + (al.vids?.length ? ' · ' + h.num(al.vids.length) + ' ' + t.video : '')} onBack={a.back} />
      <div style={{ padding: '8px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        <div onClick={() => a.go('company', { id: co.id })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={40} verified={co.verified} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{h.coName(co)}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{(ar ? al.pAr : al.pEn)} · {h.cname(al.cat)}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={() => a.go('company', { id: co.id })}>{t.viewProfile}</Button>
        </div>
        <div style={{ columns: 2, columnGap: 10 }}>
          {media.map((m, k) => m.video
            ? <MediaTile key={k} m={m} w={600} onOpen={() => a.go('photo', { src: 'album', id: al.id, i: k })} style={{ breakInside: 'avoid', marginBottom: 10 }} />
            : <div key={k} onClick={() => a.go('photo', { src: 'album', id: al.id, i: k })} style={{ breakInside: 'avoid', marginBottom: 10, aspectRatio: ALB_RATIOS[k % ALB_RATIOS.length], borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'zoom-in' }}><Img src={photo(m.src, 600)} /></div>)}
        </div>
      </div>
    </div>
  );
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
