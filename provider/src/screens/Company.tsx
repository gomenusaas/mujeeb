import { useState } from 'react';
import { Avatar, Button, Icon } from '../shared/ds';
import { logoOf, photoUrl, type Branch, type Company } from '../data';
import { useList, useP } from '../state';
import { Card, Confirm, Field, FileButton, Modal, PageHeader, Pill, Select, Spinner, Toggle, card } from '../ui';

/* ───────────────────────── Company profile ───────────────────────── */

type Form = Pick<Company, 'name_ar' | 'name_en' | 'description_ar' | 'description_en' | 'city_ar' | 'city_en' | 'governorate' | 'phone' | 'cover_photo' | 'logo_url'> & { founded: string };
const toForm = (c: Company): Form => ({
  name_ar: c.name_ar, name_en: c.name_en, description_ar: c.description_ar, description_en: c.description_en, city_ar: c.city_ar, city_en: c.city_en,
  governorate: c.governorate, phone: c.phone, cover_photo: c.cover_photo, logo_url: c.logo_url, founded: c.founded_year ? String(c.founded_year) : '',
});

export function Profile() {
  const p = useP();
  const { t, repo, company, refs } = p;
  const [f, setF] = useState<Form>(() => toForm(company));
  const [busy, setBusy] = useState(false);
  const [up, setUp] = useState<'' | 'logo' | 'cover'>('');
  const [tried, setTried] = useState(false);
  const set = (x: Partial<Form>) => setF(v => ({ ...v, ...x }));
  const dirty = JSON.stringify(f) !== JSON.stringify(toForm(company));
  const missing = !f.name_ar.trim() || !f.name_en.trim() || !f.phone.trim();

  const upload = async (kind: 'logo' | 'cover', file: File) => {
    setUp(kind);
    try {
      const url = await repo.upload(company.id, file, kind + '-' + file.name);
      set(kind === 'logo' ? { logo_url: url } : { cover_photo: url });
    } catch { p.showToast(t.uploadFailed, 'error'); } finally { setUp(''); }
  };
  const save = async () => {
    setTried(true);
    if (missing) return;
    setBusy(true);
    const { founded, ...rest } = f;
    const patch = { ...rest, name_ar: rest.name_ar.trim(), name_en: rest.name_en.trim(), phone: rest.phone.trim(), founded_year: founded ? Number(founded) || null : null };
    try {
      await repo.saveCompany(company.id, patch);
      p.setCompany({ ...company, ...patch });
      p.showToast(t.saved);
    } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); }
  };
  const req = (v: string) => (tried && !v.trim() ? t.required : undefined);

  return (
    <>
      <PageHeader title={t.profile} actions={<>
        {dirty && <Pill tone="amber">{t.unsaved}</Pill>}
        <Button iconLeft="check" loading={busy} disabled={!dirty} onClick={save}>{t.save}</Button>
      </>} />

      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 200, background: 'var(--neutral-100)' }}>
          {f.cover_photo && <img src={photoUrl(f.cover_photo, 1200)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          <span style={{ position: 'absolute', top: 12, insetInlineEnd: 12 }}>
            <FileButton accept="image/jpeg,image/png,image/webp" icon="image-plus" loading={up === 'cover'} onFiles={fs => upload('cover', fs[0])}>{t.cover}</FileButton>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '0 22px 20px', marginTop: -40, flexWrap: 'wrap' }}>
          <Avatar name={f.name_en} src={f.logo_url || logoOf(company)} size={92} verified={company.is_verified} style={{ borderRadius: '50%', boxShadow: '0 0 0 4px var(--surface-card)' }} />
          <FileButton accept="image/jpeg,image/png,image/webp" icon="upload" loading={up === 'logo'} onFiles={fs => upload('logo', fs[0])}>{t.logo}</FileButton>
          <span style={{ marginInlineStart: 'auto' }}><Pill tone={company.is_verified ? 'violet' : 'neutral'}>{company.is_verified ? t.verified : t.notVerified}</Pill></span>
        </div>
      </Card>

      <Card title={t.basics}>
        <div className="pv-grid-2">
          <Field label={t.nameAr} dir="rtl" value={f.name_ar} onChange={v => set({ name_ar: v })} error={req(f.name_ar)} />
          <Field label={t.nameEn} dir="ltr" value={f.name_en} onChange={v => set({ name_en: v })} error={req(f.name_en)} />
          <Field label={t.aboutAr} dir="rtl" multiline value={f.description_ar} onChange={v => set({ description_ar: v })} />
          <Field label={t.aboutEn} dir="ltr" multiline value={f.description_en} onChange={v => set({ description_en: v })} />
          <Field label={t.phone} dir="ltr" type="tel" value={f.phone} onChange={v => set({ phone: v })} help={t.phoneHelp} error={req(f.phone)} placeholder="+968 9xxx xxxx" />
          <Field label={t.founded} dir="ltr" type="number" value={f.founded} onChange={v => set({ founded: v.replace(/\D/g, '').slice(0, 4) })} />
          <Field label={t.cityAr} dir="rtl" value={f.city_ar} onChange={v => set({ city_ar: v })} />
          <Field label={t.cityEn} dir="ltr" value={f.city_en} onChange={v => set({ city_en: v })} />
          <Select label={t.governorate} value={f.governorate} onChange={v => set({ governorate: v })}
            options={refs.locations.map(l => ({ value: l.id, label: p.pick(l.name_ar, l.name_en) }))} />
        </div>
      </Card>

      <Card title={t.categories} subtitle={t.categoriesNote}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {company.categories.map(id => {
            const c = p.cat(id);
            return c ? <span key={id} style={{ display: 'inline-flex', alignItems: 'center', height: 30, padding: '0 12px', borderRadius: 999, background: 'var(--cat-' + c.color + '-100)', color: 'var(--cat-' + c.color + '-800)', font: 'var(--type-caption)' }}>{p.pick(c.name_ar, c.name_en)}</span> : null;
          })}
        </div>
      </Card>
    </>
  );
}

/* ───────────────────────── Branches ───────────────────────── */

const blank = (cid: string, position: number, first: boolean): Branch => ({ company_id: cid, name_ar: '', name_en: '', address_ar: null, address_en: null, lat: null, lng: null, is_primary: first, position });
const mapsLink = (b: Branch) => 'https://www.google.com/maps/search/?api=1&query=' + b.lat + ',' + b.lng;

/** Pulls "lat,lng" out of a Google/Apple Maps URL. Short links (maps.app.goo.gl) can't be expanded in the browser. */
export function coordsFromLink(s: string): [number, number] | null {
  const pats = [/@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/, /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/, /[?&](?:q|query|ll|destination|daddr|sll)=(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/, /^\s*(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)\s*$/];
  for (const re of pats) {
    const m = re.exec(decodeURIComponent(s));
    if (m) return [Number(m[1]), Number(m[2])];
  }
  return null;
}

export function Branches() {
  const p = useP();
  const { t, repo, company } = p;
  const { items, reload } = useList(() => repo.branches(company.id), [repo, company.id]);
  const [edit, setEdit] = useState<Branch | null>(null);
  const [del, setDel] = useState<Branch | null>(null);
  const [busy, setBusy] = useState(false);
  const remove = async () => {
    if (!del?.id) return;
    setBusy(true);
    try { await repo.deleteBranch(del.id); p.showToast(t.deleted); reload(); } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); setDel(null); }
  };
  return (
    <>
      <PageHeader title={t.branches} subtitle={t.locationHelp}
        actions={<Button iconLeft="plus" onClick={() => setEdit(blank(company.id, items?.length || 0, !items?.length))}>{t.addBranch}</Button>} />
      {!items ? <Spinner /> : !items.length ? <Card><span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.noBranches}</span></Card> : (
        <div className="pv-grid-2">
          {items.map(b => (
            <div key={b.id} style={{ ...card, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 'none', width: 42, height: 42, borderRadius: 12, background: b.is_primary ? 'var(--cat-teal-100)' : 'var(--cat-sky-100)', color: b.is_primary ? 'var(--cat-teal-600)' : 'var(--cat-sky-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="map-pin" size={20} /></span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--type-title)' }}>{p.pick(b.name_ar, b.name_en)}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{p.pick(b.address_ar, b.address_en) || (b.is_primary ? t.mainBranch : t.branch)}</span>
                </span>
                {b.is_primary && <Pill tone="green">{t.mainBranch}</Pill>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {b.lat != null && b.lng != null
                  ? <a href={mapsLink(b)} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', fontWeight: 700 }}><Icon name="navigation" size={15} />{t.pinSet} · {t.openMap}</a>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', fontWeight: 600, color: 'oklch(0.48 0.11 65)' }}><Icon name="circle-alert" size={15} />{t.noPin}</span>}
                <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="outline" iconLeft="pencil" onClick={() => setEdit(b)}>{t.edit}</Button>
                  <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setDel(b)}>{t.delete}</Button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {edit && <BranchEditor branch={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload(); }} />}
      <Confirm open={!!del} busy={busy} onCancel={() => setDel(null)} onConfirm={remove} />
    </>
  );
}

function BranchEditor({ branch, onClose, onSaved }: { branch: Branch; onClose: () => void; onSaved: () => void }) {
  const p = useP();
  const { t, repo } = p;
  const [b, setB] = useState(branch);
  const [lat, setLat] = useState(branch.lat != null ? String(branch.lat) : '');
  const [lng, setLng] = useState(branch.lng != null ? String(branch.lng) : '');
  const [link, setLink] = useState('');
  const [linkErr, setLinkErr] = useState('');
  const [locating, setLocating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (x: Partial<Branch>) => setB(v => ({ ...v, ...x }));
  const nLat = lat.trim() === '' ? null : Number(lat), nLng = lng.trim() === '' ? null : Number(lng);
  const coordsOk = (nLat == null && nLng == null) || (nLat != null && nLng != null && Math.abs(nLat) <= 90 && Math.abs(nLng) <= 180 && !isNaN(nLat) && !isNaN(nLng));
  const setCoords = (a: number, o: number) => { setLat(a.toFixed(6)); setLng(o.toFixed(6)); };

  const locate = () => {
    if (!navigator.geolocation) return p.showToast(t.locateFailed, 'error');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords(pos.coords.latitude, pos.coords.longitude); setLocating(false); },
      () => { setLocating(false); p.showToast(t.locateFailed, 'error'); },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };
  const fromLink = (v: string) => {
    setLink(v);
    if (!v.trim()) return setLinkErr('');
    const c = coordsFromLink(v);
    if (c) { setCoords(c[0], c[1]); setLinkErr(''); } else setLinkErr(t.badLink);
  };
  const save = async () => {
    setTried(true);
    if (!b.name_ar.trim() || !b.name_en.trim() || !coordsOk) return;
    setBusy(true);
    try {
      await repo.saveBranch({ ...b, name_ar: b.name_ar.trim(), name_en: b.name_en.trim(), address_ar: b.address_ar?.trim() || null, address_en: b.address_en?.trim() || null, lat: nLat, lng: nLng });
      p.showToast(t.saved);
      onSaved();
    } catch { p.showToast(t.saveFailed, 'error'); } finally { setBusy(false); }
  };
  const req = (v: string) => (tried && !v.trim() ? t.required : undefined);
  const bbox = nLat != null && nLng != null && coordsOk ? [nLng - 0.004, nLat - 0.0025, nLng + 0.004, nLat + 0.0025].join(',') : null;

  return (
    <Modal open onClose={onClose} title={branch.id ? t.editBranch : t.addBranch}
      footer={<><Button variant="outline" onClick={onClose}>{t.cancel}</Button><Button iconLeft="check" loading={busy} onClick={save}>{t.save}</Button></>}>
      <div className="pv-grid-2">
        <Field label={t.branchNameAr} dir="rtl" value={b.name_ar} onChange={v => set({ name_ar: v })} error={req(b.name_ar)} placeholder="القرم، مسقط" />
        <Field label={t.branchNameEn} dir="ltr" value={b.name_en} onChange={v => set({ name_en: v })} error={req(b.name_en)} placeholder="Qurum, Muscat" />
        <Field label={t.addressAr} dir="rtl" value={b.address_ar || ''} onChange={v => set({ address_ar: v })} />
        <Field label={t.addressEn} dir="ltr" value={b.address_en || ''} onChange={v => set({ address_en: v })} />
      </div>
      <Toggle on={b.is_primary} onChange={v => set({ is_primary: v })} label={t.makeMain} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 16, background: 'var(--neutral-50)' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-title)' }}>{t.location}</span>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.locationHelp}</span>
        </span>
        <span><Button size="sm" variant="secondary" iconLeft="locate-fixed" loading={locating} onClick={locate}>{locating ? t.locating : t.useMyLocation}</Button></span>
        <Field label={t.pasteLink} dir="ltr" value={link} onChange={fromLink} placeholder={t.linkPh} error={linkErr || undefined} />
        <div className="pv-grid-2">
          <Field label={t.lat} dir="ltr" value={lat} onChange={setLat} placeholder="23.6143" error={!coordsOk && tried ? t.required : undefined} />
          <Field label={t.lng} dir="ltr" value={lng} onChange={setLng} placeholder="58.4734" />
        </div>
        {bbox && (
          <iframe title={t.location} loading="lazy" style={{ width: '100%', height: 220, border: 0, borderRadius: 12, background: 'var(--neutral-100)' }}
            src={'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + nLat + ',' + nLng} />
        )}
      </div>
    </Modal>
  );
}
