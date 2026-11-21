import type { Catalog, Story } from '../data/types';
import type { RootTab, Route } from './store';
import { offerCount } from '../data/offers';

/** Offer `i` of company `co` exists (its posted offers, or its demo ones; see data/offers.ts). */
export const hasOffer = (catalog: Catalog, co?: string, i?: number) =>
  !!co && i != null && i >= 0 && catalog.companies.some(c => c.id === co) && i < offerCount(catalog, co);

/*
 * Page links. The address bar follows the screen on top, and opening a link rebuilds the screen
 * stack, so anything shared opens on the same page:
 *   /company/c4           company profile        /category/1             companies in a category
 *   /service/s7           service page           /service/s7/photo/0     one photo of a service
 *   /offer/c4/0           one of a company's offers
 *   (old) /company/c4/service/s7 opens the service page
 *   /album/a3             project (album)        /album/a3/photo/2       one photo of a project
 *   /story/<id>           a story (photo or video)   /company/c4/gallery/3   one item of a company's gallery
 *   (old) /service/s7/gallery and /company/c4/services open the company page
 *   /explore/photo/3  /explore/4/photo/3   one item of the Explore gallery (all, or category 4)
 *   /categories /explore /profile               the other tabs
 */

export function routeToPath(r: Route): string {
  switch (r.s) {
    case 'company': return '/company/' + r.id;
    case 'service': return '/service/' + r.id;
    case 'offer': return '/offer/' + r.id + '/' + (r.i ?? 0);
    case 'listing': return r.cat != null ? '/category/' + r.cat : '/companies';
    case 'album': return '/album/' + r.id;
    case 'photo': return r.src === 'gallery' ? '/company/' + r.id + '/gallery/' + (r.i ?? 0)
      : r.src === 'explore' ? '/explore/' + (r.cat != null ? r.cat + '/' : '') + 'photo/' + (r.i ?? 0)
      : '/' + (r.src === 'service' ? 'service' : 'album') + '/' + r.id + '/photo/' + (r.i ?? 0);
    case 'story': return '/story/' + r.id;
    case 'categories': case 'offers': case 'explore': case 'profile': return '/' + r.s;
    default: return '/';
  }
}

/** Screen stack (and active tab) for an address; unknown or stale links fall back to Home. */
export function pathToStack(path: string, catalog: Catalog, stories: Story[]): { stack: Route[]; tab: RootTab } {
  const home: Route = { s: 'home' };
  const p = path.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const has = { co: (id: string) => catalog.companies.some(c => c.id === id), svc: (id: string) => catalog.services.some(s => s.id === id), alb: (id: string) => catalog.albums.some(a => a.id === id) };
  const [a, b, c, d] = p;
  // Explore, or one item of its gallery: /explore/photo/3 or /explore/4/photo/3 (category 4).
  if (a === 'explore' && (b === 'photo' || c === 'photo')) {
    const cat = b === 'photo' ? undefined : Number(b);
    return { stack: [{ s: 'explore' }, { s: 'photo', src: 'explore', ...(cat != null && !isNaN(cat) ? { cat } : {}), i: Number(b === 'photo' ? c : d) || 0 }], tab: 'explore' };
  }
  // All services: a page opened from home (no tab of its own).
  if (a === 'categories') return { stack: [home, { s: 'categories' }], tab: 'home' };
  if (a === 'offers' || a === 'explore' || a === 'profile') return { stack: [{ s: a }], tab: a };
  // A service opens over its company's page (in the service's activity), so Back goes to the company.
  const atService = (id: string): Route[] => { const sv = catalog.services.find(x => x.id === id)!; return [{ s: 'company', id: sv.co, act: sv.cat }, { s: 'service', id: sv.id }]; };
  if (a === 'company' && b && has.co(b)) {
    if (c === 'service' && d && has.svc(d) && catalog.services.find(x => x.id === d)?.co === b) return { stack: [home, ...atService(d)], tab: 'home' };
    const base: Route[] = [home, { s: 'company', id: b }];
    return { stack: c === 'gallery' ? [...base, { s: 'photo', src: 'gallery', id: b, i: Number(d) || 0 }] : base, tab: 'home' };
  }
  // A category page (or all companies). Old category-gallery links (/category/1/gallery/…) land here too.
  if (a === 'category' && b != null && catalog.cats.some(x => String(x.i) === b)) return { stack: [home, { s: 'listing', cat: Number(b) }], tab: 'home' };
  if (a === 'companies') return { stack: [home, { s: 'listing' }], tab: 'home' };
  // A shared service or project opens under its company, so Back goes to the company first.
  const coOf = (id?: string): Route[] => (id && has.co(id) ? [{ s: 'company', id }] : []);
  if (a === 'service' && b && has.svc(b) && has.co(catalog.services.find(x => x.id === b)!.co)) {
    const base: Route[] = [home, ...atService(b)];
    return { stack: c === 'photo' ? [...base, { s: 'photo', src: 'service', id: b, i: Number(d) || 0 }] : base, tab: 'home' };
  }
  // An offer opens over its company's page.
  if (a === 'offer' && b && hasOffer(catalog, b, Number(c))) return { stack: [home, { s: 'company', id: b }, { s: 'offer', id: b, i: Number(c) }], tab: 'home' };
  if (a === 'album' && b && has.alb(b)) {
    const base: Route[] = [home, ...coOf(catalog.albums.find(x => x.id === b)?.co), { s: 'album', id: b }];
    return { stack: c === 'photo' ? [...base, { s: 'photo', src: 'album', id: b, i: Number(d) || 0 }] : base, tab: 'home' };
  }
  if (a === 'story' && b && stories.some(s => s.id === b)) return { stack: [home, { s: 'story', id: b }], tab: 'home' };
  return { stack: [home], tab: 'home' };
}

/**
 * Shares a page: the phone's share sheet when available, otherwise copies the link.
 * `onCopied` shows a confirmation when the link went to the clipboard instead.
 */
export async function shareLink(path: string, title: string, text: string | undefined, onCopied: () => void) {
  const url = location.origin + path;
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); } catch { /* cancelled */ }
    return;
  }
  try { await navigator.clipboard.writeText(url); onCopied(); } catch { /* clipboard blocked */ }
}
