/** Bilingual pair: [arabic, english]. */
export type Pair = [string, string];
export type Lang = 'ar' | 'en';
export type GovId = 'all' | 'muscat' | 'batinah' | 'dakhiliyah' | 'dhofar' | 'sharqiyah';

export interface Category { i: number; ar: string; en: string; sar: string; sen: string; icon: string; color: string; art: string }

/** Branch: [nameAr, nameEn, isPrimary, lat?, lng?]. The map location is set by the company in the provider app. */
export type Branch = [string, string, boolean, (number | null)?, (number | null)?];

/** Working hours by weekday (index 0 = Sunday): null = closed, else [opens, closes] or [opens, closes, opens2, closes2] as "HH:MM". */
export type WeekHours = (string[] | null)[];

export interface Company {
  id: string; ar: string; en: string; cats: number[];
  cityAr: string; cityEn: string; gov: GovId; cov: GovId[];
  /** Cover photo: an Unsplash photo id (demo data) or a full URL (uploaded by the company). */
  img: string;
  verified: boolean; book: boolean; phone: string;
  since: number; dar: string; den: string; branches: Branch[];
  /** The company's own working hours; when missing, the platform's general hours are shown. */
  hrs?: WeekHours;
}

export interface Service {
  id: string; co: string; cat: number; ar: string; en: string; imgs: string[]; dar: string; den: string;
  /** Header image of the service page (uploaded by the company). Missing = first photo, then the company cover. */
  cover?: string;
  /** Search keywords from the company (up to 7, Arabic or English). Only search uses them; customers don't see them. */
  kw?: string[];
  /** Sub-services it covers: ids from its category's fixed list (`sub`) and ones the company typed (`csub`). */
  sub?: string[]; csub?: string[];
}

/** A sub-service in a category's fixed list (managed in the admin app), in the admin's order. */
export interface SubService { id: string; cat: number; ar: string; en: string }

export interface Album {
  id: string; co: string; cat: number; ar: string; en: string; pAr: string; pEn: string; n: number; img: string; imgs: string[];
  /** When the album was added to the platform (ISO date or timestamp). */
  added: string;
  /** Project videos (full URLs). */
  vids?: string[];
  /** Photos and videos the company keeps out of its galleries (company page, service page, Explore). */
  hide?: string[];
  /** The service this project belongs to. */
  svc?: string;
  /** Project page details (optional): description, completion month (YYYY-MM-01), area in m², duration in weeks. */
  dAr?: string; dEn?: string; done?: string; area?: number; weeks?: number;
  /** Picked by the company for «مشاريع مميزة» on its page (at most 7 per company). */
  feat?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'reschedule' | 'cancelled' | 'rejected' | 'completed' | 'noshow';
export interface Booking {
  id: string; co: string; p: string; dAr: string; dEn: string; time: string; st: BookingStatus;
  nAr?: string; nEn?: string; nTime?: string;
}

/** A company story (24 hours), shown on Home. */
export interface Story {
  id: string;
  /** Company id. */
  co: string;
  kind: 'image' | 'video';
  /** Full-size image, or the video file. */
  src: string;
  /** Still image for the thumbnail (and the video's poster while it loads). */
  poster: string;
  ar: string;
  en: string;
  /** Posted this many hours ago (stories expire after 24 h). */
  h: number;
}

export interface Catalog {
  cats: Category[]; gov: Record<GovId, Pair>; hours: [string, string, string | null][];
  companies: Company[]; services: Service[]; albums: Album[];
  /** Each category's sub-services (active ones, in order). */
  subs: SubService[];
  /** Live stories from Supabase; undefined in demo mode. While there are none, the bundled demo stories show (see shownStories). */
  stories?: Story[];
  /** Followers per company (not counting the person viewing); missing = none yet. */
  followers?: Record<string, number>;
  /** Live offers from Supabase (active, not ended); undefined in demo mode. Companies without any show demo offers. */
  offers?: LiveOffer[];
  /** Service locations (governorates → wilayats) in the admin's order; undefined = the bundled list in data/oman.ts. */
  places?: import('./oman').Governorate[];
  /** The home «الخدمات» grid as the platform admin set it (table home_services): each tile's category and name, in
   * order. Undefined (demo mode) or empty = the first categories with their short names. */
  home?: HomeTile[];
}

/** A tile in the home services grid: opens category `cat`, named `ar` / `en`; `icon` = a flat icon in public/art/flat
 * the admin picked (undefined = the category's own). */
export interface HomeTile { cat: number; ar: string; en: string; icon?: string }

/** An offer a company posted (see supabase/migrations/…_offers.sql). Texts: k = kicker, b = value, s = what it's on. */
export interface LiveOffer {
  id: string; co: string; svc: string; style: number; color: string;
  kAr: string; kEn: string; bAr: string; bEn: string; sAr: string; sEn: string; tAr: string; tEn: string;
  /** Photo URL or demo id; undefined = the service's photo. */
  photo?: string;
  /** Last day, "YYYY-MM-DD" (Oman time). */
  ends: string;
  added: string;
}

export interface CustomerSeed { bookings: Booking[] }
