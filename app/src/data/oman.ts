import type { GovId } from './types';

/** A wilayat (district) the customer can pick as their service location. */
export interface Wilayat { id: string; ar: string; en: string }
/**
 * A governorate of Oman with its wilayats. `region` is the matching region in the app's own
 * (simplified) list used for company coverage, or null where the app has none yet.
 */
export interface Governorate { id: string; ar: string; en: string; region: GovId | null; wilayats: Wilayat[] }

const w = (id: string, ar: string, en: string): Wilayat => ({ id, ar, en });

/** Oman's 11 governorates and 61 wilayats. */
export const OMAN: Governorate[] = [
  { id: 'muscat', ar: 'مسقط', en: 'Muscat', region: 'muscat', wilayats: [
    w('muscat', 'مسقط', 'Muscat'), w('muttrah', 'مطرح', 'Muttrah'), w('bawshar', 'بوشر', 'Bawshar'),
    w('seeb', 'السيب', 'As Seeb'), w('amerat', 'العامرات', 'Al Amerat'), w('qurayyat', 'قريات', 'Qurayyat'),
  ] },
  { id: 'dhofar', ar: 'ظفار', en: 'Dhofar', region: 'dhofar', wilayats: [
    w('salalah', 'صلالة', 'Salalah'), w('taqah', 'طاقة', 'Taqah'), w('mirbat', 'مرباط', 'Mirbat'), w('rakhyut', 'رخيوت', 'Rakhyut'),
    w('thumrait', 'ثمريت', 'Thumrait'), w('dhalkut', 'ضلكوت', 'Dhalkut'), w('mazyunah', 'المزيونة', 'Al Mazyunah'),
    w('muqshin', 'مقشن', 'Muqshin'), w('shalim', 'شليم وجزر الحلانيات', 'Shalim and the Hallaniyat Islands'), w('sadah', 'سدح', 'Sadah'),
  ] },
  { id: 'musandam', ar: 'مسندم', en: 'Musandam', region: null, wilayats: [
    w('khasab', 'خصب', 'Khasab'), w('dibba', 'دبا', 'Dibba'), w('bukha', 'بخا', 'Bukha'), w('madha', 'مدحاء', 'Madha'),
  ] },
  { id: 'buraimi', ar: 'البريمي', en: 'Al Buraimi', region: null, wilayats: [
    w('buraimi', 'البريمي', 'Al Buraimi'), w('mahdah', 'محضة', 'Mahdah'), w('sunaynah', 'السنينة', 'As Sunaynah'),
  ] },
  { id: 'dakhiliyah', ar: 'الداخلية', en: 'Ad Dakhiliyah', region: 'dakhiliyah', wilayats: [
    w('nizwa', 'نزوى', 'Nizwa'), w('bahla', 'بهلاء', 'Bahla'), w('manah', 'منح', 'Manah'), w('hamra', 'الحمراء', 'Al Hamra'),
    w('adam', 'أدم', 'Adam'), w('izki', 'إزكي', 'Izki'), w('samail', 'سمائل', 'Samail'), w('bidbid', 'بدبد', 'Bidbid'),
  ] },
  { id: 'north-batinah', ar: 'شمال الباطنة', en: 'North Al Batinah', region: 'batinah', wilayats: [
    w('sohar', 'صحار', 'Sohar'), w('shinas', 'شناص', 'Shinas'), w('liwa', 'لوى', 'Liwa'), w('saham', 'صحم', 'Saham'),
    w('khaburah', 'الخابورة', 'Al Khaburah'), w('suwaiq', 'السويق', 'As Suwaiq'),
  ] },
  { id: 'south-batinah', ar: 'جنوب الباطنة', en: 'South Al Batinah', region: 'batinah', wilayats: [
    w('rustaq', 'الرستاق', 'Ar Rustaq'), w('awabi', 'العوابي', 'Al Awabi'), w('nakhal', 'نخل', 'Nakhal'),
    w('wadi-maawil', 'وادي المعاول', "Wadi Al Ma'awil"), w('barka', 'بركاء', 'Barka'), w('musanaah', 'المصنعة', "Al Musana'ah"),
  ] },
  { id: 'south-sharqiyah', ar: 'جنوب الشرقية', en: 'South Ash Sharqiyah', region: 'sharqiyah', wilayats: [
    w('sur', 'صور', 'Sur'), w('kamil', 'الكامل والوافي', 'Al Kamil Wal Wafi'), w('jbb-hassan', 'جعلان بني بو حسن', 'Jalan Bani Bu Hassan'),
    w('jbb-ali', 'جعلان بني بو علي', 'Jalan Bani Bu Ali'), w('masirah', 'مصيرة', 'Masirah'),
  ] },
  { id: 'north-sharqiyah', ar: 'شمال الشرقية', en: 'North Ash Sharqiyah', region: 'sharqiyah', wilayats: [
    w('ibra', 'إبراء', 'Ibra'), w('mudhaibi', 'المضيبي', 'Al Mudhaibi'), w('sinaw', 'سناو', 'Sinaw'), w('bidiyah', 'بدية', 'Bidiyah'), w('qabil', 'القابل', 'Al Qabil'),
    w('wadi-bani-khalid', 'وادي بني خالد', 'Wadi Bani Khalid'), w('dima', 'دماء والطائيين', 'Dima Wa At Taiyyin'),
  ] },
  { id: 'dhahirah', ar: 'الظاهرة', en: 'Ad Dhahirah', region: null, wilayats: [
    w('ibri', 'عبري', 'Ibri'), w('yanqul', 'ينقل', 'Yanqul'), w('dhank', 'ضنك', 'Dhank'),
  ] },
  { id: 'wusta', ar: 'الوسطى', en: 'Al Wusta', region: null, wilayats: [
    w('haima', 'هيماء', 'Haima'), w('mahout', 'محوت', 'Mahout'), w('duqm', 'الدقم', 'Ad Duqm'), w('jazir', 'الجازر', 'Al Jazir'),
  ] },
];

/** The wilayat used until the customer picks one. */
export const DEFAULT_WILAYAT = 'bawshar';

/**
 * A wilayat and its governorate by id in `list` (the admin's list from the database, or OMAN).
 * A wilayat that was removed or hidden falls back to the default, then to the first one listed.
 */
export function findWilayat(list: Governorate[], id: string): { w: Wilayat; g: Governorate } {
  const find = (k: string) => { for (const g of list) for (const x of g.wilayats) if (x.id === k) return { w: x, g }; return null; };
  const first = list.find(g => g.wilayats.length);
  return find(id) || find(DEFAULT_WILAYAT) || (first ? { w: first.wilayats[0], g: first } : { w: OMAN[0].wilayats[2], g: OMAN[0] });
}

/** The wilayat's name with «ولاية» before it, without the governorate: «ولاية بوشر» / "Bawshar". */
export function wilayatLabel(list: Governorate[], id: string, ar: boolean): string {
  const { w: x } = findWilayat(list, id);
  return ar ? 'ولاية ' + x.ar : x.en;
}
