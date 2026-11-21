import { useEffect, useRef, useState } from 'react';
import { BottomSheet, Button, TextField } from '../ds';
import { useApp } from '../app/store';
import { auth, type AuthError } from '../data/api';
import type { T } from '../i18n/strings';

/*
 * Customer sign-in sheet. Opens when a signed-out customer taps Favorite or Follow, or from the
 * Profile tab. Google sign-in on top, then email + password; plus create account, forgot password,
 * and "choose a new password" after opening the reset link from the email.
 */

const ERR: Record<AuthError, keyof T> = {
  badLogin: 'errBadLogin', emailTaken: 'errEmailTaken', notConfirmed: 'errNotConfirmed', weakPassword: 'errWeakPassword',
  badEmail: 'errBadEmail', tooMany: 'errTooMany', emailNotAllowed: 'errEmailNotAllowed', failed: 'errFailed',
};

export function AuthSheet() {
  const a = useApp();
  const { t, authStep: step, setAuthStep } = a;
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [note, setNote] = useState<'checkEmail' | 'resetSent' | null>(null);
  const open = !!step;

  // Each step starts clean (the email is kept, so "forgot password" doesn't make them type it again).
  const go = (s: typeof step) => { setErr(''); setNote(null); setPw(''); setAuthStep(s); };
  const fail = (e?: AuthError) => setErr(e ? String(t[ERR[e]]) : '');
  const done = () => { setPw(''); setName(''); setErr(''); a.setAuthStep(null); a.showToast(String(t.signedInT)); };

  const submit = async () => {
    setErr('');
    if (step === 'reset') {
      if (!email.trim()) return setErr(String(t.errFields));
      setBusy(true); const e = await auth.sendReset(email); setBusy(false);
      return e ? fail(e) : setNote('resetSent');
    }
    if (step === 'newpw') {
      if (pw.length < 8) return fail('weakPassword');
      setBusy(true); const e = await auth.setPassword(pw); setBusy(false);
      if (e) return fail(e);
      setPw(''); a.setAuthStep(null); a.showToast(String(t.pwSaved)); return;
    }
    if (!email.trim() || !pw || (step === 'signup' && !name.trim())) return setErr(String(t.errFields));
    setBusy(true);
    if (step === 'signup') {
      if (pw.length < 8) { setBusy(false); return fail('weakPassword'); }
      const r = await auth.signUp(email, pw, name);
      setBusy(false);
      if (r.error) return fail(r.error);
      if (r.confirm) { setPw(''); setNote('checkEmail'); return; }
      return done();
    }
    const e = await auth.signIn(email, pw);
    setBusy(false);
    return e ? fail(e) : done();
  };

  const title = step === 'signup' ? t.createAccount : step === 'reset' ? t.resetTitle : step === 'newpw' ? t.newPwTitle : t.signIn;
  const link = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--brand)' }}>{label}</button>
  );
  const muted = { font: 'var(--type-body-sm)', color: 'var(--text-secondary)', margin: 0 } as const;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 55, pointerEvents: 'none' }}>
      <BottomSheet open={open} onClose={a.closeAuth} title={title}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 20px calc(24px + var(--safe-bottom))' }}>
          {note ? (
            <>
              <p style={muted}>{note === 'checkEmail' ? t.checkEmailBody : t.resetSent}</p>
              <Button variant="secondary" fullWidth onClick={() => go('signin')}>{t.backToSignIn}</Button>
            </>
          ) : (
            <>
              {(step === 'signin' || step === 'signup') && <p style={muted}>{step === 'signup' ? t.signUpWhy : t.signInWhy}</p>}
              {step === 'reset' && <p style={muted}>{t.resetBody}</p>}
              {(step === 'signin' || step === 'signup') && auth.googleClientId && open && (
                <>
                  <GoogleButton onError={() => fail('failed')} onDone={done} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-tertiary)', font: 'var(--type-caption)' }}>
                    <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />{t.orWord}<span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                  </div>
                </>
              )}
              {step === 'signup' && <TextField label={t.yourName} value={name} onChange={setName} icon="user-round" />}
              {step !== 'newpw' && <TextField label={t.email} type="email" value={email} onChange={setEmail} icon="mail" />}
              {step !== 'reset' && (
                <TextField label={step === 'newpw' ? t.newPwTitle : t.password} type="password" value={pw} onChange={setPw} icon="lock"
                  helper={step === 'signup' || step === 'newpw' ? t.pwHint : undefined} />
              )}
              {err && <p role="alert" style={{ ...muted, color: 'var(--danger)', fontWeight: 'var(--fw-semibold)' }}>{err}</p>}
              <Button fullWidth loading={busy} onClick={submit}>
                {step === 'signup' ? t.createAccount : step === 'reset' ? t.sendLink : step === 'newpw' ? t.savePw : t.signIn}
              </Button>
              {step === 'signin' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  {link(String(t.forgotPw), () => go('reset'))}
                  <span style={muted}>{t.noAccount} {link(String(t.createAccount), () => go('signup'))}</span>
                </div>
              )}
              {step === 'signup' && <span style={{ ...muted, textAlign: 'center' }}>{t.haveAccount} {link(String(t.signIn), () => go('signin'))}</span>}
              {step === 'reset' && <div style={{ textAlign: 'center' }}>{link(String(t.backToSignIn), () => go('signin'))}</div>}
              {step === 'signup' && <p style={{ ...muted, font: 'var(--type-caption)', textAlign: 'center' }}>{t.termsNote}</p>}
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

/* ───────────── Google sign-in (Google Identity Services) ───────────── */

interface GoogleId {
  initialize(o: { client_id: string; callback: (r: { credential: string }) => void; nonce: string; use_fedcm_for_prompt?: boolean; itp_support?: boolean }): void;
  renderButton(el: HTMLElement, o: Record<string, string | number>): void;
  prompt(): void;
  cancel(): void;
}
declare global { interface Window { google?: { accounts: { id: GoogleId } } } }

let gsi: Promise<GoogleId> | null = null;
function loadGoogle(): Promise<GoogleId> {
  return gsi ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => (window.google ? resolve(window.google.accounts.id) : reject(new Error('gsi')));
    s.onerror = () => { gsi = null; reject(new Error('gsi')); };
    document.head.appendChild(s);
  });
}

/** A random nonce for Supabase, and its SHA-256 (hex) for Google, so the ID token can't be replayed. */
async function makeNonce() {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))));
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return { raw, hashed: [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('') };
}

/** Google's own "Continue with Google" button, plus the One Tap prompt when Google offers it. */
function GoogleButton({ onDone, onError }: { onDone: () => void; onError: () => void }) {
  const { ar } = useApp();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    let g: GoogleId | null = null;
    (async () => {
      try {
        const [id, n] = await Promise.all([loadGoogle(), makeNonce()]);
        if (!live || !box.current) return;
        g = id;
        id.initialize({
          client_id: auth.googleClientId, nonce: n.hashed, use_fedcm_for_prompt: true, itp_support: true,
          callback: async r => { if (await auth.google(r.credential, n.raw)) onError(); else onDone(); },
        });
        id.renderButton(box.current, { type: 'standard', theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', logo_alignment: 'center', width: Math.min(360, box.current.clientWidth || 320), locale: ar ? 'ar' : 'en' });
        id.prompt();
      } catch { if (live) onError(); }
    })();
    return () => { live = false; g?.cancel(); };
  }, [ar]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={box} style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }} />;
}
