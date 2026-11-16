import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { repoPromise, type Category, type Company, type Location, type Repo } from './data';
import { strings } from './i18n';
import { Login, NoCompany, SetPassword } from './screens/Auth';
import { Shell } from './Shell';

const lang = (() => { try { return JSON.parse(localStorage.getItem('mujeeb.provider.v1') || '{}').lang === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } })();
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

type Boot =
  | { s: 'loading' }
  | { s: 'login' }
  | { s: 'recover' }
  | { s: 'nocompany'; email: string }
  | { s: 'ready'; email: string; company: Company; refs: { categories: Category[]; locations: Location[] } }
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
      const ids = await r.myCompanyIds();
      if (!ids.length) return setBoot({ s: 'nocompany', email });
      const [company, refs] = await Promise.all([r.company(ids[0]), r.refs()]);
      setBoot({ s: 'ready', email, company, refs });
    } catch (e) { setBoot({ s: 'error', msg: String((e as Error)?.message || e) }); }
  }, []);

  useEffect(() => { repoPromise.then(r => { setRepo(r); start(r); }); }, [start]);

  if (!repo || boot.s === 'loading') return <Splash>{t.brand}</Splash>;
  if (boot.s === 'error') return <Splash>{boot.msg}</Splash>;
  if (boot.s === 'login') return <Login repo={repo} onDone={() => start(repo)} />;
  if (boot.s === 'recover') return <SetPassword repo={repo} onDone={() => start(repo)} />;
  if (boot.s === 'nocompany') return <NoCompany email={boot.email} onSignOut={async () => { await repo.signOut(); start(repo); }} />;
  return <Shell repo={repo} email={boot.email} company={boot.company} refs={boot.refs} onSignOut={async () => { await repo.signOut(); start(repo); }} />;
}

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand)', color: '#fff', font: '800 28px var(--font-sans)', padding: 24, textAlign: 'center' }}>
      {children}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>);
