import type { Catalog, LiveOffer, Service } from './types';
import { OFFER_PALETTE, OFFER_STYLES } from '../ds/offer';

/*
 * A company's offers: the ones it posted (Supabase `offers`) when it has any, otherwise DEMO offers until companies
 * post their own. About a third of companies have between 1 and 6 demo offers (the same ones every time, picked from
 * the company id), «لمسات للديكور» (g1-1) always has 6, and the rest have none. Each demo offer is about one of the
 * company's services, in order, and gets its own design and colour (see demoOfferLook). The demo texts live with the
 * cards (OFFER_DEMO in screens/Provider.tsx).
 */

/** How many kinds of demo offer text there are. */
export const OFFER_KINDS = 12;
/** The most demo offers a company has. */
const DEMO_MAX = 6;

const hash = (s: string) => { let h = 7; for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0; return h; };

/** How many demo offers a company has (0 for about two thirds of companies). */
export function demoOfferCount(coId: string): number {
  if (coId === 'g1-1') return DEMO_MAX;
  const h = hash(coId);
  return h % 3 === 0 ? 1 + (Math.floor(h / 3) % DEMO_MAX) : 0;
}

/** Which kind of demo offer text (0 to OFFER_KINDS - 1) a company's offer `i` is: each company starts at a different
 * kind, so not every company's first offer is the same («لمسات للديكور» keeps the plain order). */
export const offerKind = (coId: string, i: number) => (i + (coId === 'g1-1' ? 0 : Math.floor(hash(coId) / 7))) % OFFER_KINDS;

/** A demo offer's design and colour: different for each of a company's offers, and spread across companies. */
export function demoOfferLook(coId: string, i: number): { style: number; color: string } {
  const h = hash('look:' + coId);
  return { style: (h + i * 7) % OFFER_STYLES, color: OFFER_PALETTE[(Math.floor(h / 31) + i * 5) % OFFER_PALETTE.length] };
}

/** The service each of a company's demo offers is about (one per offer); empty when it has none. */
export function offerServices(catalog: Catalog, coId: string): Service[] {
  const svcs = catalog.services.filter(s => s.co === coId);
  if (!svcs.length) return [];
  return Array.from({ length: demoOfferCount(coId) }, (_, i) => svcs[i % svcs.length]);
}

/** The offers a company posted (whose service still shows), oldest first. */
export const liveOffersOf = (catalog: Catalog, coId: string): LiveOffer[] =>
  (catalog.offers || []).filter(o => o.co === coId && catalog.services.some(s => s.id === o.svc));

/** How many offers a company shows: its own when it posted any, else its demo ones. */
export const offerCount = (catalog: Catalog, coId: string) => liveOffersOf(catalog, coId).length || offerServices(catalog, coId).length;

/** How many days ago a company's demo offer `i` was posted (0 to 20), for «الأحدث». */
export const offerAge = (coId: string, i: number) => hash(coId + ':' + i) % 21;
