import { useState } from 'react';
import { Avatar, Badge, Button, Chip, Icon, IconButton, Radio, TextField } from '../ds';
import { useApp, type BookingDraft, type RfqDraft } from '../app/store';
import { BottomBar, StepBars, TopBar, helpers } from '../app/view';
import { BUDGETS, PURPOSES, STARTS, arDigits } from '../i18n/strings';
import { TIMES } from '../app/dates';
import { logoUrl } from '../data/api';
import type { GovId } from '../data/types';

const GOVS: GovId[] = ['muscat', 'batinah', 'dakhiliyah', 'dhofar', 'sharqiyah'];
const label = { font: 'var(--type-body-sm)', fontWeight: 600 } as const;
const col = (gap: number) => ({ display: 'flex', flexDirection: 'column', gap }) as const;
const wrap = { display: 'flex', flexWrap: 'wrap', gap: 8 } as const;
const stepLabel = (ar: boolean, n: number) => (ar ? 'الخطوة ' + arDigits(n + 1) + ' من ٣' : 'Step ' + (n + 1) + ' of 3');

function useSubmit(fn: () => Promise<void>) {
  const [busy, setBusy] = useState(false);
  return [busy, async () => { if (busy) return; setBusy(true); try { await fn(); } finally { setBusy(false); } }] as const;
}

export function RfqPage() {
  const a = useApp();
  const { t, ar, rfq, setRfq, catalog } = a;
  const h = helpers(a);
  const [busy, submit] = useSubmit(a.submitRfq);
  if (!rfq) return null;
  const co = a.idx.co.get(rfq.co)!;
  const set = <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => setRfq(r => (r ? { ...r, [k]: v } : r));
  const svc = rfq.svc ? a.idx.svc.get(rfq.svc) : undefined;
  const ok = [rfq.title.trim() && rfq.desc.trim(), rfq.city.trim(), rfq.name.trim() && rfq.phone.trim()][rfq.step];
  const addFile = (kind: 'img' | 'doc') => {
    // Real file picker; customer RFQ attachments come from the device, not the provider media library.
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = kind === 'img' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx';
    inp.multiple = true;
    inp.onchange = () => {
      const files = Array.from(inp.files || []).map(fl => ({ kind, name: fl.name, size: fl.size > 1e6 ? (fl.size / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(fl.size / 1e3)) + ' KB' }));
      if (files.length) { setRfq(r => (r ? { ...r, files: [...r.files, ...files] } : r)); a.showToast(t.fileAdded); }
    };
    inp.click();
  };
  const summary: [string, string][] = [
    [t.selService, svc ? (ar ? svc.ar : svc.en) : '—'], [t.reqTitle, rfq.title || '—'],
    [t.gov, h.gname(rfq.gov) + (rfq.city ? (ar ? '، ' : ', ') + rfq.city : '')],
    [t.budgetK, rfq.budget >= 0 ? BUDGETS[rfq.budget][ar ? 0 : 1] : '—'], [t.startK, rfq.start >= 0 ? STARTS[rfq.start][ar ? 0 : 1] : '—'],
  ];
  const next = () => { if (!ok) return; if (rfq.step < 2) set('step', rfq.step + 1); else submit(); };

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={[t.rfqS1, t.rfqS2, t.rfqS3][rfq.step]} subtitle={stepLabel(ar, rfq.step)} onBack={() => (rfq.step ? set('step', rfq.step - 1) : a.back())}>
        <StepBars step={rfq.step} />
      </TopBar>
      <div style={{ flex: 1, padding: '12px 20px 28px', ...col(22) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--brand-tint)' }}>
          <Avatar name={h.coName(co)} src={logoUrl(co.id)} size={32} />
          <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--brand-ink)', fontWeight: 600 }}>{t.rfqTitle} · {h.coName(co)}</span>
        </div>
        {rfq.step === 0 && (
          <>
            <div style={col(10)}>
              <span style={label}>{t.selService}</span>
              <div style={wrap}>{catalog.services.filter(s => s.co === co.id).map(s => <Chip key={s.id} selected={rfq.svc === s.id} onClick={() => set('svc', s.id)}>{ar ? s.ar : s.en}</Chip>)}</div>
            </div>
            <TextField label={t.reqTitle} placeholder={t.reqTitlePh} value={rfq.title} onChange={v => set('title', v)} />
            <TextField label={t.projDesc} placeholder={t.projDescPh} multiline value={rfq.desc} onChange={v => set('desc', v)} />
          </>
        )}
        {rfq.step === 1 && (
          <>
            <div style={col(10)}>
              <span style={label}>{t.gov}</span>
              <div style={wrap}>{GOVS.map(g => <Chip key={g} size="sm" selected={rfq.gov === g} onClick={() => set('gov', g)}>{h.gname(g)}</Chip>)}</div>
            </div>
            <TextField label={t.city} placeholder={t.cityPh} icon="map-pin" value={rfq.city} onChange={v => set('city', v)} />
            <TextField label={t.address} placeholder={t.addressPh} value={rfq.address} onChange={v => set('address', v)} />
            <div style={col(10)}>
              <span style={label}>{t.budget}</span>
              <div style={wrap}>{BUDGETS.map((b, k) => <Chip key={k} size="sm" selected={rfq.budget === k} onClick={() => set('budget', rfq.budget === k ? -1 : k)}>{b[ar ? 0 : 1]}</Chip>)}</div>
            </div>
            <div style={col(10)}>
              <span style={label}>{t.start}</span>
              <div style={wrap}>{STARTS.map((b, k) => <Chip key={k} size="sm" selected={rfq.start === k} onClick={() => set('start', rfq.start === k ? -1 : k)}>{b[ar ? 0 : 1]}</Chip>)}</div>
            </div>
          </>
        )}
        {rfq.step === 2 && (
          <>
            <div style={col(10)}>
              <span style={label}>{t.attach}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Button variant="outline" iconLeft="image-plus" onClick={() => addFile('img')}>{t.addPhoto}</Button>
                <Button variant="outline" iconLeft="file-plus" onClick={() => addFile('doc')}>{t.addDoc}</Button>
              </div>
              {rfq.files.length > 0 && (
                <div style={{ ...col(6), padding: '4px 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xs)' }}>
                  {rfq.files.map((fl, k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={fl.kind === 'img' ? 'image' : 'file-text'} size={16} /></span>
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }} dir="ltr">{fl.name}</span>
                        <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{fl.size}</span>
                      </span>
                      <IconButton icon="x" variant="plain" size={36} label="Remove" onClick={() => set('files', rfq.files.filter((_, j) => j !== k))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={col(12)}>
              <span style={label}>{t.yourContact}</span>
              <TextField label={t.name} icon="user-round" value={rfq.name} onChange={v => set('name', v)} />
              <TextField label={t.phone} icon="phone" type="tel" value={rfq.phone} onChange={v => set('phone', v)} />
            </div>
            <div style={{ ...col(10), padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--surface-sunken)' }}>
              <span style={{ font: 'var(--type-title)' }}>{t.summary}</span>
              {summary.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
                  <span>{k}</span><span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'end' }}>{v}</span>
                </div>
              ))}
            </div>
            <Note icon="shield-check" color="var(--success)">{t.rfqNote}</Note>
          </>
        )}
      </div>
      <BottomBar>
        <Button size="lg" fullWidth iconRight={rfq.step < 2 ? 'arrow-right' : 'send'} disabled={!ok} loading={busy} onClick={next}>{rfq.step < 2 ? t.continue : t.submit}</Button>
      </BottomBar>
    </div>
  );
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
          <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--cat-amber-800)', fontWeight: 600 }}>{t.bkTitle} · {h.coName(co)}</span>
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
                <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.muscatTime}</span>
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

export function DonePage({ kind }: { kind: 'rfq' | 'bk' }) {
  const a = useApp();
  const { t, ar, top, bookings } = a;
  const h = helpers(a);
  const co = a.idx.co.get(top.co!)!;
  const b = kind === 'bk' ? bookings.find(x => x.id === top.id) : undefined;
  return (
    <div style={{ minHeight: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '60px 28px 40px', textAlign: 'center' }}>
      <span style={{ width: 96, height: 96, borderRadius: 32, background: kind === 'rfq' ? 'var(--success-tint)' : 'var(--warning-tint)', color: kind === 'rfq' ? 'var(--success)' : 'oklch(0.48 0.11 65)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
        <Icon name={kind === 'rfq' ? 'circle-check' : 'calendar-clock'} size={48} />
      </span>
      <span style={{ font: 'var(--type-h1)' }}>{kind === 'rfq' ? t.rfqDone : t.bkDone}</span>
      <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', maxWidth: 290, textWrap: 'pretty' }}>
        {kind === 'rfq' ? `${t.sentTo} ${h.coName(co)} ${t.notifyReply}` : `${t.waitConfirm} ${h.coName(co)} · ${b ? (ar ? b.dAr : b.dEn) + ' · ' + b.time : ''}`}
      </span>
      <Badge tone="neutral" style={{ font: 'var(--type-mono)' }}>{top.id}</Badge>
      <div style={{ width: '100%', ...col(10), marginTop: 16 }}>
        <Button size="lg" fullWidth onClick={() => a.reset([{ s: 'profile' }, { s: kind === 'rfq' ? 'quotes' : 'bookings' }], 'profile')}>{kind === 'rfq' ? t.viewQuotes : t.viewBookings}</Button>
        <Button size="lg" variant="ghost" fullWidth onClick={() => a.setTab('home')}>{t.backHome}</Button>
      </div>
    </div>
  );
}
