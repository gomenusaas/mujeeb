import { useState } from 'react';
import { Button, IconButton } from '../shared/ds';
import { api, type PlaceGov, type PlaceWil } from '../api';
import { useA, useLoad } from '../state';
import { Card, Field, Modal, PageHeader, Pill, Select, Spinner, Toggle } from '../ui';
import { ConfirmModal, LoadError, errText } from './common';

type Table = 'governorates' | 'wilayats';

/**
 * Service locations customers pick from («موقع الخدمة»): governorates and their wilayats.
 * Edit names, hide/show, add, delete, and set the order (↑ ↓, or A–Z for a governorate's wilayats).
 * Every change is saved at once; the customer app shows the new list the next time it loads.
 */
export function Locations() {
  const a = useA();
  const { t, num, pick } = a;
  const list = useLoad(() => api.places(), []);
  const [busy, setBusy] = useState('');
  const [gov, setGov] = useState<PlaceGov | 'new' | null>(null);
  const [wil, setWil] = useState<{ w: PlaceWil | null; g: PlaceGov } | null>(null);
  const [del, setDel] = useState<{ table: Table; id: string; name: string } | null>(null);

  const run = async (key: string, fn: () => Promise<void>, done: string = t.saved) => {
    setBusy(key);
    try { await fn(); a.showToast(done); list.reload(); return true; } catch (e) { a.showToast(errText(e, t), 'error'); return false; } finally { setBusy(''); }
  };
  /** Swaps item k with its neighbour (d = -1 up, +1 down) and saves the whole order. */
  const move = (table: Table, ids: string[], k: number, d: number) => {
    const j = k + d;
    if (j < 0 || j >= ids.length || busy) return;
    const next = ids.slice();
    [next[k], next[j]] = [next[j], next[k]];
    void run('mv' + ids[k], () => api.reorder(table, next));
  };
  const sortAZ = (g: PlaceGov) => {
    const ids = g.wilayats.slice().sort((x, y) => pick(x.name_ar, x.name_en).localeCompare(pick(y.name_ar, y.name_en), a.lang)).map(w => w.id);
    void run('az' + g.id, () => api.reorder('wilayats', ids));
  };
  const name = (x: { name_ar: string; name_en: string }) => pick(x.name_ar, x.name_en);
  const other = (x: { name_ar: string; name_en: string }) => pick(x.name_en, x.name_ar);
  // Arabic counts: ولاية واحدة، ولايتان، ٣–١٠ ولايات، ١١+ ولاية.
  const wilayatCount = (n: number) => (a.ar ? (n === 1 ? 'ولاية واحدة' : n === 2 ? 'ولايتان' : num(n) + (n >= 3 && n <= 10 ? ' ولايات' : ' ولاية')) : n + (n === 1 ? ' wilayat' : ' wilayats'));

  const govs = list.data;
  return (
    <>
      <PageHeader title={t.locations} subtitle={t.locationsSub} actions={<Button iconLeft="plus" onClick={() => setGov('new')}>{t.addGov}</Button>} />
      {list.error ? <LoadError onRetry={list.reload} /> : !govs ? <Spinner /> : govs.map((g, gi) => (
        <Card key={g.id} pad={18}
          title={<span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {name(g)}
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{other(g)} · {wilayatCount(g.wilayats.length)}</span>
            {!g.is_active && <Pill tone="neutral">{t.hiddenTag}</Pill>}
          </span>}
          actions={<span style={{ display: 'flex', gap: 6 }}>
            <IconButton icon="arrow-up" size={36} label={t.moveUp} onClick={() => move('governorates', govs.map(x => x.id), gi, -1)} />
            <IconButton icon="arrow-down" size={36} label={t.moveDown} onClick={() => move('governorates', govs.map(x => x.id), gi, 1)} />
            <IconButton icon="pencil" size={36} label={t.editGov} onClick={() => setGov(g)} />
          </span>}>
          <div style={{ display: 'flex', flexDirection: 'column', opacity: g.is_active ? 1 : 0.6 }}>
            {g.wilayats.map((w, wi) => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: wi ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ font: 'var(--type-body-strong)', color: w.is_active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{name(w)}</span>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{other(w)}</span>
                  {!w.is_active && <Pill tone="neutral">{t.hiddenTag}</Pill>}
                </span>
                <IconButton icon="arrow-up" size={32} label={t.moveUp} onClick={() => move('wilayats', g.wilayats.map(x => x.id), wi, -1)} />
                <IconButton icon="arrow-down" size={32} label={t.moveDown} onClick={() => move('wilayats', g.wilayats.map(x => x.id), wi, 1)} />
                <IconButton icon="pencil" size={32} label={t.editWil} onClick={() => setWil({ w, g })} />
              </div>
            ))}
            <span style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <Button size="sm" variant="outline" iconLeft="plus" onClick={() => setWil({ w: null, g })}>{t.addWil}</Button>
              {g.wilayats.length > 1 && <Button size="sm" variant="outline" iconLeft="arrow-down-a-z" loading={busy === 'az' + g.id} onClick={() => sortAZ(g)}>{t.sortAZ}</Button>}
            </span>
          </div>
        </Card>
      ))}

      {gov && <GovForm g={gov === 'new' ? null : gov} busy={busy === 'gov'} onClose={() => setGov(null)}
        onSave={x => run('gov', () => api.saveGov({ ...x, position: govs?.length })).then(ok => ok && setGov(null))}
        onDelete={gov === 'new' ? undefined : () => { setDel({ table: 'governorates', id: gov.id, name: name(gov) }); setGov(null); }} />}
      {wil && <WilForm w={wil.w} busy={busy === 'wil'} onClose={() => setWil(null)}
        onSave={x => run('wil', () => api.saveWil({ ...x, id: wil.w?.id, governorate_id: wil.g.id, position: wil.g.wilayats.length })).then(ok => ok && setWil(null))}
        onDelete={wil.w ? () => { setDel({ table: 'wilayats', id: wil.w!.id, name: name(wil.w!) }); setWil(null); } : undefined} />}
      <ConfirmModal open={!!del} title={t.delete + (del ? ' · ' + del.name : '')} body={del?.table === 'governorates' ? t.deleteGovBody : t.deleteWilBody}
        confirm={t.deleteForGood} busy={busy === 'del'} onCancel={() => setDel(null)}
        onConfirm={() => del && run('del', () => (del.table === 'governorates' ? api.deleteGov(del.id) : api.deleteWil(del.id)), t.deleted).then(() => setDel(null))} />
    </>
  );
}

/** Add or edit a governorate: names, coverage region, shown/hidden. */
function GovForm({ g, busy, onClose, onSave, onDelete }: {
  g: PlaceGov | null; busy: boolean; onClose: () => void;
  onSave: (x: { id?: string; name_ar: string; name_en: string; region: string | null; is_active: boolean }) => void; onDelete?: () => void;
}) {
  const a = useA();
  const { t, refs, pick } = a;
  const [x, setX] = useState({ name_ar: g?.name_ar ?? '', name_en: g?.name_en ?? '', region: g?.region ?? '', is_active: g?.is_active ?? true });
  const [tried, setTried] = useState(false);
  const bad = !x.name_ar.trim() || !x.name_en.trim();
  const save = () => { setTried(true); if (!bad) onSave({ id: g?.id, name_ar: x.name_ar.trim(), name_en: x.name_en.trim(), region: x.region || null, is_active: x.is_active }); };
  return (
    <Modal open onClose={onClose} title={g ? t.editGov : t.addGov} width={560}
      footer={<>
        {onDelete && <Button variant="danger" iconLeft="trash-2" onClick={onDelete} style={{ marginInlineEnd: 'auto' }}>{t.delete}</Button>}
        <Button variant="outline" onClick={onClose}>{t.cancel}</Button>
        <Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button>
      </>}>
      <Field label={t.nameAr} dir="rtl" value={x.name_ar} onChange={v => setX({ ...x, name_ar: v })} error={tried && !x.name_ar.trim() ? t.required : undefined} />
      <Field label={t.nameEn} dir="ltr" value={x.name_en} onChange={v => setX({ ...x, name_en: v })} error={tried && !x.name_en.trim() ? t.required : undefined} />
      <Select label={t.region} value={x.region} onChange={v => setX({ ...x, region: v })}
        options={[{ value: '', label: t.noRegion }, ...refs.locations.filter(l => l.id !== 'all').map(l => ({ value: l.id, label: pick(l.name_ar, l.name_en) }))]} />
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)', marginTop: -8 }}>{t.regionHelp}</span>
      <Toggle on={x.is_active} onChange={v => setX({ ...x, is_active: v })} label={x.is_active ? t.shown : t.hiddenFromCustomers} />
    </Modal>
  );
}

/** Add or edit a wilayat: names, shown/hidden. */
function WilForm({ w, busy, onClose, onSave, onDelete }: {
  w: PlaceWil | null; busy: boolean; onClose: () => void;
  onSave: (x: { name_ar: string; name_en: string; is_active: boolean }) => void; onDelete?: () => void;
}) {
  const { t } = useA();
  const [x, setX] = useState({ name_ar: w?.name_ar ?? '', name_en: w?.name_en ?? '', is_active: w?.is_active ?? true });
  const [tried, setTried] = useState(false);
  const bad = !x.name_ar.trim() || !x.name_en.trim();
  const save = () => { setTried(true); if (!bad) onSave({ name_ar: x.name_ar.trim(), name_en: x.name_en.trim(), is_active: x.is_active }); };
  return (
    <Modal open onClose={onClose} title={w ? t.editWil : t.addWil} width={520}
      footer={<>
        {onDelete && <Button variant="danger" iconLeft="trash-2" onClick={onDelete} style={{ marginInlineEnd: 'auto' }}>{t.delete}</Button>}
        <Button variant="outline" onClick={onClose}>{t.cancel}</Button>
        <Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button>
      </>}>
      <Field label={t.nameAr} dir="rtl" value={x.name_ar} onChange={v => setX({ ...x, name_ar: v })} error={tried && !x.name_ar.trim() ? t.required : undefined} />
      <Field label={t.nameEn} dir="ltr" value={x.name_en} onChange={v => setX({ ...x, name_en: v })} error={tried && !x.name_en.trim() ? t.required : undefined} />
      <Toggle on={x.is_active} onChange={v => setX({ ...x, is_active: v })} label={x.is_active ? t.shown : t.hiddenFromCustomers} />
    </Modal>
  );
}
