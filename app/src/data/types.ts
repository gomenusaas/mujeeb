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
}

export interface Album {
  id: string; co: string; cat: number; ar: string; en: string; pAr: string; pEn: string; n: number; img: string; imgs: string[];
  /** When the album was added to the platform (ISO date or timestamp). */
  added: string;
  /** Project videos (full URLs). */
  vids?: string[];
  /** Photos and videos the company keeps out of its gallery on the company page. */
  hide?: string[];
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
  /** Live stories from Supabase; undefined in demo mode (the bundled demo stories are used). */
  stories?: Story[];
}

export interface CustomerSeed { bookings: Booking[] }
