import { StrictMode, useCallback, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { api, sb, type Refs } from './api';
import { readLang, saveLang } from './state';
import { strings } from './i18n';
import { NotAdmin, SetPassword, SignIn } from './screens/SignIn';
import { Shell } from './Shell';

saveLang(readLang());

type Boot =
  | { s: 'loading' } | { s: 'signin' } | { s: 'recover' } | { s: 'error'; msg: string }
  | { s: 'notadmin'; email: string }
  | { s: 'ready'; me: { id: string; email: string }; refs: Refs };

function Root() {
  const [boot, setBoot] = useState<Boot>({ s: 'loading' });
  const t = strings(document.documentElement.lang !== 'en');

  const start = useCallback(async () => {
    try {
      if (api.recovering()) return setBoot({ s: 'recover' });
      const user = await api.session();
      if (!user) return setBoot({ s: 'signin' });
      // Only platform admins get in; the database enforces the same rule on every admin function.
      const [admin, refs] = await Promise.all([api.isAdmin(), api.refs()]);
      if (!admin) return setBoot({ s: 'notadmin', email: user.email || '' });
      setBoot({ s: 'ready', me: { id: user.id, email: user.email || '' }, refs });
    } catch (e) { setBoot({ s: 'error', msg: String((e as Error)?.message || e) }); }
  }, []);
  useEffect(() => { if (sb) start(); }, [start]);

  const signOut = async () => { await api.signOut(); start(); };
  if (!sb) return <Splash>{t.needSupabase}</Splash>;
  if (boot.s === 'loading') return <Splash>{t.brand}</Splash>;
  if (boot.s === 'error') return <Splash>{boot.msg}</Splash>;
  if (boot.s === 'signin') return <SignIn onDone={start} />;
  if (boot.s === 'recover') return <SetPassword onDone={start} />;
  if (boot.s === 'notadmin') return <NotAdmin email={boot.email} onSignOut={signOut} />;
  return <Shell me={boot.me} refs={boot.refs} onSignOut={signOut} />;
}

function Splash({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f1a2e', color: '#fff', font: '700 22px/1.5 var(--font-sans)', padding: 24, textAlign: 'center' }}>
      <span style={{ maxWidth: 560 }}>{children}</span>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Root /></StrictMode>);
