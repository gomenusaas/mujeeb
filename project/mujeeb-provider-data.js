(function () {
  const P = {};
  P.STR = {
    brand: ['مجيب', 'MUJEEB'], providerBadge: ['لوحة الشركة', 'Provider'], coName: ['قمة المطابخ', 'Qimmah Kitchens'], planLine: ['بلاتيني · تجربة ١٨ يومًا متبقية', 'Platinum trial · 18 days left'],
    gMain: ['الرئيسية', 'Overview'], gCompany: ['الشركة', 'Company'], gMedia: ['إدارة الوسائط', 'Media management'], gCustomers: ['العملاء', 'Customers'], gGrowth: ['النمو', 'Growth'], gAccount: ['الحساب', 'Account'],
    dashboard: ['لوحة التحكم', 'Dashboard'], analytics: ['التحليلات', 'Analytics'], profile: ['ملف الشركة', 'Company profile'], services: ['الخدمات', 'Services'], branches: ['الفروع ونطاق الخدمة', 'Branches & coverage'],
    library: ['مكتبة الوسائط', 'Media library'], albums: ['ألبومات خاصة', 'Private albums'], storage: ['المساحة', 'Storage usage'], portfolio: ['ملف الأعمال', 'Portfolio'],
    quotations: ['عروض الأسعار', 'Quotations'], bookings: ['الحجوزات', 'Bookings'], messages: ['الرسائل', 'Messages'], advertising: ['الإعلانات', 'Advertising'], membership: ['العضوية', 'Membership'],
    support: ['مركز الدعم', 'Support center'], notifications: ['الإشعارات', 'Notifications'], settings: ['الإعدادات', 'Settings'],
    hello: ['صباح الخير، خالد', 'Good morning, Khalid'], last14: ['آخر ١٤ يومًا', 'Last 14 days'], profileViews: ['زيارات الملف', 'Profile views'], serviceViews: ['مشاهدات الخدمات', 'Service views'], portfolioViews: ['مشاهدات الأعمال', 'Portfolio views'],
    waClicks: ['نقرات واتساب', 'WhatsApp clicks'], callClicks: ['نقرات الاتصال', 'Call clicks'], custMsgs: ['رسائل العملاء', 'Customer messages'], rfqs: ['طلبات عروض الأسعار', 'Quotation requests'], visitBookings: ['حجوزات الزيارات', 'Site visit bookings'],
    vsPrev: ['مقارنة بالفترة السابقة', 'vs previous period'], viewsChart: ['المشاهدات اليومية', 'Daily views'], clickNote: ['النقرات تفاعلات وليست صفقات مؤكدة.', 'Clicks are interactions, not confirmed business.'],
    newRequests: ['طلبات جديدة', 'New requests'], upcoming: ['الزيارات القادمة', 'Upcoming visits'], seeAll: ['عرض الكل', 'See all'],
    pubServices: ['خدمات منشورة', 'Published services'], pubAlbums: ['ألبومات منشورة', 'Published albums'], activeAds: ['إعلانات نشطة', 'Active ads'], openTickets: ['تذاكر مفتوحة', 'Open tickets'],
    trialTitle: ['تجربة بلاتيني المجانية', 'Platinum free trial'], trialBody: ['تنتهي في ٢٥ نوفمبر ٢٠٢٦. اختر خطة للاحتفاظ بمزاياك.', 'Ends 25 Nov 2026. Choose a plan to keep your features.'], choosePlan: ['اختيار خطة', 'Choose a plan'],
    upload: ['رفع ملفات', 'Upload files'], search: ['بحث', 'Search'], all: ['الكل', 'All'], images: ['صور', 'Images'], videos: ['فيديو', 'Videos'], unused: ['غير مستخدمة', 'Unused'],
    newest: ['الأحدث', 'Newest'], largest: ['الأكبر', 'Largest'], mostUsed: ['الأكثر استخدامًا', 'Most used'], selected: ['محدد', 'selected'], addToAlbum: ['إضافة إلى ألبوم', 'Add to album'], del: ['حذف', 'Delete'], clearSel: ['إلغاء التحديد', 'Clear'], select: ['تحديد', 'Select'],
    usedIn: ['مستخدم في', 'Used in'], places: ['مواضع', 'places'], notUsed: ['غير مستخدم', 'Not used'], uploading: ['جارٍ الرفع', 'Uploading'], uploaded: ['تم الرفع', 'Uploaded'], failed: ['مرفوض', 'Rejected'],
    rules: ['JPG أو PNG أو MP4 · حتى ٢٠ ميجابايت للصورة و١٥٠ ميجابايت للفيديو · ١٢٠٠×٩٠٠ كحد أدنى · الفيديو حتى ٣ دقائق', 'JPG, PNG or MP4 · up to 20 MB per image, 150 MB per video · min 1200×900 · videos up to 3 min'],
    onlyHere: ['الرفع متاح هنا فقط. باقي الأقسام تختار من المكتبة.', 'Uploads happen here only. Other sections pick from this library.'],
    details: ['تفاصيل الملف', 'File details'], fileName: ['اسم الملف', 'File name'], description: ['الوصف', 'Description'], usage: ['الاستخدام', 'Usage'], close: ['إغلاق', 'Close'], save: ['حفظ', 'Save'], cancel: ['إلغاء', 'Cancel'],
    cantDelete: ['لا يمكن حذف هذا الملف', 'This file can’t be deleted'], cantDeleteBody: ['الملف مستخدم في المواضع التالية. أزله منها أولًا، ثم احذفه.', 'It is used in the places below. Remove it from them first, then delete.'],
    confirmDelete: ['حذف الملفات المحددة؟', 'Delete selected files?'], confirmDeleteBody: ['سيتم حذف الملفات الأصلية نهائيًا من المكتبة.', 'The original files will be permanently removed from the library.'],
    storageUsed: ['المساحة المستخدمة', 'Storage used'], of: ['من', 'of'], remaining: ['متبقٍ', 'remaining'], countedOnce: ['يُحتسب كل ملف أصلي مرة واحدة مهما تكرر استخدامه.', 'Each original file counts once, however many times it is reused.'],
    newAlbum: ['ألبوم جديد', 'New album'], privateNote: ['الألبومات الخاصة لتنظيم ملفاتك فقط ولا تظهر للعملاء.', 'Private albums organise your files and are never shown to customers.'], files: ['ملفات', 'files'],
    pickerTitle: ['اختيار من مكتبة الوسائط', 'Select from Media Library'], confirmSel: ['تأكيد الاختيار', 'Confirm selection'], pickerEmpty: ['لا توجد ملفات مطابقة. ارفع ملفاتك من إدارة الوسائط.', 'No matching files. Upload files in Media management.'], goMedia: ['فتح إدارة الوسائط', 'Open Media management'],
    cropTitle: ['قص وتغيير الحجم', 'Crop & resize'], locked: ['النسبة مقفلة', 'Ratio locked'], zoom: ['التكبير', 'Zoom'], rotate: ['تدوير', 'Rotate'], reset: ['إعادة ضبط', 'Reset'], dragHint: ['اسحب الصورة لتغيير موضعها', 'Drag the image to reposition'],
    preview: ['معاينة', 'Preview'], otherPlacements: ['مواضع أخرى لنفس الملف', 'Other placements of this file'], independent: ['لكل موضع قصّ مستقل. الملف الأصلي لا يتغير.', 'Each placement keeps its own crop. The original file is never changed.'], applyCrop: ['تطبيق', 'Apply'],
    pl_cover: ['غلاف الشركة', 'Company cover'], pl_logo: ['شعار الشركة', 'Company logo'], pl_service: ['غلاف الخدمة', 'Service cover'], pl_gallery: ['معرض الخدمة', 'Service gallery'], pl_album: ['غلاف الألبوم', 'Album cover'], pl_thumb: ['مصغر ملف الأعمال', 'Portfolio thumbnail'], pl_ad: ['بانر إعلاني', 'Ad banner'],
    newService: ['خدمة جديدة', 'New service'], service: ['الخدمة', 'Service'], category: ['الفئة', 'Category'], media: ['الوسائط', 'Media'], status: ['الحالة', 'Status'], published: ['منشورة', 'Published'], draft: ['مسودة', 'Draft'], edit: ['تعديل', 'Edit'],
    editService: ['تعديل الخدمة', 'Edit service'], titleAr: ['العنوان بالعربية', 'Title (Arabic)'], titleEn: ['العنوان بالإنجليزية', 'Title (English)'], descAr: ['الوصف بالعربية', 'Description (Arabic)'], descEn: ['الوصف بالإنجليزية', 'Description (English)'],
    coverImage: ['صورة الغلاف', 'Cover image'], chooseLib: ['اختيار من المكتبة', 'Choose from library'], adjustCrop: ['ضبط القص', 'Adjust crop'], gallery: ['معرض الصور والفيديو', 'Photos & videos'], addFromLib: ['إضافة من المكتبة', 'Add from library'],
    catNote: ['تُختار الفئة من فئاتك المعتمدة. لا تُنشأ فئات جديدة من الخدمات.', 'Pick from your approved categories. Services never create new platform categories.'], previewPage: ['معاينة الصفحة', 'Preview page'], back: ['رجوع', 'Back'],
    newReq: ['جديدة', 'New'], allReq: ['كل الطلبات', 'All requests'], sentQ: ['عروض مرسلة', 'Sent quotations'], archived: ['مؤرشفة', 'Archived'], customer: ['العميل', 'Customer'], location: ['الموقع', 'Location'], budget: ['الميزانية', 'Budget'], startPref: ['موعد البدء', 'Preferred start'], attachments: ['المرفقات', 'Attachments'],
    requestInfo: ['طلب معلومات', 'Request info'], decline: ['اعتذار', 'Decline'], createQuote: ['إنشاء عرض سعر', 'Create quotation'], uploadPdf: ['رفع عرض PDF', 'Upload PDF instead'], reply: ['رد برسالة', 'Reply'],
    builder: ['منشئ عرض السعر', 'Quotation builder'], item: ['البند', 'Item'], qty: ['الكمية', 'Qty'], unitPrice: ['سعر الوحدة', 'Unit price'], amount: ['المبلغ', 'Amount'], addLine: ['إضافة بند', 'Add line'], discount: ['الخصم', 'Discount'], vat: ['ضريبة القيمة المضافة ٥٪', 'VAT 5%'], subtotal: ['المجموع الفرعي', 'Subtotal'], total: ['الإجمالي', 'Total'],
    validity: ['مدة الصلاحية', 'Valid for'], days: ['يومًا', 'days'], terms: ['الشروط', 'Terms'], termsDefault: ['دفعة مقدمة ٤٠٪ عند الاعتماد، والباقي عند التسليم. الضمان سنتان على الخزائن.', '40% deposit on approval, balance on handover. Two-year warranty on cabinets.'], notes: ['ملاحظات', 'Notes'],
    saveDraft: ['حفظ كمسودة', 'Save draft'], sendQuote: ['إرسال العرض', 'Send quotation'], omr: ['ر.ع.', 'OMR'], qNote: ['قبول العميل للعرض لا يُنشئ دفعة أو عقدًا ملزمًا.', 'Customer acceptance does not create a payment or a binding contract.'],
    acceptBookings: ['استقبال الحجوزات', 'Accept bookings'], globalOn: ['إعداد المنصة: الحجوزات مفعّلة. إعداد المنصة يتقدم دائمًا على إعداد شركتك.', 'Platform setting: bookings ON. The platform setting always overrides yours.'], calendar: ['التقويم', 'Calendar'], requests: ['الطلبات', 'Requests'], availability: ['أوقات التوفر', 'Availability'],
    weekOf: ['١٥ – ٢١ نوفمبر ٢٠٢٦', '15 – 21 Nov 2026'], accept: ['قبول', 'Accept'], reject: ['رفض', 'Reject'], propose: ['اقتراح موعد آخر', 'Propose time'], confirmMode: ['طريقة التأكيد', 'Confirmation'], manual: ['يدوي', 'Manual'], instant: ['فوري', 'Instant'],
    duration: ['مدة الزيارة', 'Visit length'], buffer: ['فاصل بين الزيارات', 'Buffer between visits'], notice: ['أقل مدة للحجز المسبق', 'Minimum notice'], capacity: ['زيارات متزامنة', 'Simultaneous visits'], min: ['د', 'min'], hrs: ['ساعة', 'hrs'], closed: ['مغلق', 'Closed'], muscatTime: ['بتوقيت مسقط', 'Muscat time'],
    typeMsg: ['اكتب ردًا…', 'Write a reply…'], assign: ['تعيين لموظف', 'Assign'], archive: ['أرشفة', 'Archive'],
    publicAlbums: ['ألبومات الأعمال العامة', 'Public portfolio albums'], publicNote: ['تظهر للعملاء على ملف شركتك. حذف الألبوم لا يحذف ملفاته.', 'Shown to customers on your profile. Deleting an album never deletes its files.'], publish: ['نشر', 'Publish'],
    currentPlan: ['خطتك الحالية', 'Your current plan'], upgrade: ['اختيار الخطة', 'Choose plan'], current: ['الحالية', 'Current'], priceAdmin: ['الأسعار الشهرية والسنوية بالريال العُماني تحددها إدارة مجيب.', 'Monthly and annual OMR prices are set by MUJEEB admin.'], unlimited: ['غير محدود', 'Unlimited'], yes: ['نعم', 'Yes'], no: ['لا', 'No'],
    createAd: ['إنشاء إعلان', 'Create advertisement'], campaigns: ['حملاتي', 'My campaigns'], impressions: ['مرات الظهور', 'Impressions'], clicks: ['النقرات', 'Clicks'], ctr: ['نسبة النقر', 'CTR'], placement: ['الموضع', 'Placement'], sponsoredLbl: ['كل الإعلانات تظهر بعلامة «إعلان ممول».', 'All ads are labelled “Sponsored”.'],
    myTickets: ['تذاكري', 'My tickets'], createTicket: ['تذكرة جديدة', 'Create ticket'], subject: ['الموضوع', 'Subject'], priority: ['الأولوية', 'Priority'], low: ['منخفضة', 'Low'], medium: ['متوسطة', 'Medium'], high: ['عالية', 'High'], submit: ['إرسال', 'Submit'], faq: ['الأسئلة الشائعة', 'FAQ'],
    nameAr: ['الاسم بالعربية', 'Name (Arabic)'], nameEn: ['الاسم بالإنجليزية', 'Name (English)'], phone: ['الهاتف', 'Phone'], whatsapp: ['واتساب', 'WhatsApp'], email: ['البريد الإلكتروني', 'Email'], website: ['الموقع الإلكتروني', 'Website'], logo: ['الشعار', 'Logo'], cover: ['الغلاف', 'Cover'], hours: ['ساعات العمل', 'Business hours'], categories: ['الفئات الرئيسية', 'Major categories'], catLimit: ['٢ من غير محدود في بلاتيني', '2 of unlimited on Platinum'], previewProfile: ['معاينة الملف العام', 'Preview public profile'],
    addBranch: ['إضافة فرع', 'Add branch'], primary: ['رئيسي', 'Primary'], active: ['نشط', 'Active'], coverage: ['نطاق الخدمة', 'Service coverage'], allOman: ['كل عُمان', 'All Oman'], covNote: ['نطاق الخدمة منفصل عن مواقع الفروع. تظهر شركتك في بحث أي منطقة تغطيها.', 'Coverage is separate from branch locations. You appear in searches for any area you cover.'],
    rfqToggle: ['استقبال طلبات عروض الأسعار', 'Accept quotation requests'], rfqToggleSub: ['إعداد المنصة: مفعّل', 'Platform setting: ON'], bkToggleSub: ['إدارة من صفحة الحجوزات', 'Managed in Bookings'], notifPrefs: ['تفضيلات الإشعارات', 'Notification preferences'], npMsg: ['رسائل جديدة', 'New messages'], npRfq: ['طلبات عروض أسعار', 'Quotation requests'], npBk: ['حجوزات', 'Bookings'], npBill: ['الفوترة والعضوية', 'Billing & membership'],
    topServices: ['الخدمات الأكثر مشاهدة', 'Most viewed services'], contactMix: ['تفاعلات التواصل', 'Contact interactions'], views: ['مشاهدة', 'views'],
    saved: ['تم الحفظ', 'Saved'], cropSaved: ['تم حفظ القص لهذا الموضع', 'Crop saved for this placement'], sentT: ['تم إرسال عرض السعر', 'Quotation sent'], draftT: ['تم حفظ المسودة', 'Draft saved'], infoT: ['تم إرسال طلب المعلومات للعميل', 'Info request sent to customer'], declinedT: ['تم الاعتذار عن الطلب', 'Request declined'],
    bkAccT: ['تم تأكيد الزيارة', 'Visit confirmed'], bkRejT: ['تم رفض الحجز', 'Booking rejected'], bkPropT: ['تم اقتراح موعد بديل', 'New time proposed'], deletedT: ['تم حذف الملفات', 'Files deleted'], addedAlbumT: ['أضيفت إلى الألبوم', 'Added to album'], ticketT: ['تم إنشاء التذكرة', 'Ticket created'], adT: ['أُرسل الإعلان للمراجعة', 'Ad submitted for approval'], albumT: ['تم إنشاء الألبوم كمسودة', 'Album created as draft'], pdfT: ['تم رفع ملف PDF', 'PDF uploaded'], previewT: ['يفتح الملف العام في تطبيق العملاء', 'Opens the public profile in the customer app'],
  };
  P.MEDIA = [
    ['m1', '1484154218962-a197022b5858', 'kitchen-qurum-01.jpg', 'img', 4.2, '4000×2667', '12 Oct 2026', 4000, 2667],
    ['m2', '1588854337236-6889d631faa8', 'marble-island.jpg', 'img', 5.1, '4500×3000', '12 Oct 2026', 4500, 3000],
    ['m3', '1556912172-45b7abe8b7e1', 'white-kitchen-azaiba.jpg', 'img', 3.6, '3600×2400', '18 Oct 2026', 3600, 2400],
    ['m4', '1565183928294-7063f23ce0f8', 'kitchen-seeb.jpg', 'img', 3.9, '4200×2800', '18 Oct 2026', 4200, 2800],
    ['m5', '1622372738946-62e02505feb3', 'dark-cabinets.jpg', 'img', 4.4, '4000×2667', '22 Oct 2026', 4000, 2667],
    ['m6', '1600585152220-90363fe7e115', 'island-pendants.jpg', 'img', 6.0, '5000×3333', '22 Oct 2026', 5000, 3333],
    ['v1', '1484154218962-a197022b5858', 'install-timelapse.mp4', 'vid', 38.2, '1920×1080', '25 Oct 2026', 1920, 1080, '0:48'],
    ['m7', '1504148455328-c376907d081c', 'workshop-drill.jpg', 'img', 2.8, '3000×2000', '28 Oct 2026', 3000, 2000],
    ['m8', '1513467535987-fd81bc7d62f8', 'workshop-saw.jpg', 'img', 3.1, '3200×2133', '28 Oct 2026', 3200, 2133],
    ['m9', '1524758631624-e2822e304c36', 'wardrobe-lounge.jpg', 'img', 4.7, '4400×2933', '1 Nov 2026', 4400, 2933],
    ['v2', '1588854337236-6889d631faa8', 'showroom-tour.mp4', 'vid', 74.5, '1920×1080', '2 Nov 2026', 1920, 1080, '1:24'],
    ['m10', '1590725140246-20acdee442be', 'attic-kitchen.jpg', 'img', 3.3, '3400×2267', '4 Nov 2026', 3400, 2267],
    ['m11', '1611048267451-e6ed903d4a38', 'living-handover.jpg', 'img', 4.0, '4000×2667', '5 Nov 2026', 4000, 2667],
    ['m12', '1600121848594-d8644e57abab', 'living-grey.jpg', 'img', 3.8, '3800×2533', '6 Nov 2026', 3800, 2533],
  ].map(m => ({ id: m[0], img: m[1], name: m[2], kind: m[3], mb: m[4], dims: m[5], date: m[6], w: m[7], h: m[8], dur: m[9] || '' }));
  P.PRIV = [['p1', 'تركيبات المطابخ', 'Kitchen installations', ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'v1']], ['p2', 'الورشة', 'Workshop', ['m7', 'm8']], ['p3', 'صور التسليم', 'Handover photos', ['m11', 'm12', 'm9']], ['p4', 'هوية الشركة', 'Company branding', ['v2']]];
  P.SERVICES = [
    { id: 's7', ar: 'تصميم وتركيب المطابخ', en: 'Kitchen design & installation', cat: 6, cover: 'm1', gallery: ['m1', 'm2', 'm6', 'v1'], pub: true, views: 1840, dar: 'زيارة قياس، تصميم ثلاثي الأبعاد، تصنيع محلي، وتركيب خلال ٣–٥ أسابيع.', den: 'Measurement visit, 3D design, local manufacturing and installation in 3–5 weeks.' },
    { id: 's8', ar: 'خزائن حائط', en: 'Built-in wardrobes', cat: 5, cover: 'm9', gallery: ['m9', 'm7'], pub: true, views: 920, dar: 'خزائن حائط حسب المقاس بأبواب منزلقة أو مفصلية.', den: 'Made-to-measure wardrobes with sliding or hinged doors.' },
    { id: 's19', ar: 'تجديد خزائن المطبخ', en: 'Kitchen cabinet refacing', cat: 6, cover: 'm5', gallery: ['m5', 'm4'], pub: false, views: 0, dar: 'تغيير واجهات الخزائن والمقابض دون استبدال الهيكل.', den: 'New cabinet doors and handles without replacing the carcass.' },
  ];
  P.ALBUMS = [
    { id: 'a2', ar: 'مطبخ رخامي مفتوح', en: 'Open marble kitchen', cover: 'm2', media: ['m2', 'm1', 'm3', 'v1'], pub: true, place: ['القرم', 'Qurum'], views: 1260 },
    { id: 'a8', ar: 'مطبخ بخزائن داكنة', en: 'Dark cabinet kitchen', cover: 'm5', media: ['m5', 'm6'], pub: true, place: ['العذيبة', 'Al Azaiba'], views: 640 },
    { id: 'a11', ar: 'مطبخ علوي خشبي', en: 'Timber attic kitchen', cover: 'm10', media: ['m10'], pub: false, place: ['نزوى', 'Nizwa'], views: 0 },
  ];
  P.RFQS = [
    { id: 'MJB-RFQ-000128', cust: ['سالم الحارثي', 'Salim Al Harthy'], svc: 's8', t: ['خزائن حائط لثلاث غرف نوم', 'Wardrobes for three bedrooms'], d: ['أحتاج خزائن حائط بأبواب منزلقة لثلاث غرف، العرض بين ٢٫٤ و٣ أمتار. أفضّل اللون الأبيض المطفي.', 'Sliding-door wardrobes for three rooms, 2.4 to 3 m wide each. Matte white preferred.'], loc: ['السيب، مسقط', 'Seeb, Muscat'], budget: ['٥٠٠ – ٢٬٠٠٠ ر.ع.', 'OMR 500 – 2,000'], start: ['خلال شهر', 'Within a month'], files: ['room-1.jpg', 'room-2.jpg', 'plan.pdf'], st: 'new', date: '7 Nov 2026' },
    { id: 'MJB-RFQ-000126', cust: ['مريم البلوشية', 'Maryam Al Balushi'], svc: 's7', t: ['تجديد مطبخ في بوشر', 'Kitchen renovation in Bawshar'], d: ['مطبخ بمساحة ١٤ م² على شكل حرف L، أريد جزيرة صغيرة وسطح كوارتز.', 'L-shaped 14 m² kitchen. I would like a small island and quartz countertop.'], loc: ['بوشر، مسقط', 'Bawshar, Muscat'], budget: ['٢٬٠٠٠ – ١٠٬٠٠٠ ر.ع.', 'OMR 2,000 – 10,000'], start: ['خلال ٣ أشهر', 'Within 3 months'], files: ['kitchen-now.jpg'], st: 'new', date: '6 Nov 2026' },
    { id: 'MJB-RFQ-000121', cust: ['أحمد البلوشي', 'Ahmed Al Balushi'], svc: 's7', t: ['تجديد مطبخ في القرم', 'Kitchen renovation in Qurum'], d: ['تجديد كامل للمطبخ مع خزائن جديدة وسطح كوارتز ومغسلة.', 'Full kitchen renovation with new cabinets, quartz top and sink.'], loc: ['القرم، مسقط', 'Qurum, Muscat'], budget: ['٢٬٠٠٠ – ١٠٬٠٠٠ ر.ع.', 'OMR 2,000 – 10,000'], start: ['في أقرب وقت', 'As soon as possible'], files: ['photo-1.jpg', 'photo-2.jpg'], st: 'sent', date: '2 Nov 2026', total: 2585.4 },
    { id: 'MJB-RFQ-000117', cust: ['يوسف الكندي', 'Yousuf Al Kindi'], svc: 's19', t: ['تغيير واجهات الخزائن', 'Replace cabinet doors'], d: ['تغيير ١٢ بابًا ومقابض جديدة.', 'Replace 12 doors and fit new handles.'], loc: ['صحار', 'Sohar'], budget: ['أقل من ٥٠٠ ر.ع.', 'Under OMR 500'], start: ['مرن', 'Flexible'], files: [], st: 'archived', date: '20 Oct 2026' },
  ];
  P.BOOKINGS = [
    { id: 'MJB-BK-000044', cust: ['أحمد البلوشي', 'Ahmed Al Balushi'], p: ['أخذ المقاسات', 'Measurement'], day: 0, h: 10, st: 'confirmed', loc: ['القرم', 'Qurum'] },
    { id: 'MJB-BK-000051', cust: ['مريم البلوشية', 'Maryam Al Balushi'], p: ['معاينة الموقع', 'Site inspection'], day: 1, h: 9, st: 'pending', loc: ['بوشر', 'Bawshar'] },
    { id: 'MJB-BK-000053', cust: ['سالم الحارثي', 'Salim Al Harthy'], p: ['استشارة', 'Consultation'], day: 2, h: 16, st: 'confirmed', loc: ['السيب', 'Seeb'] },
    { id: 'MJB-BK-000055', cust: ['عائشة الهنائية', 'Aisha Al Hinai'], p: ['أخذ المقاسات', 'Measurement'], day: 3, h: 11, st: 'pending', loc: ['الخوير', 'Al Khuwair'] },
    { id: 'MJB-BK-000048', cust: ['خليفة المعمري', 'Khalifa Al Maamari'], p: ['معاينة الموقع', 'Site inspection'], day: 4, h: 10, st: 'confirmed', loc: ['العامرات', 'Al Amerat'] },
  ];
  P.CONVOS = [
    { id: 'k1', cust: ['أحمد البلوشي', 'Ahmed Al Balushi'], ref: 'MJB-RFQ-000121', unread: 0, msgs: [[0, 'مرحبًا أحمد، أرسلنا لك عرض السعر للمطبخ.', 'Hi Ahmed, we have sent the quotation for your kitchen.', '10:12'], [1, 'شكرًا، هل المفصلات الهادئة مشمولة؟', 'Thanks. Are soft-close hinges included?', '10:20'], [0, 'نعم، مشمولة في سعر الخزائن.', 'Yes, they are included in the cabinet price.', '10:24']] },
    { id: 'k2', cust: ['مريم البلوشية', 'Maryam Al Balushi'], ref: 'MJB-RFQ-000126', unread: 2, msgs: [[1, 'مرحبًا، هل يمكن زيارة الموقع يوم الإثنين؟', 'Hi, could you visit the site on Monday?', '08:41'], [1, 'أرفقت صورة المطبخ الحالي.', 'I attached a photo of the current kitchen.', '08:42']] },
    { id: 'k3', cust: ['سالم الحارثي', 'Salim Al Harthy'], ref: 'MJB-RFQ-000128', unread: 1, msgs: [[1, 'هل لديكم عينات من الأبيض المطفي في المعرض؟', 'Do you have matte white samples at the showroom?', 'أمس']] },
  ];
  P.TICKETS = [
    { id: 'MJB-000214', s: ['رفع الفيديو يتوقف عند ٩٠٪', 'Video upload stops at 90%'], c: ['الخدمات والوسائط', 'Services & Media'], pr: 'high', st: 'progress', date: '5 Nov 2026' },
    { id: 'MJB-000198', s: ['تعديل الاسم التجاري بالإنجليزية', 'Update English trade name'], c: ['الحساب والملف', 'Account & Profile'], pr: 'low', st: 'resolved', date: '21 Oct 2026' },
  ];
  P.ADS = [
    { id: 'AD-0031', t: ['مطابخ بلمسة عُمانية معاصرة', 'Kitchens with a modern Omani touch'], pl: ['دوّار الصفحة الرئيسية', 'Homepage carousel'], media: 'm6', st: 'active', imp: 12480, clk: 386, when: ['١ – ٣٠ نوفمبر', '1 – 30 Nov'] },
    { id: 'AD-0034', t: ['عرض خزائن الحائط', 'Wardrobe offer'], pl: ['بانر فئة الأعمال الخشبية', 'Carpentry category banner'], media: 'm9', st: 'pending', imp: 0, clk: 0, when: ['١ – ١٥ ديسمبر', '1 – 15 Dec'] },
  ];
  P.PLANS = [
    ['silver', ['فضي', 'Silver'], ['2', '1', '10', '5', '0', '10 صور|10 images', 'أساسية|Basic', 'no', 'no', 'عادي|Standard']],
    ['gold', ['ذهبي', 'Gold'], ['5', '3', '50', '15', '2', '50 ملفًا|50 media', 'قياسية|Standard', 'yes', 'no', 'عادي|Standard']],
    ['platinum', ['بلاتيني', 'Platinum'], ['∞', '∞', '∞', '30', '5', '∞', 'متقدمة|Advanced', 'yes', 'yes', 'أولوية|Priority']],
  ];
  P.PLAN_ROWS = [['الفئات الرئيسية', 'Major categories'], ['الفروع', 'Branches'], ['مشاريع وألبومات منشورة', 'Published projects/albums'], ['صور لكل مشروع', 'Images per project'], ['فيديو لكل مشروع', 'Videos per project'], ['المعرض العام', 'General gallery'], ['التحليلات', 'Analytics'], ['مشاريع مميزة', 'Featured projects'], ['أولوية الظهور', 'Priority placement'], ['الدعم', 'Support']];
  P.VIEWS = [62, 71, 58, 80, 94, 77, 69, 88, 102, 97, 84, 110, 126, 118];
  window.MJP = P;
})();
