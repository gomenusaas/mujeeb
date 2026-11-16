import { useState, type ReactNode } from 'react';
import { Button, EmptyState } from '../shared/ds';
import type { Repo } from '../data';
import { strings } from '../i18n';
import { Field } from '../ui';

/* Sign-in screens run before the dashboard state exists, so they read the language from <html lang>. */
function useLang() {
  const [ar, setAr] = useState(document.documentElement.lang !== 'en');
  const flip = () => {
    const next = !ar;
    document.documentElement.lang = next ? 'ar' : 'en';
    document.documentElement.dir = next ? 'rtl' : 'ltr';
    try { localStorage.setItem('mujeeb.provider.v1', JSON.stringify({ lang: next ? 'ar' : 'en' })); } catch { /* storage unavailable */ }
    setAr(next);
  };
  return { ar, t: strings(ar), flip };
}

function Frame({ children, flip, other }: { children: ReactNode; flip: () => void; other: string }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(160deg, var(--violet-600), var(--violet-800, #2a1670))' }}>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 18, padding: '30px 26px', borderRadius: 26, background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: '800 24px/28px var(--font-sans)' }}>مجيب<span style={{ color: 'var(--brand)' }}>.</span></span>
          <button type="button" onClick={flip} style={{ height: 34, padding: '0 12px', borderRadius: 999, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', font: '700 13px var(--font-sans)' }}>{other}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Login({ repo, onDone }: { repo: Repo; onDone: () => void }) {
  const { t, flip } = useLang();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const submit = async () => {
    if (!email.trim() || !pw) return;
    setBusy(true); setMsg(null);
    const ok = await repo.signIn(email.trim(), pw).catch(() => false);
    setBusy(false);
    if (ok) onDone(); else setMsg({ text: t.badLogin, bad: true });
  };
  const forgot = async () => {
    if (!email.trim()) return setMsg({ text: t.enterEmail, bad: true });
    await repo.sendReset(email.trim()).catch(() => {});
    setMsg({ text: t.resetSent, bad: false });
  };
  return (
    <Frame flip={flip} other={t.otherLang}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--type-h2)' }}>{t.signInTitle}</span>
        <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.signInSub}</span>
      </div>
      <form onSubmit={e => { e.preventDefault(); submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label={t.email} type="email" dir="ltr" value={email} onChange={setEmail} placeholder="name@company.om" />
        <Field label={t.password} type="password" dir="ltr" value={pw} onChange={setPw} />
        {msg && <span role="status" style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: msg.bad ? 'var(--danger)' : 'var(--success)' }}>{msg.text}</span>}
        <Button size="lg" fullWidth loading={busy} onClick={submit}>{t.signIn}</Button>
        <button type="submit" hidden />
        <button type="button" onClick={forgot} style={{ alignSelf: 'center', border: 'none', background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)' }}>{t.forgot}</button>
      </form>
    </Frame>
  );
}

export function SetPassword({ repo, onDone }: { repo: Repo; onDone: () => void }) {
  const { t, flip } = useLang();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async () => {
    if (pw.length < 8) return setErr(t.passwordShort);
    setBusy(true);
    try { await repo.setPassword(pw); onDone(); } catch { setErr(t.saveFailed); } finally { setBusy(false); }
  };
  return (
    <Frame flip={flip} other={t.otherLang}>
      <span style={{ font: 'var(--type-h2)' }}>{t.newPassword}</span>
      <Field label={t.password} type="password" dir="ltr" value={pw} onChange={v => { setPw(v); setErr(''); }} help={t.passwordShort} error={err || undefined} />
      <Button size="lg" fullWidth loading={busy} onClick={save}>{t.setPassword}</Button>
    </Frame>
  );
}

export function NoCompany({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const { t, flip } = useLang();
  return (
    <Frame flip={flip} other={t.otherLang}>
      <EmptyState icon="building-2" title={t.noCompany} body={t.noCompanyBody} style={{ padding: '8px 0' }} />
      <span dir="ltr" style={{ alignSelf: 'center', font: 'var(--type-body-sm)', color: 'var(--text-tertiary)' }}>{email}</span>
      <Button variant="outline" fullWidth iconLeft="log-out" onClick={onSignOut}>{t.signOut}</Button>
    </Frame>
  );
}
