import type { Catalog, Story } from '../data/types';
import type { RootTab, Route } from './store';

/*
 * Page links. The address bar follows the screen on top, and opening a link rebuilds the screen
 * stack, so anything shared opens on the same page:
 *   /company/c4           company profile        /category/1             companies in a category
 *   /service/s7           service page           /service/s7/photo/0     one photo of a service
 *   /album/a3             project (album)        /album/a3/photo/2       one photo of a project
 *   /story/<id>           a story (photo or video)   /company/c4/gallery/3   one item of a company's gallery
 *   /service/s7/gallery     all of a service's photos and videos   /company/c4/services   all of a company's services
 *   /explore/photo/3  /explore/4/photo/3   one item of the Explore gallery (all, or category 4)
 *   /categories /explore /profile               the other tabs
 */

export function routeToPath(r: Route): string {
  switch (r.s) {
    case 'company': return '/company/' + r.id;
    case 'listing': return r.cat != null ? '/category/' + r.cat : '/companies';
    case 'service': return '/service/' + r.id;
    case 'svcGallery': return '/service/' + r.id + '/gallery';
    case 'svcList': return '/company/' + r.id + '/services';
    case 'album': return '/album/' + r.id;
    case 'photo': return r.src === 'gallery' ? '/company/' + r.id + '/gallery/' + (r.i ?? 0)
      : r.src === 'explore' ? '/explore/' + (r.cat != null ? r.cat + '/' : '') + 'photo/' + (r.i ?? 0)
      : '/' + (r.src === 'service' ? 'service' : 'album') + '/' + r.id + '/photo/' + (r.i ?? 0);
    case 'story': return '/story/' + r.id;
    case 'categories': case 'explore': case 'profile': return '/' + r.s;
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
  if (a === 'categories' || a === 'explore' || a === 'profile') return { stack: [{ s: a }], tab: a };
  if (a === 'company' && b && has.co(b)) {
    const base: Route[] = [home, { s: 'company', id: b }];
    if (c === 'services') return { stack: [...base, { s: 'svcList', id: b }], tab: 'home' };
    return { stack: c === 'gallery' ? [...base, { s: 'photo', src: 'gallery', id: b, i: Number(d) || 0 }] : base, tab: 'home' };
  }
  // A category page (or all companies). Old category-gallery links (/category/1/gallery/…) land here too.
  if (a === 'category' && b != null && catalog.cats.some(x => String(x.i) === b)) return { stack: [home, { s: 'listing', cat: Number(b) }], tab: 'home' };
  if (a === 'companies') return { stack: [home, { s: 'listing' }], tab: 'home' };
  if (a === 'service' && b && has.svc(b)) {
    const base: Route[] = [home, { s: 'service', id: b }];
    if (c === 'gallery') return { stack: [...base, { s: 'svcGallery', id: b }], tab: 'home' };
    return { stack: c === 'photo' ? [...base, { s: 'photo', src: 'service', id: b, i: Number(d) || 0 }] : base, tab: 'home' };
  }
  if (a === 'album' && b && has.alb(b)) {
    const base: Route[] = [home, { s: 'album', id: b }];
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
