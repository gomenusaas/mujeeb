import type { Pair } from '../data/types';

/** Centralized UI strings: [arabic, english]. Copied from the MUJEEB App design. */
export const STR = {
  home: ['الرئيسية', 'Home'], categories: ['الفئات', 'Categories'], explore: ['استكشف', 'Explore'], messages: ['الرسائل', 'Messages'], profile: ['حسابي', 'Profile'],
  brand: ['مجيب', 'MUJEEB'], serviceLoc: ['موقع الخدمة', 'Service location'], loc: ['بوشر، مسقط', 'Bawshar, Muscat'], otherLang: ['EN', 'عربي'],
  greeting: ['مرحبًا أحمد، كيف نساعدك اليوم؟', 'Hi Ahmed, how can we help today?'], search: ['ما الخدمة التي تبحث عنها؟', 'What service are you looking for?'],
  viewAll: ['عرض الكل', 'View all'], seeAll: ['عرض الكل', 'See all'],
  featuredCo: ['شركات مميزة', 'Featured companies'], featuredPr: ['مشاريع مميزة', 'Featured projects'], recommended: ['مقترحة لك في مسقط', 'Recommended in Muscat'], recSub: ['حسب موقعك ونطاق الخدمة', 'Based on your location and service coverage'],
  sponsored: ['إعلان ممول', 'Sponsored'], viewOffer: ['عرض', 'View'], photos: ['صورة', 'photos'], covers: ['يغطي', 'Covers'],
  allCats: ['جميع الفئات', 'All categories'], majorCats: ['فئات رئيسية', 'major categories'], allServices: ['كل الخدمات', 'All services'],
  results: ['شركة', 'companies'], list: ['قائمة', 'List'], map: ['خريطة', 'Map'], relevance: ['الأنسب', 'Relevance'], nearest: ['الأقرب', 'Nearest'], recent: ['الأحدث', 'Recent'],
  verifiedOnly: ['موثّقة فقط', 'Verified only'], viewProfile: ['عرض الملف', 'View profile'], noResults: ['لا توجد نتائج', 'No matches yet'], noResultsBody: ['جرّب منطقة أخرى أو أزل بعض الفلاتر.', 'Try another area or remove a filter.'], clear: ['مسح الفلاتر', 'Clear filters'],
  services: ['الخدمات', 'Services'], portfolio: ['الأعمال', 'Portfolio'], about: ['نبذة', 'About'],
  getQuote: ['اطلب عرض سعر', 'Get quotation'], whatsapp: ['واتساب', 'WhatsApp'], message: ['رسالة', 'Message'], call: ['اتصال', 'Call'], bookVisit: ['احجز زيارة', 'Book visit'],
  bookOff: ['هذه الشركة لا تستقبل حجوزات الزيارات حاليًا.', 'This company is not taking site visit bookings right now.'],
  menu: ['القائمة', 'Menu'], coAddress: ['العنوان', 'Address'], svcAreas: ['توفر الخدمة حسب المنطقة', 'Service locations availability'], contact: ['التواصل', 'Contact'], website: ['الموقع الإلكتروني', 'Website'], social: ['حسابات التواصل الاجتماعي', 'Social media'], email: ['البريد الإلكتروني', 'Email'], openMaps: ['افتح في الخرائط', 'Open in Maps'], covIntro: ['تقدم الشركة خدماتها في المناطق التالية:', 'This company serves the following areas:'],
  branches: ['الفروع', 'Branches'], primary: ['الفرع الرئيسي', 'Main branch'], branch: ['فرع', 'Branch'], hours: ['ساعات العمل', 'Working hours'], closed: ['مغلق', 'Closed'], since: ['منذ', 'Since'],
  video: ['فيديو', 'Video'], related: ['أعمال ذات صلة', 'Related work'], moreServices: ['خدمات أخرى من الشركة', 'More from this company'],
  rfqTitle: ['طلب عرض سعر', 'Request a quotation'],
  rfqS1: ['تفاصيل الطلب', 'Request details'], rfqS2: ['الموقع والميزانية', 'Location & budget'], rfqS3: ['المرفقات والمراجعة', 'Attachments & review'],
  selService: ['الخدمة', 'Service'], reqTitle: ['عنوان الطلب', 'Request title'], reqTitlePh: ['مثال: تجديد مطبخ بمساحة ١٢ م²', 'e.g. Renovate a 12 m² kitchen'],
  projDesc: ['وصف المشروع', 'Project description'], projDescPh: ['المقاسات، الخامات المفضلة، وأي تفاصيل مهمة', 'Dimensions, preferred materials, anything important'],
  gov: ['المحافظة', 'Governorate'], city: ['المدينة أو الولاية', 'City or district'], cityPh: ['مثال: بوشر', 'e.g. Bawshar'], address: ['العنوان التفصيلي (اختياري)', 'Exact address (optional)'], addressPh: ['رقم المبنى أو السكة', 'Building or way number'],
  budget: ['الميزانية (اختياري)', 'Budget (optional)'], budgetK: ['الميزانية', 'Budget'], start: ['موعد البدء المفضل (اختياري)', 'Preferred start (optional)'], startK: ['موعد البدء المفضل', 'Preferred start'],
  attach: ['الصور والمستندات (اختياري)', 'Photos & documents (optional)'], addPhoto: ['إضافة صورة', 'Add photo'], addDoc: ['إضافة مستند', 'Add document'],
  yourContact: ['بيانات التواصل', 'Your contact details'], name: ['الاسم', 'Name'], phone: ['الهاتف', 'Phone'], summary: ['ملخص الطلب', 'Summary'],
  continue: ['متابعة', 'Continue'], submit: ['إرسال الطلب', 'Submit request'],
  rfqNote: ['تصلك الردود في «طلبات عروض الأسعار» وفي الرسائل. لا يترتب على الطلب أي التزام بالدفع.', 'Replies arrive in My quotations and Messages. Requesting a quotation does not commit you to pay anything.'],
  rfqDone: ['تم إرسال طلبك', 'Request sent'], sentTo: ['أرسلنا طلبك إلى', 'We have sent your request to'], notifyReply: ['وسنرسل لك إشعارًا عند الرد.', 'We will notify you when they reply.'],
  viewQuotes: ['عرض طلباتي', 'View my quotations'], backHome: ['العودة للرئيسية', 'Back to home'],
  bkTitle: ['حجز زيارة موقع', 'Book a site visit'], bkS1: ['سبب الزيارة', 'Visit purpose'], bkS2: ['الموقع والموعد', 'Location & time'], bkS3: ['المراجعة', 'Review'],
  siteLoc: ['موقع الزيارة', 'Site location'], time: ['الوقت', 'Time'], notes: ['ملاحظات للشركة (اختياري)', 'Notes for the company (optional)'], notesPh: ['رقم الفيلا، المواقف، أفضل مدخل…', 'Villa number, parking, best entrance…'],
  bkSubmit: ['إرسال طلب الحجز', 'Send booking request'], muscatTime: ['بتوقيت مسقط', 'Muscat time'],
  bkNote: ['تؤكد الشركة الموعد يدويًا، عادةً خلال ساعات. الإلغاء مجاني قبل ٢٤ ساعة.', 'The company confirms manually, usually within a few hours. Free cancellation up to 24 hours before.'],
  bkDone: ['تم إرسال طلب الحجز', 'Booking request sent'], waitConfirm: ['بانتظار تأكيد', 'Waiting for confirmation from'], viewBookings: ['عرض حجوزاتي', 'View my bookings'],
  typeMsg: ['اكتب رسالة…', 'Write a message…'], ref: ['مرجع', 'Ref'], replyFast: ['يرد عادةً خلال ساعة', 'Usually replies within an hour'], you: ['أنت: ', 'You: '],
  noChats: ['لا توجد رسائل بعد', 'No messages yet'], noChatsBody: ['راسل أي شركة من صفحتها وستظهر المحادثة هنا.', 'Message any company from its page and the conversation shows up here.'],
  myQuotes: ['طلبات عروض الأسعار', 'My quotations'], myBookings: ['حجوزاتي', 'My bookings'], favorites: ['المفضلة', 'Favorites'], notifications: ['الإشعارات', 'Notifications'], language: ['اللغة', 'Language'], settings: ['الإعدادات', 'Settings'], help: ['المساعدة', 'Help'], signOut: ['تسجيل الخروج', 'Sign out'], langName: ['العربية', 'English'],
  requests: [' طلبات', ' requests'], companiesN: [' شركات', ' companies'], newN: [' جديدة', ' new'], active: ['نشطة', 'active'],
  quotation: ['عرض السعر', 'Quotation'], validUntil: ['صالح حتى', 'Valid until'], subtotal: ['المجموع الفرعي', 'Subtotal'], discount: ['الخصم', 'Discount'], vat: ['ضريبة القيمة المضافة ٥٪', 'VAT 5%'], total: ['الإجمالي', 'Total'],
  downloadPdf: ['تحميل PDF', 'Download PDF'], accept: ['قبول العرض', 'Accept'], reject: ['رفض', 'Reject'], replyMsg: ['الرد برسالة', 'Reply in messages'],
  acceptNote: ['قبول العرض لا يُنشئ دفعة أو عقدًا ملزمًا. ستتواصل معك الشركة لترتيب الخطوات التالية.', 'Accepting does not create a payment or a binding contract. The company will contact you about next steps.'],
  providerAsks: ['سؤال من الشركة', 'The company asked'], waitingQuote: ['لم يصل عرض سعر بعد. سنرسل لك إشعارًا عند وصوله.', 'No quotation yet. We will notify you when it arrives.'],
  acceptTime: ['قبول الموعد', 'Accept time'], cancel: ['إلغاء', 'Cancel'], proposed: ['موعد مقترح', 'Proposed'], contactCo: ['مراسلة', 'Message'],
  noFav: ['لا توجد مفضلة بعد', 'Nothing saved yet'], noFavBody: ['اضغط على القلب في أي شركة لحفظها هنا.', 'Tap the heart on any company to save it here.'],
  exploreTitle: ['استكشف الأعمال', 'Explore work'], exploreSub: ['ألبومات منشورة من الشركات', 'Published albums from companies'], all: ['الكل', 'All'],
  opening: ['جارٍ فتح واتساب…', 'Opening WhatsApp…'], calling: ['جارٍ الاتصال بـ', 'Calling'], pdfToast: ['تم تحميل ملف PDF', 'PDF downloaded'], accepted: ['تم قبول عرض السعر', 'Quotation accepted'], rejected: ['تم رفض عرض السعر', 'Quotation rejected'], savedT: ['أضيفت إلى المفضلة', 'Saved to favorites'], unsavedT: ['أزيلت من المفضلة', 'Removed from favorites'], rescheduled: ['تم تأكيد الموعد الجديد', 'New time confirmed'], cancelledT: ['تم إلغاء الحجز', 'Booking cancelled'], fileAdded: ['تمت إضافة الملف', 'File added'],
  memberSince: ['عضو منذ ٢٠٢٥', 'Member since 2025'], userName: ['أحمد البلوشي', 'Ahmed Al Balushi'],
  autoReply: ['شكرًا، وصلت رسالتك. سنرد عليك بالتفاصيل قريبًا.', 'Thanks, got your message. We will get back to you with details shortly.'],
  loading: ['جارٍ التحميل…', 'Loading…'], loadError: ['تعذر تحميل البيانات', 'Could not load data'],
  stories: ['قصص الشركات', 'Company stories'], latestProjects: ['آخر المشاريع', 'Last projects'],
  viewAs: ['طريقة العرض', 'View as'], sortBy: ['ترتيب حسب', 'Sort by'], viewLarge: ['بطاقات كبيرة', 'Large cards'], viewGrid: ['بطاقتان في الصف', 'Two per row'], viewRows: ['قائمة مختصرة', 'Compact list'], close: ['إغلاق', 'Close'], hoursAgo: ['منذ {n} س', '{n}h'],
} satisfies Record<string, Pair>;

export type StrKey = keyof typeof STR;
export type T = Record<StrKey, string>;

export function strings(ar: boolean): T {
  const t = {} as T;
  for (const k in STR) t[k as StrKey] = STR[k as StrKey][ar ? 0 : 1];
  return t;
}

/** Arabic-Indic digits for Arabic UI copy (counts, step numbers). */
export const arDigits = (n: number | string) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

export const RFQ_ST = { submitted: ['تم الإرسال', 'Submitted', 'brand'], review: ['قيد المراجعة', 'Under review', 'info'], moreinfo: ['مطلوب معلومات إضافية', 'More info required', 'warning'], received: ['وصل عرض السعر', 'Quotation received', 'success'], declined: ['مرفوض', 'Declined', 'danger'], closed: ['مغلق', 'Closed', 'neutral'], cancelled: ['ملغي', 'Cancelled', 'neutral'] } as const;
export const Q_ST = { sent: ['مُرسل', 'Sent', 'brand'], viewed: ['تمت المشاهدة', 'Viewed', 'info'], accepted: ['مقبول', 'Accepted', 'success'], rejected: ['مرفوض', 'Rejected', 'danger'], expired: ['منتهي', 'Expired', 'neutral'] } as const;
export const BK_ST = { pending: ['بانتظار التأكيد', 'Pending', 'warning'], confirmed: ['مؤكد', 'Confirmed', 'success'], reschedule: ['موعد بديل مقترح', 'Reschedule proposed', 'info'], cancelled: ['ملغي', 'Cancelled', 'neutral'], rejected: ['مرفوض', 'Rejected', 'danger'], completed: ['مكتمل', 'Completed', 'neutral'], noshow: ['لم يحضر', 'No show', 'neutral'] } as const;

/** Visit purpose: [id, ar, en, descAr, descEn, icon]. */
export const PURPOSES = [
  ['inspect', 'معاينة الموقع', 'Site inspection', 'تقييم الحالة قبل التسعير', 'Assess the site before pricing', 'scan-search'],
  ['measure', 'أخذ المقاسات', 'Measurement', 'قياس دقيق للتصميم أو التصنيع', 'Exact measurements for design or manufacturing', 'ruler'],
  ['consult', 'استشارة', 'Consultation', 'نقاش الفكرة والخيارات في الموقع', 'Discuss ideas and options on site', 'messages-square'],
  ['maint', 'تقييم صيانة', 'Maintenance assessment', 'تحديد المشكلة وما تحتاجه من إصلاح', 'Find the problem and what it needs', 'wrench'],
] as const;
export const BUDGETS: Pair[] = [['أقل من ٥٠٠ ر.ع.', 'Under OMR 500'], ['٥٠٠ – ٢٬٠٠٠ ر.ع.', 'OMR 500 – 2,000'], ['٢٬٠٠٠ – ١٠٬٠٠٠ ر.ع.', 'OMR 2,000 – 10,000'], ['أكثر من ١٠٬٠٠٠ ر.ع.', 'Over OMR 10,000']];
export const STARTS: Pair[] = [['في أقرب وقت', 'As soon as possible'], ['خلال شهر', 'Within a month'], ['خلال ٣ أشهر', 'Within 3 months'], ['مرن', 'Flexible']];

/** Notification: [icon, color, titleAr, titleEn, ref, whenAr, whenEn]. Demo content. */
export const NOTIFS = [
  ['circle-check', 'teal', 'وصل عرض سعر من قمة المطابخ', 'Qimmah Kitchens sent a quotation', 'MJB-RFQ-000121', 'منذ ساعتين', '2 hrs ago'],
  ['calendar-clock', 'sky', 'برد للتكييف اقترحت موعدًا بديلًا', 'Bard Cooling proposed a new time', 'MJB-BK-000049', 'أمس', 'Yesterday'],
  ['message-circle', 'violet', 'رسالة جديدة من ساحل للديكور', 'New message from Sahil Interiors', 'MJB-RFQ-000118', 'أمس', 'Yesterday'],
  ['calendar-check', 'green', 'تأكيد زيارة القياس يوم الأحد ١٥ نوفمبر', 'Measurement visit confirmed for Sun 15 Nov', 'MJB-BK-000044', '٣ نوفمبر', '3 Nov'],
] as const;
