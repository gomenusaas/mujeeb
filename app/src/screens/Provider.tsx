import { Avatar, Badge, BottomSheet, Button, Chip, EmptyState, Icon, IconButton, ImageSlot, ListItem, SearchBar, SectionHeader, SegmentedControl } from '../ds';
import { useApp, type Filters, type ListView, type SheetKey } from '../app/store';
import { ContactGrid, HScroll, Img, MetaLine, QuoteCta, TopBar, callPhone, card, helpers, openWhatsApp, stop } from '../app/view';
import { logoUrl, photo } from '../data/api';
import type { Company } from '../data/types';

const GOVS = ['all', 'muscat', 'batinah', 'dakhiliyah', 'dhofar', 'sharqiyah'] as const;
const VIEWS: { v: ListView; icon: string; label: 'viewLarge' | 'viewGrid' | 'viewRows' }[] = [
  { v: 'large', icon: 'gallery-vertical', label: 'viewLarge' }, { v: 'grid', icon: 'grid-2x2', label: 'viewGrid' }, { v: 'rows', icon: 'layout-list', label: 'viewRows' },
];

/** Three-icon switch for the company list layout; sits beside the sort control and matches its height. */
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
const SORTS: { v: Sort; icon: string }[] = [{ v: 'rel', icon: 'star' }, { v: 'near', icon: 'map-pin' }, { v: 'recent', icon: 'clock' }];
const sortLabel = (t: ReturnType<typeof useApp>['t'], v: Sort) => (v === 'near' ? t.nearest : v === 'recent' ? t.recent : t.relevance);

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
  const { t, catalog, f, setF, top } = a;
  const h = helpers(a);
  const c = top.cat;
  const q = f.q.trim().toLowerCase();
  const set = (p: Partial<Filters>) => setF(x => ({ ...x, ...p }));
  let res = catalog.companies.filter(co =>
    (c == null || co.cats.includes(c)) &&
    // Coverage, not branch location, decides whether a company appears for a governorate.
    (f.gov === 'all' || co.cov.includes('all') || co.cov.includes(f.gov)) &&
    (!f.verified || co.verified) &&
    (!q || [co.ar, co.en, ...co.cats.map(i => catalog.cats[i].ar + ' ' + catalog.cats[i].en),
      ...catalog.services.filter(s => s.co === co.id).map(s => s.ar + ' ' + s.en)].join(' ').toLowerCase().includes(q)));
  if (f.sort === 'near') res = res.slice().sort((x, y) => Number(y.gov === 'muscat') - Number(x.gov === 'muscat'));
  if (f.sort === 'recent') res = res.slice().reverse();
  const color = c == null ? 'violet' : catalog.cats[c].color;
  const results = res.map(h.coV);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: 'var(--top-inset) 0 4px', background: 'var(--cat-' + color + '-600)', borderRadius: '0 0 28px 28px', color: '#fff' }}>
        <span style={{ position: 'absolute', insetInlineEnd: -50, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(1 0 0 / 0.14)' }} />
        <div style={{ position: 'relative', display: 'flex', padding: '8px 16px' }}><IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" /></div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '6px 20px 18px' }}>
          <span style={{ flex: 'none', width: 52, height: 52, borderRadius: 'var(--radius-tile)', background: 'oklch(1 0 0 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={c == null ? 'layout-grid' : catalog.cats[c].icon} size={26} color="#fff" />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ font: 'var(--type-h1)' }}>{c == null ? t.allServices : h.cname(c)}</span>
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, opacity: 0.9 }}>{res.length} {t.results}</span>
          </div>
        </div>
        <div style={{ position: 'relative', padding: '0 20px 12px' }}>
          <SearchBar placeholder={t.search} value={f.q} onChange={e => set({ q: e.target.value })} onFilter={null} elevated />
        </div>
        <div className="mj-s" style={{ position: 'relative', display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 14px', scrollbarWidth: 'none' }}>
          <Chip size="sm" icon="badge-check" selected={f.verified} onClick={() => set({ verified: !f.verified })}>{t.verifiedOnly}</Chip>
          {GOVS.map(g => <Chip key={g} size="sm" selected={f.gov === g} onClick={() => set({ gov: g })}>{h.gname(g)}</Chip>)}
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
      {a.listView === 'grid' && (
        <div style={{ padding: '14px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {results.map(co => (
            <div key={co.id} onClick={co.open} style={{ ...card, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ aspectRatio: '1', background: co.c100 }}><Img src={co.cover} /></div>
              <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={co.name} src={co.logo} size={24} />
                  <CoName name={co.name} verified={co.verified} size={13} />
                </span>
                <MetaLine icon="map-pin" size={12}>{co.city}</MetaLine>
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

export function CompanyPage() {
  const a = useApp();
  const { t, catalog, top, ctab, setCtab } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.id!)!;
  const cv = h.coV(co);
  const services = catalog.services.filter(s => s.co === co.id).map(h.svcV);
  const albums = catalog.albums.filter(al => al.co === co.id).map(h.albV);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 250, background: cv.c100 }}>
        <img src={photo(co.img, 900)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton icon="share-2" variant="glass" size={40} onClick={() => share(cv.name)} label="Share" />
            <IconButton icon="heart" variant="glass" size={40} active={cv.fav} onClick={cv.onFav} label={t.favorites} />
            <IconButton icon="menu" variant="glass" size={40} onClick={() => a.setSheet('menu')} label={t.menu} />
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -36 }}>
          <Avatar name={cv.name} src={cv.logo} size={84} verified={cv.verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--bg-app)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: 'var(--type-h1)' }}>{cv.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}><Icon name="map-pin" size={14} />{cv.city} · {cv.covers}</span>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty', marginTop: 4 }}>{a.ar ? co.dar : co.den}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {co.cats.map(i => <CatTag key={i} color={catalog.cats[i].color}>{h.cname(i)}</CatTag>)}
        </div>
        <ContactGrid a={a} co={co} />
        {!co.book && (
          <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start', font: 'var(--type-body-sm)', color: 'var(--text-secondary)', marginTop: -6 }}>
            <Icon name="calendar-off" size={16} color="var(--text-tertiary)" />{t.bookOff}
          </span>
        )}
        <SegmentedControl options={[{ value: 'services', label: t.services }, { value: 'portfolio', label: t.portfolio }]} value={ctab} onChange={setCtab} />
        {ctab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(s => <ServiceRow key={s.id} {...s} thumb={96} />)}
          </div>
        )}
        {ctab === 'portfolio' && (
          <>
            {!albums.length && <EmptyState icon="images" title={t.portfolio} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
              {albums.map(al => (
                <div key={al.id} onClick={al.open} style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: al.c100 }}>
                    <Img src={al.img} />
                    <span style={{ position: 'absolute', bottom: 8, insetInlineStart: 8 }}><Badge tone="dark" size="sm" icon="images">{al.count}</Badge></span>
                  </div>
                  <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{al.title}</span>
                  <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)', marginTop: -3 }}>{al.place}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <QuoteCta label={t.getQuote} onClick={() => a.startRfq(co.id)} />
    </div>
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

function share(title: string) {
  if (navigator.share) navigator.share({ title, url: location.href }).catch(() => {});
}

export function ServicePage() {
  const a = useApp();
  const { t, ar, catalog, top } = a;
  const h = helpers(a);
  const s = a.idx.svc.get(top.id!)!;
  const co = a.idx.co.get(s.co)!;
  const color = catalog.cats[s.cat].color;
  const albums = catalog.albums.filter(al => al.co === co.id).map(h.albV);
  const more = catalog.services.filter(x => x.co === co.id && x.id !== s.id).map(h.svcV);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <div className="mj-s" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', aspectRatio: '4/3', background: 'var(--cat-' + color + '-100)' }}>
          {s.imgs.map((im, k) => <img key={k} src={photo(im, 800)} alt="" style={{ flex: 'none', width: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start', display: 'block' }} />)}
        </div>
        <div style={{ position: 'absolute', top: 'calc(var(--top-inset) + 4px)', insetInline: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton icon="arrow-left" variant="glass" size={40} onClick={a.back} label="Back" />
          <IconButton icon="share-2" variant="glass" size={40} onClick={() => share(ar ? s.ar : s.en)} label="Share" />
        </div>
        <span style={{ position: 'absolute', bottom: 40, insetInlineEnd: 16 }}><Badge tone="dark" icon="images">{s.imgs.length + ' ' + t.photos}</Badge></span>
      </div>
      <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: 'var(--bg-app)', padding: '22px 20px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CatTag color={color} h={26} pad={10}>{h.cname(s.cat)}</CatTag>
          <span style={{ font: 'var(--type-h1)' }}>{ar ? s.ar : s.en}</span>
          <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{ar ? s.dar : s.den}</span>
        </div>
        <CompanyStrip id={co.id} size={48} padded />
        <ContactGrid a={a} co={co} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ font: 'var(--type-h3)' }}>{t.video}</span>
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            <ImageSlot label="service video · 0:48" tone={color} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconButton icon="play" variant="glass" size={56} label={t.video} /></span>
          </div>
        </div>
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
      <QuoteCta label={t.getQuote} onClick={() => a.startRfq(co.id, s.id)} />
    </div>
  );
}

/** Logo + name + city row linking to the company. */
function CompanyStrip({ id, size, padded }: { id: string; size: number; padded?: boolean }) {
  const a = useApp();
  const h = helpers(a);
  const co = a.idx.co.get(id)!;
  return (
    <div onClick={() => a.go('company', { id })} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', ...(padded ? { padding: 14, ...card } : {}) }}>
      <Avatar name={h.coName(co)} src={logoUrl(id)} size={size} verified={co.verified} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-title)' }}>{h.coName(co)}</span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{h.city(co)}</span>
      </span>
      <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />
    </div>
  );
}

const ALB_RATIOS = ['4/5', '1/1', '3/4', '1/1', '4/5', '3/4'];
export function AlbumPage() {
  const a = useApp();
  const { t, ar, top } = a;
  const h = helpers(a);
  const al = a.idx.alb.get(top.id!)!;
  const co = a.idx.co.get(al.co)!;
  const imgs = al.imgs.concat(al.imgs).slice(0, 6);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={ar ? al.ar : al.en} subtitle={al.n + ' ' + t.photos} onBack={a.back} />
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
          {imgs.map((im, k) => (
            <div key={k} style={{ breakInside: 'avoid', marginBottom: 10, aspectRatio: ALB_RATIOS[k], borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--neutral-100)' }}><Img src={photo(im, 600)} /></div>
          ))}
        </div>
      </div>
      <QuoteCta label={t.getQuote} onClick={() => a.startRfq(co.id)} />
    </div>
  );
}

/* ── Company menu bottom sheet (About, Branches, Address, Coverage, Contact, Website, Social) ── */

const MENU: [Exclude<SheetKey, null | 'menu'>, string, string, 'about' | 'branches' | 'coAddress' | 'svcAreas' | 'contact' | 'website' | 'social'][] = [
  ['about', 'info', 'violet', 'about'], ['branches', 'building-2', 'sky', 'branches'], ['address', 'map-pin', 'teal', 'coAddress'],
  ['coverage', 'route', 'green', 'svcAreas'], ['contact', 'phone', 'amber', 'contact'], ['website', 'globe', 'indigo', 'website'], ['social', 'at-sign', 'pink', 'social'],
];

export function CompanySheet({ co }: { co: Company }) {
  const a = useApp();
  const { t, ar, sheet, setSheet, catalog } = a;
  const h = helpers(a);
  const slug = co.en.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cur = MENU.find(m => m[0] === sheet);
  const ok = (m: string) => () => a.showToast(m);
  type Row = { icon: string; color: string; title: string; sub?: string; chev: boolean; go: (() => void) | null };
  const rows: Partial<Record<string, Row[]>> = {
    branches: co.branches.map(b => ({ icon: 'building-2', color: 'sky', title: ar ? b[0] : b[1], sub: b[2] ? t.primary : t.branch, chev: false, go: null })),
    address: [{ icon: 'map-pin', color: 'teal', title: h.city(co), sub: t.openMaps, chev: true, go: () => window.open('https://www.google.com/maps/search/' + encodeURIComponent(co.en + ' ' + co.cityEn + ' Oman'), '_blank', 'noopener') }],
    contact: [
      { icon: 'phone', color: 'teal', title: t.call, sub: co.phone, chev: true, go: () => callPhone(a, co.phone) },
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
      <BottomSheet open={!!sheet} onClose={() => setSheet(null)} title={cur ? t[cur[3]] : t.menu}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ font: 'var(--type-title)' }}>{t.hours}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 'var(--radius-card)', background: 'var(--surface-sunken)' }}>
                {catalog.hours.map((hr, k) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-body)', color: 'var(--text-secondary)' }}>
                    <span>{ar ? hr[0] : hr[1]}</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }} dir="ltr">{hr[2] || t.closed}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
