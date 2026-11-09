/*
 * Servly design system components, ported from the Claude Design bundle
 * (_ds/servly-design-system-…/_ds_bundle.js). Visual output is kept 1:1; the
 * only changes are TypeScript props, bundled Lucide icons (no runtime fetch) and
 * logical `text-align: start` so the components lay out correctly in RTL.
 */
import { useState, type CSSProperties, type ReactNode, type ChangeEvent } from 'react';
import { ICONS } from './icons';

type Style = CSSProperties;
const press = (set: (v: boolean) => void) => ({
  onPointerDown: () => set(true),
  onPointerUp: () => set(false),
  onPointerLeave: () => set(false),
});

/* Directional glyphs are mirrored in RTL (see `.ds-mirror` in app.css). */
const MIRROR = new Set(['chevron-right', 'chevron-left', 'arrow-left', 'arrow-right', 'send']);

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth, filled, style }: {
  name: string; size?: number; color?: string; strokeWidth?: number; filled?: boolean; style?: Style;
}) {
  let html = ICONS[name] || '';
  if (strokeWidth) html = html.replace(/stroke-width="2"/, 'stroke-width="' + strokeWidth + '"');
  if (filled) html = html.replace(/fill="none"/, 'fill="currentColor"');
  return (
    <span aria-hidden="true" className={MIRROR.has(name) ? 'ds-mirror' : undefined}
      style={{ display: 'inline-flex', flex: 'none', width: size, height: size, color, lineHeight: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: html }} />
  );
}

const AV_HUES = [292, 28, 190, 240, 355, 150, 72, 268];
export function Avatar({ name = '', src, size = 44, online, verified, style }: {
  name?: string; src?: string; size?: number; online?: boolean; verified?: boolean; style?: Style;
}) {
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const h = AV_HUES[(name.charCodeAt(0) || 0) % AV_HUES.length];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', width: size, height: size, ...style }}>
      <span style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0.92 0.06 ' + h + ')', color: 'oklch(0.38 0.1 ' + h + ')', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: Math.round(size * 0.36) }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </span>
      {online && <span style={{ position: 'absolute', right: 0, bottom: 0, width: Math.max(10, size * 0.26), height: Math.max(10, size * 0.26), borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 2px var(--surface-card)' }} />}
      {verified && (
        <span style={{ position: 'absolute', right: -2, bottom: -2, width: Math.max(16, size * 0.34), height: Math.max(16, size * 0.34), borderRadius: '50%', background: 'var(--brand)', boxShadow: '0 0 0 2px var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={Math.max(10, size * 0.2)} color="#fff" strokeWidth={3} />
        </span>
      )}
    </span>
  );
}

const BADGE: Record<string, [string, string]> = {
  brand: ['var(--brand-tint-strong)', 'var(--brand-ink)'],
  solid: ['var(--brand)', 'var(--text-on-brand)'],
  accent: ['var(--accent)', 'var(--neutral-0)'],
  success: ['var(--success-tint)', 'var(--success)'],
  warning: ['var(--warning-tint)', 'oklch(0.48 0.11 65)'],
  danger: ['var(--danger-tint)', 'var(--danger)'],
  info: ['var(--info-tint)', 'var(--info)'],
  neutral: ['var(--neutral-100)', 'var(--text-secondary)'],
  dark: ['oklch(0.2 0.02 285 / 0.72)', 'var(--neutral-0)'],
};
export type BadgeTone = keyof typeof BADGE;
export function Badge({ children, tone = 'brand', icon, size = 'md', style }: {
  children?: ReactNode; tone?: string; icon?: string; size?: 'sm' | 'md'; style?: Style;
}) {
  const [bg, fg] = BADGE[tone] || BADGE.brand;
  const sm = size === 'sm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: sm ? 20 : 24, padding: sm ? '0 7px' : '0 9px', borderRadius: 'var(--radius-pill)', background: bg, color: fg, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: sm ? 11 : 12, lineHeight: 1, whiteSpace: 'nowrap', ...style }}>
      {icon && <Icon name={icon} size={sm ? 11 : 13} />}{children}
    </span>
  );
}

const BTN_SIZES = { sm: { h: 36, px: 14, fs: 14, ic: 16 }, md: { h: 44, px: 18, fs: 15, ic: 18 }, lg: { h: 54, px: 24, fs: 16, ic: 20 } };
const BTN_VARIANTS: Record<string, Style> = {
  primary: { background: 'var(--brand)', color: 'var(--text-on-brand)', boxShadow: 'var(--shadow-brand)' },
  secondary: { background: 'var(--brand-tint-strong)', color: 'var(--brand-ink)' },
  outline: { background: 'var(--surface-card)', color: 'var(--text-primary)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--brand)' },
  dark: { background: 'var(--neutral-900)', color: 'var(--neutral-0)' },
  danger: { background: 'var(--danger-tint)', color: 'var(--danger)' },
};
export function Button({ children, variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth, disabled, loading, onClick, style }: {
  children?: ReactNode; variant?: keyof typeof BTN_VARIANTS; size?: keyof typeof BTN_SIZES; iconLeft?: string; iconRight?: string;
  fullWidth?: boolean; disabled?: boolean; loading?: boolean; onClick?: () => void; style?: Style;
}) {
  const [p, setP] = useState(false);
  const s = BTN_SIZES[size] || BTN_SIZES.md;
  const off = disabled || loading;
  return (
    <button type="button" disabled={off} onClick={onClick} {...press(setP)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: '0 ' + s.px + 'px', width: fullWidth ? '100%' : undefined, border: 'none', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: s.fs, letterSpacing: '-0.005em', whiteSpace: 'nowrap', cursor: off ? 'default' : 'pointer', transform: p && !off ? 'scale(var(--press-scale))' : 'none', filter: p && !off ? 'brightness(0.94)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast)', ...BTN_VARIANTS[variant], ...(disabled ? { background: 'var(--neutral-100)', color: 'var(--text-disabled)', boxShadow: 'none' } : {}), ...style }}>
      {loading
        ? <span style={{ width: s.ic, height: s.ic, borderRadius: '50%', border: '2px solid currentColor', borderRightColor: 'transparent', animation: 'sv-spin 0.7s linear infinite' }} />
        : iconLeft && <Icon name={iconLeft} size={s.ic} />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={s.ic} />}
    </button>
  );
}

export function Chip({ children, icon, selected, onClick, trailingIcon, size = 'md', style }: {
  children?: ReactNode; icon?: string; selected?: boolean; onClick?: () => void; trailingIcon?: string; size?: 'sm' | 'md'; style?: Style;
}) {
  const h = size === 'sm' ? 32 : 38;
  return (
    <button type="button" onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none', height: h, padding: '0 ' + (size === 'sm' ? 12 : 14) + 'px', border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size === 'sm' ? 13 : 14, whiteSpace: 'nowrap', transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base)', background: selected ? 'var(--neutral-900)' : 'var(--surface-card)', color: selected ? 'var(--neutral-0)' : 'var(--text-primary)', boxShadow: selected ? 'none' : 'inset 0 0 0 1px var(--border-default)', ...style }}>
      {icon && <Icon name={icon} size={16} />}{children}{trailingIcon && <Icon name={trailingIcon} size={14} />}
    </button>
  );
}

const IB: Record<string, Style> = {
  filled: { background: 'var(--brand)', color: 'var(--text-on-brand)' },
  tonal: { background: 'var(--brand-tint-strong)', color: 'var(--brand-ink)' },
  surface: { background: 'var(--surface-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' },
  outline: { background: 'transparent', color: 'var(--text-primary)', boxShadow: 'inset 0 0 0 1.5px var(--border-default)' },
  plain: { background: 'transparent', color: 'var(--text-primary)' },
  glass: { background: 'oklch(1 0 0 / 0.85)', color: 'var(--text-primary)', backdropFilter: 'var(--blur-bar)', WebkitBackdropFilter: 'var(--blur-bar)' },
};
export function IconButton({ icon, variant = 'surface', size = 44, dot, active, label, onClick, style }: {
  icon: string; variant?: keyof typeof IB; size?: number; dot?: boolean; active?: boolean; label?: string;
  onClick?: (e: React.MouseEvent) => void; style?: Style;
}) {
  const [p, setP] = useState(false);
  return (
    <button type="button" aria-label={label || icon} onClick={onClick} {...press(setP)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', width: size, height: size, border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', transform: p ? 'scale(0.92)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)', ...IB[variant], ...(active ? { color: 'var(--danger)' } : {}), ...style }}>
      <Icon name={icon} size={Math.round(size * 0.45)} filled={active} />
      {dot && <span style={{ position: 'absolute', top: size * 0.2, right: size * 0.22, width: 9, height: 9, borderRadius: 9, background: 'var(--accent)', boxShadow: '0 0 0 2px var(--surface-card)' }} />}
    </button>
  );
}

const SLOT_HUE: Record<string, number> = { coral: 28, amber: 72, green: 150, teal: 190, sky: 240, indigo: 268, violet: 300, pink: 355, neutral: 285 };
export function ImageSlot({ label = 'photo', tone = 'neutral', radius = 0, height = '100%', style }: {
  label?: string; tone?: string; radius?: number; height?: number | string; style?: Style;
}) {
  const h = SLOT_HUE[tone] ?? 285, c = tone === 'neutral' ? 0.01 : 0.05;
  const a = 'oklch(0.93 ' + c + ' ' + h + ')', b = 'oklch(0.9 ' + c + ' ' + h + ')';
  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: radius, overflow: 'hidden', background: 'repeating-linear-gradient(135deg, ' + a + ' 0 10px, ' + b + ' 10px 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <span style={{ font: 'var(--type-mono)', color: 'oklch(0.45 ' + c * 2 + ' ' + h + ')', background: 'oklch(1 0 0 / 0.7)', padding: '3px 7px', borderRadius: 6 }}>{label}</span>
    </div>
  );
}

export function BottomSheet({ open, onClose, title, children, footer, style }: {
  open: boolean; onClose: () => void; title?: ReactNode; children?: ReactNode; footer?: ReactNode; style?: Style;
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: open ? 'auto' : 'none', fontFamily: 'var(--font-sans)' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--surface-scrim)', opacity: open ? 1 : 0, transition: 'opacity var(--dur-slow) var(--ease-out)' }} />
      <div role="dialog" aria-modal="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88%', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0', background: 'var(--surface-card)', boxShadow: 'var(--shadow-lg)', transform: open ? 'none' : 'translateY(105%)', transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}><span style={{ width: 40, height: 5, borderRadius: 5, background: 'var(--neutral-200)' }} /></div>
        {title && <div style={{ padding: '8px 20px 4px', font: 'var(--type-h3)', color: 'var(--text-primary)' }}>{title}</div>}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>{children}</div>
        {footer && <div style={{ padding: '12px 20px 28px', borderTop: '1px solid var(--border-subtle)' }}>{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'calendar-x', color = 'violet', title, body, action, style }: {
  icon?: string; color?: string; title?: ReactNode; body?: ReactNode; action?: ReactNode; style?: Style;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: '32px 24px', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ width: 80, height: 80, borderRadius: 28, background: 'var(--cat-' + color + '-100)', color: 'var(--cat-' + color + '-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}><Icon name={icon} size={36} /></span>
      <span style={{ font: 'var(--type-h3)', color: 'var(--text-primary)', marginTop: 4 }}>{title}</span>
      {body && <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)', maxWidth: 280, textWrap: 'pretty' }}>{body}</span>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

const TOAST: Record<string, [string, string]> = { success: ['circle-check', 'var(--success)'], error: ['circle-alert', 'var(--danger)'], info: ['info', 'var(--violet-300)'] };
export function Toast({ message, tone = 'success', style }: { message: ReactNode; tone?: string; style?: Style }) {
  const [ic, c] = TOAST[tone] || TOAST.success;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-inverse)', color: 'var(--neutral-0)', boxShadow: 'var(--shadow-lg)', fontFamily: 'var(--font-sans)', animation: 'sv-rise var(--dur-slow) var(--ease-out)', ...style }}>
      <Icon name={ic} size={20} color={c} />
      <span style={{ flex: 1, font: 'var(--type-body-sm)', fontWeight: 600 }}>{message}</span>
    </div>
  );
}

export function Radio({ checked, onChange, label, description, card, style }: {
  checked?: boolean; onChange?: (v: boolean) => void; label?: ReactNode; description?: ReactNode; card?: boolean; style?: Style;
}) {
  return (
    <label onClick={() => onChange && onChange(true)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'start', ...(card ? { padding: 16, borderRadius: 'var(--radius-md)', background: checked ? 'var(--brand-tint)' : 'var(--surface-card)', boxShadow: 'inset 0 0 0 ' + (checked ? 2 : 1.5) + 'px ' + (checked ? 'var(--brand)' : 'var(--border-default)') } : {}), ...style }}>
      <span style={{ flex: 'none', width: 22, height: 22, borderRadius: '50%', boxShadow: 'inset 0 0 0 ' + (checked ? 7 : 1.5) + 'px ' + (checked ? 'var(--brand)' : 'var(--border-strong)'), background: 'var(--surface-card)', transition: 'box-shadow var(--dur-base) var(--ease-spring)' }} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label && <span style={{ font: 'var(--type-body-strong)', color: 'var(--text-primary)' }}>{label}</span>}
        {description && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{description}</span>}
      </span>
    </label>
  );
}

export function SearchBar({ placeholder, value, onChange, onFilter, elevated = true, style }: {
  placeholder?: string; value?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void; onFilter?: (() => void) | null; elevated?: boolean; style?: Style;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, paddingInline: '18px 6px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', boxShadow: elevated ? 'var(--shadow-md)' : 'inset 0 0 0 1.5px var(--border-default)', fontFamily: 'var(--font-sans)', ...style }}>
      <Icon name="search" size={20} color="var(--text-tertiary)" />
      <input type="search" value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder}
        style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', font: 'var(--type-body)', fontWeight: 500, color: 'var(--text-primary)' }} />
      {onFilter != null && (
        <button type="button" onClick={onFilter} aria-label="Filters" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="sliders-horizontal" size={18} />
        </button>
      )}
    </div>
  );
}

export function TextField({ label, placeholder, value, onChange, icon, helper, error, multiline, type = 'text', style }: {
  label?: ReactNode; placeholder?: string; value?: string; onChange?: (v: string) => void; icon?: string;
  helper?: ReactNode; error?: ReactNode; multiline?: boolean; type?: string; style?: Style;
}) {
  const [f, setF] = useState(false);
  const ring = error ? 'var(--danger)' : f ? 'var(--brand)' : 'var(--border-default)';
  const inputStyle: Style = { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', resize: 'none', font: 'var(--type-body)', fontWeight: 500, color: 'var(--text-primary)', padding: 0 };
  const common = { placeholder, value, onFocus: () => setF(true), onBlur: () => setF(false), style: inputStyle };
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)', textAlign: 'start', ...style }}>
      {label && <span style={{ font: 'var(--type-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>}
      <span style={{ display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10, minHeight: 52, padding: multiline ? '14px 16px' : '0 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 ' + (f || error ? 2 : 1.5) + 'px ' + ring + (f && !error ? ', 0 0 0 4px var(--focus-ring)' : ''), transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
        {icon && <Icon name={icon} size={20} color={f ? 'var(--brand)' : 'var(--text-tertiary)'} />}
        {multiline
          ? <textarea rows={3} {...common} onChange={e => onChange?.(e.target.value)} />
          : <input type={type} {...common} onChange={e => onChange?.(e.target.value)} style={{ ...inputStyle, height: 50 }} />}
      </span>
      {(helper || error) && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: error ? 'var(--danger)' : 'var(--text-tertiary)' }}>{error || helper}</span>}
    </label>
  );
}

/** CategoryCard — only the `row` variant is used by the app. */
export function CategoryCard({ icon, art, label, color = 'violet', count, onClick, style }: {
  icon: string; art?: string; label: ReactNode; color?: string; count?: number; onClick?: () => void; style?: Style;
}) {
  const [p, setP] = useState(false);
  const c = (n: number) => 'var(--cat-' + color + '-' + n + ')';
  return (
    <button type="button" onClick={onClick} {...press(setP)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: 12, border: 'none', borderRadius: 'var(--radius-card)', background: c(50), cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-sans)', transform: p ? 'scale(0.95)' : 'none', transition: 'transform var(--dur-base) var(--ease-spring)', ...style }}>
      <span style={{ flex: 'none', width: 52, height: 52, borderRadius: 'var(--radius-tile)', background: art ? c(100) : c(500), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {art ? <img src={art} alt="" style={{ width: 38, height: 38, filter: 'drop-shadow(0 4px 5px oklch(0.3 0.1 285 / 0.25))' }} /> : <Icon name={icon} size={26} />}
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-title)', color: c(800) }}>{label}</span>
        {count != null && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{count}</span>}
      </span>
      <Icon name="chevron-right" size={20} color={c(800)} />
    </button>
  );
}

export function ChatBubble({ children, mine, time, style }: { children?: ReactNode; mine?: boolean; time?: string; style?: Style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 4, fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ maxWidth: '78%', padding: '10px 14px', font: 'var(--type-body)', textWrap: 'pretty', borderRadius: 20, borderEndEndRadius: mine ? 6 : 20, borderEndStartRadius: mine ? 20 : 6, background: mine ? 'var(--brand)' : 'var(--surface-card)', color: mine ? 'var(--text-on-brand)' : 'var(--text-primary)', boxShadow: mine ? 'none' : 'var(--shadow-xs)' }}>{children}</div>
      {time && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)', padding: '0 6px' }}>{time}</span>}
    </div>
  );
}

export function PromoBanner({ eyebrow, title, cta = 'Book now', color = 'violet', imageLabel = 'promo image', onClick, style }: {
  eyebrow?: ReactNode; title: ReactNode; cta?: ReactNode; color?: string; imageLabel?: string; onClick?: () => void; style?: Style;
}) {
  const bg = color === 'brand' || color === 'violet' ? 'var(--violet-600)' : color === 'dark' ? 'var(--neutral-900)' : 'var(--cat-' + color + '-600)';
  return (
    <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') onClick?.(); }}
      style={{ position: 'relative', display: 'flex', height: 156, borderRadius: 'var(--radius-card)', overflow: 'hidden', background: bg, color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ position: 'absolute', insetInlineStart: -40, top: -60, width: 180, height: 180, borderRadius: '50%', background: 'oklch(1 0 0 / 0.08)' }} />
      <div style={{ position: 'relative', flex: 1.25, paddingBlock: 18, paddingInline: '20px 4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {eyebrow && <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', opacity: 0.85 }}>{eyebrow}</span>}
          <span style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-snug)', textWrap: 'balance' }}>{title}</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 'var(--radius-pill)', background: '#fff', color: 'var(--text-primary)', font: 'var(--type-body-sm)', fontWeight: 700 }}>
          {cta}<Icon name="arrow-right" size={15} />
        </span>
      </div>
      <div style={{ flex: 1, padding: 10 }}>
        <ImageSlot label={imageLabel} tone={color === 'violet' || color === 'brand' || color === 'dark' ? 'violet' : color} radius={14} />
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action, onAction, style }: {
  title: ReactNode; subtitle?: ReactNode; action?: ReactNode | null; onAction?: () => void; style?: Style;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-snug)', color: 'var(--text-primary)' }}>{title}</span>
        {subtitle && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{subtitle}</span>}
      </div>
      {action && (
        <button type="button" onClick={onAction} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, border: 'none', background: 'none', padding: '4px 0', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, color: 'var(--brand)' }}>
          {action}<Icon name="chevron-right" size={16} />
        </button>
      )}
    </div>
  );
}

export function AppBar({ title, subtitle, onBack, actions, style }: {
  title?: ReactNode; subtitle?: ReactNode; onBack?: () => void; actions?: ReactNode; style?: Style;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 16px', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44 }}>
        {onBack && <IconButton icon="arrow-left" variant="surface" size={40} onClick={onBack} label="Back" />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: onBack ? 'center' : 'flex-start' }}>
          {title && <span style={{ font: 'var(--type-title)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{title}</span>}
          {subtitle && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{subtitle}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, minWidth: onBack ? 40 : 0, justifyContent: 'flex-end' }}>{actions}</div>
      </div>
    </div>
  );
}

export function ListItem({ icon, color, title, subtitle, trailing, chevron = true, danger, onClick, style }: {
  icon?: string; color?: string; title: ReactNode; subtitle?: ReactNode; trailing?: ReactNode; chevron?: boolean; danger?: boolean;
  onClick?: (() => void) | null; style?: Style;
}) {
  const tint = color ? 'var(--cat-' + color + '-100)' : 'var(--neutral-100)';
  const ink = danger ? 'var(--danger)' : color ? 'var(--cat-' + color + '-600)' : 'var(--text-primary)';
  return (
    <button type="button" onClick={onClick || undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 56, padding: '10px 4px', border: 'none', background: 'none', cursor: onClick ? 'pointer' : 'default', textAlign: 'start', fontFamily: 'var(--font-sans)', ...style }}>
      {icon && <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, background: danger ? 'var(--danger-tint)' : tint, color: ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={20} /></span>}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ font: 'var(--type-body-strong)', color: danger ? 'var(--danger)' : 'var(--text-primary)' }}>{title}</span>
        {subtitle && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>{subtitle}</span>}
      </span>
      {trailing}
      {chevron && !danger && <Icon name="chevron-right" size={18} color="var(--text-tertiary)" />}
    </button>
  );
}

export function SegmentedControl<T extends string>({ options, value, onChange, style }: {
  options: { value: T; label: ReactNode }[]; value: T; onChange?: (v: T) => void; style?: Style;
}) {
  return (
    <div role="tablist" style={{ display: 'flex', padding: 4, gap: 4, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-100)', fontFamily: 'var(--font-sans)', ...style }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" role="tab" aria-selected={on} onClick={() => onChange && onChange(o.value)}
            style={{ flex: 1, height: 38, border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', font: 'var(--type-body-sm)', fontWeight: 700, textAlign: 'center', background: on ? 'var(--surface-card)' : 'transparent', color: on ? 'var(--text-primary)' : 'var(--text-secondary)', boxShadow: on ? 'var(--shadow-sm)' : 'none', transition: 'all var(--dur-base) var(--ease-out)' }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabBar<T extends string>({ items, active, onChange, style }: {
  items: { id: T; icon: string; label: ReactNode; badge?: string }[]; active: T; onChange?: (id: T) => void; style?: Style;
}) {
  return (
    <nav style={{ display: 'flex', alignItems: 'stretch', height: 'calc(var(--tabbar-height) + var(--safe-bottom))', padding: '6px 8px calc(14px + var(--safe-bottom))', background: 'oklch(1 0 0 / 0.92)', backdropFilter: 'var(--blur-bar)', WebkitBackdropFilter: 'var(--blur-bar)', boxShadow: 'var(--shadow-up)', fontFamily: 'var(--font-sans)', ...style }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} type="button" aria-current={on ? 'page' : undefined} onClick={() => onChange && onChange(it.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', color: on ? 'var(--brand)' : 'var(--text-tertiary)', position: 'relative' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 30, borderRadius: 'var(--radius-pill)', background: on ? 'var(--brand-tint-strong)' : 'transparent', transition: 'background var(--dur-base) var(--ease-out)', position: 'relative' }}>
              <Icon name={it.icon} size={22} />
              {it.badge && <span style={{ position: 'absolute', top: 0, insetInlineEnd: 12, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 16, background: 'var(--accent)', color: '#fff', font: '700 10px/16px var(--font-sans)', boxShadow: '0 0 0 2px #fff' }}>{it.badge}</span>}
            </span>
            <span style={{ font: 'var(--type-overline)', fontWeight: on ? 700 : 600 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
