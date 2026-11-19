import { useState } from 'react';
import { Button, IconButton } from '../shared/ds';
import { api, type SubService } from '../api';
import { useA, useLoad } from '../state';
import { Card, Field, Modal, PageHeader, Pill, Spinner, Toggle } from '../ui';
import { ConfirmModal, LoadError, errText } from './common';

/**
 * Sub-services: each category's fixed list (e.g. interior design: «الصالات», «غرف النوم»). Companies pick from it
 * when they add a service; customers filter a category page by it. Edit names, hide/show, add, delete and set the
 * order (↑ ↓ or A–Z). Under each category, the sub-services companies typed themselves, to add good ones to the list.
 * Every change is saved at once; the apps show the new list the next time they load.
 */
export function SubServices() {
  const a = useA();
  const { t, pick } = a;
  const list = useLoad(() => api.subs(), []);
  const custom = useLoad(() => api.customSubs(), []);
  const [busy, setBusy] = useState('');
  const [edit, setEdit] = useState<{ s: SubService | null; cat: number; draft?: string } | null>(null);
  const [del, setDel] = useState<SubService | null>(null);

  const run = async (key: string, fn: () => Promise<void>, done: string = t.saved) => {
    setBusy(key);
    try { await fn(); a.showToast(done); list.reload(); custom.reload(); return true; } catch (e) { a.showToast(errText(e, t), 'error'); return false; } finally { setBusy(''); }
  };
  /** Swaps item k with its neighbour (d = -1 up, +1 down) and saves the category's whole order. */
  const move = (ids: string[], k: number, d: number) => {
    const j = k + d;
    if (j < 0 || j >= ids.length || busy) return;
    const next = ids.slice();
    [next[k], next[j]] = [next[j], next[k]];
    void run('mv' + ids[k], () => api.reorder('sub_services', next));
  };
  const name = (x: { name_ar: string; name_en: string }) => pick(x.name_ar, x.name_en);
  const other = (x: { name_ar: string; name_en: string }) => pick(x.name_en, x.name_ar);
  const subs = list.data;
  return (
    <>
      <PageHeader title={t.subServices} subtitle={t.subServicesSub} />
      {list.error ? <LoadError onRetry={list.reload} /> : !subs ? <Spinner /> : a.refs.categories.map(c => {
        const items = subs.filter(s => s.category_id === c.id);
        const typed = (custom.data || []).filter(x => x.category_id === c.id && !items.some(s => s.name_ar.trim() === x.name || s.name_en.trim().toLowerCase() === x.name.toLowerCase()));
        const ids = items.map(s => s.id);
        const sortAZ = () => void run('az' + c.id, () => api.reorder('sub_services', items.slice().sort((x, y) => name(x).localeCompare(name(y), a.lang)).map(s => s.id)));
        return (
          <Card key={c.id} pad={18} title={<span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {pick(c.name_ar, c.name_en)}
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{a.num(items.length)}</span>
          </span>}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {!items.length && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.noSubs}</span>}
              {items.map((s, k) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: k ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--type-body-strong)', color: s.is_active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{name(s)}</span>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{other(s)}</span>
                    {!s.is_active && <Pill tone="neutral">{t.hiddenTag}</Pill>}
                  </span>
                  <IconButton icon="arrow-up" size={32} label={t.moveUp} onClick={() => move(ids, k, -1)} />
                  <IconButton icon="arrow-down" size={32} label={t.moveDown} onClick={() => move(ids, k, 1)} />
                  <IconButton icon="pencil" size={32} label={t.editSub} onClick={() => setEdit({ s, cat: c.id })} />
                </div>
              ))}
              <span style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <Button size="sm" variant="outline" iconLeft="plus" onClick={() => setEdit({ s: null, cat: c.id })}>{t.addSub}</Button>
                {items.length > 1 && <Button size="sm" variant="outline" iconLeft="arrow-down-a-z" loading={busy === 'az' + c.id} onClick={sortAZ}>{t.sortAZ}</Button>}
              </span>
              {/* What companies typed in this category that isn't in the list yet. */}
              {typed.length > 0 && (
                <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'var(--neutral-50)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ font: 'var(--type-body-sm)', fontWeight: 700 }}>{t.customSubsT}</span>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{t.customSubsHelp}</span>
                  </span>
                  {typed.map(x => (
                    <span key={x.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', fontWeight: 600 }}>{x.name} <span style={{ fontWeight: 500, color: 'var(--text-tertiary)' }}>· {t.usesN.replace('{n}', a.num(x.uses))}</span></span>
                      <Button size="sm" variant="outline" iconLeft="plus" onClick={() => setEdit({ s: null, cat: c.id, draft: x.name })}>{t.addToList}</Button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {edit && <SubForm s={edit.s} draft={edit.draft} busy={busy === 'sub'} onClose={() => setEdit(null)}
        onSave={x => run('sub', () => api.saveSub({ ...x, id: edit.s?.id, category_id: edit.cat, position: subs?.filter(s => s.category_id === edit.cat).length })).then(ok => ok && setEdit(null))}
        onDelete={edit.s ? () => { setDel(edit.s); setEdit(null); } : undefined} />}
      <ConfirmModal open={!!del} title={t.delete + (del ? ' · ' + name(del) : '')} body={t.deleteSubBody}
        confirm={t.deleteForGood} busy={busy === 'del'} onCancel={() => setDel(null)}
        onConfirm={() => del && run('del', () => api.deleteSub(del.id), t.deleted).then(() => setDel(null))} />
    </>
  );
}

/** Add or edit a sub-service: names, shown/hidden. `draft` pre-fills a name a company typed. */
function SubForm({ s, draft, busy, onClose, onSave, onDelete }: {
  s: SubService | null; draft?: string; busy: boolean; onClose: () => void;
  onSave: (x: { name_ar: string; name_en: string; is_active: boolean }) => void; onDelete?: () => void;
}) {
  const { t } = useA();
  // A typed name in Latin letters goes in the English box; anything else in the Arabic one.
  const latin = !!draft && /^[\x20-\x7E]+$/.test(draft);
  const [x, setX] = useState({ name_ar: s?.name_ar ?? (draft && !latin ? draft : ''), name_en: s?.name_en ?? (draft && latin ? draft : ''), is_active: s?.is_active ?? true });
  const [tried, setTried] = useState(false);
  const bad = !x.name_ar.trim() || !x.name_en.trim();
  const save = () => { setTried(true); if (!bad) onSave({ name_ar: x.name_ar.trim(), name_en: x.name_en.trim(), is_active: x.is_active }); };
  return (
    <Modal open onClose={onClose} title={s ? t.editSub : t.addSub} width={520}
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
