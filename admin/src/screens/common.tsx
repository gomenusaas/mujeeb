import { type ReactNode } from 'react';
import { Button, EmptyState, Icon } from '../shared/ds';
import { useA } from '../state';
import { Modal } from '../ui';

export function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useA();
  return <EmptyState icon="circle-alert" title={t.loadFailed} action={<Button variant="outline" iconLeft="refresh-cw" onClick={onRetry}>{t.retry}</Button>} />;
}

/** Search box + filter chips above a list. */
export function Toolbar({ q, onQ, placeholder, chips }: {
  q: string; onQ: (v: string) => void; placeholder: string;
  chips: { id: string; label: string; n?: number; on: boolean; pick: () => void }[];
}) {
  const { num } = useA();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: '1 1 auto' }}>
        {chips.map(c => (
          <button key={c.id} type="button" aria-pressed={c.on} onClick={c.pick}
            style={{ height: 34, padding: '0 14px', borderRadius: 999, cursor: 'pointer', font: '600 13px var(--font-sans)', whiteSpace: 'nowrap',
              border: c.on ? 'none' : '1px solid var(--border-default)', background: c.on ? '#1f1a2e' : 'var(--surface-card)', color: c.on ? '#fff' : 'var(--text-primary)' }}>
            {c.label}{c.n != null ? ' (' + num(c.n) + ')' : ''}
          </button>
        ))}
      </div>
      <label style={{ flex: '0 1 300px', minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', borderRadius: 12, background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)' }}>
        <Icon name="search" size={17} color="var(--text-tertiary)" />
        <input value={q} onChange={e => onQ(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--type-body-sm)', color: 'var(--text-primary)' }} />
      </label>
    </div>
  );
}

/** "Are you sure?" dialog for destructive actions. */
export function ConfirmModal({ open, title, body, confirm, busy, onCancel, onConfirm, children }: {
  open: boolean; title: string; body: string; confirm: string; busy?: boolean; onCancel: () => void; onConfirm: () => void; children?: ReactNode;
}) {
  const { t } = useA();
  return (
    <Modal open={open} onClose={onCancel} title={title} width={460}
      footer={<><Button variant="outline" onClick={onCancel}>{t.cancel}</Button><Button variant="danger" loading={busy} onClick={onConfirm}>{confirm}</Button></>}>
      <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{body}</span>
      {children}
    </Modal>
  );
}

/** The admin functions raise plain English messages; show the friendly translated ones we know. */
export function errText(e: unknown, t: { noSuchAccount: string; failed: string }) {
  const m = String((e as Error)?.message || '');
  if (m.includes('No account with this email')) return t.noSuchAccount;
  return m && !/fetch|network/i.test(m) ? m : t.failed;
}
