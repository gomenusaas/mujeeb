import { useState } from 'react';
import { Avatar, Icon, Toast } from './shared/ds';
import { logoOf, type Category, type Company, type Location, type Repo } from './data';
import { SECTIONS, StateProvider, useP, useProviderState } from './state';
import { Dashboard } from './screens/Dashboard';
import { Branches, Profile } from './screens/Company';
import { Projects, Services } from './screens/Catalog';
import { Stories } from './screens/Stories';

export function Shell({ repo, email, company, refs, onSignOut }: {
  repo: Repo; email: string; company: Company; refs: { categories: Category[]; locations: Location[] }; onSignOut: () => void;
}) {
  const state = useProviderState(repo, company, refs, email);
  return <StateProvider value={state}><Layout onSignOut={onSignOut} /></StateProvider>;
}

function Layout({ onSignOut }: { onSignOut: () => void }) {
  const p = useP();
  const { t, section, toast, repo } = p;
  const [drawer, setDrawer] = useState(false);
  const title = t[SECTIONS.find(s => s.id === section)!.label];
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
            style={{ position: 'relative', width: 40, height: 40, borderRadius: 12, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="menu" size={20} />
          </button>
          <span style={{ flex: 1, minWidth: 0, font: 'var(--type-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          <Avatar name={p.pick(p.company.name_ar, p.company.name_en)} src={logoOf(p.company)} size={34} />
        </header>
        {repo.mode === 'demo' && (
          <div role="note" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: '8px 16px', background: 'var(--warning-tint)', color: 'oklch(0.42 0.1 65)', font: 'var(--type-body-sm)', fontWeight: 600, textAlign: 'center' }}>
            <Icon name="info" size={16} />{t.demoMode}
          </div>
        )}
        <main className="pv-page" key={section}>
          {section === 'dashboard' && <Dashboard />}
          {section === 'profile' && <Profile />}
          {section === 'branches' && <Branches />}
          {section === 'services' && <Services />}
          {section === 'projects' && <Projects />}
          {section === 'stories' && <Stories />}
        </main>
      </div>
      {toast && (
        <div style={{ position: 'fixed', zIndex: 90, bottom: 'calc(20px + var(--safe-bottom))', insetInline: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Toast message={toast.msg} tone={toast.tone} style={{ maxWidth: 420, width: '100%' }} />
        </div>
      )}
    </div>
  );
}

function Nav({ onSignOut, onPick }: { onSignOut: () => void; onPick?: () => void }) {
  const p = useP();
  const { t, company, section, go } = p;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 6px' }}>
        <span style={{ font: '800 22px/26px var(--font-sans)' }}>{t.brand}<span style={{ color: 'var(--brand)' }}>.</span></span>
        <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{t.dashboardTag}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: 'var(--neutral-50)' }}>
        <Avatar name={p.pick(company.name_ar, company.name_en)} src={logoOf(company)} size={44} verified={company.is_verified} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-body-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.pick(company.name_ar, company.name_en)}</span>
          <span style={{ font: 'var(--type-caption)', color: company.is_verified ? 'var(--brand)' : 'var(--text-tertiary)' }}>{company.is_verified ? t.verified : t.notVerified}</span>
        </span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SECTIONS.map(s => (
          <button key={s.id} type="button" className="pv-nav-item" aria-current={section === s.id ? 'page' : undefined} onClick={() => { go(s.id); onPick?.(); }}>
            <Icon name={s.icon} size={20} />
            <span style={{ flex: 1 }}>{t[s.label]}</span>
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <span dir="ltr" style={{ padding: '4px 12px 8px', font: 'var(--type-caption)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }}>{p.email}</span>
        <button type="button" className="pv-nav-item" onClick={() => p.setLang(p.ar ? 'en' : 'ar')}><Icon name="languages" size={20} />{t.otherLang}</button>
        <button type="button" className="pv-nav-item" onClick={onSignOut}><Icon name="log-out" size={20} />{t.signOut}</button>
      </div>
    </>
  );
}
