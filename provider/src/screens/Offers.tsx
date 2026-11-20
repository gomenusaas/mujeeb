import { useState } from 'react';
import { Button, EmptyState, Icon, OFFER_PALETTE, OFFER_STYLES, OfferArt, type OfferArtData } from '../shared/ds';
import { OFFER_MAX, omanToday, photoUrl, type Offer, type Service } from '../data';
import { useList, useP } from '../state';
import { Card, Confirm, Field, FileButton, Modal, PageHeader, Pill, Select, Spinner, Toggle, card } from '../ui';

/**
 * «العروض»: the company's time-limited offers. Each one is about one of its services and is drawn as an advert in one
 * of 30 designs, in a colour the company picks; customers see exactly what the preview shows (shared/ds/offer.tsx).
 * Active offers first, then ended or paused ones.
 */
export function Offers() {
  const p = useP();
  const { t, repo, company } = p;
  const list = useList(() => repo.offers(company.id), [repo, company.id]);
  const svcs = useList(() => repo.services(company.id), [repo, company.id]);
  const [edit, setEdit] = useState<Offer | null>(null);
  const [del, setDel] = useState<Offer | null>(null);
  const [busy, setBusy] = useState(false);
  const today = omanToday();
  const live = (o: Offer) => o.is_active && o.ends_on >= today;
  const items = list.items || [];
  const services = svcs.items || [];
  const fresh = (): Offer | null => services.length ? {
    company_id: company.id, service_id: services[0].id!, kicker_ar: '', kicker_en: '', headline_ar: '', headline_en: '', subline_ar: '', subline_en: '',
    terms_ar: '', terms_en: '', style: 0, color: OFFER_PALETTE[0], photo: null, ends_on: omanToday(14), is_active: true,
  } : null;
  const remove = async () => {
    if (!del?.id) return;
    setBusy(true);
    try { await repo.deleteOffer(del.id); p.showToast(t.deleted); list.reload(); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); setDel(null); }
  };
  const add = () => { const o = fresh(); if (o) setEdit(o); };
  const grid = (os: Offer[]) => (
    <div className="pv-tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {os.map(o => <OfferTile key={o.id} o={o} svc={services.find(s => s.id === o.service_id)} status={live(o) ? 'live' : !o.is_active ? 'paused' : 'ended'}
        onEdit={() => setEdit(o)} onDelete={() => setDel(o)} />)}
    </div>
  );
  return (
    <>
      <PageHeader title={t.offers} subtitle={t.offersHelp} actions={services.length ? <Button iconLeft="plus" onClick={add}>{t.newOffer}</Button> : undefined} />
      {!list.items || !svcs.items ? <Spinner /> : !services.length
        ? <Card><EmptyState icon="briefcase" title={t.noOffers} body={t.needService} action={<Button onClick={() => p.go('services')}>{t.goServices}</Button>} /></Card>
        : (
          <>
            {!items.some(live)
              ? <Card><EmptyState icon="tag" title={t.noOffers} body={t.noOffersBody} action={<Button iconLeft="plus" onClick={add}>{t.newOffer}</Button>} /></Card>
              : <><span style={{ font: 'var(--type-h3)' }}>{t.activeOffers}</span>{grid(items.filter(live))}</>}
            {items.some(o => !live(o)) && <><span style={{ font: 'var(--type-h3)', marginTop: 8 }}>{t.pastOffers}</span>{grid(items.filter(o => !live(o)))}</>}
          </>
        )}
      {edit && <OfferEditor offer={edit} services={services} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}

/** The photo an offer shows: its own, else the service's cover or first photo. */
const offerPhoto = (o: Offer, svc?: Service) => {
  const id = o.photo || svc?.cover_url || svc?.photos[0];
  return id ? photoUrl(id, 700) : null;
};

/** What the advert shows, in the dashboard's language (English falls back to Arabic). */
function useArt() {
  const p = useP();
  return (o: Offer, svc?: Service): OfferArtData => ({
    style: o.style, color: o.color, tag: p.t.offerTag,
    kicker: p.pick(o.kicker_ar, o.kicker_en || o.kicker_ar), big: p.pick(o.headline_ar, o.headline_en || o.headline_ar) || '٢٠٪',
    sub: p.pick(o.subline_ar, o.subline_en || o.subline_ar),
    until: p.t.offerUntil + ' ' + new Date(o.ends_on + 'T12:00:00+04:00').toLocaleDateString(p.ar ? 'ar-OM' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Muscat' }),
    photo: offerPhoto(o, svc),
  });
}

function OfferTile({ o, svc, status, onEdit, onDelete }: { o: Offer; svc?: Service; status: 'live' | 'paused' | 'ended'; onEdit: () => void; onDelete: () => void }) {
  const p = useP();
  const { t } = p;
  const art = useArt();
  return (
    <div style={{ ...card, overflow: 'hidden', opacity: status === 'live' ? 1 : 0.75 }}>
      <button type="button" onClick={onEdit} aria-label={t.edit} style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
        <OfferArt d={art(o, svc)} rtl={p.ar} />
      </button>
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc ? p.pick(svc.title_ar, svc.title_en) : ''}</span>
          <Pill tone={status === 'live' ? 'green' : 'neutral'}>{status === 'live' ? t.offerLive : status === 'paused' ? t.offerPaused : t.offerEnded}</Pill>
        </span>
        <span style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" iconLeft="pencil" onClick={onEdit} style={{ flex: 1 }}>{t.edit}</Button>
          <Button size="sm" variant="danger" iconLeft="trash-2" onClick={onDelete}>{t.delete}</Button>
        </span>
      </div>
    </div>
  );
}

/** Add or edit an offer: the live preview, the service, texts, end date, photo, colour and design. */
function OfferEditor({ offer, services, onClose, onSaved }: { offer: Offer; services: Service[]; onClose: () => void; onSaved: () => void }) {
  const p = useP();
  const { t, repo, company } = p;
  const art = useArt();
  const [o, setO] = useState(offer);
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (x: Partial<Offer>) => setO(v => ({ ...v, ...x }));
  const svc = services.find(s => s.id === o.service_id);
  const today = omanToday();
  const errHead = !o.headline_ar.trim() ? t.required : undefined;
  const errDate = !o.ends_on || o.ends_on < today ? t.endsPast : undefined;
  const cut = (n: number) => (v: string) => v.slice(0, n);
  const save = async () => {
    setTried(true);
    if (errHead || errDate || !svc) return;
    setBusy(true);
    try {
      const trim = (v: string) => v.trim();
      await repo.saveOffer({ ...o, kicker_ar: trim(o.kicker_ar), kicker_en: trim(o.kicker_en), headline_ar: trim(o.headline_ar), headline_en: trim(o.headline_en), subline_ar: trim(o.subline_ar), subline_en: trim(o.subline_en), terms_ar: trim(o.terms_ar), terms_en: trim(o.terms_en) });
      p.showToast(t.saved);
      onSaved();
    } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); }
  };
  const upload = async (fs: File[]) => {
    setUploading(true);
    try { set({ photo: await repo.upload(company.id, fs[0], 'offer-' + fs[0].name) }); } catch { p.showToast(t.uploadFailed, 'error'); } finally { setUploading(false); }
  };
  // Photo choices: the service's own (null), each of the service's photos, and an uploaded one.
  const svcPhotos = svc ? [...new Set([svc.cover_url, ...svc.photos].filter(Boolean) as string[])].slice(0, 8) : [];
  const own = o.photo && !svcPhotos.includes(o.photo) ? o.photo : null;
  const label = (s: string) => <span style={{ font: 'var(--type-body-sm)', fontWeight: 700 }}>{s}</span>;
  const help = (s: string) => <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{s}</span>;
  const thumb = (id: string | null, key: string, img: string | null) => (
    <button key={key} type="button" onClick={() => set({ photo: id })} aria-pressed={o.photo === id}
      style={{ position: 'relative', flex: 'none', width: 64, height: 64, padding: 0, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: 'none', background: 'var(--neutral-100)', boxShadow: o.photo === id ? '0 0 0 3px var(--brand)' : 'inset 0 0 0 1px var(--border-default)' }}>
      {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
    </button>
  );
  return (
    <Modal open onClose={onClose} title={offer.id ? t.editOffer : t.newOffer} width={980}
      footer={<><Button variant="outline" onClick={onClose}>{t.cancel}</Button><Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button></>}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* The preview stays in view while the form scrolls (on wide screens; see .pv-offer-preview). */}
        <div className="pv-offer-preview" style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--surface-card)', paddingBottom: 8 }}>
          {label(t.offerPreview)}
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 14px oklch(0.2 0.03 285 / 0.18)' }}><OfferArt d={art(o, svc)} rtl={p.ar} /></div>
        </div>
        <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Select label={t.offerService} value={o.service_id} options={services.map(s => ({ value: s.id!, label: p.pick(s.title_ar, s.title_en) }))} onChange={v => set({ service_id: v, photo: null })} />
            {help(t.offerServiceHelp)}
          </span>

          {label(t.offerTexts)}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <Field label={t.kickerAr} dir="rtl" value={o.kicker_ar} placeholder={t.kickerPh} onChange={v => set({ kicker_ar: cut(OFFER_MAX.kicker)(v) })} />
            <Field label={t.headlineAr} dir="rtl" value={o.headline_ar} placeholder={t.headlinePh} onChange={v => set({ headline_ar: cut(OFFER_MAX.headline)(v) })} error={tried ? errHead : undefined} />
          </div>
          <Field label={t.sublineAr} dir="rtl" value={o.subline_ar} placeholder={t.sublinePh} onChange={v => set({ subline_ar: cut(OFFER_MAX.subline)(v) })} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <Field label={t.kickerEn} dir="ltr" value={o.kicker_en} onChange={v => set({ kicker_en: cut(OFFER_MAX.kicker)(v) })} />
            <Field label={t.headlineEn} dir="ltr" value={o.headline_en} onChange={v => set({ headline_en: cut(OFFER_MAX.headline)(v) })} />
          </div>
          <Field label={t.sublineEn} dir="ltr" value={o.subline_en} onChange={v => set({ subline_en: cut(OFFER_MAX.subline)(v) })} help={t.englishOptional} />

          <Field label={t.endsOn} type="date" value={o.ends_on} onChange={v => set({ ends_on: v })} error={tried ? errDate : undefined} />

          <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {label(t.offerColor)}
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {OFFER_PALETTE.map(c => (
                <button key={c} type="button" aria-label={c} aria-pressed={o.color.toLowerCase() === c.toLowerCase()} onClick={() => set({ color: c })}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: c, boxShadow: o.color.toLowerCase() === c.toLowerCase() ? '0 0 0 3px #fff, 0 0 0 5px ' + c : 'inset 0 0 0 1px oklch(0 0 0 / 0.1)' }} />
              ))}
              {/* Any other colour. */}
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px 0 4px', borderRadius: 999, cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--border-default)', font: 'var(--type-body-sm)', fontWeight: 600 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: OFFER_PALETTE.some(c => c.toLowerCase() === o.color.toLowerCase()) ? 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' : o.color }} />
                {t.customColor}
                <input type="color" value={o.color} onChange={e => set({ color: e.target.value })} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              </label>
            </span>
          </span>

          <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {label(t.offerPhoto)}
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {svcPhotos.map(id => thumb(id === svcPhotos[0] ? null : id, id, photoUrl(id, 160)))}
              {own && thumb(own, 'own', photoUrl(own, 160))}
              <FileButton accept="image/jpeg,image/png,image/webp" icon="upload" loading={uploading} onFiles={upload}>{t.uploadPhoto}</FileButton>
            </span>
            {help(t.offerPhotoHelp)}
          </span>

          <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {label(t.offerStyle)}
            {help(t.offerStyleHelp)}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {Array.from({ length: OFFER_STYLES }, (_, s) => (
                <button key={s} type="button" aria-label={t.offerStyle + ' ' + (s + 1)} aria-pressed={o.style === s} onClick={() => set({ style: s })}
                  style={{ position: 'relative', padding: 0, border: 'none', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: 'none', boxShadow: o.style === s ? '0 0 0 3px var(--brand)' : '0 1px 4px oklch(0.2 0.03 285 / 0.18)' }}>
                  <OfferArt d={art({ ...o, style: s }, svc)} rtl={p.ar} />
                  {o.style === s && <span style={{ position: 'absolute', top: 6, insetInlineEnd: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={14} /></span>}
                </button>
              ))}
            </div>
          </span>

          <Field label={t.termsAr} dir="rtl" multiline rows={3} value={o.terms_ar} onChange={v => set({ terms_ar: cut(OFFER_MAX.terms)(v) })} help={t.termsHelp} />
          <Field label={t.termsEn} dir="ltr" multiline rows={3} value={o.terms_en} onChange={v => set({ terms_en: cut(OFFER_MAX.terms)(v) })} />
          <Toggle on={o.is_active} onChange={v => set({ is_active: v })} label={t.offerActive} help={t.offerActiveHelp} />
        </div>
      </div>
    </Modal>
  );
}
