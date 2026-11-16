import { useCallback, useEffect, useState } from 'react';
import { Button, EmptyState, Icon } from '../shared/ds';
import type { Category, Location, QueueItem, Repo } from '../data';
import type { T } from '../i18n';
import { Field, Modal, PageHeader, Pill, Spinner, card } from '../ui';

/**
 * MUJEEB admins only: companies that signed up and wait for review. Approve (optionally marking
 * the company verified) makes it visible to customers; Reject sends it back with a note.
 * Takes its context as props so it also works for an admin without a company of their own.
 */
export function Approvals({ repo, t, ar, refs, toast }: {
  repo: Repo; t: T; ar: boolean; refs: { categories: Category[]; locations: Location[] }; toast: (msg: string, tone?: string) => void;
}) {
  const [items, setItems] = useState<QueueItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<QueueItem | null>(null);
  const [note, setNote] = useState('');
  const pick = (a: string, b: string) => (ar ? a : b);
  const load = useCallback(() => { repo.adminQueue().then(setItems).catch(() => setItems([])); }, [repo]);
  useEffect(load, [load]);

  const review = async (q: QueueItem, approve: boolean, verified?: boolean) => {
    setBusy(q.id + (verified ? 'v' : approve ? 'a' : 'r'));
    try {
      await repo.adminReview(q.id, approve, approve ? undefined : note.trim() || undefined, verified);
      toast(approve ? t.approvedT : t.rejectedT);
      setRejecting(null); setNote(''); load();
    } catch { toast(t.saveFailed, 'error'); } finally { setBusy(null); }
  };
  const catName = (id: number) => { const c = refs.categories.find(x => x.id === id); return c ? pick(c.name_ar, c.name_en) : String(id); };
  const govName = (id: string) => { const l = refs.locations.find(x => x.id === id); return l ? pick(l.name_ar, l.name_en) : id; };
  const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(ar ? 'ar-OM' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Muscat' }) : '');

  return (
    <>
      <PageHeader title={t.approvals} subtitle={t.approvalsSub} />
      {!items ? <Spinner /> : !items.length ? <EmptyState icon="circle-check" title={t.noPending} body={t.noPendingBody} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map(q => (
            <div key={q.id} style={{ ...card, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: 'var(--type-title)' }}>{pick(q.name_ar, q.name_en)}</span>
                  <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{pick(q.name_en, q.name_ar)}</span>
                </span>
                <Pill tone={q.status === 'pending' ? 'amber' : 'neutral'}>{q.status === 'pending' ? t.statusPending : t.statusRejected}</Pill>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px 16px', font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>
                <Line icon="mail"><span dir="ltr">{q.owner_email || '—'}</span></Line>
                <Line icon="phone"><span dir="ltr">{q.phone}</span></Line>
                <Line icon="map-pin">{pick(q.city_ar, q.city_en)} · {govName(q.governorate)}</Line>
                <Line icon="clock">{when(q.submitted_at)}</Line>
                <Line icon="briefcase">{q.services} {t.services} · {q.projects} {t.projects}</Line>
                <Line icon="image">{[!q.has_cover && t.noCover, !q.has_logo && t.noLogo].filter(Boolean).join(' · ') || t.cover + ' ✓ · ' + t.logo + ' ✓'}</Line>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{q.categories.map((c, k) => <Pill key={c} tone={k === 0 ? 'violet' : 'neutral'}>{catName(c)}</Pill>)}</div>
              {q.status === 'rejected' && q.review_note && <span style={{ font: 'var(--type-body-sm)', color: 'var(--danger)' }}>{q.review_note}</span>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button size="sm" iconLeft="check" loading={busy === q.id + 'a'} onClick={() => review(q, true)}>{t.approve}</Button>
                <Button size="sm" variant="secondary" iconLeft="badge-check" loading={busy === q.id + 'v'} onClick={() => review(q, true, true)}>{t.approveVerify}</Button>
                {q.status === 'pending' && <Button size="sm" variant="danger" iconLeft="x" onClick={() => { setRejecting(q); setNote(''); }}>{t.reject}</Button>}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title={t.reject + (rejecting ? ' · ' + pick(rejecting.name_ar, rejecting.name_en) : '')} width={480}
        footer={<><Button variant="outline" onClick={() => setRejecting(null)}>{t.cancel}</Button><Button variant="danger" iconLeft="x" loading={!!busy} onClick={() => rejecting && review(rejecting, false)}>{t.reject}</Button></>}>
        <Field label={t.rejectReason} multiline rows={3} value={note} onChange={setNote} />
      </Modal>
    </>
  );
}

const Line = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}><Icon name={icon} size={15} color="var(--text-tertiary)" style={{ flex: 'none' }} /><span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span></span>
);
