import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chip, Icon, SegmentedControl, TabBar, Toast } from './ds';
import { AppProvider, useApp, useAppState, type RootTab, type Route } from './app/store';
import { dataSource, loadCatalog, loadCustomerSeed } from './data/api';
import type { Catalog, CustomerSeed } from './data/types';
import { STR } from './i18n/strings';
import { useDragScroll } from './app/useDragScroll';
import { Categories, Explore, Home } from './screens/Discover';
import { AlbumPage, CompanyPage, CompanySheet, Listing, ServicePage, SortSheet } from './screens/Provider';
import { BookingPage, DonePage, RfqPage } from './screens/Flows';
import { StoryViewer } from './screens/Stories';
import { STORIES } from './data/stories';
import { Bookings, ChatPage, Favorites, Messages, Notifications, Profile, QuotePage, Quotes } from './screens/Account';

const TABS: { id: RootTab; icon: string }[] = [
  { id: 'home', icon: 'house' }, { id: 'categories', icon: 'layout-grid' }, { id: 'explore', icon: 'compass' },
  { id: 'messages', icon: 'message-circle' }, { id: 'profile', icon: 'user-round' },
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

function Phone() {
  const a = useApp();
  const { t, ar, top, stack, tab, chats, toast, lang } = a;
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragScroll();

  // A story opens over the screen it was tapped on, which stays put underneath.
  const base = top.s === 'story' ? stack[stack.length - 2] ?? { s: 'home' } : top;

  // Every new screen (or wizard step) opens at the top.
  const key = base.s + '|' + (base.id || '') + '|' + (base.cat ?? '') + '|' + tab + '|' + (a.rfq?.step ?? '') + '|' + (a.bk?.step ?? '');
  useLayoutEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [key]);

  const unread = Object.values(chats).reduce((n, c) => n + (c.unread || 0), 0);
  const showTabs = stack.length === 1 && TABS.some(x => x.id === top.s);
  const company = top.s === 'company' ? a.idx.co.get(top.id!) : undefined;

  return (
    <div className="mj-root">
      <div className="mj-frame" dir={ar ? 'rtl' : 'ltr'} lang={lang}>
        <div className="mj-status" dir="ltr" style={{ color: top.s === 'home' || top.s === 'story' ? '#fff' : 'var(--text-primary)' }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 6 }}><Icon name="signal" size={16} /><Icon name="wifi" size={16} /><Icon name="battery-full" size={18} /></span>
        </div>
        <div className="mj-s mj-scroll" ref={scrollRef}>
          <ScreenSwitch route={base} scrollRef={scrollRef} />
        </div>
        {top.s === 'story' && <StoryViewer key={top.id} />}
        {showTabs && (
          <div style={{ position: 'absolute', insetInline: 0, bottom: 0, zIndex: 10 }}>
            <TabBar items={TABS.map(x => ({ ...x, label: t[x.id], badge: x.id === 'messages' && unread ? String(unread) : undefined }))} active={tab} onChange={a.setTab} />
          </div>
        )}
        {company && <CompanySheet co={company} />}
        {top.s === 'listing' && <SortSheet />}
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

function ScreenSwitch({ route, scrollRef }: { route: Route; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  switch (route.s) {
    case 'home': return <Home />;
    case 'categories': return <Categories />;
    case 'explore': return <Explore />;
    case 'messages': return <Messages />;
    case 'profile': return <Profile />;
    case 'listing': return <Listing />;
    case 'company': return <CompanyPage />;
    case 'service': return <ServicePage />;
    case 'album': return <AlbumPage />;
    case 'rfq': return <RfqPage />;
    case 'rfqDone': return <DonePage kind="rfq" />;
    case 'booking': return <BookingPage />;
    case 'bkDone': return <DonePage kind="bk" />;
    case 'chat': return <ChatPage scrollEl={scrollRef} />;
    case 'quotes': return <Quotes />;
    case 'quote': return <QuotePage />;
    case 'bookings': return <Bookings />;
    case 'favs': return <Favorites />;
    case 'notifs': return <Notifications />;
    case 'story': return null;
  }
}

/** Desktop-only side panel from the design: language switch and screen shortcuts for demos. */
function DemoPanel() {
  const a = useApp();
  const jump = (routes: Route[], tb: RootTab = 'home') => () => a.reset(routes, tb);
  const H: Route = { s: 'home' };
  const jumps: [string, () => void][] = [
    ['Home', jump([H])], ['Categories', jump([{ s: 'categories' }], 'categories')], ['Listing · AC', jump([H, { s: 'listing', cat: 1 }])],
    ['Company profile', jump([H, { s: 'company', id: 'c4' }])], ['Service details', jump([H, { s: 'service', id: 's7' }])], ['Album', jump([H, { s: 'album', id: 'a3' }])],
    ['Get quotation', () => { a.reset([H, { s: 'company', id: 'c4' }], 'home'); setTimeout(() => a.startRfq('c4', 's7'), 0); }],
    ['Book site visit', () => { a.reset([H, { s: 'company', id: 'c4' }], 'home'); setTimeout(() => a.startBk('c4'), 0); }],
    ['Messages', jump([{ s: 'messages' }], 'messages')], ['Chat', jump([{ s: 'messages' }, { s: 'chat', id: 'c4' }], 'messages')],
    ['My quotations', jump([{ s: 'profile' }, { s: 'quotes' }], 'profile')], ['Received quotation', jump([{ s: 'profile' }, { s: 'quotes' }, { s: 'quote', id: 'MJB-RFQ-000121' }], 'profile')],
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
