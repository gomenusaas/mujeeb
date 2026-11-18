import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Button, Icon } from './shared/ds';
import { photoUrl } from './data';
import { useP } from './state';

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

/**
 * Up to `max` short words or phrases as chips. Enter or a comma adds what's typed (leaving the field does too),
 * × or Backspace on an empty box removes one. Duplicates are ignored.
 */
export function KeywordsField({ label, value, onChange, max = 7, maxLen = 30, placeholder, help }: {
  label: ReactNode; value: string[]; onChange: (v: string[]) => void; max?: number; maxLen?: number; placeholder?: string; help?: ReactNode;
}) {
  const p = useP();
  const [f, setF] = useState(false);
  const [text, setText] = useState('');
  const full = value.length >= max;
  const add = (raw: string) => {
    const words = raw.split(/[,،\n]/).map(w => w.trim().replace(/\s+/g, ' ').slice(0, maxLen)).filter(Boolean);
    const next = [...value];
    for (const w of words) if (next.length < max && !next.some(x => x.toLowerCase() === w.toLowerCase())) next.push(w);
    if (next.length !== value.length) onChange(next);
    setText('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, font: 'var(--type-body-sm)', fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color: full ? 'var(--brand)' : 'var(--text-tertiary)', fontWeight: 600 }}>{p.num(value.length)} / {p.num(max)}</span>
      </span>
      <label style={{ ...fieldBox(f), flexWrap: 'wrap', gap: 6, padding: '7px 10px', cursor: 'text' }}>
        {value.map(w => (
          <span key={w} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, paddingInline: '10px 4px', borderRadius: 999, background: 'var(--brand-tint)', color: 'var(--brand)', font: '600 13px var(--font-sans)' }}>
            {w}
            <button type="button" aria-label={p.t.remove + ' ' + w} onClick={() => onChange(value.filter(x => x !== w))}
              style={{ width: 22, height: 22, border: 'none', borderRadius: '50%', background: 'none', color: 'inherit', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 }}>
              <Icon name="x" size={14} />
            </button>
          </span>
        ))}
        {!full && (
          <input value={text} maxLength={maxLen} placeholder={value.length ? '' : placeholder} enterKeyHint="done"
            onFocus={() => setF(true)} onBlur={() => { setF(false); if (text.trim()) add(text); }}
            onChange={e => (/[,،]/.test(e.target.value) ? add(e.target.value) : setText(e.target.value))}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); add(text); }
              else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
            }}
            style={{ ...inputCss, flex: '1 1 120px', height: 30 }} />
        )}
      </label>
      {help && <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{help}</span>}
    </div>
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

export function Confirm({ open, onCancel, onConfirm, busy }: { open: boolean; onCancel: () => void; onConfirm: () => void; busy?: boolean }) {
  const { t } = useP();
  return (
    <Modal open={open} onClose={onCancel} title={t.confirmDelete} width={420}
      footer={<><Button variant="outline" onClick={onCancel}>{t.cancel}</Button><Button variant="danger" iconLeft="trash-2" loading={busy} onClick={onConfirm}>{t.delete}</Button></>}>
      <span style={{ font: 'var(--type-body)', color: 'var(--text-secondary)' }}>{t.confirmDeleteBody}</span>
    </Modal>
  );
}

/** Hidden file input behind a button. */
export function FileButton({ accept, multiple, onFiles, children, variant = 'outline', icon = 'upload', size = 'sm', loading }: {
  accept: string; multiple?: boolean; onFiles: (f: File[]) => void; children: ReactNode;
  variant?: 'outline' | 'secondary' | 'primary'; icon?: string; size?: 'sm' | 'md'; loading?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} multiple={multiple} hidden onChange={e => { const fs = [...(e.target.files || [])]; e.target.value = ''; if (fs.length) onFiles(fs); }} />
      <Button variant={variant} size={size} iconLeft={icon} loading={loading} onClick={() => ref.current?.click()}>{children}</Button>
    </>
  );
}

/** Gallery visibility for one photo or video: optional, only on projects. */
type GalleryProps = { hidden?: string[]; onHidden?: (h: string[]) => void };

/** Dims a thumbnail that is kept out of the gallery and labels it "Not in gallery". */
function HiddenVeil({ src, hidden }: { src: string; hidden?: string[] }) {
  const { t } = useP();
  if (!hidden?.includes(src)) return null;
  return (
    <span style={{ position: 'absolute', inset: 0, background: 'oklch(1 0 0 / 0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 6, pointerEvents: 'none' }}>
      <span style={{ padding: '2px 8px', borderRadius: 999, background: 'oklch(0.25 0.02 285)', color: '#fff', font: '700 11px/18px var(--font-sans)' }}>{t.notInGallery}</span>
    </span>
  );
}

/** Eye button: shown in the gallery (filled) or hidden from it (crossed out). */
function GalleryMark({ src, hidden, onHidden }: { src: string } & GalleryProps) {
  const { t } = useP();
  if (!hidden || !onHidden) return null;
  const off = hidden.includes(src);
  return <MiniBtn icon={off ? 'eye-off' : 'eye'} label={off ? t.showInGallery : t.hideFromGallery} on={!off}
    onClick={() => onHidden(off ? hidden.filter(x => x !== src) : [...hidden, src])} />;
}

/** Ordered photo list: first is the cover. Add (upload), remove, make cover; on projects, show or hide each in the gallery. */
/** Service page header in the customer app: 390 × 250 on the phone. */
export const SERVICE_COVER = { w: 390, h: 250 };

/** Center-crops an image file to the service header shape and returns a JPEG (3× the phone size). */
export async function cropToServiceCover(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const want = SERVICE_COVER.w / SERVICE_COVER.h;
  let sw = img.width, sh = img.height;
  if (sw / sh > want) sw = Math.round(sh * want); else sh = Math.round(sw / want);
  const W = Math.min(SERVICE_COVER.w * 3, sw), H = Math.round(W / want);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d')!.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, W, H);
  img.close();
  return new Promise((ok, no) => c.toBlob(b => (b ? ok(b) : no(new Error('crop'))), 'image/jpeg', 0.86));
}

/**
 * The service's cover image, with a preview of the top of the service page in the customer app:
 * the photo under the back/share/directions/menu buttons, the company logo and the heart.
 * Without a cover, the preview shows what customers see instead (`fallback`).
 */
export function ServiceCoverEditor({ value, fallback, logo, name, onChange }: {
  value: string | null; fallback: string; logo: string; name: string; onChange: (url: string | null) => void;
}) {
  const { t, repo, company, showToast } = useP();
  const [busy, setBusy] = useState(false);
  const add = async (files: File[]) => {
    if (!files[0]) return;
    setBusy(true);
    try { onChange(await repo.upload(company.id, await cropToServiceCover(files[0]), 'service-cover.jpg')); }
    catch { showToast(t.uploadFailed, 'error'); } finally { setBusy(false); }
  };
  const shown = value || fallback;
  // Phone geometry (px): header 250 tall, then 40 px of the page so the logo shows; buttons 40 at y 48.
  const W = SERVICE_COVER.w, H = 290;
  const x = (px: number) => (px / W) * 100 + '%', y = (px: number) => (px / H) * 100 + '%';
  const dot = (start: number | null, end: number | null): CSSProperties => ({
    position: 'absolute', top: y(48), width: x(40), aspectRatio: '1', borderRadius: '50%', background: 'oklch(1 0 0 / 0.85)',
    ...(start != null ? { insetInlineStart: x(start) } : { insetInlineEnd: x(end!) }),
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 260px' }}>
          <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.svcCover}</span>
          <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{value ? t.svcCoverHelp : t.svcCoverNone}</span>
        </span>
        <span style={{ display: 'flex', gap: 6 }}>
          {value && <Button size="sm" variant="outline" iconLeft="trash-2" onClick={() => onChange(null)}>{t.remove}</Button>}
          <FileButton accept="image/jpeg,image/png,image/webp" onFiles={add} icon="image-plus" loading={busy}>{value ? t.change : t.svcCoverAdd}</FileButton>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <div aria-label={t.svcCoverPreview} role="img"
          style={{ position: 'relative', width: '100%', maxWidth: W, aspectRatio: W + ' / ' + H, borderRadius: 18, overflow: 'hidden', background: 'var(--neutral-100)', boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>
          {shown && <img src={photoUrl(shown, 1200)} alt="" style={{ position: 'absolute', insetInline: 0, top: 0, height: y(250), width: '100%', objectFit: 'cover', display: 'block', opacity: value ? 1 : 0.55 }} />}
          <span style={dot(16, null)} />
          {[16, 64, 112].map(e => <span key={e} style={dot(null, e)} />)}
          <span style={{ position: 'absolute', insetInline: 0, top: y(222), bottom: 0, borderRadius: '18px 18px 0 0', background: 'var(--bg-app)' }} />
          <span style={{ position: 'absolute', top: y(186), insetInlineStart: x(20), width: x(84), aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 3px var(--bg-app)', background: 'var(--neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 13px var(--font-sans)', color: 'var(--text-secondary)' }}>
            {logo ? <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.slice(0, 2)}
          </span>
          <span style={{ position: 'absolute', top: y(205), insetInlineStart: x(118), width: x(46), aspectRatio: '1', borderRadius: '50%', background: 'var(--surface-card)', boxShadow: '0 0 0 3px var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Icon name="heart" size={16} />
          </span>
        </div>
        <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.svcCoverPreview}</span>
      </div>
    </div>
  );
}

export function PhotoEditor({ photos, onChange, error, hidden, onHidden, noCover, noAdd, help }: { photos: string[]; onChange: (p: string[]) => void; error?: string; noCover?: boolean; noAdd?: boolean; help?: string } & GalleryProps) {
  const { t, repo, company, showToast } = useP();
  const [busy, setBusy] = useState(false);
  const add = async (files: File[]) => {
    setBusy(true);
    try {
      const urls = await Promise.all(files.map(f => repo.upload(company.id, f, f.name)));
      onChange([...photos, ...urls]);
    } catch { showToast(t.uploadFailed, 'error'); } finally { setBusy(false); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.photos}</span>
          <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: error ? 'var(--danger)' : 'var(--text-tertiary)' }}>{error || help || (noCover ? t.svcPhotosHelp : t.photosHelp)}</span>
        </span>
        {!noAdd && <FileButton accept="image/jpeg,image/png,image/webp" multiple onFiles={add} icon="image-plus" loading={busy}>{t.addPhotos}</FileButton>}
      </div>
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {photos.map((p, k) => (
            <div key={p + k} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: 'var(--neutral-100)' }}>
              <img src={photoUrl(p, 300)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <HiddenVeil src={p} hidden={hidden} />
              {k === 0 && !noCover && <span style={{ position: 'absolute', top: 6, insetInlineStart: 6, padding: '2px 8px', borderRadius: 999, background: 'var(--brand)', color: '#fff', font: '700 11px/18px var(--font-sans)' }}>{t.coverTag}</span>}
              <span style={{ position: 'absolute', insetInline: 6, bottom: 6, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <GalleryMark src={p} hidden={hidden} onHidden={onHidden} />
                {k > 0 && !noCover && <MiniBtn icon="star" label={t.makeCover} onClick={() => onChange([p, ...photos.filter((_, j) => j !== k)])} />}
                <MiniBtn icon="trash-2" label={t.remove} onClick={() => onChange(photos.filter((_, j) => j !== k))} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MAX_VIDEO = 50 * 1024 * 1024;

/** A project's videos: add (upload, up to 50 MB each), remove, show or hide each in the gallery. */
export function VideoEditor({ videos, onChange, hidden, onHidden }: { videos: string[]; onChange: (v: string[]) => void } & GalleryProps) {
  const { t, repo, company, showToast } = useP();
  const [busy, setBusy] = useState(false);
  const add = async (files: File[]) => {
    const ok = files.filter(f => f.size <= MAX_VIDEO);
    if (ok.length < files.length) showToast(t.videoTooBig, 'error');
    if (!ok.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(ok.map(f => repo.upload(company.id, f, f.name)));
      onChange([...videos, ...urls]);
    } catch { showToast(t.uploadFailed, 'error'); } finally { setBusy(false); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-body-sm)', fontWeight: 600 }}>{t.videos}</span>
          <span style={{ font: 'var(--type-caption)', fontWeight: 500, color: 'var(--text-tertiary)' }}>{t.videosHelp}</span>
        </span>
        <FileButton accept="video/mp4,video/quicktime" multiple onFiles={add} icon="video" loading={busy}>{t.addVideos}</FileButton>
      </div>
      {videos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {videos.map((v, k) => (
            <div key={v + k} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: 'var(--neutral-900, #111)' }}>
              <video src={v + '#t=0.1'} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <HiddenVeil src={v} hidden={hidden} />
              <span style={{ position: 'absolute', top: 6, insetInlineStart: 6, width: 24, height: 24, borderRadius: '50%', background: 'oklch(0 0 0 / 0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={12} /></span>
              <span style={{ position: 'absolute', insetInline: 6, bottom: 6, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <GalleryMark src={v} hidden={hidden} onHidden={onHidden} />
                <MiniBtn icon="trash-2" label={t.remove} onClick={() => onChange(videos.filter((_, j) => j !== k))} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const MiniBtn = ({ icon, label, onClick, on }: { icon: string; label: string; onClick: () => void; on?: boolean }) => (
  <button type="button" title={label} aria-label={label} aria-pressed={on} onClick={onClick}
    style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: on ? 'var(--brand)' : 'oklch(1 0 0 / 0.9)', color: on ? '#fff' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
    <Icon name={icon} size={15} />
  </button>
);

export const Spinner = ({ size = 28 }: { size?: number }) => (
  <span style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
    <span style={{ width: size, height: size, borderRadius: '50%', border: '3px solid var(--brand)', borderRightColor: 'transparent', animation: 'pv-spin 0.7s linear infinite' }} />
  </span>
);

/** Status pill, e.g. Published / Hidden. */
export const Pill = ({ tone, children }: { tone: 'green' | 'neutral' | 'violet' | 'amber'; children: ReactNode }) => {
  const c = tone === 'neutral' ? ['var(--neutral-100)', 'var(--text-secondary)'] : ['var(--cat-' + tone + '-100)', 'var(--cat-' + tone + '-800)'];
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 10px', borderRadius: 999, background: c[0], color: c[1], font: '700 12px var(--font-sans)', whiteSpace: 'nowrap' }}>{children}</span>;
};
