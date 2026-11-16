import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from './shared/ds';

export const card: CSSProperties = { borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' };

export function Card({ title, subtitle, actions, children, style, pad = 22 }: {
  title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children?: ReactNode; style?: CSSProperties; pad?: number;
}) {
  return (
    <section style={{ ...card, padding: pad, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, ...style }}>
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            {title && <span style={{ font: 'var(--type-title)', color: 'var(--text-primary)' }}>{title}</span>}
            {subtitle && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{subtitle}</span>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 8, flex: 'none' }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <h1 style={{ margin: 0, font: 'var(--type-h1)', color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{subtitle}</span>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

const fieldBox = (focus: boolean, error?: boolean): CSSProperties => ({
  display: 'flex', alignItems: 'center', minHeight: 46, padding: '0 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)',
  boxShadow: 'inset 0 0 0 ' + (focus || error ? 2 : 1.5) + 'px ' + (error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-default)'),
});
const inputCss: CSSProperties = { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--type-body)', fontWeight: 500, color: 'var(--text-primary)', padding: 0 };

/** Labelled text input / textarea. `dir` lets an English field stay LTR inside the Arabic UI and vice versa. */
export function Field({ label, value, onChange, multiline, type = 'text', placeholder, help, error, dir, rows = 4, style }: {
  label: ReactNode; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string; placeholder?: string;
  help?: ReactNode; error?: ReactNode; dir?: 'rtl' | 'ltr'; rows?: number; style?: CSSProperties;
}) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, ...style }}>
      <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
      <span style={{ ...fieldBox(f, !!error), ...(multiline ? { alignItems: 'flex-start', padding: '12px 14px' } : {}) }}>
        {multiline
          ? <textarea rows={rows} dir={dir} value={value} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)} onChange={e => onChange(e.target.value)} style={{ ...inputCss, resize: 'vertical' }} />
          : <input type={type} dir={dir} value={value} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)} onChange={e => onChange(e.target.value)} style={{ ...inputCss, height: 44 }} />}
      </span>
      {(help || error) && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: error ? 'var(--danger)' : 'var(--text-tertiary)' }}>{error || help}</span>}
    </label>
  );
}

export function Select<V extends string | number>({ label, value, options, onChange }: {
  label: ReactNode; value: V; options: { value: V; label: string }[]; onChange: (v: V) => void;
}) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{label}</span>
      <span style={{ ...fieldBox(f), position: 'relative' }}>
        <select value={String(value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
          onChange={e => onChange((typeof value === 'number' ? Number(e.target.value) : e.target.value) as V)}
          style={{ ...inputCss, height: 44, appearance: 'none', cursor: 'pointer', paddingInlineEnd: 24 }}>
          {options.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={18} color="var(--text-tertiary)" style={{ position: 'absolute', insetInlineEnd: 14, pointerEvents: 'none' }} />
      </span>
    </label>
  );
}

export function Toggle({ on, onChange, label, help }: { on: boolean; onChange: (v: boolean) => void; label: ReactNode; help?: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 0, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'start' }}>
      <span style={{ position: 'relative', flex: 'none', width: 46, height: 28, borderRadius: 28, background: on ? 'var(--brand)' : 'var(--neutral-200)', transition: 'background var(--dur-base)' }}>
        <span style={{ position: 'absolute', top: 3, insetInlineStart: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'inset-inline-start var(--dur-base) var(--ease-out)' }} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        {help && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{help}</span>}
      </span>
    </button>
  );
}

/** Centered dialog; on phones it fills most of the screen. */
export function Modal({ open, onClose, title, children, footer, width = 640 }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; width?: number;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--surface-scrim)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: width, maxHeight: 'calc(100dvh - 32px)', display: 'flex', flexDirection: 'column', borderRadius: 22, background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px 12px' }}>
          <span style={{ flex: 1, font: 'var(--type-h3)' }}>{title}</span>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--neutral-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 20px 18px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </div>
  );
}


export const Spinner = ({ size = 28 }: { size?: number }) => (
  <span style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
    <span style={{ width: size, height: size, borderRadius: '50%', border: '3px solid var(--brand)', borderRightColor: 'transparent', animation: 'pv-spin 0.7s linear infinite' }} />
  </span>
);

/** Status pill. */
export const Pill = ({ tone, children }: { tone: 'green' | 'neutral' | 'violet' | 'amber' | 'red'; children: ReactNode }) => {
  const c = tone === 'neutral' ? ['var(--neutral-100)', 'var(--text-secondary)'] : tone === 'red' ? ['var(--danger-tint)', 'var(--danger)'] : ['var(--cat-' + tone + '-100)', 'var(--cat-' + tone + '-800)'];
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 10px', borderRadius: 999, background: c[0], color: c[1], font: '700 12px var(--font-sans)', whiteSpace: 'nowrap' }}>{children}</span>;
};
