/** Bilingual pair: [arabic, english]. */
export type Pair = [string, string];
export type Lang = 'ar' | 'en';
export type GovId = 'all' | 'muscat' | 'batinah' | 'dakhiliyah' | 'dhofar' | 'sharqiyah';

export interface Category { i: number; ar: string; en: string; sar: string; sen: string; icon: string; color: string; art: string }

/** Branch: [nameAr, nameEn, isPrimary]. */
export type Branch = [string, string, boolean];

export interface Company {
  id: string; ar: string; en: string; cats: number[];
  cityAr: string; cityEn: string; gov: GovId; cov: GovId[];
  /** Unsplash photo id for the cover. */
  img: string;
  verified: boolean; book: boolean; rfq: boolean; phone: string;
  since: number; dar: string; den: string; branches: Branch[];
}

export interface Service { id: string; co: string; cat: number; ar: string; en: string; imgs: string[]; dar: string; den: string }

export interface Album { id: string; co: string; cat: number; ar: string; en: string; pAr: string; pEn: string; n: number; img: string; imgs: string[] }

/** Quotation line: [nameAr, nameEn, qty, unitPrice]. */
export type QuoteLine = [string, string, number, number];
export type QuoteStatus = 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
export type RfqStatus = 'submitted' | 'review' | 'moreinfo' | 'received' | 'declined' | 'closed' | 'cancelled';
export interface Quotation { no: string; st: QuoteStatus; valid: string; lines: QuoteLine[]; discount: number; vat: number }
export interface QuoteRequest {
  id: string; co: string; svc: string; tAr: string; tEn: string; st: RfqStatus; date: string;
  askAr?: string; askEn?: string; quote?: Quotation | null;
}

export type BookingStatus = 'pending' | 'confirmed' | 'reschedule' | 'cancelled' | 'rejected' | 'completed' | 'noshow';
export interface Booking {
  id: string; co: string; p: string; dAr: string; dEn: string; time: string; st: BookingStatus;
  nAr?: string; nEn?: string; nTime?: string;
}

export interface ChatMessage { mine: boolean; ar: string; en: string; time: string }
export interface Chat { unread: number; ref: string | null; msgs: ChatMessage[] }

export interface Catalog {
  cats: Category[]; gov: Record<GovId, Pair>; hours: [string, string, string | null][];
  companies: Company[]; services: Service[]; albums: Album[];
}

export interface CustomerSeed { quotes: QuoteRequest[]; bookings: Booking[]; chats: Record<string, Chat> }
