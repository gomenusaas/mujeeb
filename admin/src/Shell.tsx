import { useState } from 'react';
import { Icon, Toast } from './shared/ds';
import type { Refs } from './api';
import { SECTIONS, StateProvider, useA, useAdminState } from './state';
import { Overview } from './screens/Overview';
import { Companies } from './screens/Companies';
import { Users } from './screens/Users';
import { Locations } from './screens/Locations';
import { Admins } from './screens/Admins';

export function Shell({ me, refs, onSignOut }: { me: { id: string; email: string }; refs: Refs; onSignOut: () => void }) {
  const state = useAdminState(refs, me);
  return <StateProvider value={state}><Layout onSignOut={onSignOut} /></StateProvider>;
}

function Layout({ onSignOut }: { onSignOut: () => void }) {
  const a = useA();
  const { t, section, toast } = a;
  const [drawer, setDrawer] = useState(false);
  return (
    <div className="pv-shell">
      <aside className="pv-side"><Nav onSignOut={onSignOut} /></aside>
      <div className="pv-drawer" data-open={drawer}>
        <div className="pv-drawer-scrim" onClick={() => setDrawer(false)} />
        <div className="pv-drawer-panel"><Nav onSignOut={onSignOut} onPick={() => setDrawer(false)} /></div>
      </div>
      <div className="pv-main">
        <header className="pv-top">
          <button type="button" onClick={() => setDrawer(true)} aria-label={t.menu}
            style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="menu" size={20} />
          </button>
          <span style={{ flex: 1, font: 'var(--type-title)' }}>{t[SECTIONS.find(s => s.id === section)!.label]}</span>
          <Brand small />
        </header>
        <main className="pv-page" key={section}>
          {section === 'overview' && <Overview />}
          {section === 'companies' && <Companies />}
          {section === 'users' && <Users />}
          {section === 'locations' && <Locations />}
          {section === 'admins' && <Admins />}
        </main>
      </div>
      {toast && (
        <div style={{ position: 'fixed', zIndex: 90, bottom: 'calc(20px + var(--safe-bottom))', insetInline: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Toast message={toast.msg} tone={toast.tone} style={{ maxWidth: 440, width: '100%' }} />
        </div>
      )}
    </div>
  );
}

const Brand = ({ small }: { small?: boolean }) => (
  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
    <span style={{ font: small ? '800 18px/22px var(--font-sans)' : '800 22px/26px var(--font-sans)' }}>مجيب<span style={{ color: 'var(--brand)' }}>.</span></span>
    <span style={{ padding: '2px 8px', borderRadius: 999, background: '#1f1a2e', color: '#fff', font: '700 11px/18px var(--font-sans)' }}>ADMIN</span>
  </span>
);

function Nav({ onSignOut, onPick }: { onSignOut: () => void; onPick?: () => void }) {
  const a = useA();
  const { t, section, go } = a;
  return (
    <>
      <div style={{ padding: '0 6px' }}><Brand /></div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SECTIONS.map(s => (
          <button key={s.id} type="button" className="pv-nav-item" aria-current={section === s.id ? 'page' : undefined} onClick={() => { go(s.id); onPick?.(); }}>
            <Icon name={s.icon} size={20} />
            <span style={{ flex: 1 }}>{t[s.label]}</span>
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <span dir="ltr" style={{ padding: '4px 12px 8px', font: 'var(--type-caption)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }}>{a.me.email}</span>
        <button type="button" className="pv-nav-item" onClick={() => a.setLang(a.ar ? 'en' : 'ar')}><Icon name="languages" size={20} />{t.otherLang}</button>
        <button type="button" className="pv-nav-item" onClick={onSignOut}><Icon name="log-out" size={20} />{t.signOut}</button>
      </div>
    </>
  );
}
