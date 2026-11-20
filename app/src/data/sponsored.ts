/*
 * DEMO sponsored listings, until companies can pay for a place: about half of companies count as sponsored (the
 * same ones every time, picked from the company id). Each day they take turns at the front of the strip.
 */

const hash = (s: string) => { let h = 7; for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0; return h; };

/** The most companies a category page's sponsored strip shows. */
export const SPONSORED_MAX = 10;

/** The company has a (demo) sponsored listing. */
export const isSponsored = (coId: string) => hash('sp:' + coId) % 2 === 0;

/** A number that orders sponsored companies differently each day (the same all day). */
export const sponsoredTurn = (coId: string, day: string) => hash(day + ':' + coId);
