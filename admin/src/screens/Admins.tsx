import { useState } from 'react';
import { Avatar, Button } from '../shared/ds';
import { api, type AdminRow } from '../api';
import { useA, useLoad } from '../state';
import { Card, Field, PageHeader, Pill, Spinner } from '../ui';
import { ConfirmModal, LoadError, errText } from './common';

/** Who can sign in to the admin app. */
export function Admins() {
  const a = useA();
  const { t } = a;
  const list = useLoad(() => api.admins(), []);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState('');
  const [removing, setRemoving] = useState<AdminRow | null>(null);
  const add = async () => {
    if (!email.trim()) return;
    setBusy('add');
    try {
      const r = await api.inviteAdmin(email.trim(), name.trim());
      a.showToast(r.invited ? t.inviteSent + ' ' + email.trim() : t.adminAdded);
      setEmail(''); setName(''); list.reload();
    } catch (e) {
      const m = String((e as Error)?.message || '');
      a.showToast(m === 'email_not_allowed' ? t.inviteNotAllowed : m === 'bad_email' ? t.badEmail : errText(e, t), 'error');
    } finally { setBusy(''); }
  };
  const remove = async () => {
    if (!removing) return;
    setBusy('rm');
    try { await api.removeAdmin(removing.user_id); a.showToast(t.adminRemoved); setRemoving(null); list.reload(); }
    catch (e) { a.showToast(errText(e, t), 'error'); } finally { setBusy(''); }
  };
  return (
    <>
      <PageHeader title={t.admins} subtitle={t.adminsSub} />
      <Card>
        {list.error ? <LoadError onRetry={list.reload} /> : !list.data ? <Spinner size={22} /> : list.data.map(x => {
          const self = x.user_id === a.me.id;
          return (
            <div key={x.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Avatar name={x.full_name || x.email} size={40} />
              <span style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ font: 'var(--type-body-strong)' }}>{x.full_name || x.email.split('@')[0]}</span>
                  {self && <Pill tone="green">{t.you}</Pill>}
                </span>
                <span dir="ltr" style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)', textAlign: 'start' }}>{x.email}</span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{t.since} {a.when(x.created_at)} · {t.lastSignIn} {x.last_sign_in_at ? a.when(x.last_sign_in_at) : t.never}</span>
              </span>
              {!self && <Button size="sm" variant="outline" onClick={() => setRemoving(x)}>{t.removeAdmin}</Button>}
            </div>
          );
        })}
      </Card>
      <Card title={t.inviteAdmin} subtitle={t.inviteAdminHelp}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label={t.adminName} value={name} onChange={setName} style={{ flex: '1 1 200px' }} />
          <Field label={t.email} type="email" dir="ltr" value={email} onChange={setEmail} style={{ flex: '1 1 260px' }} />
          <Button iconLeft="send" loading={busy === 'add'} onClick={add}>{t.invite}</Button>
        </div>
      </Card>
      <ConfirmModal open={!!removing} title={t.removeAdmin + (removing ? ' · ' + removing.email : '')} body={t.adminsSub} confirm={t.remove} busy={busy === 'rm'}
        onCancel={() => setRemoving(null)} onConfirm={remove} />
    </>
  );
}
