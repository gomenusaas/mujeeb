import type { Pair } from '../data/types';

/** Centralized UI strings: [arabic, english]. Copied from the MUJEEB App design. */
export const STR = {
  home: ['الرئيسية', 'Home'], categories: ['الفئات', 'Categories'], explore: ['استكشف', 'Explore'], profile: ['حسابي', 'Profile'],
  brand: ['مجيب', 'MUJEEB'], serviceLoc: ['موقع الخدمة', 'Service location'], searchWilayat: ['ابحث عن ولايتك', 'Search your wilayat'], noWilayat: ['لا توجد ولاية بهذا الاسم', 'No wilayat by that name'], otherLang: ['EN', 'عربي'],
  greeting: ['مرحبًا أحمد، كيف نساعدك اليوم؟', 'Hi Ahmed, how can we help today?'], search: ['ما الخدمة التي تبحث عنها؟', 'What service are you looking for?'],
  viewAll: ['عرض الكل', 'View all'], seeAll: ['عرض الكل', 'See all'],
  featuredCo: ['شركات مميزة', 'Featured companies'], featuredPr: ['مشاريع مميزة', 'Featured projects'], offers: ['العروض', 'Offers'], offerUntil: ['حتى', 'Until'], offerTag: ['عرض خاص', 'Special offer'], offerCta: ['التفاصيل', 'Details'], offerValid: ['ساري حتى', 'Valid until'], offerLeft: ['باقٍ', 'left'], offerTerms: ['الشروط', 'Terms'], offerService: ['الخدمة', 'Service'], moreOffers: ['عروض أخرى', 'More offers'], recommended: ['مقترحة لك في مسقط', 'Recommended in Muscat'], recSub: ['حسب موقعك ونطاق الخدمة', 'Based on your location and service coverage'],
  sponsored: ['إعلان ممول', 'Sponsored'], viewOffer: ['عرض', 'View'], photos: ['صورة', 'photos'], covers: ['يغطي', 'Covers'], activity: ['النشاط', 'Activity'], actNoSvc: ['لا توجد خدمات في هذا النشاط بعد.', 'No services in this activity yet.'], actNoMedia: ['لا توجد صور في هذا النشاط بعد.', 'No photos in this activity yet.'], nothingYet: ['لا توجد أعمال بعد', 'Nothing yet'], workArea: ['نطاق العمل', 'Service area'],
  allCats: ['جميع الفئات', 'All categories'], majorCats: ['فئات رئيسية', 'major categories'], allServices: ['كل الخدمات', 'All services'],
  results: ['شركة', 'companies'], list: ['قائمة', 'List'], map: ['خريطة', 'Map'], relevance: ['الأنسب', 'Relevance'], nearest: ['الأقرب', 'Nearest'], recent: ['الأحدث', 'Recent'],
  verifiedOnly: ['موثّقة فقط', 'Verified only'], viewProfile: ['عرض الملف', 'View profile'], firstFollower: ['كن أول متابع', 'Be the first to follow'], completedIn: ['أُنجز في', 'Completed'], serviceLabel: ['الخدمة:', 'Service:'], projectNo: ['مشروع رقم {n}', 'Project no. {n}'], areaM2: ['م²', 'm²'],
  waProject: ['مرحبًا، شاهدت مشروعكم «{p}» على مجيب وأرغب بمشروع مشابه: {url}', 'Hello, I saw your project “{p}” on MUJEEB and I’d like something similar: {url}'],
  showLess: ['عرض أقل', 'Show less'], noResults: ['لا توجد نتائج', 'No matches yet'], noResultsBody: ['جرّب منطقة أخرى أو أزل بعض الفلاتر.', 'Try another area or remove a filter.'], clear: ['مسح الفلاتر', 'Clear filters'],
  toTop: ['العودة للأعلى', 'Back to top'], services: ['الخدمات', 'Services'], gallery: ['المعرض', 'Gallery'], workGallery: ['معرض الأعمال', 'Work gallery'], allPhotos: ['عرض كل الصور', 'Show all photos'], viewProject: ['عرض المشروع', 'View project'], portfolio: ['الأعمال', 'Portfolio'], about: ['نبذة', 'About'],
  whatsapp: ['واتساب', 'WhatsApp'], call: ['اتصال', 'Call'], bookVisit: ['احجز زيارة', 'Book visit'],
  menu: ['القائمة', 'Menu'], coAddress: ['العنوان', 'Address'], svcAreas: ['توفر الخدمة حسب المنطقة', 'Service locations availability'], contact: ['التواصل', 'Contact'], website: ['الموقع الإلكتروني', 'Website'], social: ['حسابات التواصل الاجتماعي', 'Social media'], email: ['البريد الإلكتروني', 'Email'], openMaps: ['افتح في الخرائط', 'Open in Maps'], covIntro: ['تقدم الشركة خدماتها في المناطق التالية:', 'This company serves the following areas:'],
  branches: ['الفروع', 'Branches'], primary: ['الفرع الرئيسي', 'Main branch'], branch: ['فرع', 'Branch'], hours: ['ساعات العمل', 'Working hours'], openNow: ['مفتوح الآن', 'Open now'], closedNow: ['مغلق الآن', 'Closed now'], today: ['اليوم', 'Today'], closed: ['مغلق', 'Closed'], since: ['منذ', 'Since'],
  video: ['فيديو', 'Video'], svcPhotos: ['صور الخدمة', 'Service photos'], related: ['مشاريع منجزة', 'Completed projects'], relatedServices: ['خدمات ذات صلة', 'Related services'],
  gov: ['المحافظة', 'Governorate'], city: ['المدينة أو الولاية', 'City or district'], cityPh: ['مثال: بوشر', 'e.g. Bawshar'],
  name: ['الاسم', 'Name'], phone: ['الهاتف', 'Phone'],
  continue: ['متابعة', 'Continue'],
  backHome: ['العودة للرئيسية', 'Back to home'],
  bkTitle: ['حجز زيارة موقع', 'Book a site visit'], bkS1: ['سبب الزيارة', 'Visit purpose'], bkS2: ['الموقع والموعد', 'Location & time'], bkS3: ['المراجعة', 'Review'],
  siteLoc: ['موقع الزيارة', 'Site location'], time: ['الوقت', 'Time'], notes: ['ملاحظات للشركة (اختياري)', 'Notes for the company (optional)'], notesPh: ['رقم الفيلا، المواقف، أفضل مدخل…', 'Villa number, parking, best entrance…'],
  bkSubmit: ['إرسال طلب الحجز', 'Send booking request'], muscatTime: ['بتوقيت مسقط', 'Muscat time'],
  bkNote: ['تؤكد الشركة الموعد يدويًا، عادةً خلال ساعات. الإلغاء مجاني قبل ٢٤ ساعة.', 'The company confirms manually, usually within a few hours. Free cancellation up to 24 hours before.'],
  bkDone: ['تم إرسال طلب الحجز', 'Booking request sent'], waitConfirm: ['بانتظار تأكيد', 'Waiting for confirmation from'], viewBookings: ['عرض حجوزاتي', 'View my bookings'],
  myBookings: ['حجوزاتي', 'My bookings'], favorites: ['المفضلة', 'Favorites'], country: ['الدولة', 'Country'], comingSoon: ['قريبًا', 'Coming soon'], notifications: ['الإشعارات', 'Notifications'], language: ['اللغة', 'Language'], settings: ['الإعدادات', 'Settings'], help: ['المساعدة', 'Help'], signOut: ['تسجيل الخروج', 'Sign out'], langName: ['العربية', 'English'],
  companiesN: [' شركات', ' companies'], newN: [' جديدة', ' new'], active: ['نشطة', 'active'],
  acceptTime: ['قبول الموعد', 'Accept time'], cancel: ['إلغاء', 'Cancel'], proposed: ['موعد مقترح', 'Proposed'],
  noFav: ['لا توجد مفضلة بعد', 'Nothing saved yet'], noFavBody: ['اضغط على القلب في أي شركة لحفظها هنا.', 'Tap the heart on any company to save it here.'],
  exploreTitle: ['استكشف الأعمال', 'Explore work'], all: ['الكل', 'All'], allActivities: ['كل الأنشطة', 'All activities'],
  opening: ['جارٍ فتح واتساب…', 'Opening WhatsApp…'], calling: ['جارٍ الاتصال بـ', 'Calling'], savedT: ['أضيفت إلى المفضلة', 'Saved to favorites'], unsavedT: ['أزيلت من المفضلة', 'Removed from favorites'], rescheduled: ['تم تأكيد الموعد الجديد', 'New time confirmed'], cancelledT: ['تم إلغاء الحجز', 'Booking cancelled'],
  memberSince: ['عضو منذ ٢٠٢٥', 'Member since 2025'], userName: ['أحمد البلوشي', 'Ahmed Al Balushi'],
  loading: ['جارٍ التحميل…', 'Loading…'], loadError: ['تعذر تحميل البيانات', 'Could not load data'],
  stories: ['قصص الشركات', 'Company stories'], latestProjects: ['آخر المشاريع', 'Last projects'],
  // Accounts
  signIn: ['تسجيل الدخول', 'Sign in'], createAccount: ['إنشاء حساب', 'Create account'], signInCta: ['سجّل الدخول أو أنشئ حسابًا', 'Sign in or create an account'],
  signInWhy: ['سجّل الدخول لمتابعة الشركات من أي جهاز.', 'Sign in to follow companies on any device.'],
  signUpWhy: ['أنشئ حسابك لمتابعة الشركات.', 'Create your account to follow companies.'],
  password: ['كلمة المرور', 'Password'], yourName: ['الاسم', 'Name'], pwHint: ['٨ أحرف على الأقل', 'At least 8 characters'],
  forgotPw: ['نسيت كلمة المرور؟', 'Forgot password?'], noAccount: ['ليس لديك حساب؟', 'No account yet?'], haveAccount: ['لديك حساب؟', 'Already have an account?'], orWord: ['أو', 'or'],
  resetTitle: ['استعادة كلمة المرور', 'Reset password'], resetBody: ['أدخل بريدك وسنرسل لك رابطًا لتعيين كلمة مرور جديدة.', 'Enter your email and we’ll send you a link to set a new password.'],
  sendLink: ['إرسال الرابط', 'Send link'], resetSent: ['أرسلنا رابطًا إلى بريدك. افتحه على هذا الجهاز.', 'We sent a link to your email. Open it on this device.'],
  newPwTitle: ['كلمة مرور جديدة', 'New password'], savePw: ['حفظ كلمة المرور', 'Save password'], pwSaved: ['تم تغيير كلمة المرور', 'Password changed'],
  checkEmail: ['تحقق من بريدك', 'Check your email'], checkEmailBody: ['أرسلنا رابط تأكيد إلى بريدك. افتحه ثم سجّل الدخول هنا.', 'We sent a confirmation link to your email. Open it, then sign in here.'],
  backToSignIn: ['العودة لتسجيل الدخول', 'Back to sign in'], signedInT: ['تم تسجيل الدخول', 'Signed in'], signedOutT: ['تم تسجيل الخروج', 'Signed out'],
  guest: ['أهلًا بك', 'Welcome'], guestSub: ['تصفّح بحرية. سجّل الدخول لمتابعة الشركات.', 'Browse freely. Sign in to follow companies.'],
  termsNote: ['بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.', 'By continuing you agree to the Terms and Privacy Policy.'],
  deleteAccount: ['حذف الحساب', 'Delete account'], deleteTitle: ['حذف حسابك؟', 'Delete your account?'],
  deleteBody: ['سيُحذف حسابك ومفضلتك ومتابعاتك نهائيًا، ولا يمكن التراجع.', 'Your account, favorites and follows will be deleted for good. This can’t be undone.'],
  deleteConfirm: ['حذف نهائيًا', 'Delete for good'], deletedT: ['تم حذف الحساب', 'Account deleted'],
  errBadLogin: ['البريد أو كلمة المرور غير صحيحة.', 'Wrong email or password.'], errEmailTaken: ['هذا البريد لديه حساب. سجّل الدخول بدلًا من ذلك.', 'This email already has an account. Sign in instead.'],
  errNotConfirmed: ['أكّد بريدك أولًا من الرابط الذي أرسلناه.', 'Confirm your email first using the link we sent.'], errWeakPassword: ['كلمة المرور ضعيفة. استخدم ٨ أحرف على الأقل.', 'That password is too weak. Use at least 8 characters.'],
  errBadEmail: ['البريد الإلكتروني غير صحيح.', 'That email address isn’t valid.'], errTooMany: ['محاولات كثيرة. حاول بعد قليل.', 'Too many attempts. Try again in a little while.'],
  errEmailNotAllowed: ['لا يمكن إرسال بريد إلى هذا العنوان حاليًا.', 'We can’t send email to this address yet.'], errFailed: ['تعذّر الإكمال. حاول مرة أخرى.', 'Something went wrong. Try again.'],
  errFields: ['أكمل الحقول المطلوبة.', 'Fill in the required fields.'],
  viewAs: ['طريقة العرض', 'View as'], sortBy: ['ترتيب حسب', 'Sort by'], follow: ['متابعة', 'Follow'], readMore: ['اقرأ المزيد', 'Read more'], share: ['مشاركة', 'Share'], linkCopied: ['تم نسخ الرابط', 'Link copied'],
  directions: ['الاتجاهات', 'Directions'], chooseBranch: ['اختر الفرع', 'Choose a branch'], openingMaps: ['جارٍ فتح الخرائط…', 'Opening Maps…'], following: ['تمت المتابعة', 'Following'],
  followedT: ['تمت متابعة الشركة', 'You’re following this company'], unfollowedT: ['أُلغيت المتابعة', 'Unfollowed'], verifiedSort: ['موثّقة', 'Verified'], viewLarge: ['بطاقات كبيرة', 'Large cards'], viewGrid: ['شبكة', 'Grid'], viewRows: ['قائمة مختصرة', 'Compact list'], close: ['إغلاق', 'Close'], hoursAgo: ['منذ {n} س', '{n}h'],
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

export const BK_ST = { pending: ['بانتظار التأكيد', 'Pending', 'warning'], confirmed: ['مؤكد', 'Confirmed', 'success'], reschedule: ['موعد بديل مقترح', 'Reschedule proposed', 'info'], cancelled: ['ملغي', 'Cancelled', 'neutral'], rejected: ['مرفوض', 'Rejected', 'danger'], completed: ['مكتمل', 'Completed', 'neutral'], noshow: ['لم يحضر', 'No show', 'neutral'] } as const;

/** Visit purpose: [id, ar, en, descAr, descEn, icon]. */
export const PURPOSES = [
  ['inspect', 'معاينة الموقع', 'Site inspection', 'تقييم الحالة قبل التسعير', 'Assess the site before pricing', 'scan-search'],
  ['measure', 'أخذ المقاسات', 'Measurement', 'قياس دقيق للتصميم أو التصنيع', 'Exact measurements for design or manufacturing', 'ruler'],
  ['consult', 'استشارة', 'Consultation', 'نقاش الفكرة والخيارات في الموقع', 'Discuss ideas and options on site', 'messages-square'],
  ['maint', 'تقييم صيانة', 'Maintenance assessment', 'تحديد المشكلة وما تحتاجه من إصلاح', 'Find the problem and what it needs', 'wrench'],
] as const;

/** Notification: [icon, color, titleAr, titleEn, ref, whenAr, whenEn]. Demo content. */
export const NOTIFS = [
  ['calendar-clock', 'sky', 'برد للتكييف اقترحت موعدًا بديلًا', 'Bard Cooling proposed a new time', 'MJB-BK-000049', 'أمس', 'Yesterday'],
  ['calendar-check', 'green', 'تأكيد زيارة القياس يوم الأحد ١٥ نوفمبر', 'Measurement visit confirmed for Sun 15 Nov', 'MJB-BK-000044', '٣ نوفمبر', '3 Nov'],
] as const;
