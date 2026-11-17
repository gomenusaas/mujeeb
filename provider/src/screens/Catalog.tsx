import { useState } from 'react';
import { Button, EmptyState, Icon } from '../shared/ds';
import { logoOf, photoUrl, type Album, type Service } from '../data';
import { useList, useP } from '../state';
import { Confirm, Field, Modal, PageHeader, PhotoEditor, Pill, Select, ServiceCoverEditor, Spinner, Toggle, VideoEditor, card } from '../ui';

/* Services and projects share one layout: a grid of cards and a bilingual editor. */

type Item = {
  id?: string; title_ar: string; title_en: string; category_id: number; photos: string[]; is_published: boolean;
  /** Services: description. Projects: place. */
  a_ar: string; a_en: string;
  /** Projects only: videos, and the photos/videos kept out of the company gallery. */
  videos?: string[]; hidden?: string[];
  /** Services only: the page header image (null = first photo). */
  cover?: string | null;
};

function Tile({ item, sub, onEdit, onDelete }: { item: Item; sub: string; onEdit: () => void; onDelete: () => void }) {
  const p = useP();
  const { t } = p;
  return (
    <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <button type="button" onClick={onEdit} style={{ position: 'relative', aspectRatio: '4/3', padding: 0, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer' }}>
        {item.cover || item.photos[0]
          ? <img src={photoUrl(item.cover || item.photos[0], 500)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <Icon name="image" size={32} color="var(--text-tertiary)" />}
        <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}><Pill tone={item.is_published ? 'green' : 'neutral'}>{item.is_published ? t.published : t.hidden}</Pill></span>
        <span style={{ position: 'absolute', bottom: 10, insetInlineEnd: 10, display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 9px', borderRadius: 999, background: 'oklch(0.2 0.02 285 / 0.72)', color: '#fff', font: '700 12px var(--font-sans)' }}>
          <Icon name="images" size={13} />{p.num(item.photos.length)}
          {!!item.videos?.length && <><Icon name="play" size={12} style={{ marginInlineStart: 4 }} />{p.num(item.videos.length)}</>}
        </span>
      </button>
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <span style={{ font: 'var(--type-title)' }}>{p.pick(item.title_ar, item.title_en)}</span>
        <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{sub}</span>
        <span style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 10 }}>
          <Button size="sm" variant="outline" iconLeft="pencil" onClick={onEdit} style={{ flex: 1 }}>{t.edit}</Button>
          <Button size="sm" variant="danger" iconLeft="trash-2" onClick={onDelete} style={{ paddingInline: 12 }} />
        </span>
      </div>
    </div>
  );
}

function Editor({ title, initial, isProject, onClose, onSave }: {
  title: string; initial: Item; isProject: boolean; onClose: () => void; onSave: (x: Item) => Promise<void>;
}) {
  const p = useP();
  const { t, company } = p;
  const [x, setX] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (v: Partial<Item>) => setX(o => ({ ...o, ...v }));
  const bad = !x.title_ar.trim() || !x.title_en.trim() || !x.photos.length;
  const save = async () => {
    setTried(true);
    if (bad) return;
    setBusy(true);
    try { await onSave({ ...x, title_ar: x.title_ar.trim(), title_en: x.title_en.trim() }); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); }
  };
  const req = (v: string) => (tried && !v.trim() ? t.required : undefined);
  return (
    <Modal open onClose={onClose} title={title} width={760}
      footer={<><Button variant="outline" onClick={onClose}>{t.cancel}</Button><Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button></>}>
      <div className="pv-grid-2">
        <Field label={t.titleAr} dir="rtl" value={x.title_ar} onChange={v => set({ title_ar: v })} error={req(x.title_ar)} />
        <Field label={t.titleEn} dir="ltr" value={x.title_en} onChange={v => set({ title_en: v })} error={req(x.title_en)} />
        {isProject ? (
          <>
            <Field label={t.placeAr} dir="rtl" value={x.a_ar} onChange={v => set({ a_ar: v })} />
            <Field label={t.placeEn} dir="ltr" value={x.a_en} onChange={v => set({ a_en: v })} />
          </>
        ) : (
          <>
            <Field label={t.descAr} dir="rtl" multiline value={x.a_ar} onChange={v => set({ a_ar: v })} />
            <Field label={t.descEn} dir="ltr" multiline value={x.a_en} onChange={v => set({ a_en: v })} />
          </>
        )}
        <Select label={t.category} value={x.category_id} onChange={v => set({ category_id: v })}
          options={company.categories.map(id => ({ value: id, label: p.pick(p.cat(id)?.name_ar || '', p.cat(id)?.name_en || '') }))} />
      </div>
      {!isProject && (
        <ServiceCoverEditor value={x.cover ?? null} fallback={x.photos[0] || company.cover_photo} logo={logoOf(company)} name={p.pick(company.name_ar, company.name_en)}
          onChange={cover => set({ cover })} />
      )}
      <PhotoEditor photos={x.photos} onChange={photos => set({ photos })} error={tried && !x.photos.length ? t.needPhoto : undefined} noCover={!isProject}
        hidden={isProject ? x.hidden || [] : undefined} onHidden={hidden => set({ hidden })} />
      {isProject && (
        <>
          <VideoEditor videos={x.videos || []} onChange={videos => set({ videos })} hidden={x.hidden || []} onHidden={hidden => set({ hidden })} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>
            <Icon name="eye" size={14} />{t.galleryHelp}
          </span>
        </>
      )}
      <Toggle on={x.is_published} onChange={v => set({ is_published: v })} label={x.is_published ? t.published : t.hidden} help={t.publishedHelp} />
    </Modal>
  );
}

/* ───────────────────────── Services ───────────────────────── */

const svcToItem = (s: Service): Item => ({ id: s.id, title_ar: s.title_ar, title_en: s.title_en, category_id: s.category_id, photos: s.photos, is_published: s.is_published, a_ar: s.description_ar, a_en: s.description_en, cover: s.cover_url });

export function Services() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.services(company.id), [repo, company.id]);
  const [edit, setEdit] = useState<Service | 'new' | null>(null);
  const [del, setDel] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const blank: Item = { title_ar: '', title_en: '', category_id: company.categories[0], photos: [], is_published: true, a_ar: '', a_en: '' };
  const save = async (x: Item) => {
    const base = edit && edit !== 'new' ? edit : { company_id: company.id, position: items?.length || 0 };
    await repo.saveService({ ...base, id: x.id, company_id: company.id, category_id: x.category_id, title_ar: x.title_ar, title_en: x.title_en, description_ar: x.a_ar.trim(), description_en: x.a_en.trim(), photos: x.photos, is_published: x.is_published, cover_url: x.cover ?? null } as Service);
    p.showToast(t.saved); setEdit(null); reload();
  };
  const remove = async () => {
    if (!del?.id) return;
    setBusy(true);
    try { await repo.deleteService(del.id); p.showToast(t.deleted); reload(); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); setDel(null); }
  };
  return (
    <>
      <PageHeader title={t.services} actions={<Button iconLeft="plus" onClick={() => setEdit('new')}>{t.newService}</Button>} />
      {!items ? <Spinner /> : !items.length
        ? <EmptyState icon="briefcase" title={t.noServices} body={t.noServicesBody} action={<Button iconLeft="plus" onClick={() => setEdit('new')}>{t.newService}</Button>} />
        : (
          <div className="pv-tiles">
            {items.map(s => <Tile key={s.id} item={svcToItem(s)} sub={p.pick(p.cat(s.category_id)?.name_ar || '', p.cat(s.category_id)?.name_en || '')} onEdit={() => setEdit(s)} onDelete={() => setDel(s)} />)}
          </div>
        )}
      {edit && <Editor title={edit === 'new' ? t.newService : t.editService} isProject={false} initial={edit === 'new' ? blank : svcToItem(edit)} onClose={() => setEdit(null)} onSave={save} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}

/* ───────────────────────── Projects (portfolio albums) ───────────────────────── */

const albToItem = (a: Album): Item => ({ id: a.id, title_ar: a.title_ar, title_en: a.title_en, category_id: a.category_id, photos: a.photos, is_published: a.is_published, a_ar: a.place_ar || '', a_en: a.place_en || '', videos: a.videos || [], hidden: a.gallery_hidden || [] });

export function Projects() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.albums(company.id), [repo, company.id]);
  const [edit, setEdit] = useState<Album | 'new' | null>(null);
  const [del, setDel] = useState<Album | null>(null);
  const [busy, setBusy] = useState(false);
  const blank: Item = { title_ar: '', title_en: '', category_id: company.categories[0], photos: [], is_published: true, a_ar: '', a_en: '', videos: [], hidden: [] };
  const save = async (x: Item) => {
    const base = edit && edit !== 'new' ? edit : { company_id: company.id, position: 0 };
    await repo.saveAlbum({ ...base, id: x.id, company_id: company.id, category_id: x.category_id, title_ar: x.title_ar, title_en: x.title_en, place_ar: x.a_ar.trim() || null, place_en: x.a_en.trim() || null, photos: x.photos, cover_photo: x.photos[0], is_published: x.is_published,
      videos: x.videos || [], gallery_hidden: (x.hidden || []).filter(h => x.photos.includes(h) || (x.videos || []).includes(h)) } as Album);
    p.showToast(t.saved); setEdit(null); reload();
  };
  const remove = async () => {
    if (!del?.id) return;
    setBusy(true);
    try { await repo.deleteAlbum(del.id); p.showToast(t.deleted); reload(); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); setDel(null); }
  };
  return (
    <>
      <PageHeader title={t.projects} subtitle={t.noProjectsBody} actions={<Button iconLeft="plus" onClick={() => setEdit('new')}>{t.newProject}</Button>} />
      {!items ? <Spinner /> : !items.length
        ? <EmptyState icon="images" title={t.noProjects} body={t.noProjectsBody} action={<Button iconLeft="plus" onClick={() => setEdit('new')}>{t.newProject}</Button>} />
        : (
          <div className="pv-tiles">
            {items.map(a => <Tile key={a.id} item={albToItem(a)} sub={p.pick(a.place_ar || '', a.place_en || '') || p.pick(p.cat(a.category_id)?.name_ar || '', p.cat(a.category_id)?.name_en || '')} onEdit={() => setEdit(a)} onDelete={() => setDel(a)} />)}
          </div>
        )}
      {edit && <Editor title={edit === 'new' ? t.newProject : t.editProject} isProject initial={edit === 'new' ? blank : albToItem(edit)} onClose={() => setEdit(null)} onSave={save} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}
