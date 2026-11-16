import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { repoPromise, type Category, type Company, type Location, type Repo } from './data';
import { strings } from './i18n';
import { Login, RegisterCompany, SetPassword } from './screens/Auth';
import { Approvals } from './screens/Admin';
import { DeleteAccount } from './Shell';
import { Button, Toast } from './shared/ds';
import { Shell } from './Shell';

const lang = (() => { try { return JSON.parse(localStorage.getItem('mujeeb.provider.v1') || '{}').lang === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } })();
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

type Refs = { categories: Category[]; locations: Location[] };

type Boot =
  | { s: 'loading' }
  | { s: 'login' }
  | { s: 'recover' }
  | { s: 'register'; email: string; refs: Refs }
  | { s: 'admin'; email: string; refs: Refs }
  | { s: 'ready'; email: string; company: Company; refs: Refs; isAdmin: boolean }
  | { s: 'error'; msg: string };

function Root() {
  const [repo, setRepo] = useState<Repo | null>(null);
  const [boot, setBoot] = useState<Boot>({ s: 'loading' });
  const t = strings(document.documentElement.lang !== 'en');

  const start = useCallback(async (r: Repo) => {
    try {
      if (r.recovering()) return setBoot({ s: 'recover' });
      const email = await r.session();
      if (!email) return setBoot({ s: 'login' });
      const [ids, refs, isAdmin] = await Promise.all([r.myCompanyIds(), r.refs(), r.isAdmin().catch(() => false)]);
      // No company yet: a new sign-up fills in its company; an admin without a company gets the Approvals page.
      if (!ids.length) return setBoot({ s: isAdmin ? 'admin' : 'register', email, refs });
      const company = await r.company(ids[0]);
      setBoot({ s: 'ready', email, company, refs, isAdmin });
    } catch (e) { setBoot({ s: 'error', msg: String((e as Error)?.message || e) }); }
  }, []);

  useEffect(() => { repoPromise.then(r => { setRepo(r); start(r); }); }, [start]);

  if (!repo || boot.s === 'loading') return <Splash>{t.brand}</Splash>;
  if (boot.s === 'error') return <Splash>{boot.msg}</Splash>;
  if (boot.s === 'login') return <Login repo={repo} onDone={() => start(repo)} />;
  if (boot.s === 'recover') return <SetPassword repo={repo} onDone={() => start(repo)} />;
  const signOut = async () => { await repo.signOut(); start(repo); };
  if (boot.s === 'register') return <RegisterCompany repo={repo} email={boot.email} refs={boot.refs} onDone={() => start(repo)} onSignOut={signOut} />;
  if (boot.s === 'admin') return <AdminHome repo={repo} email={boot.email} refs={boot.refs} onRegister={() => setBoot({ s: 'register', email: boot.email, refs: boot.refs })} onSignOut={signOut} onDeleted={() => start(repo)} />;
  return <Shell repo={repo} email={boot.email} company={boot.company} refs={boot.refs} isAdmin={boot.isAdmin} onSignOut={signOut} />;
}

/** An admin account with no company of its own: just the Approvals page. */
function AdminHome({ repo, email, refs, onRegister, onSignOut, onDeleted }: { repo: Repo; email: string; refs: Refs; onRegister: () => void; onSignOut: () => void; onDeleted: () => void }) {
  const [ar, setAr] = useState(document.documentElement.lang !== 'en');
  const t = strings(ar);
  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);
  const show = (msg: string, tone = 'success') => { setToast({ msg, tone }); setTimeout(() => setToast(null), 2600); };
  const flip = () => { const n = !ar; document.documentElement.lang = n ? 'ar' : 'en'; document.documentElement.dir = n ? 'rtl' : 'ltr'; try { localStorage.setItem('mujeeb.provider.v1', JSON.stringify({ lang: n ? 'ar' : 'en' })); } catch { /* storage unavailable */ } setAr(n); };
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-app)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '14px 20px', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ font: '800 22px/26px var(--font-sans)' }}>{t.brand}<span style={{ color: 'var(--brand)' }}>.</span></span>
        <span style={{ flex: 1, font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{t.adminTag} · <span dir="ltr">{email}</span></span>
        <Button size="sm" variant="outline" onClick={flip}>{t.otherLang}</Button>
        <Button size="sm" variant="outline" iconLeft="building-2" onClick={onRegister}>{t.createCompanyAccount}</Button>
        <Button size="sm" variant="outline" iconLeft="log-out" onClick={onSignOut}>{t.signOut}</Button>
      </header>
      <main className="pv-page" style={{ maxWidth: 980, margin: '0 auto' }}>
        <Approvals repo={repo} t={t} ar={ar} refs={refs} toast={show} />
        <div style={{ alignSelf: 'flex-start' }}><DeleteAccount repo={repo} t={t} onDeleted={onDeleted} /></div>
      </main>
      {toast && <div style={{ position: 'fixed', zIndex: 90, bottom: 20, insetInline: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}><Toast message={toast.msg} tone={toast.tone} style={{ maxWidth: 420, width: '100%' }} /></div>}
    </div>
  );
}

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand)', color: '#fff', font: '800 28px var(--font-sans)', padding: 24, textAlign: 'center' }}>
      {children}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>);
