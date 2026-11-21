import { useState } from 'react';
import { Button, IconButton } from '../shared/ds';
import { TILE_ICONS, api, categoryIcon, tileIconUrl, type HomeTile } from '../api';
import { useA, useLoad } from '../state';
import { Card, Field, Modal, PageHeader, Select, Spinner } from '../ui';
import { ConfirmModal, LoadError, errText } from './common';

/** The customer app's home grid shows this many tiles (3 × 3). */
const MAX_TILES = 9;

/**
 * «خدمات الرئيسية»: the tiles in the «الخدمات» grid on the customer app's home page (3 per row). Each tile has a short
 * name (Arabic and English), an icon (the service's own or one picked from TILE_ICONS) and the category page it opens. Add (up to MAX_TILES), edit, delete and reorder (↑ ↓).
 * Every change is saved at once; the app shows the new grid the next time it loads.
 */
export function HomeServices() {
  const a = useA();
  const { t, pick } = a;
  const list = useLoad(() => api.homeTiles(), []);
  const [busy, setBusy] = useState('');
  const [edit, setEdit] = useState<{ x: HomeTile | null } | null>(null);
  const [del, setDel] = useState<HomeTile | null>(null);

  const run = async (key: string, fn: () => Promise<void>, done: string = t.saved) => {
    setBusy(key);
    try { await fn(); a.showToast(done); list.reload(); return true; } catch (e) { a.showToast(errText(e, t), 'error'); return false; } finally { setBusy(''); }
  };
  const tiles = list.data;
  const ids = (tiles || []).map(x => x.id);
  /** Swaps tile k with its neighbour (d = -1 up, +1 down) and saves the whole order. */
  const move = (k: number, d: number) => {
    const j = k + d;
    if (j < 0 || j >= ids.length || busy) return;
    const next = ids.slice();
    [next[k], next[j]] = [next[j], next[k]];
    void run('mv' + ids[k], () => api.reorderTiles(next));
  };
  const full = (tiles?.length ?? 0) >= MAX_TILES;
  return (
    <>
      <PageHeader title={t.homeServices} subtitle={t.homeServicesSub} />
      {list.error ? <LoadError onRetry={list.reload} /> : !tiles ? <Spinner /> : (
        <Card pad={18} title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {t.homeServices}
          <span style={{ font: 'var(--type-body-sm)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{a.num(tiles.length)} / {a.num(MAX_TILES)}</span>
        </span>}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!tiles.length && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.noTiles}</span>}
            {tiles.map((x, k) => (
              <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: k ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ flex: 'none', width: 22, font: '700 13px var(--font-sans)', color: 'var(--text-tertiary)', textAlign: 'center' }}>{a.num(k + 1)}</span>
                <TileIcon name={x.icon || categoryIcon(a.refs.categories.find(c => c.id === x.category_id)?.art_url ?? null)} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--type-body-strong)' }}>{pick(x.label_ar, x.label_en || x.label_ar)}</span>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{pick(x.label_en, x.label_ar)}</span>
                  </span>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-secondary)' }}>{t.opensX.replace('{x}', a.catName(x.category_id))}</span>
                </span>
                <IconButton icon="arrow-up" size={32} label={t.moveUp} onClick={() => move(k, -1)} />
                <IconButton icon="arrow-down" size={32} label={t.moveDown} onClick={() => move(k, 1)} />
                <IconButton icon="pencil" size={32} label={t.editTile} onClick={() => setEdit({ x })} />
              </div>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              <Button size="sm" variant="outline" iconLeft="plus" disabled={full} onClick={() => setEdit({ x: null })}>{t.addTile}</Button>
              {full && <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{t.tilesFull}</span>}
            </span>
          </div>
        </Card>
      )}

      {edit && <TileForm x={edit.x} busy={busy === 'tile'} onClose={() => setEdit(null)}
        onSave={v => run('tile', () => api.saveTile({ ...v, id: edit.x?.id, position: tiles?.length })).then(ok => ok && setEdit(null))}
        onDelete={edit.x ? () => { setDel(edit.x); setEdit(null); } : undefined} />}
      <ConfirmModal open={!!del} title={t.delete + (del ? ' · ' + pick(del.label_ar, del.label_en || del.label_ar) : '')} body={t.deleteTileBody}
        confirm={t.delete} busy={busy === 'del'} onCancel={() => setDel(null)}
        onConfirm={() => del && run('del', () => api.deleteTile(del.id), t.deleted).then(() => setDel(null))} />
    </>
  );
}

/** Add or edit a tile: the page it opens and its names. Picking a page fills empty names with that service's name. */
function TileForm({ x, busy, onClose, onSave, onDelete }: {
  x: HomeTile | null; busy: boolean; onClose: () => void;
  onSave: (v: { category_id: number; label_ar: string; label_en: string; icon: string | null }) => void; onDelete?: () => void;
}) {
  const a = useA();
  const { t, refs } = a;
  const first = refs.categories[0];
  const [v, setV] = useState({
    category_id: x?.category_id ?? first?.id ?? 0,
    label_ar: x?.label_ar ?? first?.name_ar ?? '',
    label_en: x?.label_en ?? first?.name_en ?? '',
    icon: x?.icon ?? null as string | null,
  });
  const [tried, setTried] = useState(false);
  const bad = !v.label_ar.trim();
  const pickCat = (id: number) => {
    const c = refs.categories.find(y => y.id === id);
    const old = refs.categories.find(y => y.id === v.category_id);
    // Names still showing the previous service's full name follow the new one; names the admin typed stay.
    setV({
      ...v,
      category_id: id,
      label_ar: !v.label_ar.trim() || v.label_ar === old?.name_ar ? c?.name_ar ?? '' : v.label_ar,
      label_en: !v.label_en.trim() || v.label_en === old?.name_en ? c?.name_en ?? '' : v.label_en,
    });
  };
  const save = () => { setTried(true); if (!bad) onSave({ category_id: v.category_id, label_ar: v.label_ar.trim(), label_en: v.label_en.trim(), icon: v.icon }); };
  const own = categoryIcon(refs.categories.find(c => c.id === v.category_id)?.art_url ?? null);
  return (
    <Modal open onClose={onClose} title={x ? t.editTile : t.addTile} width={520}
      footer={<>
        {onDelete && <Button variant="danger" iconLeft="trash-2" onClick={onDelete} style={{ marginInlineEnd: 'auto' }}>{t.delete}</Button>}
        <Button variant="outline" onClick={onClose}>{t.cancel}</Button>
        <Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button>
      </>}>
      <Select label={t.opensPage} value={v.category_id} onChange={pickCat}
        options={refs.categories.map(c => ({ value: c.id, label: a.pick(c.name_ar, c.name_en) }))} />
      <Field label={t.tileName + ' · ' + t.nameAr} dir="rtl" value={v.label_ar} onChange={s => setV({ ...v, label_ar: s })}
        help={t.tileNameHelp} error={tried && bad ? t.required : undefined} />
      <Field label={t.tileName + ' · ' + t.nameEn} dir="ltr" value={v.label_en} onChange={s => setV({ ...v, label_en: s })} />
      {/* Icon: the service's own (first) or any of the flat icons. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.tileIcon}</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: 6 }}>
          <IconChoice name={own} on={!v.icon} label={t.iconOfService} onPick={() => setV({ ...v, icon: null })} />
          {TILE_ICONS.filter(n => n !== own).map(n => <IconChoice key={n} name={n} on={v.icon === n} label={n.replace(/_/g, ' ')} onPick={() => setV({ ...v, icon: n })} />)}
        </div>
      </div>
    </Modal>
  );
}

/** A tile's icon as the customer app shows it (an empty box when there's none). */
function TileIcon({ name }: { name: string | null }) {
  return (
    <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border-default)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {name && <img src={tileIconUrl(name)} alt="" style={{ width: 26, height: 26 }} />}
    </span>
  );
}

/** One icon in the picker; the picked one has a brand-colour ring. */
function IconChoice({ name, on, label, onPick }: { name: string | null; on: boolean; label: string; onPick: () => void }) {
  return (
    <button type="button" onClick={onPick} aria-pressed={on} title={label} aria-label={label}
      style={{ aspectRatio: '1', borderRadius: 12, border: 'none', cursor: 'pointer', background: on ? 'var(--brand-tint)' : 'var(--surface-card)',
        boxShadow: 'inset 0 0 0 ' + (on ? '2px var(--brand)' : '1px var(--border-default)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {name ? <img src={tileIconUrl(name)} alt="" style={{ width: 26, height: 26 }} /> : <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>—</span>}
    </button>
  );
}
