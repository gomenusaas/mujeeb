import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Avatar, Button, Icon, IconButton } from '../ds';
import { useApp, type App } from '../app/store';
import { helpers } from '../app/view';
import { logoUrl } from '../data/api';
import { STORIES, type Story } from '../data/stories';

/** How long a photo story stays on screen. Videos play to their end. */
const IMAGE_MS = 5000;

const storiesFor = (a: App) => STORIES.filter(s => a.idx.co.has(s.co));
const ago = (a: App, s: Story) => a.t.hoursAgo.replace('{n}', helpers(a).num(s.h));

/** The circular company logo with a story ring: brand gradient while unseen, muted once seen. */
function StoryLogo({ src, name, size, seen }: { src: string; name: string; size: number; seen: boolean }) {
  return (
    <span style={{ flex: 'none', display: 'inline-flex', padding: 2, borderRadius: '50%', background: seen ? 'oklch(1 0 0 / .55)' : 'linear-gradient(135deg, var(--accent), var(--brand))' }}>
      <span style={{ display: 'inline-flex', padding: 2, borderRadius: '50%', background: '#fff' }}>
        <Avatar name={name} src={src} size={size} />
      </span>
    </span>
  );
}

/**
 * Home row of 9:16 story thumbnails, three per view. A swipe moves a whole set of
 * three: only every third card is a snap point.
 */
export function StoryRow() {
  const a = useApp();
  const h = helpers(a);
  const list = storiesFor(a);
  if (!list.length) return null;
  return (
    <section aria-label={a.t.stories} className="mj-s"
      style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'calc((100% - 20px) / 3 - 8px)', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, padding: '18px 20px', background: 'var(--brand-tint-strong)', scrollbarWidth: 'none' }}>
      {list.map((s, i) => {
        const co = a.idx.co.get(s.co)!;
        const name = h.coName(co);
        return (
          <button key={s.id} type="button" className="mj-press-sm" onClick={() => a.go('story', { id: s.id })}
            aria-label={name + ' — ' + (a.ar ? s.ar : s.en)}
            style={{ position: 'relative', aspectRatio: '9 / 16', border: 'none', padding: 0, borderRadius: 16, overflow: 'hidden', background: 'var(--neutral-200)', cursor: 'pointer', scrollSnapAlign: i % 3 === 0 ? 'start' : 'none', fontFamily: 'var(--font-sans)', textAlign: 'start', boxShadow: 'var(--shadow-sm)' }}>
            <img src={s.poster} alt="" loading="lazy" decoding="async" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, oklch(0 0 0 / .35), transparent 30%, transparent 55%, oklch(0 0 0 / .7))' }} />
            <span style={{ position: 'absolute', top: 8, insetInlineStart: 8 }}>
              <StoryLogo src={logoUrl(co.id)} name={name} size={38} seen={!!a.seen[s.id]} />
            </span>
            {s.kind === 'video' && (
              <span aria-hidden="true" style={{ position: 'absolute', top: 11, insetInlineEnd: 8, width: 22, height: 22, borderRadius: '50%', background: 'oklch(0 0 0 / .35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                <Icon name="play" size={10} filled />
              </span>
            )}
            <span style={{ position: 'absolute', insetInline: 8, bottom: 9, display: 'flex', flexDirection: 'column', gap: 1, color: '#fff' }}>
              <span style={{ font: '700 12px/15px var(--font-sans)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</span>
              <span style={{ font: '500 11px/14px var(--font-sans)', opacity: 0.8 }}>{ago(a, s)}</span>
            </span>
          </button>
        );
      })}
    </section>
  );
}

/**
 * Full-screen story viewer (route `story`). Swipe sideways between companies' stories;
 * tap the far side for the next one and the near side for the previous one; press and
 * hold to pause. Photos show for 5 s, videos play to the end, then it moves on and
 * closes after the last story.
 */
export function StoryViewer() {
  const a = useApp();
  const { t, ar, top } = a;
  const h = helpers(a);
  const list = storiesFor(a);
  const start = Math.max(0, list.findIndex(s => s.id === top.id));
  const [i, setI] = useState(start);
  const [prog, setProg] = useState(0);
  const pager = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const paused = useRef(false);
  const story = list[i];
  const co = story && a.idx.co.get(story.co);

  const isRtl = () => !!pager.current && getComputedStyle(pager.current).direction === 'rtl';
  const scrollTo = (k: number, behavior: ScrollBehavior = 'smooth') => {
    const el = pager.current;
    if (el) el.scrollTo({ left: (isRtl() ? -1 : 1) * k * el.clientWidth, behavior });
  };
  const goTo = (k: number) => {
    if (k >= list.length) a.back();
    else scrollTo(Math.max(0, k));
  };

  useLayoutEffect(() => { scrollTo(start, 'instant'); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (story) a.markSeen(story.id); }, [story?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play the current story (and only it), and drive its progress bar.
  useEffect(() => {
    paused.current = false;
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    });
    let raf = 0, elapsed = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const v = vids.current[i];
      let p: number;
      if (list[i]?.kind === 'video') p = v && v.duration ? v.currentTime / v.duration : 0;
      else { if (!paused.current) elapsed += dt; p = elapsed / IMAGE_MS; }
      setProg(Math.min(1, p));
      if (p >= 1) { goTo(i + 1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const fwd = isRtl() ? 'ArrowLeft' : 'ArrowRight', bwd = isRtl() ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === 'Escape') a.back();
      else if (e.key === fwd) goTo(i + 1);
      else if (e.key === bwd) goTo(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const onScroll = () => {
    const el = pager.current;
    if (!el) return;
    const k = Math.min(list.length - 1, Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
    if (k !== i) { setI(k); setProg(0); }
  };

  // Tap vs. press-and-hold on the media. Swipes are native scrolling.
  const press = useRef<{ x: number; y: number; held: boolean; timer: number } | null>(null);
  const setPaused = (on: boolean) => {
    paused.current = on;
    const v = vids.current[i];
    if (v) { if (on) v.pause(); else v.play().catch(() => {}); }
  };
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = { x: e.clientX, y: e.clientY, held: false, timer: 0 };
    p.timer = window.setTimeout(() => { p.held = true; setPaused(true); }, 220);
    press.current = p;
  };
  const onUp = (e: React.PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    clearTimeout(p.timer);
    if (p.held) { setPaused(false); return; }
    if (Math.abs(e.clientX - p.x) > 10 || Math.abs(e.clientY - p.y) > 10) return;
    const r = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    const fwd = isRtl() ? frac < 2 / 3 : frac > 1 / 3;
    goTo(fwd ? i + 1 : i - 1);
  };
  const onCancel = () => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    clearTimeout(p.timer);
    if (p.held) setPaused(false);
  };

  if (!story || !co) return null;
  const name = h.coName(co);

  return (
    <div role="dialog" aria-label={t.stories} style={{ position: 'absolute', inset: 0, zIndex: 15, background: '#000', color: '#fff', fontFamily: 'var(--font-sans)' }}>
      <div ref={pager} className="mj-s" onScroll={onScroll}
        style={{ position: 'absolute', inset: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', overscrollBehavior: 'contain' }}>
        {list.map((s, k) => (
          <div key={s.id} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onCancel} onContextMenu={e => e.preventDefault()}
            style={{ position: 'relative', flex: '0 0 100%', height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
            {s.kind === 'video' ? (
              <video ref={el => { vids.current[k] = el; }} src={s.src} poster={s.poster} muted playsInline preload={Math.abs(k - i) <= 1 ? 'auto' : 'none'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
            ) : (
              <img src={Math.abs(k - i) <= 1 ? s.src : s.poster} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', insetInline: 0, top: 0, padding: 'calc(var(--top-inset) + 6px) 12px 40px', background: 'linear-gradient(to bottom, oklch(0 0 0 / .55), transparent)', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {list.map((s, k) => (
            <span key={s.id} style={{ flex: 1, height: 3, borderRadius: 3, background: 'oklch(1 0 0 / .35)', overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: (k < i ? 1 : k === i ? prog : 0) * 100 + '%', background: '#fff' }} />
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <StoryLogo src={logoUrl(co.id)} name={name} size={32} seen />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: '700 14px/18px var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
            <span style={{ font: 'var(--type-caption)', opacity: 0.8 }}>{ago(a, story)}</span>
          </span>
          <span style={{ pointerEvents: 'auto' }}><IconButton icon="x" variant="glass" size={40} label={t.close} onClick={a.back} /></span>
        </div>
      </div>

      <div style={{ position: 'absolute', insetInline: 0, bottom: 0, padding: '48px 20px calc(24px + var(--safe-bottom))', display: 'flex', flexDirection: 'column', gap: 14, background: 'linear-gradient(to top, oklch(0 0 0 / .7), transparent)', pointerEvents: 'none' }}>
        <span style={{ font: 'var(--type-title)', textWrap: 'balance' }}>{ar ? story.ar : story.en}</span>
        <span style={{ pointerEvents: 'auto' }}>
          <Button size="lg" fullWidth variant="outline" iconLeft="building-2" onClick={() => a.replace('company', { id: co.id })}>{t.viewProfile}</Button>
        </span>
      </div>
    </div>
  );
}
