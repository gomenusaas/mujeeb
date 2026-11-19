import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Avatar, Badge, BottomSheet, Button, Chip, EmptyState, Icon, IconButton, ListItem, SearchBar, SectionHeader } from '../ds';
import { DEFAULT_F, useApp, type Filters, type SheetKey } from '../app/store';
import { ContactGrid, HScroll, Img, MetaLine, preloadPhotos, useNear, albumMedia, callPhone, card, categoryServiceChips, companyGallery, companyPreview, helpers, listingCompanies, openDirections, openWhatsApp, serviceImage, type Media } from '../app/view';
import { logoUrl, photo, remote } from '../data/api';
import { OFFERS_PER_COMPANY } from '../app/links';
import type { Album, Company } from '../data/types';
import { WEEK_ORDER, dayName, fmtTime, isOpenNow, muscatToday, shifts } from '../app/hours';
import { CategoryStoryRow } from './Stories';

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

/**
 * The company page's gallery: square photos and videos, three across with thin gaps (like a business profile).
 * More than `per` become a sideways strip of pages of `per` (3 × 4), the next page peeking in at the edge.
 */
function SquareGrid({ items, onOpen, per = 12 }: { items: Media[]; onOpen: (k: number) => void; per?: number }) {
  const fill: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  const tile = (m: Media, k: number) => (
    <button key={k} type="button" onClick={() => onOpen(k)} aria-label={m.video ? 'video' : 'photo'}
      style={{ position: 'relative', aspectRatio: '1/1', padding: 0, border: 'none', borderRadius: 6, overflow: 'hidden', background: 'var(--neutral-100)', cursor: 'zoom-in' }}>
      {m.video
        ? <video src={m.src + '#t=0.1'} muted loop playsInline autoPlay preload="metadata" style={fill} />
        : <img src={photo(m.src, 360)} alt="" loading="lazy" decoding="async" style={fill} />}
      {m.video && (
        <span style={{ position: 'absolute', top: 5, insetInlineEnd: 5, width: 20, height: 20, borderRadius: '50%', background: 'oklch(0 0 0 / 0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="play" size={10} />
        </span>
      )}
    </button>
  );
  const grid = (list: Media[], from: number, style?: CSSProperties) => (
    <div key={from} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignContent: 'start', gap: 3, ...style }}>
      {list.map((m, k) => tile(m, from + k))}
    </div>
  );
  // Up to one page: a plain grid in line with the page content.
  if (items.length <= per) return grid(items, 0);
  const pages: number[] = [];
  for (let k = 0; k < items.length; k += per) pages.push(k);
  return (
    <div className="mj-s" style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
      {pages.map(from => grid(items.slice(from, from + per), from, { flex: 'none', width: 'calc(100% - 32px)', scrollSnapAlign: 'start' }))}
    </div>
  );
}

/** A project's number within its company («مشروع رقم N»): its place when the company's projects are in the order they were added. */
function projectNumber(a: ReturnType<typeof useApp>, al: Album) {
  return a.catalog.albums.filter(x => x.co === al.co).sort((x, y) => x.added.localeCompare(y.added) || x.id.localeCompare(y.id)).findIndex(x => x.id === al.id) + 1;
}

/** How many photos and videos the work preview sheet shows. */
const PREVIEW_MAX = 10;
/** Width the work preview sheet's photos are fetched at (its 350px column on a 2× screen). */
const SHEET_W = 700;
/**
 * A company card's quick look at its work (category page): up to PREVIEW_MAX photos and videos from its projects
 * in the category (see companyPreview); the mosaic shows the first 3 photos. Fewer than 3 photos: no mosaic, and
 * the card keeps its cover.
 */
function workPreview(a: ReturnType<typeof useApp>, co: Company, cat: number | null | undefined) {
  const media = companyPreview(a, co.id, cat).slice(0, PREVIEW_MAX);
  const photos = media.filter(m => !m.video).slice(0, 3).map(m => m.src);
  return photos.length === 3 ? { photos, n: media.length } : { photos: [], n: 0 };
}

const PHOTO_W: Words = { ar: ['صورة واحدة', 'صورتان', 'صور', 'صورة'], en: ['photo', 'photos'] };

/**
 * One large photo with two smaller ones stacked beside it, in the card's 200px band. Tapping it opens the work
 * preview sheet (the rest of the card opens the company); `n` (how many it has) is only read out to screen readers.
 */
function Mosaic({ photos, n, bg, onOpen, onPress }: { photos: string[]; n: number; bg: string; onOpen: () => void; onPress?: () => void }) {
  const a = useApp();
  const box = useRef<HTMLButtonElement>(null);
  // Photos start loading well before the card scrolls into view (see useNear).
  const near = useNear(box);
  return (
    // The grid is a div inside the button: Safari on iPhone doesn't lay out a <button> as a grid, which left the
    // photos with no size there.
    <button ref={box} type="button" aria-label={countOf(a, n, PHOTO_W)} onClick={e => { e.stopPropagation(); onOpen(); }}
      onPointerDown={onPress}
      style={{ display: 'block', width: '100%', height: 200, padding: 0, border: 'none', background: 'var(--surface-card)', cursor: 'zoom-in' }}>
      <div style={{ display: 'grid', width: '100%', height: '100%', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2 }}>
        {photos.map((src, k) => (
          <div key={src} style={{ position: 'relative', minWidth: 0, minHeight: 0, overflow: 'hidden', background: bg, ...(k === 0 ? { gridRow: 'span 2' } : {}) }}>
            {/* The large one at the sheet's size, so opening the sheet reuses it. */}
            {near && <Img eager src={photo(src, k === 0 ? SHEET_W : 300)} style={{ position: 'absolute', inset: 0 }} />}
          </div>
        ))}
      </div>
    </button>
  );
}

/**
 * The work preview (from a category page card): a white sheet with the company's name and logo, its photos and
 * videos large, each with its project's name and number over a dark fade at the bottom (nothing to tap), and
 * «زيارة صفحة الشركة». It's only there to help decide whether the company is worth a visit.
 */
export function WorkPreviewSheet() {
  const a = useApp();
  const { t, sheet, setSheet, previewCo, page } = a;
  const h = helpers(a);
  const co = previewCo ? a.idx.co.get(previewCo) : undefined;
  const cat = page.s === 'listing' ? page.cat : undefined;
  const media = co ? companyPreview(a, co.id, cat).slice(0, PREVIEW_MAX) : [];
  const fill: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  return (
    <BottomSheet open={sheet === 'preview' && !!co} onClose={() => setSheet(null)}
      title={co && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={36} verified={co.verified} />
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.coName(co)}</span>
        </span>
      )}
      footer={co && <Button fullWidth size="lg" onClick={() => a.go('company', { id: co.id, ...(cat != null ? { act: cat } : {}) })}>{t.visitProfile}</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ font: 'var(--type-body-strong)', color: 'var(--text-secondary)', textAlign: 'center' }}>{t.workSamples}</span>
        {sheet === 'preview' && media.map((m, k) => (
          <div key={m.src} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: 'var(--neutral-100)' }}>
            {m.video
              ? <video src={m.src + '#t=0.1'} muted loop playsInline autoPlay preload="metadata" style={fill} />
              : <img src={photo(m.src, SHEET_W)} alt="" loading={k < 4 ? 'eager' : 'lazy'} decoding="async" style={fill} />}
            {m.al && (
              <span style={{ position: 'absolute', insetInline: 0, bottom: 0, padding: '36px 14px 12px', background: 'linear-gradient(to top, oklch(0.12 0.02 285 / 0.78), oklch(0.12 0.02 285 / 0.4) 55%, transparent)', color: '#fff', display: 'flex', flexDirection: 'column', gap: 2, pointerEvents: 'none' }}>
                <span style={{ font: '700 15px/1.3 var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.ar ? m.al.ar : m.al.en}</span>
                <span style={{ font: '600 12px var(--font-sans)', opacity: 0.85 }}>{t.projectNo.replace('{n}', h.num(projectNumber(a, m.al)))}</span>
              </span>
            )}
          </div>
        ))}
        {/* Last line: an invitation to the company page (the button below opens it). */}
        {co && media.length > 0 && (
          <span style={{ padding: '28px 12px 6px', textAlign: 'center', font: 'var(--type-body-strong)', color: 'var(--text-secondary)' }}>{t.moreOnProfile}</span>
        )}
      </div>
    </BottomSheet>
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


/** Companies per page on a category page. */
const PAGE = 20;

export function Listing() {
  const a = useApp();
  const { t, catalog, f, setF, page: top } = a;
  const h = helpers(a);
  const c = top.cat;
  const set = (p: Partial<Filters>) => setF(x => ({ ...x, ...p }));
  const res = listingCompanies(a, c);
  const chips = categoryServiceChips(a, c);
  // Companies come in pages of PAGE: the next page loads as the end of the list nears the screen.
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [c, f]);
  const more = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = more.current;
    if (!el) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) setShown(n => n + PAGE); }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, res.length]);
  const color = c == null ? 'violet' : catalog.cats[c].color;
  // Opening a company from here lands on this category's activity.
  const results = res.map(co => ({ ...h.coV(co), work: workPreview(a, co, c), open: () => a.go('company', { id: co.id, ...(c != null ? { act: c } : {}) }) }));

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
      {/* The category's stories (hidden while searching or filtering: then only results show). */}
      {c != null && !f.q && !f.mine && !f.verified && !f.open && !f.svc && <CategoryStoryRow cat={c} />}
      {/* The order, then the category's common services. */}
      <div className="mj-s" style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', padding: '10px 20px 2px', scrollbarWidth: 'none' }}>
        <button type="button" aria-haspopup="dialog" aria-label={t.sortBy + ': ' + sortLabel(t, f.sort)} onClick={() => a.setSheet('sort')}
          style={{ flex: 'none', height: 38, display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', border: 'none', borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', color: 'var(--text-primary)', font: 'var(--type-body-sm)', fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
          <Icon name="arrow-down-up" size={15} />{sortLabel(t, f.sort)}<Icon name="chevron-down" size={15} color="var(--text-secondary)" />
        </button>
      </div>
      {chips.length >= 2 && (
        <div className="mj-s" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 20px 2px', scrollbarWidth: 'none' }}>
          {chips.map(x => <Chip key={x.key} size="sm" selected={f.svc === x.key} onClick={() => set({ svc: f.svc === x.key ? '' : x.key })}>{x.label}</Chip>)}
        </div>
      )}
      {!res.length && (
        <>
          <EmptyState icon="search-x" color={color} title={t.noResults} body={t.noResultsBody} />
          <div style={{ display: 'flex', justifyContent: 'center' }}><Button variant="secondary" onClick={() => setF(x => ({ ...DEFAULT_F, sort: x.sort }))}>{t.clear}</Button></div>
        </>
      )}
      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {results.slice(0, shown).map(co => (
          <div key={co.id} onClick={co.open} style={{ ...card, overflow: 'hidden', cursor: 'pointer' }}>
            {co.work.photos.length
              ? <Mosaic photos={co.work.photos} n={co.work.n} bg={co.c100} onOpen={() => a.openPreview(co.id)}
                  // As the finger lands, start fetching the sheet's first photos (it then opens with them ready).
                  onPress={() => preloadPhotos(companyPreview(a, co.id, c).slice(0, 4).filter(m => !m.video).map(m => photo(m.src, SHEET_W)))} />
              : (
                <div style={{ position: 'relative', aspectRatio: '4/3', maxHeight: 200, width: '100%', background: co.c100 }}>
                  <Img src={co.cover} />
                </div>
              )}
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
        {/* Loads the next PAGE companies when this comes near the screen. */}
        {shown < results.length && <div ref={more} aria-hidden="true" style={{ height: 1 }} />}
      </div>
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
 * A company's offers. DEMO: made up from its services (OFFERS_PER_COMPANY of them) until companies can post
 * offers; `i` is the offer's number, used in its link (/offer/<company>/<i>).
 */
type Lang2 = [string, string];
const OFFER_DEMO: { kicker: Lang2; big: Lang2; on: (svc: Lang2) => Lang2; title: (svc: Lang2) => Lang2; days: number }[] = [
  { kicker: ['خصم', 'Save'], big: ['١٥٪', '15%'], on: ([ar, en]) => ['على ' + ar, 'on ' + en.toLowerCase()], title: ([ar, en]) => ['خصم ١٥٪ على ' + ar, '15% off ' + en.toLowerCase()], days: 12 },
  { kicker: ['تصميم ثلاثي الأبعاد', '3D design'], big: ['مجانًا', 'Free'], on: ([ar, en]) => ['مع ' + ar, 'with ' + en.toLowerCase()], title: ([ar, en]) => ['تصميم ثلاثي الأبعاد مجاني مع ' + ar, 'Free 3D design with ' + en.toLowerCase()], days: 20 },
  { kicker: ['خصم', 'Save'], big: ['٢٠٪', '20%'], on: ([ar, en]) => ['على ' + ar, 'on ' + en.toLowerCase()], title: ([ar, en]) => ['خصم ٢٠٪ على ' + ar, '20% off ' + en.toLowerCase()], days: 6 },
  { kicker: ['زيارة معاينة', 'Site visit'], big: ['مجانًا', 'Free'], on: ([ar, en]) => ['لخدمة ' + ar, 'for ' + en.toLowerCase()], title: ([ar, en]) => ['زيارة معاينة مجانية لخدمة ' + ar, 'Free site visit for ' + en.toLowerCase()], days: 30 },
  { kicker: ['خصم', 'Save'], big: ['١٠٪', '10%'], on: ([ar, en]) => ['على ' + ar, 'on ' + en.toLowerCase()], title: ([ar, en]) => ['خصم ١٠٪ على ' + ar, '10% off ' + en.toLowerCase()], days: 9 },
  { kicker: ['ضمان إضافي', 'Extra warranty'], big: ['سنة', '+1 year'], on: ([ar, en]) => ['على ' + ar, 'on ' + en.toLowerCase()], title: ([ar, en]) => ['سنة ضمان إضافية على ' + ar, 'An extra year of warranty on ' + en.toLowerCase()], days: 25 },
];
const OFFER_COLORS = ['violet', 'teal', 'coral', 'indigo', 'green', 'pink'];
function companyOffers(a: ReturnType<typeof useApp>, co: Company) {
  const { ar } = a;
  const h = helpers(a);
  const svcs = a.catalog.services.filter(s => s.co === co.id);
  if (!svcs.length) return [];
  const L = (x: Lang2) => x[ar ? 0 : 1];
  return OFFER_DEMO.slice(0, OFFERS_PER_COMPANY).map((o, i) => {
    const s = svcs[i % svcs.length];
    const v = h.svcV(s);
    const end = new Date(Date.now() + o.days * 864e5);
    return {
      i, svc: s, color: OFFER_COLORS[i % OFFER_COLORS.length], kicker: L(o.kicker), big: L(o.big), on: L(o.on([s.ar, s.en])), title: L(o.title([s.ar, s.en])),
      img: v.img, days: o.days, until: end.toLocaleDateString(ar ? 'ar-OM' : 'en-GB', { day: 'numeric', month: 'long' }),
      open: () => a.go('offer', { id: co.id, i }),
    };
  });
}
type Offer = ReturnType<typeof companyOffers>[number];
/** The fade under an offer's text, in its colour; the text starts on the right in Arabic and on the left in English. */
const offerFade = (ar: boolean, c: string) => {
  const mix = (pct: number) => 'color-mix(in oklch, var(--cat-' + c + '-800) ' + pct + '%, transparent)';
  return 'linear-gradient(' + (ar ? 'to left' : 'to right') + ', ' + mix(96) + ' 0%, ' + mix(80) + ' 45%, ' + mix(10) + ' 100%)';
};

/**
 * «العروض»: the company's offers as a sideways row of advert cards the shape of an ID card (85.6 × 54): the
 * service photo full bleed under a fade in the card's colour, a «عرض خاص» tag, the offer in big type, what it's
 * for, the end date and a «التفاصيل» button; each opens the offer's page. `except` leaves one out.
 */
function OfferStrip({ co, title, except }: { co: Company; title?: string; except?: number }) {
  const a = useApp();
  const { t, ar } = a;
  const offers = companyOffers(a, co).filter(o => o.i !== except);
  if (!offers.length) return null;
  return (
    <section aria-label={title || t.offers} style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '0 -20px' }}>
      <div style={{ padding: '0 20px' }}><SectionHeader title={title || t.offers} action={null} /></div>
      <HScroll>
        {offers.map(o => (
          <button key={o.i} type="button" className="mj-press-sm" onClick={o.open} aria-label={o.title}
            style={{ position: 'relative', flex: 'none', width: 240, aspectRatio: '85.6 / 54', scrollSnapAlign: 'start', padding: 0, border: 'none', borderRadius: 12, overflow: 'hidden', background: 'var(--cat-' + o.color + '-800)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'start', color: '#fff', boxShadow: '0 3px 10px oklch(0.2 0.03 285 / 0.16)' }}>
            <Img src={o.img} style={{ position: 'absolute', inset: 0 }} />
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: offerFade(ar, o.color) }} />
            <span style={{ position: 'absolute', inset: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <OfferTag o={o} />
              <span style={{ marginTop: 6, font: '700 12px var(--font-sans)', opacity: 0.9 }}>{o.kicker}</span>
              <span style={{ font: '800 30px/1.05 var(--font-sans)', letterSpacing: '-0.01em' }}>{o.big}</span>
              <span style={{ marginTop: 2, maxWidth: '70%', font: '600 12px/1.35 var(--font-sans)', opacity: 0.92, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{o.on}</span>
              <span style={{ marginTop: 'auto', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 10px var(--font-sans)', opacity: 0.85 }}><Icon name="clock" size={11} />{t.offerUntil} {o.until}</span>
                <span style={{ height: 24, padding: '0 10px', borderRadius: 999, background: '#fff', color: 'var(--cat-' + o.color + '-800)', display: 'inline-flex', alignItems: 'center', gap: 3, font: '800 11px var(--font-sans)' }}>
                  {t.offerCta}<Icon name="chevron-right" size={12} />
                </span>
              </span>
            </span>
          </button>
        ))}
      </HScroll>
    </section>
  );
}
const OfferTag = ({ o, big }: { o: Offer; big?: boolean }) => {
  const { t, ar } = useApp();
  return (
    <span style={{ height: big ? 24 : 20, padding: big ? '0 10px' : '0 8px', borderRadius: 999, background: '#fff', color: 'var(--cat-' + o.color + '-600)', display: 'inline-flex', alignItems: 'center', font: '800 ' + (big ? 12 : 10) + 'px var(--font-sans)', letterSpacing: ar ? 0 : '0.04em' }}>{t.offerTag}</span>
  );
};

const DAY_W: Words = { ar: ['يوم واحد', 'يومان', 'أيام', 'يومًا'], en: ['day', 'days'] };
const OFFER_TERMS: ((until: string) => Lang2)[] = [
  until => ['العرض ساري حتى ' + until + ' أو حتى اكتمال الحجوزات.', 'Valid until ' + until + ' or while bookings last.'],
  () => ['يُطبَّق على المشاريع الجديدة التي يُتفق عليها خلال مدة العرض.', 'Applies to new projects agreed during the offer.'],
  () => ['لا يُجمع مع عروض أو خصومات أخرى.', 'Can’t be combined with other offers or discounts.'],
  () => ['اذكر العرض عند التواصل مع الشركة.', 'Mention the offer when you contact the company.'],
];

/**
 * An offer's own page: the advert as the header (Back, share), who offers it (opens the company), the offer,
 * how long it lasts, what it includes, contact buttons (WhatsApp starts with the offer's name), the terms,
 * the service it's for, and the company's other offers.
 */
export function OfferPage() {
  const a = useApp();
  const { t, ar, page: top } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.id!)!;
  const o = companyOffers(a, co).find(x => x.i === top.i)!;
  const L = (x: Lang2) => x[ar ? 0 : 1];
  const name = h.coName(co);
  const about = ar
    ? 'تقدّم ' + name + ' ' + o.title + ' لفترة محدودة. تواصل مع الشركة عبر واتساب أو الاتصال قبل ' + o.until + ' لحجز العرض ومعرفة التفاصيل.'
    : name + ' is offering ' + o.title.charAt(0).toLowerCase() + o.title.slice(1) + ' for a limited time. Contact them on WhatsApp or by phone before ' + o.until + ' to book it and get the details.';
  const wa = ar ? 'مرحبًا، أود الاستفسار عن عرض «' + o.title + '» في مجيب.' : 'Hello, I’d like to ask about the offer “' + o.title + '” on MUJEEB.';
  const line = <div aria-hidden="true" style={{ height: 1, background: 'var(--border-default)', margin: '0 -20px' }} />;
  const sv = h.svcV(o.svc);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* The advert, full width: photo, fade in the offer's colour and the offer in big type. */}
      <div style={{ position: 'relative', height: HERO_H + 40, background: 'var(--cat-' + o.color + '-800)', color: '#fff', overflow: 'hidden' }}>
        <img src={o.img.replace(/w=\d+/, 'w=900')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: offerFade(ar, o.color) }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={() => a.sharePage(top, o.title + ' · ' + name, about)} />
        </div>
        <div style={{ position: 'absolute', insetInline: 22, bottom: 44, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <OfferTag o={o} big />
          <span style={{ marginTop: 8, font: '700 15px var(--font-sans)', opacity: 0.92 }}>{o.kicker}</span>
          <span style={{ font: '800 46px/1.05 var(--font-sans)', letterSpacing: '-0.01em' }}>{o.big}</span>
          <span style={{ marginTop: 2, maxWidth: '75%', font: '600 15px/1.35 var(--font-sans)', opacity: 0.92 }}>{o.on}</span>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Who offers it (the row opens the company). */}
        <div onClick={() => a.go('company', { id: co.id, act: o.svc.cat })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={name} src={logoUrl(co.id)} size={44} verified={co.verified} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{name}</span>
            <span style={{ marginTop: 4 }}><CatTag color={a.catalog.cats[o.svc.cat]?.color ?? 'violet'} h={24} pad={10}>{h.cname(o.svc.cat)}</CatTag></span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
        </div>
        <ContactGrid a={a} co={co} waText={wa} />
        {line}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ margin: 0, font: 'var(--type-h1)', fontSize: 22 }}>{o.title}</h1>
          {/* How long it lasts. */}
          <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}><Icon name="calendar-clock" size={16} />{t.offerValid} {o.until}</span>
            <span style={{ height: 24, padding: '0 10px', borderRadius: 999, background: 'var(--cat-coral-100)', color: 'var(--cat-coral-800)', display: 'inline-flex', alignItems: 'center', font: '700 12px var(--font-sans)' }}>
              {ar ? t.offerLeft + ' ' + countOf(a, o.days, DAY_W) : countOf(a, o.days, DAY_W) + ' ' + t.offerLeft}
            </span>
          </span>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{about}</span>
        </div>
        {line}
        <section aria-label={t.offerTerms} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionHeader title={t.offerTerms} action={null} />
          {OFFER_TERMS.map((term, k) => (
            <span key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
              <Icon name="check" size={16} color="var(--brand)" style={{ flex: 'none', marginTop: 2 }} />{L(term(o.until))}
            </span>
          ))}
        </section>
        {line}
        <section aria-label={t.offerService} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeader title={t.offerService} action={null} />
          <ServiceNavCard title={sv.title} img={sv.img} open={sv.open} sub={svcProjects(a, sv.id)} />
        </section>
        {line}
        <OfferStrip co={co} title={t.moreOffers} except={o.i} />
      </div>
    </div>
  );
}

/**
 * The activity selector: a pill centred on a hairline that runs from screen edge to screen edge. It separates the
 * company info from its work and filters everything below (services, featured projects, gallery). With several
 * activities it opens the activity sheet.
 */
function ActivityPicker({ co, act }: { co: Company; act: number | null }) {
  const a = useApp();
  const { t } = a;
  const h = helpers(a);
  const many = co.cats.length > 1;
  const cur = act ?? co.cats[0];
  const box: CSSProperties = { flex: '0 1 auto', minWidth: 0, minHeight: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', color: 'var(--text-primary)', font: 'var(--type-body)', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sans)', textAlign: 'start' };
  const inner = (
    <>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.cname(cur)}</span>
      {/* A round solid purple button so it reads as tappable at a glance. */}
      {many && (
        <span aria-hidden="true" style={{ flex: 'none', width: 26, height: 26, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      )}
    </>
  );
  const line = <span aria-hidden="true" style={{ flex: 1, minWidth: 16, height: 1, background: 'var(--border-default)' }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px -20px' }}>
      {line}
      {many
        ? <button type="button" aria-haspopup="dialog" aria-label={t.activity + ': ' + h.cname(cur)} onClick={() => a.setSheet('activity')} style={{ ...box, cursor: 'pointer', paddingInlineEnd: 9 }}>{inner}</button>
        : <div role="note" aria-label={t.activity + ': ' + h.cname(cur)} style={box}>{inner}</div>}
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

/** Under a service: how many completed projects are linked to it. */
function svcProjects(a: ReturnType<typeof useApp>, id: string) {
  const n = a.catalog.albums.filter(al => al.svc === id).length;
  return n ? countOf(a, n, PRJ_W) : a.t.nothingYet;
}

/** «عرض الكل» from the company page: all of its services (in the chosen activity) as a plain list. */

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
  // «مشاريع مميزة»: the projects the company picked (up to 7), in the chosen activity. A company that hasn't
  // picked any yet shows its newest projects instead.
  const own = catalog.albums.filter(al => al.co === co.id);
  const picked = own.some(al => al.feat);
  const featured = own.filter(al => (!picked || al.feat) && (act == null || al.cat === act))
    .sort((x, y) => (y.done || y.added || '').localeCompare(x.done || x.added || '')).slice(0, 7);
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
        {/* Centred: the logo, the name, then the follower count; the contact buttons right under it. */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: -42 }}>
          <Avatar name={cv.name} src={cv.logo} size={84} verified={cv.verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-app)' }} />
          <span style={{ font: 'var(--type-h1)', textAlign: 'center' }}>{cv.name}</span>
          <FollowLine co={co} />
        </div>
        <ContactGrid a={a} co={co} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Where the company is, then where it works. */}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={14} style={{ flex: 'none' }} />{cv.city}</span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}><Icon name="route" size={14} style={{ flex: 'none', marginTop: 2 }} /><span>{t.workArea}: {h.covText(co)}</span></span>
          </span>
          <ClampedAbout text={a.ar ? co.dar : co.den} />
        </div>
        {/* The activity pill on a full-width line (opens the activity list), then everything it filters, with no lines between, so it reads as one block: its services (a 3-row sideways strip when there are more than 3), featured projects and gallery. */}
        <ActivityPicker co={co} act={act} />
        {/* «الخدمات ١٢»: the activity's services, with how many there are (like «معرض الأعمال»). */}
        {services.length
          ? (
            <section aria-label={t.services} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionHeader title={<>{t.services} <span style={{ color: 'var(--text-tertiary)' }}>{h.num(services.length)}</span></>}
                action={services.length > 3 ? t.seeAll : null} onAction={() => a.setSheet('services')} />
              <ServiceStrip key={act ?? 'all'} items={services} />
            </section>
          )
          : <EmptyLine>{t.actNoSvc}</EmptyLine>}
        {/* «العروض»: the company's offers (all activities), after the services. */}
        <div style={{ marginTop: 10 }}><OfferStrip co={co} /></div>
        {/* «مشاريع مميزة»: the company's picks in this activity as a sideways row of cards. */}
        {featured.length > 0 && (
          <section aria-label={t.featuredPr} style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '10px -20px 0' }}>
            <div style={{ padding: '0 20px' }}><SectionHeader title={t.featuredPr} action={null} /></div>
            <HScroll>
              {featured.map(al => {
                const v = h.albV(al);
                return (
                  <div key={al.id} onClick={v.open} style={{ flex: 'none', width: 232, scrollSnapAlign: 'start', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden', background: 'var(--surface-card)', cursor: 'pointer' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', background: v.c100 }}>
                      <Img src={v.img} />
                      <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}><Badge tone="dark" size="sm" icon="images">{h.num(albumMedia(al).length)}</Badge></span>
                    </div>
                    <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ font: 'var(--type-body-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</span>
                      {v.place && <MetaLine icon="map-pin">{v.place}</MetaLine>}
                    </div>
                  </div>
                );
              })}
            </HScroll>
          </section>
        )}
        {allMedia.length > 0 && (
            <section aria-label={t.gallery} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
              <SectionHeader title={<>{t.workGallery} <span style={{ color: 'var(--text-tertiary)' }}>{h.num(gallery.length)}</span></>}
                action={gallery.length > 12 ? t.seeAll : null} onAction={() => a.setSheet('gallery')} />
              {/* Square tiles in line with the page content: pages of 12 (3 × 4) scrolling sideways when there are more. */}
              {gallery.length
                ? <SquareGrid key={act ?? 'all'} items={gallery} onOpen={k => a.go('photo', { src: 'gallery', id: co.id, i: k, ...(act != null ? { act } : {}) })} />
                : <EmptyLine>{t.actNoMedia}</EmptyLine>}
            </section>
        )}
      </div>
    </div>
  );
}

/**
 * A service card: small landscape photo, then name (up to two lines) and project count; opens the service page.
 * `icon`: the service has no projects yet, so a grey square with this (category) icon stands in for the photo.
 */
function ServiceNavCard({ title, img, open, sub, icon }: { title: string; img: string; open: () => void; sub: string; icon?: string }) {
  return (
    <button type="button" className="mj-press-sm" onClick={open}
      style={{ minWidth: 0, minHeight: 64, display: 'flex', alignItems: 'center', gap: 10, padding: 8, paddingInlineEnd: 12, border: '1px solid var(--border-default)', borderRadius: 12, background: 'var(--surface-card)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'start', scrollSnapAlign: 'start' }}>
      <span style={{ position: 'relative', flex: 'none', width: 72, height: 50, borderRadius: 8, overflow: 'hidden', background: 'var(--neutral-100)', display: 'grid', placeItems: 'center' }}>
        {icon ? <Icon name={icon} size={22} color="var(--text-tertiary)" /> : <Img src={img} style={{ position: 'absolute', inset: 0 }} />}
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, lineHeight: 1.35, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</span>
        <span style={{ font: 'var(--type-caption)', color: icon ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>{sub}</span>
      </span>
    </button>
  );
}

/** Services with projects first, those without any last (each group in the company's own order). */
function servicesInOrder<T extends { id: string }>(a: ReturnType<typeof useApp>, items: T[]): T[] {
  const has = (id: string) => a.catalog.albums.some(al => al.svc === id);
  return [...items.filter(x => has(x.id)), ...items.filter(x => !has(x.id))];
}

/** One service card, with the category icon in place of a photo when it has no projects yet. */
function ServiceCard({ x }: { x: ReturnType<ReturnType<typeof helpers>['svcV']> }) {
  const a = useApp();
  const s = a.idx.svc.get(x.id);
  const empty = !a.catalog.albums.some(al => al.svc === x.id);
  return <ServiceNavCard title={x.title} img={x.img} open={x.open} sub={svcProjects(a, x.id)} icon={empty ? (s ? a.catalog.cats[s.cat]?.icon : undefined) || 'briefcase' : undefined} />;
}

/**
 * «عرض الكل» from the company page's «معرض الأعمال»: every photo and video of the activity on screen in one
 * square grid (three across). Tapping one opens it full screen, like the strip.
 */
export function GallerySheet() {
  const a = useApp();
  const { t, sheet, setSheet, page } = a;
  const h = helpers(a);
  const co = page.s === 'company' ? a.idx.co.get(page.id!) : undefined;
  const act = co ? activeAct(co, page) : null;
  const items = co ? (act == null ? companyGallery(a, co.id) : companyGallery(a, co.id, act)) : [];
  return (
    <BottomSheet open={sheet === 'gallery' && !!co} onClose={() => setSheet(null)}
      title={<>{t.workGallery} <span style={{ color: 'var(--text-tertiary)' }}>{h.num(items.length)}</span></>}>
      {sheet === 'gallery' && co && (
        <SquareGrid items={items} per={items.length} onOpen={k => a.go('photo', { src: 'gallery', id: co.id, i: k, ...(act != null ? { act } : {}) })} />
      )}
    </BottomSheet>
  );
}

/**
 * «عرض الكل» from the company page's «الخدمات»: every service of the activity on screen as a plain list (same
 * order and cards as the strip). Tapping one opens its page.
 */
export function ServicesSheet() {
  const a = useApp();
  const { t, sheet, setSheet, page } = a;
  const h = helpers(a);
  const co = page.s === 'company' ? a.idx.co.get(page.id!) : undefined;
  const act = co ? activeAct(co, page) : null;
  const items = co ? servicesInOrder(a, a.catalog.services.filter(s => s.co === co.id && (act == null || s.cat === act)).map(h.svcV)) : [];
  return (
    <BottomSheet open={sheet === 'services' && !!co} onClose={() => setSheet(null)}
      title={<>{t.services} <span style={{ color: 'var(--text-tertiary)' }}>{h.num(items.length)}</span></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sheet === 'services' && items.map(x => <ServiceCard key={x.id} x={x} />)}
      </div>
    </BottomSheet>
  );
}

/**
 * A company's services as cards: up to 3 stacked in one column; more become a sideways strip of columns
 * (2 cards each for 4 services, 3 each for 5 or more), the next column peeking in at the edge. Services with
 * projects come first, those without any last (each group in the company's own order), shown with their
 * category icon instead of a photo.
 */
function ServiceStrip({ items }: { items: ReturnType<ReturnType<typeof helpers>['svcV']>[] }) {
  const a = useApp();
  const cards = servicesInOrder(a, items).map(x => <ServiceCard key={x.id} x={x} />);
  if (items.length <= 3) return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{cards}</div>;
  // 4 services: two columns of two. 5 or more: columns of three (5 = three and two).
  const rows = items.length === 4 ? 2 : 3;
  return (
    <div className="mj-s" style={{ display: 'grid', gridTemplateRows: 'repeat(' + rows + ', auto)', gridAutoFlow: 'column', gridAutoColumns: 'calc(100% - 56px)', gap: '8px 10px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
      {cards}
    </div>
  );
}

/**
 * A service's own page: its cover as the header (Back, share), who offers it (logo, name, activity — opens the
 * company), the contact buttons, its name and description, its completed projects, and the company's other
 * services in the same activity.
 */
export function ServicePage() {
  const a = useApp();
  const { t, ar, catalog, page: top } = a;
  const h = helpers(a);
  const s = a.idx.svc.get(top.id!)!;
  const co = a.idx.co.get(s.co)!;
  const color = catalog.cats[s.cat]?.color ?? 'violet';
  const title = ar ? s.ar : s.en;
  const desc = (ar ? s.dar : s.den) || '';
  const [full, setFull] = useState(false);
  useEffect(() => setFull(false), [s.id]);
  useEffect(() => { remote.track(co.id, 'service_view', s.id); }, [co.id, s.id]);
  // «مشاريع منجزة»: newest first (by completion month, else when added).
  const albums = catalog.albums.filter(al => al.svc === s.id).sort((x, y) => (y.done || y.added || '').localeCompare(x.done || x.added || ''));
  const others = catalog.services.filter(x => x.co === co.id && x.cat === s.cat && x.id !== s.id).map(h.svcV);
  const line = <div aria-hidden="true" style={{ height: 1, background: 'var(--border-default)', margin: '0 -20px' }} />;
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: HERO_H, background: 'var(--cat-' + color + '-100)' }}>
        <img src={photo(serviceImage(a, s), 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={() => a.sharePage(top, title + ' · ' + h.coName(co), desc || undefined)} />
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Who offers it (the row opens the company in this activity). */}
        <div onClick={() => a.go('company', { id: co.id, act: s.cat })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={44} verified={co.verified} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ font: 'var(--type-body-strong)' }}>{h.coName(co)}</span>
            <span style={{ marginTop: 4 }}><CatTag color={color} h={24} pad={10}>{h.cname(s.cat)}</CatTag></span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
        </div>
        <ContactGrid a={a} co={co} />
        {line}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 style={{ margin: 0, font: 'var(--type-h1)', fontSize: 22 }}>{title}</h1>
          {desc && <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty', ...(full ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>{desc}</span>}
          {desc.length > 140 && (
            <button type="button" onClick={() => setFull(m => !m)} style={{ alignSelf: 'flex-start', border: 'none', padding: 0, background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--brand)' }}>{full ? t.showLess : t.readMore}</button>
          )}
        </div>
        {albums.length > 0 && line}
        {albums.length > 0 && <ProjectsBlock albums={albums} />}
        {others.length > 0 && line}
        {others.length > 0 && (
          <section aria-label={t.relatedServices} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionHeader title={t.relatedServices} action={null} />
            <ServiceStrip items={others} />
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

/**
 * A hairline from screen edge to screen edge with a centred white pill (same look as the company page's
 * activity pill). The project page puts its number there.
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

/** A small amber star on a project photo: the company features this project («مشاريع مميزة»). */
function FeatStar() {
  const { t } = useApp();
  return (
    <span role="img" aria-label={t.featuredPr} title={t.featuredPr}
      style={{ position: 'absolute', top: 8, insetInlineStart: 8, width: 26, height: 26, borderRadius: '50%', background: 'oklch(0.8 0.16 80)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 1px 4px oklch(0 0 0 / 0.25)' }}>
      <Icon name="star" size={14} filled />
    </span>
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
                <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: v.c100 }}><Img src={v.img} />{al.feat && <FeatStar />}</div>
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
                <div style={{ position: 'relative', aspectRatio: '4/3', maxHeight: 200, width: '100%', background: v.c100 }}><Img src={v.img} />{al.feat && <FeatStar />}</div>
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
  const projNo = projectNumber(a, al);
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
        <div aria-hidden="true" style={{ height: 1, background: 'var(--border-default)' }} />
        <div style={{ columns: 2, columnGap: 10 }}>
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
