import { useEffect, useLayoutEffect, useState } from 'react';
import { Chip, Icon, IconButton, SegmentedControl, TabBar, Toast } from './ds';
import { AppProvider, useApp, useAppState, type RootTab, type Route } from './app/store';
import { dataSource, loadCatalog, loadCustomerSeed } from './data/api';
import type { Catalog, CustomerSeed } from './data/types';
import { STR } from './i18n/strings';
import { useDragScroll } from './app/useDragScroll';
import { Categories, Explore, Home, LocationSheet } from './screens/Discover';
import { ActivitySheet, AlbumPage, CompanyPage, CompanySheet, Listing, ReachSheets, ServicePage, SortSheet } from './screens/Provider';
import { BookingPage, DonePage } from './screens/Flows';
import { StoryViewer } from './screens/Stories';
import { PhotoViewer } from './screens/Photo';
import { STORIES } from './data/stories';
import { Bookings, Notifications, Profile } from './screens/Account';
import { AuthSheet } from './screens/Auth';

const TABS: { id: RootTab; icon: string }[] = [
  { id: 'home', icon: 'house' }, { id: 'categories', icon: 'layout-grid' }, { id: 'explore', icon: 'compass' },
  { id: 'profile', icon: 'user-round' },
];

export default function App() {
  const [data, setData] = useState<{ catalog: Catalog; seed: CustomerSeed } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([loadCatalog(), loadCustomerSeed()])
      .then(([catalog, seed]) => setData({ catalog, seed }))
      .catch(e => setError(String(e?.message || e)));
  }, []);
  const ar = (document.documentElement.lang || 'ar') === 'ar';
  if (error) return <Splash>{STR.loadError[ar ? 0 : 1]}<small style={{ display: 'block', marginTop: 6, opacity: 0.7 }}>{error}</small></Splash>;
  if (!data) return <Splash>{STR.loading[ar ? 0 : 1]}</Splash>;
  return <Shell catalog={data.catalog} seed={data.seed} />;
}

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--brand)', color: '#fff', textAlign: 'center', padding: 24 }}>
      <span style={{ font: '800 34px/40px var(--font-sans)' }}>مجيب<span style={{ opacity: 0.6 }}>.</span></span>
      <span style={{ font: 'var(--type-body-sm)', opacity: 0.85 }}>{children}</span>
    </div>
  );
}

function Shell({ catalog, seed }: { catalog: Catalog; seed: CustomerSeed }) {
  const app = useAppState(catalog, seed);
  return <AppProvider value={app}><Phone /></AppProvider>;
}

/**
 * Round ↑ button at the bottom corner. Shows after about two screens of scrolling and fades out
 * near the top. Jumps most of the way at once, then glides the last screen (smooth-scrolling
 * through hundreds of photos would be slow).
 */
function BackToTop({ el, aboveTabs }: { el: React.RefObject<HTMLDivElement | null>; aboveTabs?: boolean }) {
  const a = useApp();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const s = el.current;
    if (!s) return;
    const on = () => setShow(s.scrollTop > s.clientHeight * 2);
    on();
    s.addEventListener('scroll', on, { passive: true });
    return () => s.removeEventListener('scroll', on);
  }, [el]);
  const up = () => {
    const s = el.current;
    if (!s) return;
    if (s.scrollTop > s.clientHeight) s.scrollTop = s.clientHeight;
    s.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div style={{ position: 'absolute', bottom: aboveTabs ? 'calc(100px + var(--safe-bottom))' : 'calc(24px + var(--safe-bottom))', insetInlineEnd: 16, zIndex: 9, borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-md)',
      opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(12px) scale(0.9)', transition: 'opacity 220ms var(--ease-out), transform 220ms var(--ease-out)', pointerEvents: show ? 'auto' : 'none' }}>
      <IconButton icon="arrow-up" variant="glass" size={44} label={a.t.toTop} onClick={up} />
    </div>
  );
}

function Phone() {
  const a = useApp();
  const { t, ar, top, stack, tab, toast, lang } = a;
  const scrollRef = a.scroller;
  useDragScroll();

  // A story or full-screen photo opens over the screen it was tapped on, which stays put underneath.
  const overlay = top.s === 'story' || top.s === 'photo';
  const base = a.page;

  // A new screen (or wizard step) opens at the top; going Back returns to where that page was left.
  // Content can still be loading (images, more gallery items), so keep nudging for up to a second
  // unless the customer starts scrolling themselves.
  const key = base.s + '|' + (base.id || '') + '|' + (base.cat ?? '') + '|' + tab + '|' + (a.bk?.step ?? '') + '|' + stack.length;
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const want = base.y ?? 0;
    el.scrollTo({ top: want });
    if (!want) return;
    let n = 0, raf = 0;
    const stop = () => cancelAnimationFrame(raf);
    const tick = () => {
      if (Math.abs(el.scrollTop - want) < 2 || ++n > 60) return;
      el.scrollTop = want;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const evs = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    evs.forEach(e => el.addEventListener(e, stop, { once: true, passive: true }));
    return () => { stop(); evs.forEach(e => el.removeEventListener(e, stop)); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const showTabs = stack.length === 1 && TABS.some(x => x.id === top.s);
  const company = top.s === 'company' ? a.idx.co.get(top.id!) : undefined;
  // Company behind the menu and directions on the company page.
  const reachCo = company;

  return (
    <div className="mj-root">
      <div className="mj-frame" dir={ar ? 'rtl' : 'ltr'} lang={lang}>
        <div className="mj-status" dir="ltr" style={{ color: top.s === 'home' || overlay ? '#fff' : 'var(--text-primary)' }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 6 }}><Icon name="signal" size={16} /><Icon name="wifi" size={16} /><Icon name="battery-full" size={18} /></span>
        </div>
        <div className="mj-s mj-scroll" ref={scrollRef}>
          <ScreenSwitch route={base} />
        </div>
        {/* Long pages (category list and gallery, company page, Explore) get a back-to-top button. */}
        {!overlay && (base.s === 'listing' || base.s === 'company' || base.s === 'explore') && <BackToTop key={key} el={scrollRef} aboveTabs={showTabs} />}
        {top.s === 'story' && <StoryViewer key="story" />}
        {top.s === 'photo' && <PhotoViewer key={top.src + '|' + (top.id ?? top.cat)} />}
        {showTabs && (
          <div style={{ position: 'absolute', insetInline: 0, bottom: 0, zIndex: 10 }}>
            <TabBar items={TABS.map(x => ({ ...x, label: t[x.id] }))} active={tab} onChange={a.setTab} />
          </div>
        )}
        {reachCo && <CompanySheet co={reachCo} />}
        {reachCo && <ReachSheets co={reachCo} />}
        {top.s === 'listing' && <SortSheet />}
        {top.s === 'company' && <ActivitySheet />}
        <LocationSheet />
        <AuthSheet />
        {toast && (
          <div style={{ position: 'absolute', insetInline: 16, bottom: showTabs ? 'calc(88px + var(--safe-bottom))' : 'calc(104px + var(--safe-bottom))', zIndex: 60 }}>
            <Toast message={toast.msg} tone={toast.tone} />
          </div>
        )}
      </div>
      <DemoPanel />
    </div>
  );
}

function ScreenSwitch({ route }: { route: Route }) {
  switch (route.s) {
    case 'home': return <Home />;
    case 'categories': return <Categories />;
    case 'explore': return <Explore />;
    case 'profile': return <Profile />;
    case 'listing': return <Listing />;
    case 'company': return <CompanyPage />;
    case 'service': return <ServicePage />;
    case 'album': return <AlbumPage />;
    case 'booking': return <BookingPage />;
    case 'bkDone': return <DonePage />;
    case 'bookings': return <Bookings />;
    case 'notifs': return <Notifications />;
    case 'story': case 'photo': return null;
  }
}

/** Desktop-only side panel from the design: language switch and screen shortcuts for demos. */
function DemoPanel() {
  const a = useApp();
  const jump = (routes: Route[], tb: RootTab = 'home') => () => a.reset(routes, tb);
  const H: Route = { s: 'home' };
  const jumps: [string, () => void][] = [
    ['Home', jump([H])], ['Categories', jump([{ s: 'categories' }], 'categories')], ['Listing · AC', jump([H, { s: 'listing', cat: 1 }])],
    ['Company profile', jump([H, { s: 'company', id: 'c4' }])], ['Service details', jump([H, { s: 'company', id: 'g1-1', act: 4 }, { s: 'service', id: 'sg1-1-2' }])], ['Album', jump([H, { s: 'album', id: 'a3' }])],
    ['Book site visit', () => { a.reset([H, { s: 'company', id: 'c4' }], 'home'); setTimeout(() => a.startBk('c4'), 0); }],
    ['My bookings', jump([{ s: 'profile' }, { s: 'bookings' }], 'profile')], ['Explore', jump([{ s: 'explore' }], 'explore')],
    ['Profile', jump([{ s: 'profile' }], 'profile')], ['Notifications', jump([H, { s: 'notifs' }])], ['Stories', jump([H, { s: 'story', id: STORIES[0].id }])],
  ];
  return (
    <aside className="mj-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: '800 22px/26px var(--font-sans)', letterSpacing: '-.02em' }}>MUJEEB<span style={{ color: 'var(--brand)' }}>.</span></span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>Customer app · demo data is fictional · source: {dataSource === 'supabase' ? 'Supabase' : 'bundled demo'}</span>
      </div>
      <SegmentedControl options={[{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }]} value={a.lang} onChange={a.setLang} />
      <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 6 }}>Jump to screen</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {jumps.map(([label, go]) => <Chip key={label} size="sm" onClick={go}>{label}</Chip>)}
      </div>
    </aside>
  );
}
