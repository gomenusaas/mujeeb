import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Avatar, Button, Icon, IconButton } from '../ds';
import { useApp, type App } from '../app/store';
import { helpers } from '../app/view';
import { logoUrl, remote } from '../data/api';
import { shownStories, type Story } from '../data/stories';

/** How long a photo story stays on screen. Videos play to their end. */
const IMAGE_MS = 5000;

/** Live stories posted by companies (Supabase), or the bundled demo stories. */
const allStories = (a: App) => shownStories(a.catalog.stories).filter(s => a.idx.co.has(s.co));

/** Most companies in a category page's stories row. */
const CAT_STORY_MAX = 30;
/**
 * A category page's stories row: one entry per company in the category that has live stories (its stories newest
 * first), at most CAT_STORY_MAX companies. Companies with a story this customer hasn't watched come first, those
 * where everything is watched last; within each, companies the customer follows first, then the rest, each by
 * their newest story (newest first).
 */
export function categoryStories(a: App, cat: number): { co: string; stories: Story[]; seen: boolean }[] {
  const by = new Map<string, Story[]>();
  for (const s of allStories(a)) {
    if (!a.idx.co.get(s.co)!.cats.includes(cat)) continue;
    by.set(s.co, [...(by.get(s.co) ?? []), s]);
  }
  const groups = [...by].map(([co, list]) => {
    const stories = list.slice().sort((x, y) => x.h - y.h);
    return { co, stories, seen: stories.every(s => a.seen[s.id]), followed: !!a.follows[co], newest: stories[0].h };
  });
  groups.sort((x, y) => Number(x.seen) - Number(y.seen) || Number(y.followed) - Number(x.followed) || x.newest - y.newest);
  return groups.slice(0, CAT_STORY_MAX).map(({ co, stories, seen }) => ({ co, stories, seen }));
}

/** The stories the viewer steps through: a category page's row in its order (`cat`), or all of them (Home). */
const storiesFor = (a: App, cat?: number) => (cat != null ? categoryStories(a, cat).flatMap(g => g.stories) : allStories(a));
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
      style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'calc((100% - 20px) / 3 - 8px)', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, padding: '18px 20px 4px', scrollbarWidth: 'none' }}>
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
 * A category page's stories: like Home's row, 9:16 thumbnails three per view (a swipe moves a whole set of
 * three), but one card per company showing its latest story, with the logo ring (brand gradient while something
 * is unwatched, muted once all is watched), name and how long ago. Tapping plays the company's stories, then
 * the next companies' in the row's order. See categoryStories for who shows and in what order.
 */
export function CategoryStoryRow({ cat }: { cat: number }) {
  const a = useApp();
  const h = helpers(a);
  const groups = categoryStories(a, cat);
  if (!groups.length) return null;
  return (
    <section aria-label={a.t.stories} className="mj-s"
      style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'calc((100% - 20px) / 3 - 8px)', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 20, padding: '16px 20px 4px', scrollbarWidth: 'none' }}>
      {groups.map((g, i) => {
        const co = a.idx.co.get(g.co)!;
        const name = h.coName(co);
        const latest = g.stories[0];
        // Start at its newest story not watched yet (or its newest).
        const first = g.stories.find(s => !a.seen[s.id]) ?? latest;
        return (
          <button key={g.co} type="button" className="mj-press-sm" onClick={() => a.go('story', { id: first.id, cat })}
            aria-label={name + ' — ' + (a.ar ? latest.ar : latest.en)}
            style={{ position: 'relative', aspectRatio: '9 / 16', border: 'none', padding: 0, borderRadius: 16, overflow: 'hidden', background: 'var(--neutral-200)', cursor: 'pointer', scrollSnapAlign: i % 3 === 0 ? 'start' : 'none', fontFamily: 'var(--font-sans)', textAlign: 'start', boxShadow: 'var(--shadow-sm)' }}>
            <img src={latest.poster} alt="" loading="lazy" decoding="async" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, oklch(0 0 0 / .35), transparent 30%, transparent 55%, oklch(0 0 0 / .7))' }} />
            <span style={{ position: 'absolute', top: 8, insetInlineStart: 8 }}>
              <StoryLogo src={logoUrl(co.id)} name={name} size={38} seen={g.seen} />
            </span>
            {latest.kind === 'video' && (
              <span aria-hidden="true" style={{ position: 'absolute', top: 11, insetInlineEnd: 8, width: 22, height: 22, borderRadius: '50%', background: 'oklch(0 0 0 / .35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                <Icon name="play" size={10} filled />
              </span>
            )}
            <span style={{ position: 'absolute', insetInline: 8, bottom: 9, display: 'flex', flexDirection: 'column', gap: 1, color: '#fff' }}>
              <span style={{ font: '700 12px/15px var(--font-sans)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</span>
              <span style={{ font: '500 11px/14px var(--font-sans)', opacity: 0.8 }}>{ago(a, latest)}</span>
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
  // From a category page the viewer steps through that page's row; from Home, through every story.
  const list = storiesFor(a, top.cat);
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

  useEffect(() => {
    if (!story) return;
    a.markSeen(story.id);
    remote.track(story.co, 'story_view', story.id);
    // Keep the address on the story being shown, so Share and reloads point at it.
    if (top.id !== story.id) a.replace('story', { id: story.id, ...(top.cat != null ? { cat: top.cat } : {}) });
  }, [story?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <span style={{ pointerEvents: 'auto', display: 'flex', gap: 8 }}>
            <IconButton icon="share-2" variant="glass" size={40} label={t.share} onClick={() => a.sharePage({ s: 'story', id: story.id }, name, ar ? story.ar : story.en)} />
            <IconButton icon="x" variant="glass" size={40} label={t.close} onClick={a.back} />
          </span>
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

/**
 * The home header's stories: one circle per company (its newest story's picture inside a ring: bright while any of
 * its stories is unwatched, faint once all are), the company name under it, in a sideways row on the purple header.
 * Tapping opens the company's first unwatched story (else its first), and the viewer carries on through the rest.
 * `bg`: the header colour behind them (the gap inside each ring); `ink`: the names' colour.
 */
export function StoryCircles({ bg = 'var(--brand)', ink = '#fff' }: { bg?: string; ink?: string }) {
  const a = useApp();
  const h = helpers(a);
  const list = storiesFor(a);
  if (!list.length) return null;
  const order: string[] = [];
  const byCo = new Map<string, Story[]>();
  for (const s of list) {
    if (!byCo.has(s.co)) { byCo.set(s.co, []); order.push(s.co); }
    byCo.get(s.co)!.push(s);
  }
  const groups = order.map(co => {
    const ss = byCo.get(co)!;
    return { co, ss, seen: ss.every(s => a.seen[s.id]), open: (ss.find(s => !a.seen[s.id]) || ss[0]).id };
  });
  // Unwatched companies first (each group keeps its place otherwise).
  groups.sort((x, y) => Number(x.seen) - Number(y.seen));
  return (
    <section aria-label={a.t.stories} className="mj-s"
      style={{ position: 'relative', display: 'flex', gap: 14, overflowX: 'auto', margin: '0 -20px', padding: '2px 20px 4px', scrollbarWidth: 'none' }}>
      {groups.map(g => {
        const co = a.idx.co.get(g.co)!;
        const name = h.coName(co);
        return (
          <button key={g.co} type="button" className="mj-press-sm" onClick={() => a.go('story', { id: g.open })} aria-label={name}
            style={{ flex: 'none', width: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 0, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', color: ink }}>
            {/* The ring, a thin purple gap, then the picture. */}
            <span style={{ display: 'inline-flex', padding: 2.5, borderRadius: '50%', background: g.seen ? (ink === '#fff' ? 'oklch(1 0 0 / .35)' : 'oklch(0 0 0 / .2)') : 'linear-gradient(135deg, #FFE08A, var(--accent) 60%, var(--accent-ink))' }}>
              <span style={{ display: 'inline-flex', padding: 2.5, borderRadius: '50%', background: bg }}>
                <img src={g.ss[0].poster} alt="" loading="lazy" decoding="async" draggable={false} style={{ width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', display: 'block', background: 'oklch(1 0 0 / .2)' }} />
              </span>
            </span>
            <span style={{ width: '100%', font: '600 11px/14px var(--font-sans)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: g.seen ? 0.75 : 1 }}>{name}</span>
          </button>
        );
      })}
    </section>
  );
}
