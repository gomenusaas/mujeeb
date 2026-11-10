import { photo } from './api';

/**
 * Company stories (Instagram-style), shown on Home under the categories.
 *
 * Demo content until companies can post their own: photos come from the companies'
 * existing service/album images (Unsplash), and videos are free Mixkit stock clips
 * (https://mixkit.co/license/#videoFree).
 */
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

const img = (id: string, co: string, h: number, ar: string, en: string): Story => ({
  id: 'st-' + co, co, kind: 'image', src: photo(id, 1080), poster: photo(id, 540), ar, en, h,
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
];
