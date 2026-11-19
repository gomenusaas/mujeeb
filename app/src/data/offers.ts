import type { Catalog, Service } from './types';

/*
 * DEMO offers, until companies can post their own. About a third of companies have between 1 and 6 offers (the same
 * ones every time, picked from the company id), «لمسات للديكور» (g1-1) always has all 6, and the rest have none.
 * Each offer is about one of the company's services, in order. The offer texts live with the cards
 * (OFFER_DEMO in screens/Provider.tsx).
 */

/** How many kinds of demo offer there are (and so the most a company can have). */
export const OFFER_KINDS = 6;

const hash = (s: string) => { let h = 7; for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0; return h; };

/** How many demo offers a company has (0 for about two thirds of companies). */
export function demoOfferCount(coId: string): number {
  if (coId === 'g1-1') return OFFER_KINDS;
  const h = hash(coId);
  return h % 3 === 0 ? 1 + (Math.floor(h / 3) % OFFER_KINDS) : 0;
}

/** Which kind of demo offer (0 to OFFER_KINDS - 1) a company's offer `i` is: each company starts at a different
 * kind, so not every company's first offer is the same («لمسات للديكور» keeps the plain order). */
export const offerKind = (coId: string, i: number) => (i + (coId === 'g1-1' ? 0 : Math.floor(hash(coId) / 7))) % OFFER_KINDS;

/** The service each of a company's demo offers is about (one per offer); empty when it has none. */
export function offerServices(catalog: Catalog, coId: string): Service[] {
  const svcs = catalog.services.filter(s => s.co === coId);
  if (!svcs.length) return [];
  return Array.from({ length: demoOfferCount(coId) }, (_, i) => svcs[i % svcs.length]);
}

/** The company has an offer in this category (any category when null). */
export const hasOfferIn = (catalog: Catalog, coId: string, cat: number | null | undefined) =>
  offerServices(catalog, coId).some(s => cat == null || s.cat === cat);

/** How many days ago a company's demo offer `i` was posted (0 to 20), for «الأحدث». */
export const offerAge = (coId: string, i: number) => hash(coId + ':' + i) % 21;
