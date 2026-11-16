import { useEffect, useState } from 'react';
import { Avatar, Button, EmptyState } from '../shared/ds';
import { api, CUSTOMER_URL, PROVIDER_URL, type AdminUser } from '../api';
import { useA, useLoad } from '../state';
import { Pill, Spinner, card } from '../ui';
import { ConfirmModal, LoadError, Toolbar, errText } from './common';

/** Every account: customers and company accounts. Reset password, block, delete. */
export function Users() {
  const a = useA();
  const { t, num } = a;
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'customer' | 'provider' | null>(null);
  useEffect(() => { const id = setTimeout(() => setQuery(q), 300); return () => clearTimeout(id); }, [q]);
  const list = useLoad(() => api.users(query, kind), [query, kind]);
  const [busy, setBusy] = useState('');
  const [ask, setAsk] = useState<{ u: AdminUser; what: 'block' | 'delete' } | null>(null);

  const act = async (key: string, fn: () => Promise<void>, ok: string) => {
    setBusy(key);
    try { await fn(); a.showToast(ok); list.reload(); return true; } catch (e) { a.showToast(errText(e, t), 'error'); return false; } finally { setBusy(''); }
  };
  const reset = (u: AdminUser) => act('r' + u.id, () => api.sendReset(u.email, u.kind === 'provider' ? PROVIDER_URL : CUSTOMER_URL + '/profile'), t.resetSentTo + ' ' + u.email);

  return (
    <>
      <PageHeaderLite title={t.users} subtitle={t.usersSub} />
      <Toolbar q={q} onQ={setQ} placeholder={t.searchUsers} chips={[
        { id: 'all', label: t.fAll, on: kind === null, pick: () => setKind(null) },
        { id: 'c', label: t.fCustomers, on: kind === 'customer', pick: () => setKind('customer') },
        { id: 'p', label: t.fProviders, on: kind === 'provider', pick: () => setKind('provider') },
      ]} />
      {list.error ? <LoadError onRetry={list.reload} /> : !list.data ? <Spinner /> : !list.data.length ? <EmptyState icon="user-round" title={t.noUsers} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>{num(list.data.length)}</span>
          {list.data.map(u => {
            const self = u.id === a.me.id;
            return (
              <div key={u.id} style={{ ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Avatar name={u.full_name || u.email} size={42} />
                <span style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--type-body-strong)' }}>{u.full_name || u.email.split('@')[0]}</span>
                    <Pill tone={u.kind === 'provider' ? 'violet' : 'neutral'}>{u.kind === 'provider' ? t.kindProvider : t.kindCustomer}</Pill>
                    {u.is_admin && <Pill tone="amber">{t.adminTag}</Pill>}
                    {u.blocked && <Pill tone="red">{t.blocked}</Pill>}
                    {!u.confirmed && <Pill tone="neutral">{t.unconfirmedTag}</Pill>}
                    {self && <Pill tone="green">{t.you}</Pill>}
                  </span>
                  <span dir="ltr" style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)', textAlign: 'start', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-tertiary)' }}>
                    {(u.sign_in_with === 'google' ? t.viaGoogle : t.viaEmail)} · {t.created} {a.when(u.created_at)} · {t.lastSignIn} {u.last_sign_in_at ? a.when(u.last_sign_in_at) : t.never}
                    {u.companies.length > 0 && ' · ' + u.companies.join('، ')}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="outline" iconLeft="mail" loading={busy === 'r' + u.id} onClick={() => reset(u)}>{t.sendReset}</Button>
                  {!self && (u.blocked
                    ? <Button size="sm" variant="secondary" loading={busy === 'b' + u.id} onClick={() => act('b' + u.id, () => api.setBlocked(u.id, false), t.unblockedT)}>{t.unblock}</Button>
                    : <Button size="sm" variant="outline" onClick={() => setAsk({ u, what: 'block' })}>{t.block}</Button>)}
                  {!self && <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setAsk({ u, what: 'delete' })} />}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <ConfirmModal open={!!ask} busy={!!busy}
        title={(ask?.what === 'block' ? t.block : t.deleteUser) + (ask ? ' · ' + ask.u.email : '')}
        body={ask?.what === 'block' ? t.blockBody : t.deleteUserBody}
        confirm={ask?.what === 'block' ? t.block : t.deleteForGood}
        onCancel={() => setAsk(null)}
        onConfirm={async () => {
          if (!ask) return;
          const ok = ask.what === 'block'
            ? await act('b' + ask.u.id, () => api.setBlocked(ask.u.id, true), t.blockedT)
            : await act('d' + ask.u.id, () => api.deleteUser(ask.u.id), t.deleted);
          if (ok) setAsk(null);
        }} />
    </>
  );
}

const PageHeaderLite = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <h1 style={{ margin: 0, font: 'var(--type-h1)' }}>{title}</h1>
    <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{subtitle}</span>
  </div>
);
