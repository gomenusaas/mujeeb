import type { WeekHours } from '../data/types';

/** Days in the order Omani customers expect: Saturday first. Values are JavaScript weekdays (0 = Sunday). */
export const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];

const SUNDAY = new Date(2024, 0, 7); // a Sunday
export const dayName = (day: number, ar: boolean) =>
  new Date(SUNDAY.getFullYear(), 0, 7 + day).toLocaleDateString(ar ? 'ar-OM' : 'en-GB', { weekday: 'long' });

/** "08:30" → "٨:٣٠ ص" / "8:30 AM". */
export const fmtTime = (hhmm: string, ar: boolean) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2024, 0, 1, h, m).toLocaleTimeString(ar ? 'ar-OM' : 'en-US', { hour: 'numeric', minute: '2-digit' });
};

/** Shifts of a day as ["08:00", "13:00"] pairs. */
export const shifts = (h: string[] | null | undefined): [string, string][] =>
  !h ? [] : h.length >= 4 ? [[h[0], h[1]], [h[2], h[3]]] : [[h[0], h[1]]];

const mins = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** Weekday and minutes since midnight in Oman, whatever the device's time zone. */
function muscatNow(): { day: number; min: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Muscat', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t: string) => parts.find(p => p.type === t)?.value || '';
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** Today's weekday in Oman (0 = Sunday). */
export const muscatToday = () => muscatNow().day;

/** Whether the company is open right now (Oman time), including shifts that run past midnight. */
export function isOpenNow(week: WeekHours): boolean {
  const { day, min } = muscatNow();
  const inShift = ([o, c]: [string, string], m: number, overnightTail: boolean) => {
    const a = mins(o), b = mins(c);
    if (b > a) return !overnightTail && m >= a && m < b;
    return overnightTail ? m < b : m >= a; // closes after midnight
  };
  if (shifts(week[day]).some(s => inShift(s, min, false))) return true;
  return shifts(week[(day + 6) % 7]).some(s => inShift(s, min, true));
}
