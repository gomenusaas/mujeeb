import { useEffect } from 'react';

/**
 * Lets mouse users drag any horizontal `.mj-s` row sideways like a finger swipe
 * (scrollbars stay hidden). A drag does not trigger a click on the card under it.
 */
export function useDragScroll() {
  useEffect(() => {
    let drag: { el: HTMLElement; x: number; sl: number; moved: boolean; snap: string } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const el = (e.target as Element).closest?.('.mj-s') as HTMLElement | null;
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      drag = { el, x: e.clientX, sl: el.scrollLeft, moved: false, snap: el.style.scrollSnapType };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        drag.el.style.scrollSnapType = 'none';
        drag.el.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }
      if (drag.moved) { drag.el.scrollLeft = drag.sl - dx; e.preventDefault(); }
    };
    const up = () => {
      if (!drag) return;
      const d = drag;
      drag = null;
      document.body.style.userSelect = '';
      if (!d.moved) return;
      d.el.style.cursor = '';
      const kill = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
      window.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', kill, { capture: true }), 50);
      const sl = d.el.scrollLeft;
      d.el.style.scrollSnapType = d.snap;
      d.el.scrollLeft = sl;
    };
    const dragstart = (e: DragEvent) => { if ((e.target as Element).closest?.('.mj-s')) e.preventDefault(); };
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('dragstart', dragstart);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('dragstart', dragstart);
    };
  }, []);
}
