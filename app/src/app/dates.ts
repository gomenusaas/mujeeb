/* Booking calendar helpers. All times are Asia/Muscat (UTC+4, no daylight saving). */

const MUSCAT_OFFSET = '+04:00';
export const TIMES = ['08:00', '09:00', '10:00', '11:00', '16:00', '17:00'];

export interface BookingDay {
  /** Short weekday label shown on the day button. */
  dAr: string; dEn: string;
  /** Day of month. */
  n: number;
  /** e.g. "الأحد ١٥ نوفمبر" / "Sun 15 Nov". */
  longAr: string; longEn: string;
  monthAr: string; monthEn: string;
  /** Slots already taken (shown struck through). */
  full: string[];
  iso: (time: string) => string;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const fmt = (loc: string, o: Intl.DateTimeFormatOptions, d: Date) => new Intl.DateTimeFormat(loc, { timeZone: 'Asia/Muscat', ...o }).format(d);
const latn = (loc: string) => loc + '-u-nu-latn';

/** Next six bookable days starting tomorrow, skipping Fridays (closed). */
export function bookingDays(from = new Date()): BookingDay[] {
  const out: BookingDay[] = [];
  const muscatToday = new Date(fmt('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }, from) + 'T12:00:00Z');
  for (let k = 1; out.length < 6 && k < 14; k++) {
    const d = new Date(muscatToday.getTime() + k * 86400000);
    if (d.getUTCDay() === 5) continue;
    const day = ymd(d);
    const dayNum = d.getUTCDate();
    out.push({
      dAr: fmt('ar-u-nu-arab', { weekday: 'long' }, d), dEn: fmt('en-GB', { weekday: 'short' }, d), n: dayNum,
      longAr: fmt('ar-u-nu-arab', { weekday: 'long' }, d) + ' ' + fmt('ar-u-nu-arab', { day: 'numeric', month: 'long' }, d),
      longEn: fmt('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }, d).replace(',', ''),
      monthAr: fmt('ar-u-nu-arab', { month: 'long', year: 'numeric' }, d), monthEn: fmt(latn('en-GB'), { month: 'long', year: 'numeric' }, d),
      // Simulated availability: a few slots are taken on some days.
      full: [[], ['10:00'], [], ['09:00', '16:00'], [], ['08:00']][out.length],
      iso: (time: string) => day + 'T' + time + ':00' + MUSCAT_OFFSET,
    });
  }
  return out;
}

export const todayLabel = () => fmt(latn('en-GB'), { day: 'numeric', month: 'short', year: 'numeric' }, new Date());
export const nowHHMM = () => fmt(latn('en-GB'), { hour: '2-digit', minute: '2-digit', hour12: false }, new Date());
