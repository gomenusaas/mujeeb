import { photo } from './api';
import type { Story } from './types';

export type { Story };

/**
 * Company stories (Instagram-style), shown on Home under the categories.
 *
 * Demo content until companies can post their own: photos come from the companies'
 * existing service/album images (Unsplash), and videos are free Mixkit stock clips
 * (https://mixkit.co/license/#videoFree).
 */
const img = (id: string, co: string, h: number, ar: string, en: string, n = ''): Story => ({
  id: 'st-' + co + n, co, kind: 'image', src: photo(id, 1080), poster: photo(id, 540), ar, en, h,
});

const vid = (mixkitId: number, co: string, h: number, ar: string, en: string): Story => ({
  id: 'st-' + co, co, kind: 'video',
  src: 'https://assets.mixkit.co/videos/' + mixkitId + '/' + mixkitId + '-720.mp4',
  poster: 'https://assets.mixkit.co/videos/' + mixkitId + '/' + mixkitId + '-thumb-720-0.jpg',
  ar, en, h,
});

export const STORIES: Story[] = [
  vid(4010, 'c1', 1, 'مشاريعنا الجارية هذا الأسبوع', 'Projects underway this week'),
  img('1545259741-2ea3ebf61fa3', 'c7', 2, 'عرض صيانة المكيفات قبل الصيف', 'Pre-summer AC servicing offer'),
  vid(41178, 'c2', 3, 'من الفكرة إلى غرفة جاهزة', 'From idea to finished room'),
  img('1621905252507-b35492cc74b4', 'c3', 5, 'ترقية لوحة كهربائية لمبنى تجاري', 'Commercial panel upgrade'),
  vid(43033, 'c4', 6, 'مطبخ مفتوح سلّمناه هذا الأسبوع', 'Open kitchen handed over this week'),
  img('1564013799919-ab600027ffc6', 'c5', 8, 'تنسيق حديقة ومسبح في السيب', 'Pool and garden landscaping in Seeb'),
  vid(1439, 'g0-2', 11, 'مراجعة المخططات مع العميل', 'Reviewing the plans with a client'),
  img('1557597774-9d273605dfa9', 'c10', 14, 'تركيب كاميرات مراقبة لفيلا', 'Villa CCTV installation'),
  // Interior design companies (for the category page's stories row).
  img('1617104678098-de229db51175', 'g1-1', 4, 'غرفة نوم رئيسية سلّمناها اليوم', 'Master bedroom handed over today'),
  img('1586023492125-27b2c045efd7', 'g1-1', 16, 'لمسات أخيرة في صالة عائلية', 'Finishing touches in a family living room', '-2'),
  img('1600607687939-ce8a6c25118c', 'g1-0', 7, 'مجلس بألوان هادئة', 'A majlis in calm colours'),
  img('1615874959474-d609969a20ed', 'g1-2', 9, 'قبل وبعد: صالة في مسقط', 'Before and after: a living room in Muscat'),
  img('1611048267451-e6ed903d4a38', 'g1-3', 12, 'إضاءة مخفية لسقف جبسي', 'Hidden lighting for a gypsum ceiling'),
  img('1615873968403-89e068629265', 'g1-4', 18, 'تنسيق أثاث لشقة جديدة', 'Furnishing a new apartment'),
  img('1618221195710-dd6b41faaea6', 'g1-5', 20, 'غرفة جلوس بطابع عصري', 'A modern sitting room'),
];

/**
 * The stories the app shows: the live ones, or the demo ones above while the database has none (so the stories
 * rows aren't empty before companies start posting). PRE-LAUNCH: drop the demo fallback (return `live ?? []`).
 */
export const shownStories = (live?: Story[]): Story[] => (live?.length ? live : STORIES);
