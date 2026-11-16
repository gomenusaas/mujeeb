import { useState, type ReactNode } from 'react';
import { Button } from '../shared/ds';
import type { Category, Location, Repo } from '../data';
import { strings } from '../i18n';
import { Field, Select } from '../ui';

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

export function Frame({ children, flip, other, wide }: { children: ReactNode; flip: () => void; other: string; wide?: boolean }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(160deg, var(--violet-600), var(--violet-800, #2a1670))' }}>
      <div style={{ width: '100%', maxWidth: wide ? 560 : 420, display: 'flex', flexDirection: 'column', gap: 18, padding: '30px 26px', borderRadius: 26, background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: '800 24px/28px var(--font-sans)' }}>مجيب<span style={{ color: 'var(--brand)' }}>.</span></span>
          <button type="button" onClick={flip} style={{ height: 34, padding: '0 12px', borderRadius: 999, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', font: '700 13px var(--font-sans)' }}>{other}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const linkBtn = { border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)' } as const;
const Msg = ({ text, bad }: { text: string; bad: boolean }) => (
  <span role="status" style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: bad ? 'var(--danger)' : 'var(--success)' }}>{text}</span>
);

/** Sign in, or create a company account (then the company form follows). */
export function Login({ repo, onDone }: { repo: Repo; onDone: () => void }) {
  const { t, flip } = useLang();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const up = mode === 'up';
  const submit = async () => {
    if (!email.trim() || !pw || (up && !name.trim())) return setMsg({ text: t.required, bad: true });
    setMsg(null);
    if (up) {
      if (pw.length < 8) return setMsg({ text: t.passwordShort, bad: true });
      setBusy(true);
      const r = await repo.signUp(email.trim(), pw, name.trim()).catch(() => ({ error: 'failed' as const, confirm: false }));
      setBusy(false);
      if (r.error) return setMsg({ text: r.error === 'taken' ? t.emailTaken : r.error === 'weak' ? t.passwordShort : r.error === 'email' ? t.badEmail : t.failed, bad: true });
      if (r.confirm) { setMode('in'); setPw(''); return setMsg({ text: t.checkEmail, bad: false }); }
      return onDone();
    }
    setBusy(true);
    const r = await repo.signIn(email.trim(), pw).catch(() => 'bad' as const);
    setBusy(false);
    if (r === 'ok') onDone(); else setMsg({ text: r === 'unconfirmed' ? t.unconfirmed : t.badLogin, bad: true });
  };
  const forgot = async () => {
    if (!email.trim()) return setMsg({ text: t.enterEmail, bad: true });
    await repo.sendReset(email.trim()).catch(() => {});
    setMsg({ text: t.resetSent, bad: false });
  };
  const flipMode = () => { setMode(up ? 'in' : 'up'); setMsg(null); setPw(''); };
  return (
    <Frame flip={flip} other={t.otherLang}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--type-h2)' }}>{up ? t.signUpTitle : t.signInTitle}</span>
        <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{up ? t.signUpSub : t.signInSub}</span>
      </div>
      <form onSubmit={e => { e.preventDefault(); submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {up && <Field label={t.yourName} value={name} onChange={setName} />}
        <Field label={t.email} type="email" dir="ltr" value={email} onChange={setEmail} placeholder="name@company.om" />
        <Field label={t.password} type="password" dir="ltr" value={pw} onChange={setPw} help={up ? t.passwordShort : undefined} />
        {msg && <Msg {...msg} />}
        <Button size="lg" fullWidth loading={busy} onClick={submit}>{up ? t.createAccount : t.signIn}</Button>
        <button type="submit" hidden />
        {!up && <button type="button" onClick={forgot} style={{ ...linkBtn, alignSelf: 'center' }}>{t.forgot}</button>}
      </form>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid var(--border-subtle)', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
        {up ? t.haveAccount : t.newHere}
        <button type="button" onClick={flipMode} style={linkBtn}>{up ? t.signIn : t.createCompanyAccount}</button>
      </div>
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

/**
 * After sign-up: the company's basic details. Creates the company (pending review) and makes this
 * account its owner. Everything else (cover, logo, services, projects) is added in the dashboard.
 */
export function RegisterCompany({ repo, email, refs, onDone, onSignOut }: {
  repo: Repo; email: string; refs: { categories: Category[]; locations: Location[] }; onDone: () => void; onSignOut: () => void;
}) {
  const { ar, t, flip } = useLang();
  const [f, setF] = useState({ name_ar: '', name_en: '', phone: '+968 ', governorate: refs.locations[0]?.id || 'muscat', city_ar: '', city_en: '' });
  const [cats, setCats] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (v: string) => setF(o => ({ ...o, [k]: v }));
  const pick = (a: string, b: string) => (ar ? a : b);
  const req = (v: string) => (tried && !v.trim() ? t.required : undefined);
  const phoneOk = f.phone.replace(/\D/g, '').length >= 8;
  const toggle = (id: number) => setCats(c => (c.includes(id) ? c.filter(x => x !== id) : c.length < 3 ? [...c, id] : c));
  const submit = async () => {
    setTried(true); setErr('');
    if (!f.name_ar.trim() || !f.name_en.trim() || !phoneOk || !f.city_ar.trim() || !f.city_en.trim() || !cats.length) return setErr(t.required);
    setBusy(true);
    try { await repo.registerCompany({ ...f, categories: cats }); onDone(); } catch { setErr(t.failed); } finally { setBusy(false); }
  };
  return (
    <Frame flip={flip} other={t.otherLang} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--type-h2)' }}>{t.regTitle}</span>
        <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.regSub}</span>
      </div>
      <div className="pv-grid-2">
        <Field label={t.nameAr} dir="rtl" value={f.name_ar} onChange={set('name_ar')} error={req(f.name_ar)} />
        <Field label={t.nameEn} dir="ltr" value={f.name_en} onChange={set('name_en')} error={req(f.name_en)} />
        <Field label={t.phone} dir="ltr" type="tel" value={f.phone} onChange={set('phone')} help={t.phoneHelp} error={tried && !phoneOk ? t.required : undefined} />
        <Select label={t.governorate} value={f.governorate} onChange={set('governorate')} options={refs.locations.map(l => ({ value: l.id, label: pick(l.name_ar, l.name_en) }))} />
        <Field label={t.cityAr} dir="rtl" value={f.city_ar} onChange={set('city_ar')} error={req(f.city_ar)} />
        <Field label={t.cityEn} dir="ltr" value={f.city_en} onChange={set('city_en')} error={req(f.city_en)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.categories}</span>
          <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: tried && !cats.length ? 'var(--danger)' : 'var(--text-tertiary)' }}>{t.pickCats}</span>
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {refs.categories.map(c => {
            const k = cats.indexOf(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={k >= 0} onClick={() => toggle(c.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer', font: '600 13px var(--font-sans)',
                  border: k >= 0 ? '1.5px solid var(--brand)' : '1px solid var(--border-default)', background: k >= 0 ? 'var(--violet-50, #f3efff)' : 'var(--surface-card)', color: k >= 0 ? 'var(--brand)' : 'var(--text-primary)' }}>
                {k >= 0 && <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--brand)', color: '#fff', font: '700 11px/18px var(--font-sans)', textAlign: 'center' }}>{ar ? '١٢٣'[k] : k + 1}</span>}
                {pick(c.name_ar, c.name_en)}
              </button>
            );
          })}
        </div>
      </div>
      {err && <Msg text={err} bad />}
      <Button size="lg" fullWidth loading={busy} onClick={submit}>{t.submitCompany}</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span dir="ltr" style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{email}</span>
        <button type="button" onClick={onSignOut} style={linkBtn}>{t.signOut}</button>
      </div>
    </Frame>
  );
}
