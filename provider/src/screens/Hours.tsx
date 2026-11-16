import { useEffect, useState } from 'react';
import { Button, Icon } from '../shared/ds';
import type { DayHours } from '../data';
import { useP } from '../state';
import { Card, PageHeader, Pill, Spinner, Toggle } from '../ui';

/** Saturday first, as Omani customers read the week. Values are JavaScript weekdays (0 = Sunday). */
const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];
const dayName = (day: number, ar: boolean) => new Date(2024, 0, 7 + day).toLocaleDateString(ar ? 'ar-OM' : 'en-GB', { weekday: 'long' });
const valid = (d: DayHours) => d.is_closed || (!!d.opens && !!d.closes && d.opens !== d.closes && (d.opens2 == null || (!!d.opens2 && !!d.closes2 && d.opens2 !== d.closes2)));

export function Hours() {
  const p = useP();
  const { t, repo, company } = p;
  const [saved, setSaved] = useState<DayHours[] | null>(null);
  const [week, setWeek] = useState<DayHours[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  useEffect(() => { repo.hours(company.id).then(w => { setSaved(w); setWeek(w); }).catch(() => setWeek([])); }, [repo, company.id]);

  if (!week) return <><PageHeader title={t.hours} /><Spinner /></>;
  const dirty = JSON.stringify(week) !== JSON.stringify(saved);
  const set = (day: number, x: Partial<DayHours>) => setWeek(w => w!.map(d => (d.day === day ? { ...d, ...x } : d)));
  const applyToAll = (src: DayHours) => {
    setWeek(w => w!.map(d => (d.is_closed ? d : { ...d, opens: src.opens, closes: src.closes, opens2: src.opens2, closes2: src.closes2 })));
    p.showToast(t.copied, 'info');
  };
  const save = async () => {
    setTried(true);
    if (!week.every(valid)) return;
    setBusy(true);
    // Closed days don't keep stale times.
    const clean = week.map(d => (d.is_closed ? { ...d, opens: null, closes: null, opens2: null, closes2: null } : d));
    try { await repo.saveHours(company.id, clean); setSaved(clean); setWeek(clean); p.showToast(t.saved); }
    catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title={t.hours} subtitle={t.hoursSub} actions={<>
        {dirty && <Pill tone="amber">{t.unsaved}</Pill>}
        <Button iconLeft="check" loading={busy} disabled={!dirty} onClick={save}>{t.save}</Button>
      </>} />
      <Card pad={0}>
        {WEEK_ORDER.map((day, k) => {
          const d = week.find(x => x.day === day)!;
          const bad = tried && !valid(d);
          return (
            <div key={day} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', padding: '16px 20px', borderTop: k ? '1px solid var(--border-subtle)' : undefined }}>
              <span style={{ width: 110, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
                <span style={{ font: 'var(--type-title)' }}>{dayName(day, p.ar)}</span>
              </span>
              <span style={{ width: 120, flex: 'none', paddingTop: 8 }}>
                <Toggle on={!d.is_closed} label={d.is_closed ? t.closedDay : t.openDay}
                  onChange={on => set(day, on ? { is_closed: false, opens: d.opens || '08:00', closes: d.closes || '18:00' } : { is_closed: true })} />
              </span>
              {!d.is_closed && (
                <span style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Shift opens={d.opens} closes={d.closes} onChange={(o, c) => set(day, { opens: o, closes: c })} />
                  {d.opens2 != null && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Shift opens={d.opens2} closes={d.closes2} onChange={(o, c) => set(day, { opens2: o, closes2: c })} />
                      <button type="button" aria-label={t.removeShift} title={t.removeShift} onClick={() => set(day, { opens2: null, closes2: null })}
                        style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={16} /></button>
                    </span>
                  )}
                  {bad && <span style={{ font: 'var(--type-caption)', color: 'var(--danger)' }}>{t.badTime}</span>}
                  <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {d.opens2 == null && <Button size="sm" variant="ghost" iconLeft="plus" onClick={() => set(day, { opens2: '16:00', closes2: '21:00' })}>{t.addShift}</Button>}
                    <Button size="sm" variant="ghost" iconLeft="refresh-cw" onClick={() => applyToAll(d)}>{t.copyToAll}</Button>
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </Card>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--text-tertiary)' }}><Icon name="clock" size={15} />{t.omanTime}</span>
    </>
  );
}

function Shift({ opens, closes, onChange }: { opens: string | null; closes: string | null; onChange: (o: string, c: string) => void }) {
  const { t } = useP();
  const input = (label: string, v: string | null, on: (x: string) => void) => (
    <label style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 10px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)' }}>
      <span style={{ flex: 'none', font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{label}</span>
      <input type="time" value={v || ''} onChange={e => on(e.target.value)} dir="ltr"
        style={{ flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', background: 'transparent', font: 'var(--type-body)', fontWeight: 600, color: 'var(--text-primary)' }} />
    </label>
  );
  // One row that shrinks on phones instead of wrapping.
  return (
    <span style={{ flex: '1 1 auto', maxWidth: 380, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center', gap: 6 }}>
      {input(t.from, opens, x => onChange(x, closes || ''))}
      <span style={{ color: 'var(--text-tertiary)' }}>–</span>
      {input(t.to, closes, x => onChange(opens || '', x))}
    </span>
  );
}
