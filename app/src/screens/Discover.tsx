import { useState } from 'react';
import { Avatar, BottomSheet, Button, Chip, EmptyState, Icon, IconButton, SectionHeader } from '../ds';
import { useApp } from '../app/store';
import { ColorHeader, HScroll, Img, LocationBar, card, exploreMedia, helpers, myGov, searchMatch, servesArea } from '../app/view';
import { ALL_OMAN } from '../data/oman';
import { photo } from '../data/api';
import type { Album } from '../data/types';
import { StoryCircles } from './Stories';
import { CompaniesFeed, HomeOffers, Masonry, PRJ_W, countOf, listCompanies } from './Provider';

const ROOT_PAD = { padding: 'calc(var(--top-inset) + 8px) 20px 100px' };

/** The flat 2D version of a category's 3D art (public/art/flat: Fluent emoji «Flat», MIT licence, plus our own camera
 * and cupboard drawn to match), for the home services grid and the «الخدمات» page; other art is shown as it is. */
const FLAT_ART: Record<string, string> = {
  building_construction_3d: 'construction', snowflake_3d: 'snowflake', light_bulb_3d: 'bulb', shower_3d: 'shower',
  couch_and_lamp_3d: 'couch', window_3d: 'window', fire_extinguisher_3d: 'extinguisher', potted_plant_3d: 'plant',
  cctv: 'cctv', cupboard: 'cupboard',
};
const flatArt = (url: string) => {
  const k = FLAT_ART[(url.split('/').pop() || '').replace(/\.(png|svg)$/, '')];
  return k ? '/art/flat/' + k + '.svg' : url;
};

export function Home() {
  const a = useApp();
  const { t, catalog } = a;
  const h = helpers(a);
  // The services grid: the admin's tiles (up to 9), or the first 9 categories with their short names.
  const tiles = catalog.home?.length
    ? catalog.home.slice(0, 9).flatMap(x => {
      const c = catalog.cats.find(y => y.i === x.cat);
      return c ? [{ c, name: a.ar ? x.ar : x.en, art: x.icon ? '/art/flat/' + x.icon + '.svg' : c.art && flatArt(c.art) }] : [];
    })
    : catalog.cats.slice(0, 9).map(c => ({ c, name: h.cshort(c.i), art: c.art && flatArt(c.art) }));
  const more = catalog.cats.some(c => !tiles.some(x => x.c.i === c.i));
  // Everything below follows the service location: companies (and their projects) that cover it.
  const local = catalog.companies.filter(co => servesArea(a, co.id));
  const localAlbums = catalog.albums.filter(al => servesArea(a, al.co));
  // Suggested: verified companies covering the area first, then those with the most projects.
  const projects = (id: string) => catalog.albums.filter(al => al.co === id).length;
  const recommended = local.slice().sort((x, y) => Number(y.verified) - Number(x.verified) || projects(y.id) - projects(x.id)).slice(0, 8);
  const latest = localAlbums.slice().sort((x, y) => (y.added || '').localeCompare(x.added || '')).slice(0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 100 }}>
      <div>
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--brand)', color: '#fff', padding: 'calc(var(--top-inset) + 2px) 20px 56px' }}>
          <span style={{ position: 'absolute', insetInlineEnd: -60, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(1 0 0 / .08)' }} />
          <span style={{ position: 'absolute', insetInlineEnd: 40, bottom: -70, width: 140, height: 140, borderRadius: '50%', background: 'oklch(1 0 0 / .06)' }} />
          {/* The header: the app's service location at the very top (it filters the sections below), then the search bar
              inside the header. No logo, language or bell: language is in «حسابي», and new notifications show as a dot
              on its tab. */}
          {/* The MUJEEB logo (white, public/logo-white.png), centred at the top. */}
          <img src="/logo-white.png" alt={t.brand} style={{ position: 'relative', display: 'block', height: 28, width: 'auto', margin: '4px auto 24px' }} />
          <LocationBar a={a} light style={{ position: 'relative' }} />
          <button type="button" onClick={() => a.go('listing')} style={{ position: 'relative', width: '100%', marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, height: 44, paddingInline: '16px 5px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-sans)' }}>
            <Icon name="search" size={20} color="var(--text-tertiary)" />
            <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body)', fontWeight: 'var(--fw-medium)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }}>{t.search}</span>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sliders-horizontal" size={16} /></span>
          </button>
          {/* Companies' stories as circles, under the search bar. */}
          <div style={{ marginTop: 18 }}><StoryCircles /></div>
        </div>
        {/* Reversed corners: the page curves up into the header (the purple shows at the two corners). */}
        <div aria-hidden="true" style={{ position: 'relative', height: 34, marginTop: -33, marginBottom: -1, borderRadius: '32px 32px 0 0', background: 'var(--bg-app)' }} />
      </div>

      {/* Services: a 3 × 3 grid of icons (the category's art, flat 2D, on a white tile with a thin border, like the cards
          on the «الخدمات» page, and a short name), each opening its category page. The platform admin picks the tiles,
          their names and icons (catalog.home, up to 9); otherwise the first 9 categories with their short names. No «عرض الكل»:
          all services are here (and in the «الخدمات» tab). */}
      <section aria-label={t.categories} style={{ padding: '0 20px', marginTop: -18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* «عرض الكل» only when some services aren't on the grid (the admin picked fewer, or there are more than 9). */}
        <SectionHeader title={t.categories} action={more ? t.seeAll : null} onAction={() => a.go('categories')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px 12px' }}>
          {tiles.map(({ c, name, art }, k) => (
            <button key={k} type="button" className="mj-press-sm" onClick={() => a.go('listing', { cat: c.i })}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 0, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <span style={{ width: '100%', aspectRatio: '1 / 0.68', borderRadius: 16, background: 'var(--surface-card)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {art ? <img src={art} alt="" style={{ width: 36, height: 36 }} /> : <Icon name={c.icon} size={24} color={'var(--cat-' + c.color + '-600)'} />}
              </span>
              <span style={{ font: 'var(--type-caption)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.25 }}>{name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Offers in the service location, as big adverts to swipe through. */}
      <HomeOffers />

      {/* Recommended companies in the service location: verified first, then those with the most projects. */}
      {recommended.length > 0 && (
        <section aria-label={t.recommended} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '0 20px' }}><SectionHeader title={myGov(a) ? t.recommendedIn.replace('{area}', a.locLabel) : t.recommended} action={t.seeAll} onAction={() => a.go('listing')} /></div>
          <HScroll>
            {recommended.map(co => {
              const v = h.coV(co);
              return (
                <button key={co.id} type="button" className="mj-press-sm" onClick={() => a.go('company', { id: co.id })}
                  style={{ ...card, flex: 'none', width: 220, padding: 0, border: '1px solid var(--border-subtle)', overflow: 'hidden', cursor: 'pointer', scrollSnapAlign: 'start', textAlign: 'start', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
                  <div style={{ position: 'relative', height: 112, background: v.c100 }}><Img src={v.cover} /></div>
                  <div style={{ padding: '10px 12px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={v.name} src={v.logo} size={34} verified={v.verified} />
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ font: 'var(--type-body-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</span>
                      <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{countOf(a, projects(co.id), PRJ_W)} · {v.city}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </HScroll>
        </section>
      )}

      {/* The latest projects in the service location, each with its title, company and place. */}
      {latest.length > 0 && (
        <section aria-label={t.latestProjects} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '0 20px' }}><SectionHeader title={t.latestProjects} action={t.seeAll} onAction={() => a.setTab('explore')} /></div>
          <HScroll>
            {latest.map(al => {
              const p = h.albV(al);
              return (
                <button key={al.id} type="button" className="mj-press-sm" onClick={p.open}
                  style={{ flex: 'none', width: 150, padding: 0, border: 'none', background: 'none', cursor: 'pointer', scrollSnapAlign: 'start', textAlign: 'start', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 14, overflow: 'hidden', background: p.c100 }}><Img src={photo(al.img, 400)} /></span>
                  <span style={{ font: 'var(--type-body-sm)', fontWeight: 'var(--fw-bold)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</span>
                  <span style={{ marginTop: -4, font: 'var(--type-caption)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.company} · {p.place}</span>
                </button>
              );
            })}
          </HScroll>
        </section>
      )}
    </div>
  );
}

export function Categories() {
  const a = useApp();
  const { t, catalog } = a;
  const h = helpers(a);
  return (
    <div style={{ ...ROOT_PAD, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Opened from home's «عرض الكل» (no tab of its own), so it has Back. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
        {a.stack.length > 1 && <IconButton icon="arrow-left" variant="glass" size={34} onClick={a.back} label="Back" />}
        <span style={{ font: 'var(--type-h2)' }}>{t.allCats}</span>
      </div>
      {/* A plain list on the page: each service's flat icon and name, a thin line between rows (no cards). */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {catalog.cats.map((c, k) => (
          <button key={c.i} type="button" onClick={() => a.go('listing', { cat: c.i })}
            style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 60, padding: '10px 0', border: 'none', borderTop: k ? '1px solid var(--border-default)' : 'none', background: 'none', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-sans)' }}>
            {c.art ? <img src={flatArt(c.art)} alt="" style={{ flex: 'none', width: 30, height: 30 }} /> : <Icon name={c.icon} size={26} color={'var(--cat-' + c.color + '-600)'} />}
            <span style={{ flex: 1, font: 'var(--type-title)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{h.cname(c.i)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


type ResultTab = 'work' | 'cos';

/**
 * «استكشف» (the Explore tab), top to bottom: the service location (it filters everything here), the search field,
 * service chips («الكل» and each service with work in the area) and the gallery of photos from companies' projects
 * (the daily mix; a tap opens the photo's project page).
 * A search runs when Enter is pressed: then two tabs appear, «المشاريع» (default: photos of matching projects) and
 * «الشركات» (matching companies). The service chip narrows both. Emptying the field goes back to the gallery.
 */
export function Explore() {
  const a = useApp();
  const { t, catalog } = a;
  const h = helpers(a);
  const [q, setQ] = useState('');
  // The search that ran (Enter); '' = none, the plain gallery shows.
  const [ran, setRan] = useState('');
  const [cat, setCat] = useState<number | null>(null);
  const [tab, setTab] = useState<ResultTab>('work');
  const onQ = (v: string) => { setQ(v); if (!v.trim()) setRan(''); };
  const run = () => { setRan(q.trim()); setTab('work'); };
  const searching = !!ran;

  // Chips: every service with published work in the service location.
  const chips = catalog.cats.map(c => c.i).filter(i => catalog.albums.some(al => al.cat === i && servesArea(a, al.co)));
  // Photos: the area's projects (in the chosen service), and while searching, only projects matching the search.
  const m = searchMatch(ran);
  const albumOk = (al: Album) => {
    const co = a.idx.co.get(al.co);
    return !m || m(al.ar, al.en, al.pAr, al.pEn, al.dAr, al.dEn, co?.ar, co?.en, h.cname(al.cat));
  };
  const media = exploreMedia(a, cat ?? undefined).filter(x => !searching || (x.al && albumOk(x.al)));
  const projects = new Set(media.map(x => x.al?.id)).size;
  const cos = searching ? listCompanies(a, ran, cat) : [];
  // A photo opens its project's page straight away (no full-screen viewer), in the gallery and in search results.
  const open = (k: number) => { const x = media[k]; if (x.al) a.go('album', { id: x.al.id }); };
  const empty = (icon: string) => (
    <EmptyState icon={searching ? 'search-x' : icon} title={t.noResults} body={searching ? t.noResultsBody : myGov(a) ? t.noOffersAreaBody : undefined}
      action={searching ? <Button variant="secondary" onClick={() => onQ('')}>{t.clear}</Button>
        : myGov(a) ? <Button variant="secondary" iconLeft="globe" onClick={() => a.setWilayat(ALL_OMAN)}>{t.showAllOman}</Button> : undefined} />
  );

  return (
    <div style={{ minHeight: '100%', padding: '0 0 100px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--surface-card)' }}>
      {/* The service location, then the search field (runs on Enter). */}
      <ColorHeader a={a} q={q} onQ={onQ} placeholder={t.searchAll} onSubmit={run} />
      {/* Service chips: narrow the gallery, or both result tabs. */}
      <div className="mj-s" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px', scrollbarWidth: 'none', marginTop: -6 }}>
        <Chip selected={cat == null} onClick={() => setCat(null)}>{t.all}</Chip>
        {chips.map(i => <Chip key={i} selected={cat === i} onClick={() => setCat(i)}>{h.cshort(i)}</Chip>)}
      </div>
      {/* After a search: «المشاريع» (default) and «الشركات», with how many each found. */}
      {searching && (
        <div role="tablist" style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 20px' }}>
          {([['work', t.segProjects, projects], ['cos', t.segCos, cos.length]] as [ResultTab, string, number][]).map(([k, label, n]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              style={{ flex: 1, height: 44, marginBottom: -1, padding: 0, border: 'none', borderBottom: '2px solid ' + (tab === k ? 'var(--brand)' : 'transparent'), background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', font: 'var(--type-body)', fontWeight: tab === k ? 'var(--fw-semibold)' : 'var(--fw-regular)', color: tab === k ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {label + ' ' + h.num(n)}
            </button>
          ))}
        </div>
      )}
      {(!searching || tab === 'work') && <>
        {!media.length && empty('images')}
        {/* Narrow side margins (same as the gap between tiles) so the pictures get the width. */}
        <div style={{ padding: '0 6px' }}>
          <Masonry key={ran + '|' + cat} cols={3} items={media} onOpen={open} />
        </div>
      </>}
      {searching && tab === 'cos' && <>
        {!cos.length && empty('building-2')}
        <CompaniesFeed list={cos} />
      </>}
    </div>
  );
}

/**
 * «موقع الخدمة»: pick a wilayat (grouped by governorate, with a search box). The choice is kept on
 * the phone and shown in the home header and on Explore; a booking starts there.
 */
export function LocationSheet() {
  const a = useApp();
  const { t, ar, sheet, setSheet, wilayat, setWilayat, places } = a;
  const [q, setQ] = useState('');
  const open = sheet === 'location';
  const cur = wilayat;
  const n = q.trim().toLowerCase();
  const hit = (s: string) => s.toLowerCase().includes(n);
  const groups = places.map(g => ({ g, list: !n || hit(g.ar) || hit(g.en) ? g.wilayats : g.wilayats.filter(x => hit(x.ar) || hit(x.en)) })).filter(x => x.list.length);
  const close = () => { setSheet(null); setQ(''); };
  const pick = (id: string) => { setWilayat(id); close(); };
  return (
    // A fixed height, so the sheet doesn't shrink while the list is filtered by typing.
    <BottomSheet open={open} onClose={close} title={t.serviceLoc} style={{ height: '88%' }}>
      <div style={{ position: 'sticky', top: -12, zIndex: 1, margin: '-12px -20px 4px', padding: '12px 20px 10px', background: 'var(--surface-card)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 14px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)' }}>
          <Icon name="search" size={18} color="var(--text-tertiary)" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.searchWilayat} aria-label={t.searchWilayat}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', font: 'var(--type-body)', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }} />
        </label>
      </div>
      {/* All of Oman: no area filter (to browse beyond the customer's own area). */}
      {!n && (
        <button type="button" onClick={() => pick(ALL_OMAN)} aria-pressed={cur === ALL_OMAN}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 48, padding: '0 4px', border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-sans)', font: 'var(--type-body)', fontWeight: cur === ALL_OMAN ? 700 : 500, color: cur === ALL_OMAN ? 'var(--brand)' : 'var(--text-primary)' }}>
          <Icon name="globe" size={18} color={cur === ALL_OMAN ? 'var(--brand)' : 'var(--text-secondary)'} />
          <span style={{ flex: 1 }}>{t.allOman}</span>
          {cur === ALL_OMAN && <Icon name="check" size={20} color="var(--accent)" />}
        </button>
      )}
      {!groups.length && <div style={{ padding: '24px 0', textAlign: 'center', font: 'var(--type-body-sm)', color: 'var(--text-tertiary)' }}>{t.noWilayat}</div>}
      {groups.map(({ g, list }) => (
        <div key={g.id} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Governorate heading: a tinted band with the name in bold and how many wilayats it has. */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, marginBottom: 2, padding: '9px 12px', borderRadius: 12, background: 'var(--brand-tint)', color: 'var(--brand-ink)' }}>
            <Icon name="map-pin" size={15} />
            <span style={{ flex: 1, font: 'var(--type-body-strong)', fontWeight: 'var(--fw-extrabold)' }}>{ar ? g.ar : g.en}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 'var(--fw-semibold)', opacity: 0.75 }}>{helpers(a).num(g.wilayats.length)}</span>
          </span>
          {list.map(x => {
            const on = x.id === cur;
            return (
              <button key={x.id} type="button" onClick={() => pick(x.id)} aria-pressed={on}
                style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, padding: '0 4px', border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-sans)', font: 'var(--type-body)', fontWeight: on ? 700 : 500, color: on ? 'var(--brand)' : 'var(--text-primary)' }}>
                <span style={{ flex: 1 }}>{ar ? x.ar : x.en}</span>
                {on && <Icon name="check" size={20} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      ))}
    </BottomSheet>
  );
}
