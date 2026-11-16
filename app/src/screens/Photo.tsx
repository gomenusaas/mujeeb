import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, IconButton } from '../ds';
import { useApp } from '../app/store';
import { albumMedia, companyGallery, helpers, type Media } from '../app/view';
import { photo } from '../data/api';

/**
 * Full-screen viewer (route `photo`) for a project's photos and videos, a service's photos, or a
 * company's gallery. Swipe sideways between items; the address bar follows the item on screen, and
 * Share sends a link to that item. Only the video on screen plays.
 */
export function PhotoViewer() {
  const a = useApp();
  const { t, ar, top } = a;
  const h = helpers(a);
  const src = top.src ?? 'album';
  const svc = src === 'service' ? a.idx.svc.get(top.id!) : undefined;
  const al = src === 'album' ? a.idx.alb.get(top.id!) : undefined;
  const items: Media[] = src === 'gallery' ? companyGallery(a, top.id!)
    : al ? albumMedia(al)
    : (svc?.imgs ?? []).map(s => ({ src: s, video: false }));
  const start = Math.min(Math.max(0, top.i ?? 0), Math.max(0, items.length - 1));
  const [i, setI] = useState(start);
  const pager = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  const cur = items[i];
  const project = cur?.al ?? al;
  const co = a.idx.co.get(src === 'gallery' ? top.id! : (project || svc)?.co || '');
  const title = project ? (ar ? project.ar : project.en) : svc ? (ar ? svc.ar : svc.en) : '';

  const isRtl = () => !!pager.current && getComputedStyle(pager.current).direction === 'rtl';
  useLayoutEffect(() => {
    const el = pager.current;
    if (el) el.scrollTo({ left: (isRtl() ? -1 : 1) * start * el.clientWidth, behavior: 'instant' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play the video on screen from the start; pause the rest.
  useEffect(() => {
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.currentTime = 0; v.play().catch(() => { /* autoplay blocked: controls are shown */ }); } else v.pause();
    });
  }, [i]);

  const onScroll = () => {
    const el = pager.current;
    if (!el) return;
    const k = Math.min(items.length - 1, Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
    if (k !== i) { setI(k); a.replace('photo', { src, id: top.id, i: k }); }
  };
  const share = () => a.sharePage({ s: 'photo', src, id: top.id, i }, title + (co ? ' · ' + h.coName(co) : ''));

  if (!items.length) return null;
  return (
    <div role="dialog" aria-label={title} style={{ position: 'absolute', inset: 0, zIndex: 15, background: '#000', color: '#fff', fontFamily: 'var(--font-sans)' }}>
      <div ref={pager} className="mj-s" onScroll={onScroll}
        style={{ position: 'absolute', inset: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', overscrollBehavior: 'contain' }}>
        {items.map((m, k) => (
          <div key={k} style={{ flex: '0 0 100%', height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {m.video
              ? <video ref={el => { vids.current[k] = el; }} src={m.src} muted loop playsInline controls preload={Math.abs(k - i) <= 1 ? 'auto' : 'none'}
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} />
              : <img src={photo(m.src, Math.abs(k - i) <= 1 ? 1400 : 400)} alt="" draggable={false} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', insetInline: 0, top: 0, display: 'flex', alignItems: 'center', gap: 10, padding: 'calc(var(--top-inset) + 6px) 16px 30px', background: 'linear-gradient(to bottom, oklch(0 0 0 / .6), transparent)' }}>
        <IconButton icon="x" variant="glass" size={40} label={t.close} onClick={a.back} />
        <span style={{ flex: 1, textAlign: 'center', font: 'var(--type-body-sm)', fontWeight: 700 }}>{h.num(i + 1) + ' / ' + h.num(items.length)}</span>
        <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={share} />
      </div>

      <div style={{ position: 'absolute', insetInline: 0, bottom: cur?.video ? 56 : 0, padding: '40px 20px calc(24px + var(--safe-bottom))', display: 'flex', alignItems: 'flex-end', gap: 12, background: 'linear-gradient(to top, oklch(0 0 0 / .7), transparent)', pointerEvents: 'none' }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: 'var(--type-title)' }}>{title}</span>
          {co && <span style={{ font: 'var(--type-body-sm)', opacity: 0.85 }}>{h.coName(co)}</span>}
        </span>
        {/* From the gallery, each item links to the project it came from. */}
        {src === 'gallery' && project && (
          <Button size="sm" variant="secondary" onClick={() => a.go('album', { id: project.id })} style={{ pointerEvents: 'auto', flex: 'none' }}>{t.viewProject}</Button>
        )}
      </div>
    </div>
  );
}
