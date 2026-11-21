import { useState } from 'react';
import { Badge, Button, Chip, Icon, Radio, TextField } from '../ds';
import { useApp, type BookingDraft } from '../app/store';
import { BottomBar, StepBars, TopBar, helpers } from '../app/view';
import { PURPOSES, arDigits } from '../i18n/strings';
import { TIMES } from '../app/dates';
import type { GovId } from '../data/types';

const GOVS: GovId[] = ['muscat', 'batinah', 'dakhiliyah', 'dhofar', 'sharqiyah'];
const col = (gap: number) => ({ display: 'flex', flexDirection: 'column', gap }) as const;
const wrap = { display: 'flex', flexWrap: 'wrap', gap: 8 } as const;
const stepLabel = (ar: boolean, n: number) => (ar ? 'الخطوة ' + arDigits(n + 1) + ' من ٣' : 'Step ' + (n + 1) + ' of 3');

function useSubmit(fn: () => Promise<void>) {
  const [busy, setBusy] = useState(false);
  return [busy, async () => { if (busy) return; setBusy(true); try { await fn(); } finally { setBusy(false); } }] as const;
}

export const Note = ({ icon, color, children }: { icon: string; color: string; children: React.ReactNode }) => (
  <span style={{ display: 'flex', gap: 8, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}><Icon name={icon} size={18} color={color} />{children}</span>
);

export function BookingPage() {
  const a = useApp();
  const { t, ar, bk, setBk, days } = a;
  const h = helpers(a);
  const [busy, submit] = useSubmit(a.submitBooking);
  if (!bk) return null;
  const co = a.idx.co.get(bk.co)!;
  const set = <K extends keyof BookingDraft>(k: K, v: BookingDraft[K]) => setBk(b => (b ? { ...b, [k]: v } : b));
  const d = days[bk.day];
  const p = PURPOSES.find(x => x[0] === bk.purpose)!;
  const ok = [true, !!bk.city.trim(), true][bk.step];
  const next = () => { if (!ok) return; if (bk.step < 2) set('step', bk.step + 1); else submit(); };
  const pickDay = (k: number) => setBk(b => b && ({ ...b, day: k, time: days[k].full.includes(b.time) ? TIMES.find(x => !days[k].full.includes(x))! : b.time }));

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={[t.bkS1, t.bkS2, t.bkS3][bk.step]} subtitle={stepLabel(ar, bk.step)} onBack={() => (bk.step ? set('step', bk.step - 1) : a.back())}>
        <StepBars step={bk.step} />
      </TopBar>
      <div style={{ flex: 1, padding: '12px 20px 28px', ...col(22) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cat-amber-50)' }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--cat-amber-100)', color: 'var(--cat-amber-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="calendar-check" size={18} /></span>
          <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--cat-amber-800)', fontWeight: 'var(--fw-semibold)' }}>{t.bkTitle} · {h.coName(co)}</span>
        </div>
        {bk.step === 0 && (
          <div style={col(10)}>
            {PURPOSES.map(x => <Radio key={x[0]} card checked={bk.purpose === x[0]} onChange={() => set('purpose', x[0])} label={ar ? x[1] : x[2]} description={ar ? x[3] : x[4]} />)}
          </div>
        )}
        {bk.step === 1 && (
          <>
            <div style={col(10)}>
              <span style={{ font: 'var(--type-h3)' }}>{t.siteLoc}</span>
              <div style={wrap}>{GOVS.map(g => <Chip key={g} size="sm" selected={bk.gov === g} onClick={() => set('gov', g)}>{h.gname(g)}</Chip>)}</div>
              <TextField icon="map-pin" placeholder={t.cityPh} value={bk.city} onChange={v => set('city', v)} />
            </div>
            <div style={col(12)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: 'var(--type-h3)' }}>{ar ? days[0].monthAr : days[0].monthEn}</span>
                <span style={{ font: 'var(--type-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--text-tertiary)' }}>{t.muscatTime}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 8 }}>
                {days.map((day, k) => {
                  const sel = bk.day === k;
                  return (
                    <button key={k} type="button" aria-pressed={sel} onClick={() => pickDay(k)}
                      style={{ height: 70, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'var(--font-sans)', background: sel ? 'var(--brand)' : 'var(--surface-card)', color: sel ? '#fff' : 'var(--text-primary)', boxShadow: sel ? 'var(--shadow-brand)' : 'inset 0 0 0 1px var(--border-default)', transition: 'all var(--dur-base) var(--ease-out)', textAlign: 'center' }}>
                      <span style={{ font: 'var(--type-caption)', opacity: 0.8, fontSize: 10.5 }}>{ar ? day.dAr : day.dEn}</span>
                      <span style={{ font: 'var(--type-h3)' }}>{day.n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={col(12)}>
              <span style={{ font: 'var(--type-h3)' }}>{t.time}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }} dir="ltr">
                {TIMES.map(x => {
                  const full = d.full.includes(x);
                  return <Chip key={x} size="sm" selected={bk.time === x} onClick={() => !full && set('time', x)} style={{ justifyContent: 'center', opacity: full ? 0.4 : 1, textDecoration: full ? 'line-through' : 'none', width: '100%', cursor: full ? 'not-allowed' : 'pointer' }}>{x}</Chip>;
                })}
              </div>
            </div>
          </>
        )}
        {bk.step === 2 && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ flex: 'none', width: 52, height: 52, borderRadius: 'var(--radius-tile)', background: 'var(--cat-amber-100)', color: 'var(--cat-amber-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={p[5]} size={24} /></span>
              <div style={{ flex: 1, ...col(3) }}>
                <span style={{ font: 'var(--type-title)' }}>{ar ? p[1] : p[2]}</span>
                <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{h.coName(co)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-body-sm)', marginTop: 2 }}><Icon name="calendar" size={14} color="var(--brand)" />{(ar ? d.longAr : d.longEn) + ' · ' + bk.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: 'var(--type-body-sm)' }}><Icon name="map-pin" size={14} color="var(--brand)" />{(bk.city ? bk.city + (ar ? '، ' : ', ') : '') + h.gname(bk.gov)}</span>
              </div>
            </div>
            <TextField label={t.notes} placeholder={t.notesPh} multiline value={bk.notes} onChange={v => set('notes', v)} />
            <Note icon="shield-check" color="var(--success)">{t.bkNote}</Note>
          </>
        )}
      </div>
      <BottomBar>
        <Button size="lg" fullWidth iconRight={bk.step < 2 ? 'arrow-right' : 'calendar-check'} disabled={!ok} loading={busy} onClick={next}>{bk.step < 2 ? t.continue : t.bkSubmit}</Button>
      </BottomBar>
    </div>
  );
}

export function DonePage() {
  const a = useApp();
  const { t, ar, page: top, bookings } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.co!)!;
  const b = bookings.find(x => x.id === top.id);
  return (
    <div style={{ minHeight: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '60px 28px 40px', textAlign: 'center' }}>
      <span style={{ width: 96, height: 96, borderRadius: 32, background: 'var(--warning-tint)', color: 'oklch(0.48 0.11 65)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
        <Icon name="calendar-clock" size={48} />
      </span>
      <span style={{ font: 'var(--type-h1)' }}>{t.bkDone}</span>
      <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', maxWidth: 290, textWrap: 'pretty' }}>
        {`${t.waitConfirm} ${h.coName(co)} · ${b ? (ar ? b.dAr : b.dEn) + ' · ' + b.time : ''}`}
      </span>
      <Badge tone="neutral" style={{ font: 'var(--type-mono)' }}>{top.id}</Badge>
      <div style={{ width: '100%', ...col(10), marginTop: 16 }}>
        <Button size="lg" fullWidth onClick={() => a.reset([{ s: 'profile' }, { s: 'bookings' }], 'profile')}>{t.viewBookings}</Button>
        <Button size="lg" variant="ghost" fullWidth onClick={() => a.setTab('home')}>{t.backHome}</Button>
      </div>
    </div>
  );
}
