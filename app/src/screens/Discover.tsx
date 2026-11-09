import { Avatar, Badge, CategoryCard, Chip, Icon, IconButton, PromoBanner, SectionHeader } from '../ds';
import { useApp } from '../app/store';
import { HScroll, Img, MetaLine, card, helpers, stop } from '../app/view';
import { logoUrl, photo } from '../data/api';

const ROOT_PAD = { padding: 'calc(var(--top-inset) + 8px) 20px 100px' };

export function Home() {
  const a = useApp();
  const { t, ar, catalog } = a;
  const h = helpers(a);
  const promos: [string, string, string, string, string][] = [
    ['واجهات زجاجية بلا إطارات', 'Frameless glass facades', 'indigo', 'glass facade', 'c1'],
    ['صيانة المكيفات قبل الصيف', 'AC servicing before summer', 'sky', 'AC technician', 'c7'],
    ['مطابخ بلمسة عُمانية معاصرة', 'Kitchens with a modern Omani touch', 'violet', 'kitchen showroom', 'c4'],
  ];
  const featCats = catalog.cats.map(c => ({
    ...c, label: h.cname(c.i),
    img: photo((catalog.companies.find(co => co.cats[0] === c.i) || catalog.companies[0]).img, 600),
    count: catalog.companies.filter(co => co.cats.includes(c.i)).length + ' ' + t.results,
  }));
  const recommended = ['c7', 'c3', 'c10'].map(id => a.idx.co.get(id)).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, paddingBottom: 100 }}>
      <div>
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--brand)', color: '#fff', padding: 'calc(var(--top-inset) + 8px) 20px 52px', borderRadius: '0 0 32px 32px' }}>
          <span style={{ position: 'absolute', insetInlineEnd: -60, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'oklch(1 0 0 / .08)' }} />
          <span style={{ position: 'absolute', insetInlineEnd: 40, bottom: -70, width: 140, height: 140, borderRadius: '50%', background: 'oklch(1 0 0 / .06)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ font: '800 20px/24px var(--font-sans)', letterSpacing: '-.02em' }}>{t.brand}<span style={{ opacity: 0.6 }}>.</span></span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="button" onClick={() => a.setLang(ar ? 'en' : 'ar')} style={{ height: 40, padding: '0 14px', border: 'none', borderRadius: 999, background: 'oklch(1 0 0 / .16)', color: '#fff', font: '700 13px var(--font-sans)', cursor: 'pointer' }}>{t.otherLang}</button>
              <IconButton icon="bell" variant="glass" size={40} dot onClick={() => a.go('notifs')} label={t.notifications} />
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, marginTop: 14 }}>
            <span style={{ font: 'var(--type-caption)', opacity: 0.8 }}>{t.serviceLoc}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-title)' }}><Icon name="map-pin" size={16} />{t.loc}<Icon name="chevron-down" size={16} /></span>
          </div>
          <div style={{ position: 'relative', font: 'var(--type-h1)', marginTop: 18, textWrap: 'balance' }}>{t.greeting}</div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px', marginTop: -26 }}>
          <button type="button" onClick={() => a.go('listing')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, height: 52, paddingInline: '18px 6px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-sans)' }}>
            <Icon name="search" size={20} color="var(--text-tertiary)" />
            <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body)', fontWeight: 500, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }}>{t.search}</span>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sliders-horizontal" size={18} /></span>
          </button>
        </div>
      </div>

      <HScroll>
        {promos.map(([tar, ten, color, image, id]) => (
          <div key={id} style={{ flex: 'none', width: 'min(350px, calc(100vw - 40px))', scrollSnapAlign: 'start' }}>
            <PromoBanner eyebrow={t.sponsored} title={ar ? tar : ten} cta={t.viewOffer} color={color} imageLabel={image} onClick={() => a.go('company', { id })} />
          </div>
        ))}
      </HScroll>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '0 20px' }}><SectionHeader title={t.categories} action={t.viewAll + ' (' + h.num(catalog.cats.length) + ')'} onAction={() => a.setTab('categories')} /></div>
        <div className="mj-s" style={{ display: 'grid', gridTemplateRows: 'repeat(2,auto)', gridAutoFlow: 'column', gridAutoColumns: 'calc(100% - 64px)', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, padding: '4px 20px 12px', margin: '-4px 0 -12px', scrollbarWidth: 'none' }}>
          {featCats.map(c => (
            <button key={c.i} type="button" className="mj-press-sm" onClick={() => a.go('listing', { cat: c.i })}
              style={{ overflow: 'hidden', height: 92, border: 'none', padding: 0, borderRadius: 'var(--radius-card)', background: 'var(--cat-' + c.color + '-600)', cursor: 'pointer', scrollSnapAlign: 'start', display: 'flex', alignItems: 'stretch', fontFamily: 'var(--font-sans)' }}>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 6, padding: '0 16px', textAlign: 'start' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', opacity: 0.92 }}><Icon name={c.icon} size={18} /><span style={{ font: 'var(--type-caption)' }}>{c.count}</span></span>
                <span style={{ font: 'var(--type-title)', color: '#fff' }}>{c.label}</span>
              </span>
              <img src={c.img} alt="" loading="lazy" style={{ flex: 'none', width: '38%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '0 20px' }}><SectionHeader title={t.featuredCo} action={t.seeAll} onAction={() => a.go('listing')} /></div>
        <HScroll>
          {catalog.companies.slice(0, 6).map(h.coV).map(co => (
            <div key={co.id} onClick={co.open} style={{ flex: 'none', width: 260, scrollSnapAlign: 'start', ...card, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', background: co.c100 }}>
                <Img src={co.cover} />
                <span style={{ position: 'absolute', top: 8, insetInlineEnd: 8 }} onClick={stop}><IconButton icon="heart" variant="glass" size={34} active={co.fav} onClick={co.onFav} label={t.favorites} /></span>
              </div>
              <div style={{ padding: '12px 14px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar name={co.name} src={co.logo} size={44} verified={co.verified} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ font: 'var(--type-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{co.name}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{co.cat}</span>
                  <MetaLine icon="map-pin" style={{ gap: 3 }}>{co.city}</MetaLine>
                </div>
              </div>
            </div>
          ))}
        </HScroll>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '0 20px' }}><SectionHeader title={t.featuredPr} action={t.seeAll} onAction={() => a.setTab('explore')} /></div>
        <HScroll>
          {catalog.albums.slice(0, 6).map(h.albV).map(p => (
            <div key={p.id} onClick={p.open} style={{ flex: 'none', width: 232, scrollSnapAlign: 'start', ...card, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', background: p.c100 }}>
                <Img src={p.img} />
                <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}><Badge tone="dark" size="sm" icon="images">{p.count}</Badge></span>
              </div>
              <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.company} · {p.place}</span>
                <span style={{ font: 'var(--type-title)' }}>{p.title}</span>
              </div>
            </div>
          ))}
        </HScroll>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader title={t.recommended} subtitle={t.recSub} action={null} />
        {recommended.map(co => co && (
          <div key={co.id} onClick={() => a.go('company', { id: co.id })} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, ...card, cursor: 'pointer' }}>
            <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={60} verified={co.verified} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ font: 'var(--type-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.coName(co)}</span>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{h.cname(co.cats[0])}</span>
              <MetaLine icon="map-pin" style={{ gap: 3 }}>{h.city(co)}</MetaLine>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Categories() {
  const a = useApp();
  const { t, catalog } = a;
  const h = helpers(a);
  return (
    <div style={{ ...ROOT_PAD, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-h1)' }}>{t.allCats}</span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{h.num(catalog.cats.length)} {t.majorCats}</span>
      </div>
      <button type="button" onClick={() => a.go('listing')} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, paddingInline: 18, border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)', fontFamily: 'var(--font-sans)' }}>
        <Icon name="search" size={20} color="var(--text-tertiary)" />
        <span style={{ font: 'var(--type-body)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.search}</span>
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {catalog.cats.map(c => <CategoryCard key={c.i} label={h.cname(c.i)} art={c.art} icon={c.icon} color={c.color} onClick={() => a.go('listing', { cat: c.i })} />)}
      </div>
    </div>
  );
}

const RATIOS = ['3/4', '1/1', '4/5', '1/1', '3/4', '4/5', '1/1', '3/4', '4/5', '1/1'];

export function Explore() {
  const a = useApp();
  const { t, catalog, exCat, setExCat } = a;
  const h = helpers(a);
  // Quick filters: construction, interiors, kitchens, gardens, electrical.
  const chips = [0, 4, 9, 8, 2].filter(i => catalog.cats[i]);
  const feed = catalog.albums.filter(al => exCat < 0 || al.cat === exCat).map(h.albV);
  return (
    <div style={{ padding: 'calc(var(--top-inset) + 8px) 0 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-h1)' }}>{t.exploreTitle}</span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.exploreSub}</span>
      </div>
      <div className="mj-s" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px', scrollbarWidth: 'none' }}>
        <Chip selected={exCat < 0} onClick={() => setExCat(-1)}>{t.all}</Chip>
        {chips.map(i => <Chip key={i} selected={exCat === i} onClick={() => setExCat(i)}>{h.cshort(i)}</Chip>)}
      </div>
      <div style={{ padding: '0 20px', columns: 2, columnGap: 12 }}>
        {feed.map((p, k) => (
          <div key={p.id} onClick={p.open} style={{ breakInside: 'avoid', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
            <div style={{ aspectRatio: RATIOS[k % 10], borderRadius: 'var(--radius-md)', overflow: 'hidden', background: p.c100 }}><Img src={p.img} /></div>
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-secondary)', marginTop: -3 }}>{p.company}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
