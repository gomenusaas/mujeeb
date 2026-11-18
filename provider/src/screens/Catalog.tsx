import { useState } from 'react';
import { Button, EmptyState, Icon } from '../shared/ds';
import { FEATURED_MAX, isFeaturedLimit, logoOf, photoUrl, type Album, type Service } from '../data';
import { useList, useP } from '../state';
import { Confirm, Field, KeywordsField, Modal, PageHeader, PhotoEditor, Pill, Select, ServiceCoverEditor, Spinner, Toggle, VideoEditor, card } from '../ui';

/* Services and projects share one layout: a grid of cards and a bilingual editor. */

type Item = {
  id?: string; title_ar: string; title_en: string; category_id: number; photos: string[]; is_published: boolean;
  /** Services: description. Projects: place. */
  a_ar: string; a_en: string;
  /** Projects only: videos, and the photos/videos kept out of the company gallery. */
  videos?: string[]; hidden?: string[];
  /** Services only: the page header image (null = first photo). */
  cover?: string | null;
  /** Services only: search keywords (up to 7). */
  kw?: string[];
  /** Projects only: the service it shows under. */
  service_id?: string | null;
  /** Projects only: page details. done = "YYYY-MM"; area and weeks as typed. */
  d_ar?: string; d_en?: string; done?: string; area?: string; weeks?: string;
  /** Projects only: shown in «مشاريع مميزة». */
  feat?: boolean;
};

function Tile({ item, sub, onEdit, onDelete, n, thumb, onStar }: { item: Item; sub: string; onEdit: () => void; onDelete: () => void; n?: number; thumb?: string; onStar?: () => void }) {
  const p = useP();
  const { t } = p;
  return (
    <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
      <button type="button" onClick={onEdit} style={{ position: 'relative', width: '100%', aspectRatio: '4/3', padding: 0, border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', display: 'block' }}>
        {thumb || item.cover || item.photos[0]
          ? <img src={photoUrl(thumb || item.cover || item.photos[0], 500)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <Icon name="image" size={32} color="var(--text-tertiary)" />}
        <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}><Pill tone={item.is_published ? 'green' : 'neutral'}>{item.is_published ? t.published : t.hidden}</Pill></span>
        <span style={{ position: 'absolute', bottom: 10, insetInlineEnd: 10, display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 9px', borderRadius: 999, background: 'oklch(0.2 0.02 285 / 0.72)', color: '#fff', font: '700 12px var(--font-sans)' }}>
          <Icon name="images" size={13} />{p.num(n ?? item.photos.length)}
          {!!item.videos?.length && <><Icon name="play" size={12} style={{ marginInlineStart: 4 }} />{p.num(item.videos.length)}</>}
        </span>
      </button>
      {/* Projects: the star puts it in «مشاريع مميزة» (filled amber when featured). */}
      {onStar && (
        <button type="button" onClick={onStar} aria-pressed={!!item.feat} aria-label={item.feat ? t.unfeature : t.feature} title={item.feat ? t.unfeature : t.feature}
          style={{ position: 'absolute', top: 8, insetInlineEnd: 8, width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center',
            background: item.feat ? 'oklch(0.8 0.16 80)' : 'oklch(0.2 0.02 285 / 0.55)', color: '#fff', boxShadow: 'var(--shadow-sm)' }}>
          <Icon name="star" size={18} filled={item.feat} />
        </button>
      )}
      </div>
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

function Editor({ title, initial, isProject, onClose, onSave, services, linked, featFull }: {
  title: string; initial: Item; isProject: boolean; onClose: () => void; onSave: (x: Item) => Promise<void>;
  /** Projects: the company already features the most projects allowed (so this one can't be added). */
  featFull?: boolean;
  /** Projects: the company's services (for the «الخدمة» picker). */
  services?: Service[];
  /** Services: the projects linked to it (their photos fill its page). */
  linked?: Album[];
}) {
  const p = useP();
  const { t, company } = p;
  const [x, setX] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (v: Partial<Item>) => setX(o => ({ ...o, ...v }));
  // Services get their photos from linked projects, so only projects must have a photo.
  const bad = !x.title_ar.trim() || !x.title_en.trim() || (isProject && !x.photos.length);
  // Projects: the services in the chosen category. With just one, it's picked for the company.
  const inCat = (cat: number) => (services || []).filter(s => s.category_id === cat);
  const svcFor = (cat: number, cur?: string | null) => {
    const list = inCat(cat);
    return list.some(s => s.id === cur) ? cur! : list.length === 1 ? list[0].id! : null;
  };
  const save = async () => {
    setTried(true);
    if (bad) return;
    setBusy(true);
    try { await onSave({ ...x, title_ar: x.title_ar.trim(), title_en: x.title_en.trim() }); } catch (e) { p.showToast(isFeaturedLimit(e) ? t.featuredFull : t.saveFailed, 'error'); } finally { setBusy(false); }
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
            <div style={{ gridColumn: '1 / -1' }}>
              <KeywordsField label={t.keywords} value={x.kw || []} onChange={kw => set({ kw })} placeholder={t.keywordsPh} help={t.keywordsHelp} />
            </div>
          </>
        )}
        <Select label={t.category} value={x.category_id} onChange={v => set({ category_id: v, ...(isProject ? { service_id: svcFor(v, x.service_id) } : {}) })}
          options={company.categories.map(id => ({ value: id, label: p.pick(p.cat(id)?.name_ar || '', p.cat(id)?.name_en || '') }))} />
        {isProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Select label={t.projService} value={x.service_id || ''} onChange={v => set({ service_id: v || null })}
              options={[{ value: '', label: t.noService }, ...inCat(x.category_id).map(s => ({ value: s.id!, label: p.pick(s.title_ar, s.title_en) }))]} />
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.projServiceHelp}</span>
          </div>
        )}
        {isProject && (
          <>
            <Field label={t.projDescAr} dir="rtl" multiline rows={3} value={x.d_ar || ''} onChange={v => set({ d_ar: v })} />
            <Field label={t.projDescEn} dir="ltr" multiline rows={3} value={x.d_en || ''} onChange={v => set({ d_en: v })} />
            <Field label={t.projDone} type="month" dir="ltr" value={x.done || ''} onChange={v => set({ done: v })} help={t.optional} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t.projArea} type="number" dir="ltr" value={x.area || ''} onChange={v => set({ area: v.replace(/[^0-9]/g, '') })} help={t.optional} />
              <Field label={t.projWeeks} type="number" dir="ltr" value={x.weeks || ''} onChange={v => set({ weeks: v.replace(/[^0-9]/g, '') })} help={t.optional} />
            </div>
          </>
        )}
      </div>
      {!isProject && (
        <ServiceCoverEditor value={x.cover ?? null} fallback={x.photos[0] || company.cover_photo} logo={logoOf(company)} name={p.pick(company.name_ar, company.name_en)}
          onChange={cover => set({ cover })} />
      )}
      {isProject
        ? <PhotoEditor photos={x.photos} onChange={photos => set({ photos })} error={tried && !x.photos.length ? t.needPhoto : undefined}
            hidden={x.hidden || []} onHidden={hidden => set({ hidden })} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
              <Icon name="info" size={16} style={{ flex: 'none', marginTop: 2 }} />{t.svcFromProjects}
            </span>
            <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.svcLinked}</span>
            {linked?.length
              ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {linked.map(al => (
                    <span key={al.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', borderRadius: 999, background: 'var(--neutral-100)', font: 'var(--type-caption)', fontWeight: 600 }}>
                      <img src={photoUrl(al.photos[0] || al.cover_photo, 80)} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                      {p.pick(al.title_ar, al.title_en)} · {p.num(al.photos.length + (al.videos?.length || 0))}
                    </span>
                  ))}
                </div>
              : <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.svcNoLinked}</span>}
            {x.photos.length > 0 && <PhotoEditor photos={x.photos} onChange={photos => set({ photos })} noCover noAdd help={t.svcOldPhotos} />}
          </div>
        )}
      {isProject && (
        <>
          <VideoEditor videos={x.videos || []} onChange={videos => set({ videos })} hidden={x.hidden || []} onHidden={hidden => set({ hidden })} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>
            <Icon name="eye" size={14} />{t.galleryHelp}
          </span>
        </>
      )}
      <Toggle on={x.is_published} onChange={v => set({ is_published: v })} label={x.is_published ? t.published : t.hidden} help={t.publishedHelp} />
      {isProject && (
        <Toggle on={!!x.feat} onChange={v => (v && featFull ? p.showToast(t.featuredFull, 'error') : set({ feat: v }))} label={t.featured} help={t.featuredHelp} />
      )}
    </Modal>
  );
}

/* ───────────────────────── Services ───────────────────────── */

const svcToItem = (s: Service): Item => ({ id: s.id, title_ar: s.title_ar, title_en: s.title_en, category_id: s.category_id, photos: s.photos, is_published: s.is_published, a_ar: s.description_ar, a_en: s.description_en, cover: s.cover_url, kw: s.keywords || [] });

export function Services() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.services(company.id), [repo, company.id]);
  const projects = useList(() => repo.albums(company.id), [repo, company.id]).items || [];
  const linkedTo = (id?: string) => projects.filter(al => id && al.service_id === id);
  const media = (id?: string) => linkedTo(id).reduce((n, al) => n + al.photos.filter(x => !al.gallery_hidden?.includes(x)).length + (al.videos || []).filter(x => !al.gallery_hidden?.includes(x)).length, 0);
  const [edit, setEdit] = useState<Service | 'new' | null>(null);
  const [del, setDel] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const blank: Item = { title_ar: '', title_en: '', category_id: company.categories[0], photos: [], is_published: true, a_ar: '', a_en: '' };
  const save = async (x: Item) => {
    const base = edit && edit !== 'new' ? edit : { company_id: company.id, position: items?.length || 0 };
    await repo.saveService({ ...base, id: x.id, company_id: company.id, category_id: x.category_id, title_ar: x.title_ar, title_en: x.title_en, description_ar: x.a_ar.trim(), description_en: x.a_en.trim(), photos: x.photos, is_published: x.is_published, cover_url: x.cover ?? null, keywords: x.kw || [] } as Service);
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
            {items.map(s => <Tile key={s.id} item={svcToItem(s)} n={media(s.id) + s.photos.length} thumb={s.cover_url || linkedTo(s.id)[0]?.photos[0]} sub={p.pick(p.cat(s.category_id)?.name_ar || '', p.cat(s.category_id)?.name_en || '')} onEdit={() => setEdit(s)} onDelete={() => setDel(s)} />)}
          </div>
        )}
      {edit && <Editor title={edit === 'new' ? t.newService : t.editService} isProject={false} linked={edit === 'new' ? [] : linkedTo(edit.id)} initial={edit === 'new' ? blank : svcToItem(edit)} onClose={() => setEdit(null)} onSave={save} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}

/* ───────────────────────── Projects (portfolio albums) ───────────────────────── */

const albToItem = (a: Album): Item => ({ id: a.id, title_ar: a.title_ar, title_en: a.title_en, category_id: a.category_id, photos: a.photos, is_published: a.is_published, a_ar: a.place_ar || '', a_en: a.place_en || '', videos: a.videos || [], hidden: a.gallery_hidden || [], service_id: a.service_id ?? null,
  d_ar: a.description_ar || '', d_en: a.description_en || '', done: a.completed_on ? a.completed_on.slice(0, 7) : '', area: a.area_m2 ? String(a.area_m2) : '', weeks: a.duration_weeks ? String(a.duration_weeks) : '', feat: !!a.is_featured });

export function Projects() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.albums(company.id), [repo, company.id]);
  const services = useList(() => repo.services(company.id), [repo, company.id]).items || [];
  const [edit, setEdit] = useState<Album | 'new' | null>(null);
  const [del, setDel] = useState<Album | null>(null);
  const [busy, setBusy] = useState(false);
  const cat0 = company.categories[0];
  const only = services.filter(s => s.category_id === cat0);
  const blank: Item = { title_ar: '', title_en: '', category_id: cat0, photos: [], is_published: true, a_ar: '', a_en: '', videos: [], hidden: [], service_id: only.length === 1 ? only[0].id! : null };
  const svcName = (id?: string | null) => { const s = services.find(x => x.id === id); return s ? p.pick(s.title_ar, s.title_en) : ''; };
  const save = async (x: Item) => {
    const base = edit && edit !== 'new' ? edit : { company_id: company.id, position: 0 };
    await repo.saveAlbum({ ...base, id: x.id, company_id: company.id, category_id: x.category_id, title_ar: x.title_ar, title_en: x.title_en, place_ar: x.a_ar.trim() || null, place_en: x.a_en.trim() || null, photos: x.photos, cover_photo: x.photos[0], is_published: x.is_published,
      videos: x.videos || [], gallery_hidden: (x.hidden || []).filter(h => x.photos.includes(h) || (x.videos || []).includes(h)), service_id: x.service_id ?? null,
      description_ar: (x.d_ar || '').trim(), description_en: (x.d_en || '').trim(), completed_on: x.done ? x.done + '-01' : null,
      area_m2: Number(x.area) > 0 ? Math.round(Number(x.area)) : null, duration_weeks: Number(x.weeks) > 0 ? Math.round(Number(x.weeks)) : null, is_featured: !!x.feat } as Album);
    p.showToast(t.saved); setEdit(null); reload();
  };
  // «مشاريع مميزة»: up to FEATURED_MAX projects, picked with the star on each tile (or in the editor).
  const nFeat = (items || []).filter(a => a.is_featured).length;
  const star = async (a: Album) => {
    if (!a.is_featured && nFeat >= FEATURED_MAX) { p.showToast(t.featuredFull, 'error'); return; }
    try { await repo.saveAlbum({ ...a, is_featured: !a.is_featured }); p.showToast(a.is_featured ? t.featuredOff : t.featuredOn); reload(); }
    catch (e) { p.showToast(isFeaturedLimit(e) ? t.featuredFull : t.saveFailed, 'error'); }
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
          <>
          {/* How many are featured, and how to pick them. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16, padding: '10px 14px', borderRadius: 14, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', fontWeight: 700 }}>
              <Icon name="star" size={16} filled color="oklch(0.75 0.16 80)" />{t.featuredCount.replace('{n}', p.num(nFeat))}
            </span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.featuredTip}</span>
          </div>
          <div className="pv-tiles">
            {items.map(a => <Tile key={a.id} item={albToItem(a)} onStar={() => star(a)} sub={[svcName(a.service_id), p.pick(a.place_ar || '', a.place_en || '')].filter(Boolean).join(' · ') || p.pick(p.cat(a.category_id)?.name_ar || '', p.cat(a.category_id)?.name_en || '')} onEdit={() => setEdit(a)} onDelete={() => setDel(a)} />)}
          </div>
          </>
        )}
      {edit && <Editor title={edit === 'new' ? t.newProject : t.editProject} isProject services={services} featFull={nFeat >= FEATURED_MAX && !(edit !== 'new' && edit.is_featured)} initial={edit === 'new' ? blank : albToItem(edit)} onClose={() => setEdit(null)} onSave={save} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}
