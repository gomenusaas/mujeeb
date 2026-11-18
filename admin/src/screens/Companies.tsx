import { useEffect, useState } from 'react';
import { Avatar, Button, EmptyState, Icon } from '../shared/ds';
import { api, CUSTOMER_URL, logoOf, photoUrl, type AdminCompany, type CompanyDetails, type CompanyFilter } from '../api';
import { useA, useLoad } from '../state';
import { Field, Modal, PageHeader, Pill, Select, Spinner, Toggle, card } from '../ui';
import { ConfirmModal, LoadError, Toolbar, errText } from './common';

/** Status pill for a company: pending, live, hidden or rejected. */
function StatusPill({ c }: { c: AdminCompany }) {
  const { t } = useA();
  if (c.status === 'pending') return <Pill tone="amber">{t.stPending}</Pill>;
  if (c.status === 'rejected') return <Pill tone="red">{t.stRejected}</Pill>;
  return c.is_published ? <Pill tone="green">{t.stLive}</Pill> : <Pill tone="neutral">{t.stHidden}</Pill>;
}

export function Companies() {
  const a = useA();
  const { t, pick, num } = a;
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const f = a.companyFilter;
  useEffect(() => { const id = setTimeout(() => setQuery(q), 300); return () => clearTimeout(id); }, [q]);
  const list = useLoad(() => api.companies(query, f), [query, f]);
  const counts = useLoad(() => api.overview(), [list.data]);
  const [open, setOpen] = useState<AdminCompany | null>(null);
  const c = counts.data;
  const chips: { id: string; label: string; n?: number; v: CompanyFilter }[] = [
    { id: 'pending', label: t.fPending, n: c?.pending, v: 'pending' }, { id: 'approved', label: t.fLive, n: c?.approved, v: 'approved' },
    { id: 'hidden', label: t.fHidden, n: c?.hidden, v: 'hidden' }, { id: 'rejected', label: t.fRejected, n: c?.rejected, v: 'rejected' },
    { id: 'all', label: t.fAll, v: null },
  ];
  const changed = () => { list.reload(); };
  return (
    <>
      <PageHeader title={t.companies} subtitle={t.companiesSub} />
      <Toolbar q={q} onQ={setQ} placeholder={t.searchCompanies}
        chips={chips.map(x => ({ id: x.id, label: x.label, n: x.n, on: f === x.v, pick: () => a.setCompanyFilter(x.v) }))} />
      {list.error ? <LoadError onRetry={list.reload} /> : !list.data ? <Spinner /> : !list.data.length ? <EmptyState icon="building-2" title={t.noCompanies} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.data.map(co => (
            <button key={co.id} type="button" onClick={() => setOpen(co)}
              style={{ ...card, border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'start', font: 'inherit', color: 'inherit', flexWrap: 'wrap' }}>
              <Avatar name={pick(co.name_ar, co.name_en)} src={logoOf(co)} size={46} verified={co.is_verified} />
              <span style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: 'var(--type-body-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pick(co.name_ar, co.name_en)}</span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pick(co.city_ar, co.city_en)} · {co.categories.map(a.catName).join('، ')}
                </span>
              </span>
              <span className="pv-hide-phone" style={{ flex: '0 1 220px', minWidth: 0, font: 'var(--type-caption)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span dir="ltr" style={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'start' }}>{co.owner_email || '—'}</span>
                <span>{num(co.services)} {t.services} · {num(co.projects)} {t.projects} · {num(co.followers)} {t.followers}</span>
              </span>
              <StatusPill c={co} />
            </button>
          ))}
        </div>
      )}
      {open && <CompanyPanel key={open.id} co={open} onClose={() => setOpen(null)} onChanged={changed} />}
    </>
  );
}

/** Everything an admin can do with one company. */
function CompanyPanel({ co, onClose, onChanged }: { co: AdminCompany; onClose: () => void; onChanged: () => void }) {
  const a = useA();
  const { t, pick, num } = a;
  const [c, setC] = useState(co);
  const [busy, setBusy] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');
  const [deleting, setDeleting] = useState(false);
  const run = async (key: string, fn: () => Promise<void>, ok: string, after?: (x: AdminCompany) => AdminCompany) => {
    setBusy(key);
    try { await fn(); if (after) setC(after); a.showToast(ok); onChanged(); return true; }
    catch (e) { a.showToast(errText(e, t), 'error'); return false; } finally { setBusy(''); }
  };
  const live = c.status === 'approved' && c.is_published;

  return (
    <Modal open onClose={onClose} width={820} title={
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={pick(c.name_ar, c.name_en)} src={logoOf(c)} size={40} verified={c.is_verified} />
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span>{pick(c.name_ar, c.name_en)}</span>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{pick(c.name_en, c.name_ar)}</span>
        </span>
      </span>
    }>
      {/* Status and review */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <StatusPill c={c} />
        {c.is_verified && <Pill tone="violet">{t.verified}</Pill>}
        {!c.cover_photo && <Pill tone="neutral">{t.noCover}</Pill>}
        {!c.logo_url && <Pill tone="neutral">{t.noLogo}</Pill>}
        <span style={{ flex: 1 }} />
        {live && <a href={CUSTOMER_URL + '/company/' + c.id} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}><Icon name="link" size={15} />{t.openInApp}</a>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '6px 16px', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
        <Line icon="mail"><span dir="ltr">{c.owner_email || '—'}</span></Line>
        <Line icon="phone"><span dir="ltr">{c.phone}</span></Line>
        <Line icon="map-pin">{pick(c.city_ar, c.city_en)} · {a.govName(c.governorate)}</Line>
        <Line icon="clock">{c.status === 'approved' ? t.joined + ' ' + a.when(c.created_at) : t.submitted + ' ' + a.when(c.submitted_at || c.created_at)}</Line>
        <Line icon="briefcase">{num(c.services)} {t.services} · {num(c.projects)} {t.projects}</Line>
        <Line icon="user-check">{num(c.followers)} {t.followers}</Line>
      </div>
      {c.status === 'rejected' && c.review_note && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--danger-tint)', color: 'var(--danger)', font: 'var(--type-body-sm)' }}><b>{t.rejectedNote}:</b> {c.review_note}</div>
      )}
      {c.status !== 'approved' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button iconLeft="check" loading={busy === 'a'} onClick={() => run('a', () => api.review(c.id, true), t.approvedT, x => ({ ...x, status: 'approved', is_published: true, review_note: null }))}>{t.approve}</Button>
          <Button variant="secondary" iconLeft="badge-check" loading={busy === 'av'} onClick={() => run('av', () => api.review(c.id, true, undefined, true), t.approvedT, x => ({ ...x, status: 'approved', is_published: true, is_verified: true, review_note: null }))}>{t.approveVerify}</Button>
          {c.status === 'pending' && <Button variant="danger" iconLeft="x" onClick={() => { setNote(''); setRejecting(true); }}>{t.reject}</Button>}
        </div>
      )}
      {c.status === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 16, background: 'var(--neutral-50)' }}>
          <Toggle on={c.is_published} label={t.visible} help={t.visibleHelp}
            onChange={v => run('p', () => api.setFlags(c.id, { published: v }), t.saved, x => ({ ...x, is_published: v }))} />
          <Toggle on={c.is_verified} label={t.verified} help={t.verifiedHelp}
            onChange={v => run('v', () => api.setFlags(c.id, { verified: v }), t.saved, x => ({ ...x, is_verified: v }))} />
        </div>
      )}

      <Details c={c} onSaved={d => { setC(x => ({ ...x, ...d })); onChanged(); }} />
      <Categories c={c} onSaved={cats => { setC(x => ({ ...x, categories: cats })); onChanged(); }} />
      <Featured cid={c.id} />
      <Team cid={c.id} />

      <Section title={t.dangerZone}>
        <div><Button variant="danger" iconLeft="trash-2" onClick={() => setDeleting(true)}>{t.deleteCompany}</Button></div>
      </Section>

      <Modal open={rejecting} onClose={() => setRejecting(false)} title={t.reject + ' · ' + pick(c.name_ar, c.name_en)} width={480}
        footer={<><Button variant="outline" onClick={() => setRejecting(false)}>{t.cancel}</Button>
          <Button variant="danger" iconLeft="x" loading={busy === 'r'} onClick={async () => { if (await run('r', () => api.review(c.id, false, note.trim() || undefined), t.rejectedT, x => ({ ...x, status: 'rejected', review_note: note.trim() || null }))) setRejecting(false); }}>{t.reject}</Button></>}>
        <Field label={t.rejectReason} multiline rows={3} value={note} onChange={setNote} />
      </Modal>
      <ConfirmModal open={deleting} title={t.deleteCompany + ' · ' + pick(c.name_ar, c.name_en)} body={t.deleteCompanyBody} confirm={t.deleteForGood} busy={busy === 'd'}
        onCancel={() => setDeleting(false)} onConfirm={async () => { if (await run('d', () => api.deleteCompany(c.id), t.deleted)) { setDeleting(false); onClose(); } }} />
    </Modal>
  );
}

const Line = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}><Icon name={icon} size={15} color="var(--text-tertiary)" style={{ flex: 'none' }} /><span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span></span>
);

function Section({ title, help, children }: { title: string; help?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-title)' }}>{title}</span>
        {help && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{help}</span>}
      </span>
      {children}
    </section>
  );
}

function Details({ c, onSaved }: { c: AdminCompany; onSaved: (d: CompanyDetails) => void }) {
  const a = useA();
  const { t, pick } = a;
  const pickD = (x: AdminCompany): CompanyDetails => ({ name_ar: x.name_ar, name_en: x.name_en, phone: x.phone, city_ar: x.city_ar, city_en: x.city_en, governorate: x.governorate, description_ar: x.description_ar, description_en: x.description_en });
  const [d, setD] = useState(pickD(c));
  const [busy, setBusy] = useState(false);
  const set = (k: keyof CompanyDetails) => (v: string) => setD(o => ({ ...o, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify(pickD(c));
  const save = async () => {
    setBusy(true);
    try { await api.updateCompany(c.id, d); onSaved(d); a.showToast(t.saved); } catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(false); }
  };
  return (
    <Section title={t.details}>
      <div className="pv-grid-2">
        <Field label={t.nameAr} dir="rtl" value={d.name_ar} onChange={set('name_ar')} />
        <Field label={t.nameEn} dir="ltr" value={d.name_en} onChange={set('name_en')} />
        <Field label={t.phone} dir="ltr" value={d.phone} onChange={set('phone')} />
        <Select label={t.governorate} value={d.governorate} onChange={set('governorate')} options={a.refs.locations.map(l => ({ value: l.id, label: pick(l.name_ar, l.name_en) }))} />
        <Field label={t.cityAr} dir="rtl" value={d.city_ar} onChange={set('city_ar')} />
        <Field label={t.cityEn} dir="ltr" value={d.city_en} onChange={set('city_en')} />
        <Field label={t.aboutAr} dir="rtl" multiline rows={3} value={d.description_ar} onChange={set('description_ar')} />
        <Field label={t.aboutEn} dir="ltr" multiline rows={3} value={d.description_en} onChange={set('description_en')} />
      </div>
      <div><Button size="sm" iconLeft="check" disabled={!dirty} loading={busy} onClick={save}>{t.save}</Button></div>
    </Section>
  );
}

function Categories({ c, onSaved }: { c: AdminCompany; onSaved: (cats: number[]) => void }) {
  const a = useA();
  const { t, pick } = a;
  const [cats, setCats] = useState(c.categories);
  const [busy, setBusy] = useState(false);
  const toggle = (id: number) => setCats(x => (x.includes(id) ? x.filter(y => y !== id) : x.length < 3 ? [...x, id] : x));
  const dirty = cats.join() !== c.categories.join();
  const save = async () => {
    setBusy(true);
    try { await api.setCategories(c.id, cats); onSaved(cats); a.showToast(t.saved); } catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(false); }
  };
  return (
    <Section title={t.categories} help={t.categoriesHelp}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {a.refs.categories.map(cat => {
          const k = cats.indexOf(cat.id);
          return (
            <button key={cat.id} type="button" aria-pressed={k >= 0} onClick={() => toggle(cat.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 999, cursor: 'pointer', font: '600 13px var(--font-sans)',
                border: k >= 0 ? '1.5px solid var(--brand)' : '1px solid var(--border-default)', background: k >= 0 ? 'var(--brand-tint, #f3efff)' : 'var(--surface-card)', color: k >= 0 ? 'var(--brand)' : 'var(--text-primary)' }}>
              {k >= 0 && <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--brand)', color: '#fff', font: '700 11px/18px var(--font-sans)', textAlign: 'center' }}>{a.num(k + 1)}</span>}
              {pick(cat.name_ar, cat.name_en)}
            </button>
          );
        })}
      </div>
      <div><Button size="sm" iconLeft="check" disabled={!dirty || !cats.length} loading={busy} onClick={save}>{t.save}</Button></div>
    </Section>
  );
}

/** «مشاريع مميزة»: the projects the company picked for its page; an admin can take one off. */
function Featured({ cid }: { cid: string }) {
  const a = useA();
  const { t, pick } = a;
  const f = useLoad(() => api.featured(cid), [cid]);
  const [busy, setBusy] = useState('');
  const off = async (id: string) => {
    setBusy(id);
    try { await api.setFeatured(id, false); a.showToast(t.unfeatured); f.reload(); }
    catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(''); }
  };
  return (
    <Section title={t.featuredT + (f.data?.length ? ' · ' + a.num(f.data.length) + ' / ' + a.num(7) : '')} help={t.featuredHelp}>
      {f.error ? <LoadError onRetry={f.reload} /> : !f.data ? <Spinner size={22} /> : !f.data.length
        ? <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.noFeatured}</span>
        : f.data.map(x => (
          <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={photoUrl(x.cover_photo)} alt="" style={{ flex: 'none', width: 56, height: 42, borderRadius: 8, objectFit: 'cover', background: 'var(--neutral-100)' }} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: 'var(--type-body-sm)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pick(x.title_ar, x.title_en)}</span>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{a.catName(x.category_id)}</span>
            </span>
            {!x.is_published && <Pill tone="neutral">{t.hiddenProject}</Pill>}
            <Button size="sm" variant="outline" loading={busy === x.id} onClick={() => off(x.id)}>{t.unfeature}</Button>
          </div>
        ))}
    </Section>
  );
}

function Team({ cid }: { cid: string }) {
  const a = useA();
  const { t } = a;
  const m = useLoad(() => api.members(cid), [cid]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'editor'>('editor');
  const [busy, setBusy] = useState('');
  const add = async () => {
    if (!email.trim()) return;
    setBusy('add');
    try { await api.addMember(cid, email.trim(), role); setEmail(''); a.showToast(t.memberAdded); m.reload(); }
    catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(''); }
  };
  const remove = async (uid: string) => {
    setBusy(uid);
    try { await api.removeMember(cid, uid); a.showToast(t.memberRemoved); m.reload(); }
    catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(''); }
  };
  return (
    <Section title={t.team} help={t.teamHelp}>
      {m.error ? <LoadError onRetry={m.reload} /> : !m.data ? <Spinner size={22} /> : !m.data.length
        ? <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{t.noMembers}</span>
        : m.data.map(x => (
          <div key={x.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={x.full_name || x.email} size={36} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: 'var(--type-body-sm)', fontWeight: 700 }}>{x.full_name || x.email.split('@')[0]}</span>
              <span dir="ltr" style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)', textAlign: 'start' }}>{x.email}</span>
            </span>
            <Pill tone={x.role === 'owner' ? 'violet' : 'neutral'}>{x.role === 'owner' ? t.roleOwner : t.roleEditor}</Pill>
            <Button size="sm" variant="outline" loading={busy === x.user_id} onClick={() => remove(x.user_id)}>{t.remove}</Button>
          </div>
        ))}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Field label={t.memberEmail} type="email" dir="ltr" value={email} onChange={setEmail} help={t.mustSignUp} style={{ flex: '1 1 240px' }} />
        <div style={{ flex: '0 0 150px' }}><Select label={t.role} value={role} onChange={setRole} options={[{ value: 'editor', label: t.roleEditor }, { value: 'owner', label: t.roleOwner }]} /></div>
        <div style={{ paddingBottom: 22 }}><Button size="sm" iconLeft="user-plus" loading={busy === 'add'} onClick={add}>{t.addMember}</Button></div>
      </div>
    </Section>
  );
}
