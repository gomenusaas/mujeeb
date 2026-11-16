import { useState, type ReactNode } from 'react';
import { Button, EmptyState } from '../shared/ds';
import { api } from '../api';
import { strings } from '../i18n';
import { readLang, saveLang } from '../state';
import { Field } from '../ui';

/* Sign-in screens run before the admin state exists. No sign-up here: admins are added by another admin. */
function useLang() {
  const [ar, setAr] = useState(readLang() === 'ar');
  const flip = () => { saveLang(ar ? 'en' : 'ar'); setAr(!ar); };
  return { t: strings(ar), flip };
}

function Frame({ children, flip, other }: { children: ReactNode; flip: () => void; other: string }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(160deg, #2a2440, #141120)' }}>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 18, padding: '30px 26px', borderRadius: 26, background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ font: '800 24px/28px var(--font-sans)' }}>مجيب<span style={{ color: 'var(--brand)' }}>.</span></span>
            <span style={{ padding: '2px 8px', borderRadius: 999, background: '#1f1a2e', color: '#fff', font: '700 11px/18px var(--font-sans)' }}>ADMIN</span>
          </span>
          <button type="button" onClick={flip} style={{ height: 34, padding: '0 12px', borderRadius: 999, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', font: '700 13px var(--font-sans)' }}>{other}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SignIn({ onDone }: { onDone: () => void }) {
  const { t, flip } = useLang();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const submit = async () => {
    if (!email.trim() || !pw) return setMsg({ text: t.required, bad: true });
    setBusy(true); setMsg(null);
    const r = await api.signIn(email.trim(), pw).catch(() => 'bad' as const);
    setBusy(false);
    if (r === 'ok') onDone(); else setMsg({ text: r === 'unconfirmed' ? t.unconfirmed : t.badLogin, bad: true });
  };
  const forgot = async () => {
    if (!email.trim()) return setMsg({ text: t.enterEmail, bad: true });
    await api.sendReset(email.trim()).catch(() => {});
    setMsg({ text: t.resetSent, bad: false });
  };
  return (
    <Frame flip={flip} other={t.otherLang}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--type-h2)' }}>{t.signInTitle}</span>
        <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.signInSub}</span>
      </div>
      <form onSubmit={e => { e.preventDefault(); submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label={t.email} type="email" dir="ltr" value={email} onChange={setEmail} />
        <Field label={t.password} type="password" dir="ltr" value={pw} onChange={setPw} />
        {msg && <span role="status" style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: msg.bad ? 'var(--danger)' : 'var(--success)' }}>{msg.text}</span>}
        <Button size="lg" fullWidth loading={busy} onClick={submit}>{t.signIn}</Button>
        <button type="submit" hidden />
        <button type="button" onClick={forgot} style={{ alignSelf: 'center', border: 'none', background: 'none', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)' }}>{t.forgot}</button>
      </form>
    </Frame>
  );
}

export function SetPassword({ onDone }: { onDone: () => void }) {
  const { t, flip } = useLang();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async () => {
    if (pw.length < 8) return setErr(t.passwordShort);
    setBusy(true);
    try { await api.setPassword(pw); onDone(); } catch { setErr(t.failed); } finally { setBusy(false); }
  };
  return (
    <Frame flip={flip} other={t.otherLang}>
      <span style={{ font: 'var(--type-h2)' }}>{t.newPassword}</span>
      <Field label={t.password} type="password" dir="ltr" value={pw} onChange={v => { setPw(v); setErr(''); }} help={t.passwordShort} error={err || undefined} />
      <Button size="lg" fullWidth loading={busy} onClick={save}>{t.setPassword}</Button>
    </Frame>
  );
}

export function NotAdmin({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const { t, flip } = useLang();
  return (
    <Frame flip={flip} other={t.otherLang}>
      <EmptyState icon="shield-check" title={t.notAdmin} body={t.notAdminBody} style={{ padding: '8px 0' }} />
      <span dir="ltr" style={{ alignSelf: 'center', font: 'var(--type-body-sm)', color: 'var(--text-tertiary)' }}>{email}</span>
      <Button variant="outline" fullWidth iconLeft="log-out" onClick={onSignOut}>{t.signOut}</Button>
    </Frame>
  );
}
