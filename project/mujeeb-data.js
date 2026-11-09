(function () {
  const U = (id, w) => 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 600) + '&q=70&auto=format&fit=crop';
  const HUES = ['amber', 'pink', 'indigo', 'amber', 'sky', 'coral', 'violet', 'teal', 'green', 'coral', 'coral', 'indigo', 'sky', 'teal', 'sky', 'violet', 'indigo', 'teal', 'coral', 'violet'];
  const ART = ['Building construction', 'Couch and lamp', 'Window', 'Light bulb', 'Shower', 'Carpentry saw', 'Cooking', 'Rock', 'Potted plant', 'Chair', 'Fire', 'Sparkles', 'Automobile', 'Delivery truck', 'Snowflake', 'House', 'Triangular ruler', 'Office building', 'Fire extinguisher', 'Video camera'].map(n => 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/' + encodeURIComponent(n) + '/3D/' + n.toLowerCase().replace(/ /g, '_') + '_3d.png');
  const CATS = [
    ['مقاولات البناء', 'Building Contracting', 'مقاولات', 'Contracting', 'building-2'],
    ['التصميم الداخلي والديكور', 'Interior Design & Decoration', 'تصميم داخلي', 'Interiors', 'lamp'],
    ['الحدادة والألمنيوم والزجاج', 'Metal, Aluminum & Glass Works', 'حدادة وألمنيوم', 'Metal & glass', 'frame'],
    ['أعمال الكهرباء', 'Electrical Works', 'كهرباء', 'Electrical', 'zap'],
    ['السباكة وشبكات المياه', 'Plumbing & Water Systems', 'سباكة', 'Plumbing', 'droplets'],
    ['الأعمال الخشبية', 'Carpentry & Woodworks', 'نجارة', 'Carpentry', 'hammer'],
    ['المطابخ والخزانات', 'Kitchens & Cabinets', 'مطابخ', 'Kitchens', 'chef-hat'],
    ['تركيب الحجر الطبيعي والأرضيات', 'Natural Stone & Flooring Installation', 'حجر وأرضيات', 'Stone & floors', 'layout-grid'],
    ['تصميم وتنفيذ الحدائق', 'Landscaping & Garden Design', 'حدائق', 'Landscaping', 'trees'],
    ['فك وتركيب الأثاث', 'Furniture Assembly & Installation', 'تركيب أثاث', 'Furniture', 'sofa'],
    ['تمديد أنابيب الغاز', 'Gas Pipe Installation', 'أنابيب الغاز', 'Gas pipes', 'flame'],
    ['تلميع الرخام', 'Marble Polishing', 'تلميع الرخام', 'Marble polish', 'sparkles'],
    ['خدمات السيارات', 'Automotive Services', 'سيارات', 'Automotive', 'car'],
    ['خدمات النقل', 'Transportation Services', 'نقل', 'Transport', 'truck'],
    ['أعمال التكييف والتبريد', 'Air Conditioning & Refrigeration', 'تكييف وتبريد', 'AC & cooling', 'snowflake'],
    ['البيوت الذكية', 'Smart Home Systems', 'بيوت ذكية', 'Smart home', 'wifi'],
    ['استشارات هندسية', 'Engineering Consultancy', 'استشارات هندسية', 'Engineering', 'drafting-compass'],
    ['التطوير العقاري', 'Real Estate Development', 'تطوير عقاري', 'Real estate', 'building'],
    ['أنظمة مكافحة الحريق', 'Fire Protection Systems', 'مكافحة الحريق', 'Fire safety', 'fire-extinguisher'],
    ['أنظمة الأمن والمراقبة CCTV', 'Security & CCTV Systems', 'أمن ومراقبة', 'Security & CCTV', 'cctv'],
  ].map((c, i) => ({ i, ar: c[0], en: c[1], sar: c[2], sen: c[3], icon: c[4], color: HUES[i], art: ART[i] }));
  const GOV = { all: ['كل عُمان', 'All Oman'], muscat: ['مسقط', 'Muscat'], batinah: ['شمال الباطنة', 'North Batinah'], dakhiliyah: ['الداخلية', 'Ad Dakhiliyah'], dhofar: ['ظفار', 'Dhofar'], sharqiyah: ['الشرقية', 'Ash Sharqiyah'] };
  const HOURS = [['السبت – الخميس', 'Sat – Thu', '8:00 – 18:00'], ['الجمعة', 'Friday', null]];
  const C = (id, ar, en, cats, cityAr, cityEn, gov, cov, img, o) => Object.assign({ id, ar, en, cats, cityAr, cityEn, gov, cov, img: img, verified: true, book: true, rfq: true, phone: '+968 9' + (1000000 + id.length * 1234567 + cats[0] * 98765).toString().slice(0, 7) }, o || {});
  const COMPANIES = [
    C('c1', 'النور للمقاولات', 'Al Noor Contracting', [0, 16], 'الخوير، مسقط', 'Al Khuwair, Muscat', 'muscat', ['all'], '1600585154340-be6161a56a0c', { since: 2009, dar: 'مقاول عام لبناء الفلل والمباني السكنية والتجارية، مع فريق هندسي يتابع المشروع من الترخيص حتى التسليم.', den: 'General contractor for villas, residential and commercial buildings, with an in-house engineering team from permits to handover.', branches: [['الخوير، مسقط', 'Al Khuwair, Muscat', true], ['صحار', 'Sohar', false]] }),
    C('c2', 'ساحل للديكور', 'Sahil Interiors', [1, 9], 'بوشر، مسقط', 'Bawshar, Muscat', 'muscat', ['muscat', 'batinah'], '1600210492486-724fe5c67fb0', { since: 2015, dar: 'استوديو تصميم داخلي متخصص في المجالس والصالات وغرف النوم، بأسلوب عُماني معاصر.', den: 'Interior studio focused on majlis, living and bedroom spaces in a contemporary Omani style.', branches: [['بوشر، مسقط', 'Bawshar, Muscat', true]] }),
    C('c3', 'برق للكهرباء', 'Barq Electric', [3, 15], 'صحار', 'Sohar', 'batinah', ['batinah', 'muscat'], '1621905252507-b35492cc74b4', { since: 2012, book: false, dar: 'أعمال كهرباء للمنازل والمباني التجارية: التمديدات، اللوحات، والإنارة الذكية.', den: 'Electrical works for homes and commercial buildings: wiring, panels and smart lighting.', branches: [['صحار', 'Sohar', true]] }),
    C('c4', 'قمة المطابخ', 'Qimmah Kitchens', [6, 5], 'القرم، مسقط', 'Qurum, Muscat', 'muscat', ['all'], '1588854337236-6889d631faa8', { since: 2011, dar: 'تصميم وتصنيع وتركيب المطابخ والخزائن حسب الطلب، مع معرض في القرم.', den: 'Made-to-measure kitchens and cabinets, designed, built and installed, with a showroom in Qurum.', branches: [['القرم، مسقط', 'Qurum, Muscat', true], ['نزوى', 'Nizwa', false]] }),
    C('c5', 'حدائق الوادي', 'Wadi Gardens', [8], 'نزوى', 'Nizwa', 'dakhiliyah', ['dakhiliyah', 'muscat'], '1564013799919-ab600027ffc6', { since: 2017, dar: 'تصميم وتنفيذ الحدائق المنزلية وأنظمة الري والمسطحات الخضراء.', den: 'Home garden design and build, irrigation systems and lawns.', branches: [['نزوى', 'Nizwa', true]] }),
    C('c6', 'سراج للبيوت الذكية', 'Siraj Smart Homes', [15, 19], 'صلالة', 'Salalah', 'dhofar', ['dhofar'], '1558002038-1055907df827', { since: 2019, dar: 'أنظمة البيت الذكي: الإنارة، الأقفال، التكييف، والكاميرات في تطبيق واحد.', den: 'Smart home systems: lighting, locks, climate and cameras in one app.', branches: [['صلالة', 'Salalah', true]] }),
    C('c7', 'برد للتكييف', 'Bard Cooling', [14], 'السيب، مسقط', 'Seeb, Muscat', 'muscat', ['muscat', 'batinah'], '1545259741-2ea3ebf61fa3', { since: 2010, dar: 'تركيب وصيانة المكيفات المنفصلة والمركزية للمنازل والمكاتب.', den: 'Installation and maintenance of split and central AC for homes and offices.', branches: [['السيب، مسقط', 'Seeb, Muscat', true]] }),
    C('c8', 'صخر للرخام', 'Sakhr Marble', [11, 7], 'العامرات، مسقط', 'Al Amerat, Muscat', 'muscat', ['all'], '1584622650111-993a426fbf0a', { since: 2008, verified: false, dar: 'تلميع وترميم الرخام وتركيب الأرضيات الحجرية.', den: 'Marble polishing and restoration, and natural stone flooring.', branches: [['العامرات، مسقط', 'Al Amerat, Muscat', true]] }),
    C('c9', 'مسار للنقل', 'Masar Transport', [13, 9], 'غلا، مسقط', 'Ghala, Muscat', 'muscat', ['all'], '1601584115197-04ecc0da31d7', { since: 2014, dar: 'نقل الأثاث المنزلي والمكتبي داخل عُمان مع الفك والتركيب.', den: 'Home and office moving across Oman, including dismantling and assembly.', branches: [['غلا، مسقط', 'Ghala, Muscat', true]] }),
    C('c10', 'أمان للأنظمة الأمنية', 'Amaan Security', [19, 18], 'صحار', 'Sohar', 'batinah', ['batinah', 'muscat'], '1557597774-9d273605dfa9', { since: 2013, dar: 'كاميرات المراقبة وأنظمة الإنذار ومكافحة الحريق للفلل والمنشآت.', den: 'CCTV, alarm and fire protection systems for villas and facilities.', branches: [['صحار', 'Sohar', true]] }),
  ];
  const S = (id, co, cat, ar, en, imgs, dar, den) => ({ id, co, cat, ar, en, imgs, dar, den });
  const SERVICES = [
    S('s1', 'c1', 0, 'بناء الفلل السكنية', 'Villa construction', ['1504307651254-35680f356dfd', '1541888946425-d81bb19240f5', '1600585154340-be6161a56a0c'], 'تنفيذ الفلل من الأساسات حتى التشطيب، مع جدول زمني ومهندس موقع مخصص.', 'Villas built from foundations to finishing, with a set schedule and a dedicated site engineer.'),
    S('s2', 'c1', 16, 'مراجعة التصاميم الإنشائية', 'Structural design review', ['1503387762-592deb58ef4e', '1581092160562-40aa08e78837'], 'مراجعة المخططات الإنشائية قبل التنفيذ وتقديم تقرير بالملاحظات.', 'Review of structural drawings before construction, with a written report.'),
    S('s3', 'c2', 1, 'تصميم المجالس', 'Majlis interior design', ['1615874959474-d609969a20ed', '1600210492486-724fe5c67fb0', '1618221195710-dd6b41faaea6'], 'تصميم مجالس الرجال والنساء: المخطط، الإضاءة، الجلسات، والستائر.', 'Majlis design for men and women: layout, lighting, seating and curtains.'),
    S('s4', 'c2', 1, 'تجهيز داخلي متكامل', 'Full home interior fit-out', ['1600607687939-ce8a6c25118c', '1617104678098-de229db51175', '1586023492125-27b2c045efd7'], 'تصميم وتنفيذ داخلي للمنزل بالكامل مع لوحة مواد واعتماد قبل التنفيذ.', 'Whole-home interior design and fit-out, with a materials board you approve first.'),
    S('s5', 'c3', 3, 'تحديث لوحات الكهرباء', 'Electrical panel upgrade', ['1621905251189-08b45d6a269e', '1621905252507-b35492cc74b4'], 'استبدال اللوحات القديمة وتوزيع الأحمال وفحص التمديدات.', 'Replacing old panels, load balancing and wiring inspection.'),
    S('s6', 'c3', 15, 'إنارة ذكية', 'Smart lighting', ['1558002038-1055907df827'], 'مفاتيح ومشاهد إنارة ذكية يمكن التحكم بها من الهاتف.', 'Smart switches and lighting scenes controlled from your phone.'),
    S('s7', 'c4', 6, 'تصميم وتركيب المطابخ', 'Kitchen design & installation', ['1484154218962-a197022b5858', '1588854337236-6889d631faa8', '1600566753190-17f0baa2a6c3'], 'زيارة قياس، تصميم ثلاثي الأبعاد، تصنيع محلي، وتركيب خلال ٣–٥ أسابيع.', 'Measurement visit, 3D design, local manufacturing and installation in 3–5 weeks.'),
    S('s8', 'c4', 5, 'خزائن حائط', 'Built-in wardrobes', ['1622372738946-62e02505feb3', '1524758631624-e2822e304c36'], 'خزائن حائط حسب المقاس بأبواب منزلقة أو مفصلية.', 'Made-to-measure wardrobes with sliding or hinged doors.'),
    S('s9', 'c5', 8, 'تصميم وتنفيذ الحدائق', 'Garden design & build', ['1558904541-efa843a96f01', '1564013799919-ab600027ffc6', '1416879595882-3373a0480b5b'], 'تصميم الحديقة، الزراعة، الممرات، والري بالتنقيط.', 'Garden design, planting, pathways and drip irrigation.'),
    S('s10', 'c6', 15, 'تجهيز البيت الذكي', 'Smart home setup', ['1558002038-1055907df827'], 'ربط الإنارة والتكييف والأقفال في نظام واحد.', 'Lighting, climate and locks connected in one system.'),
    S('s11', 'c6', 19, 'تركيب كاميرات المراقبة', 'CCTV installation', ['1557597774-9d273605dfa9'], 'كاميرات داخلية وخارجية مع مشاهدة مباشرة من الهاتف.', 'Indoor and outdoor cameras with live view on your phone.'),
    S('s12', 'c7', 14, 'تركيب المكيفات', 'AC installation', ['1545259741-2ea3ebf61fa3'], 'تركيب المكيفات المنفصلة مع التمديدات والتصريف.', 'Split AC installation including piping and drainage.'),
    S('s13', 'c7', 14, 'صيانة المكيفات', 'AC maintenance', ['1545259741-2ea3ebf61fa3'], 'تنظيف، فحص الغاز، وصيانة دورية قبل الصيف.', 'Cleaning, refrigerant check and seasonal servicing before summer.'),
    S('s14', 'c8', 11, 'تلميع الرخام', 'Marble polishing', ['1584622650111-993a426fbf0a', '1620626011761-996317b8d101'], 'جلي وتلميع وترميم الرخام للأرضيات والدرج.', 'Grinding, polishing and restoration for floors and stairs.'),
    S('s15', 'c8', 7, 'تركيب الأرضيات الحجرية', 'Stone flooring', ['1497366216548-37526070297c'], 'توريد وتركيب الحجر الطبيعي للأرضيات الداخلية والخارجية.', 'Supply and installation of natural stone for indoor and outdoor floors.'),
    S('s16', 'c9', 13, 'نقل الأثاث المنزلي', 'Home moving', ['1601584115197-04ecc0da31d7'], 'تغليف ونقل الأثاث مع الفك والتركيب.', 'Packing and moving furniture, with dismantling and assembly.'),
    S('s17', 'c10', 19, 'مراقبة الفلل', 'Villa CCTV', ['1557597774-9d273605dfa9'], 'نظام مراقبة متكامل للفلل مع تسجيل ٣٠ يومًا.', 'Complete villa surveillance with 30-day recording.'),
    S('s18', 'c10', 18, 'أنظمة إنذار الحريق', 'Fire alarm systems', ['1607472586893-edb57bdc0e39'], 'تركيب أنظمة الإنذار والإطفاء وفق متطلبات الدفاع المدني.', 'Alarm and suppression systems installed to Civil Defence requirements.'),
  ];
  const A = (id, co, cat, ar, en, pAr, pEn, n, img, more) => ({ id, co, cat, ar, en, pAr, pEn, n, img, imgs: [img].concat(more || []) });
  const ALBUMS = [
    A('a1', 'c1', 0, 'فيلا سكنية بطابقين', 'Two-storey family villa', 'الموج', 'Al Mouj', 24, '1600585154340-be6161a56a0c', ['1580587771525-78b9dba3b914', '1504307651254-35680f356dfd', '1541888946425-d81bb19240f5']),
    A('a2', 'c4', 6, 'مطبخ رخامي مفتوح', 'Open marble kitchen', 'القرم', 'Qurum', 18, '1588854337236-6889d631faa8', ['1484154218962-a197022b5858', '1600566753190-17f0baa2a6c3']),
    A('a3', 'c2', 1, 'تصميم مجلس عصري', 'Modern majlis design', 'بوشر', 'Bawshar', 15, '1615874959474-d609969a20ed', ['1600210492486-724fe5c67fb0', '1618221195710-dd6b41faaea6']),
    A('a4', 'c5', 8, 'مسبح وحديقة خارجية', 'Pool and garden landscape', 'السيب', 'Seeb', 21, '1564013799919-ab600027ffc6', ['1558904541-efa843a96f01', '1416879595882-3373a0480b5b']),
    A('a5', 'c2', 1, 'صالة معيشة مفتوحة', 'Open-plan living room', 'الخوير', 'Al Khuwair', 12, '1600607687939-ce8a6c25118c', ['1586023492125-27b2c045efd7']),
    A('a6', 'c2', 1, 'جناح نوم رئيسي', 'Master bedroom suite', 'المعبيلة', 'Al Maabilah', 9, '1617104678098-de229db51175', ['1513694203232-719a280e022f']),
    A('a7', 'c3', 3, 'لوحة كهرباء لمبنى تجاري', 'Commercial panel upgrade', 'صحار', 'Sohar', 8, '1621905251189-08b45d6a269e', ['1621905252507-b35492cc74b4']),
    A('a8', 'c4', 6, 'مطبخ بخزائن داكنة', 'Dark cabinet kitchen', 'العذيبة', 'Al Azaiba', 14, '1600566753190-17f0baa2a6c3', ['1588854337236-6889d631faa8']),
    A('a9', 'c8', 11, 'حمام رخامي', 'Marble bathroom', 'مدينة السلطان قابوس', 'Madinat Sultan Qaboos', 10, '1584622650111-993a426fbf0a', ['1620626011761-996317b8d101']),
    A('a10', 'c1', 0, 'توسعة فيلا', 'Villa extension', 'السيب', 'Seeb', 11, '1580587771525-78b9dba3b914', ['1541888946425-d81bb19240f5']),
  ];
  const QUOTES = [
    { id: 'MJB-RFQ-000121', co: 'c4', svc: 's7', tAr: 'تجديد مطبخ في القرم', tEn: 'Kitchen renovation in Qurum', st: 'received', date: '2 Nov 2026', quote: { no: 'QT-QMK-0457', st: 'sent', valid: '2 Dec 2026', lines: [['توريد وتركيب الخزائن', 'Cabinet supply & installation', 1, 1850], ['سطح كوارتز (م.ط)', 'Quartz countertop (lin. m)', 6.5, 95], ['تركيب المغسلة والخلاط', 'Sink & mixer installation', 1, 120]], discount: 100, vat: 0.05 } },
    { id: 'MJB-RFQ-000118', co: 'c2', svc: 's3', tAr: 'إعادة تصميم المجلس', tEn: 'Majlis redesign', st: 'moreinfo', date: '30 Oct 2026', askAr: 'هل يمكنك مشاركة مقاسات المجلس وصورة للجدار الرئيسي؟', askEn: 'Could you share the majlis dimensions and a photo of the main wall?' },
    { id: 'MJB-RFQ-000109', co: 'c7', svc: 's12', tAr: 'تركيب ٤ مكيفات منفصلة', tEn: 'Install 4 split AC units', st: 'review', date: '27 Oct 2026' },
  ];
  const BOOKINGS = [
    { id: 'MJB-BK-000044', co: 'c2', p: 'measure', dAr: 'الأحد ١٥ نوفمبر', dEn: 'Sun 15 Nov', time: '10:00', st: 'confirmed' },
    { id: 'MJB-BK-000049', co: 'c7', p: 'inspect', dAr: 'الثلاثاء ١٧ نوفمبر', dEn: 'Tue 17 Nov', time: '16:00', st: 'reschedule', nAr: 'الأربعاء ١٨ نوفمبر', nEn: 'Wed 18 Nov', nTime: '09:00' },
    { id: 'MJB-BK-000031', co: 'c1', p: 'consult', dAr: 'الإثنين ٢ نوفمبر', dEn: 'Mon 2 Nov', time: '11:00', st: 'completed' },
  ];
  const M = (mine, ar, en, time) => ({ mine, ar, en, time });
  const CHATS = {
    c4: { unread: 1, ref: 'MJB-RFQ-000121', msgs: [M(false, 'مرحبًا أحمد، أرسلنا لك عرض السعر للمطبخ.', 'Hi Ahmed, we have sent the quotation for your kitchen.', '10:12'), M(true, 'شكرًا، هل المفصلات الهادئة مشمولة؟', 'Thanks. Are soft-close hinges included?', '10:20'), M(false, 'نعم، مشمولة في سعر الخزائن. ويمكننا تعديل خامة السطح إذا رغبت.', 'Yes, they are included in the cabinet price. We can also change the countertop material if you like.', '10:24')] },
    c2: { unread: 1, ref: 'MJB-RFQ-000118', msgs: [M(false, 'هل يمكنك مشاركة مقاسات المجلس وصورة للجدار الرئيسي؟', 'Could you share the majlis dimensions and a photo of the main wall?', 'أمس')] },
    c7: { unread: 0, ref: 'MJB-BK-000049', msgs: [M(true, 'هل يناسبكم الثلاثاء بعد العصر؟', 'Does Tuesday afternoon work for you?', '09:02'), M(false, 'اقترحنا الأربعاء الساعة ٩ صباحًا بدلًا من ذلك.', 'We have proposed Wednesday at 9:00 instead.', '09:40')] },
  };
  // Generated demo companies: 6 per category (fictional)
  const POOL = [
    ['1504307651254-35680f356dfd', '1541888946425-d81bb19240f5', '1600585154340-be6161a56a0c', '1449844908441-8829872d2607', '1503387762-592deb58ef4e'],
    ['1618221195710-dd6b41faaea6', '1586023492125-27b2c045efd7', '1600210492486-724fe5c67fb0', '1615874959474-d609969a20ed', '1600607687939-ce8a6c25118c', '1617104678098-de229db51175', '1611048267451-e6ed903d4a38', '1615873968403-89e068629265'],
    ['1504328345606-18bbc8c9d7d1', '1600573472550-8090b5e0745e', '1582268611958-ebfd161ef9cf', '1600585154526-990dced4db0d'],
    ['1621905251189-08b45d6a269e', '1621905252507-b35492cc74b4', '1621905251918-48416bd8575a'],
    ['1542013936693-884638332954', '1585704032915-c3400ca199e7', '1620626011761-996317b8d101', '1517646287270-a5a9ca602e5c'],
    ['1513467535987-fd81bc7d62f8', '1504148455328-c376907d081c', '1572981779307-38b8cabb2407', '1590725140246-20acdee442be'],
    ['1484154218962-a197022b5858', '1588854337236-6889d631faa8', '1556912172-45b7abe8b7e1', '1565183928294-7063f23ce0f8', '1622372738946-62e02505feb3', '1600585152220-90363fe7e115'],
    ['1497366216548-37526070297c', '1584622650111-993a426fbf0a', '1600121848594-d8644e57abab'],
    ['1558904541-efa843a96f01', '1416879595882-3373a0480b5b', '1564013799919-ab600027ffc6', '1580587771525-78b9dba3b914'],
    ['1555041469-a586c61ea9bc', '1567016432779-094069958ea5', '1524758631624-e2822e304c36', '1513694203232-719a280e022f'],
    ['1558618666-fcd25c85cd64', '1607472586893-edb57bdc0e39'],
    ['1584622650111-993a426fbf0a', '1620626011761-996317b8d101', '1595515106969-1ce29566ff1c'],
    ['1486262715619-67b85e0b08d3', '1597007066704-67bf2068d5b2'],
    ['1601584115197-04ecc0da31d7', '1555041469-a586c61ea9bc'],
    ['1545259741-2ea3ebf61fa3', '1600607687939-ce8a6c25118c'],
    ['1558002038-1055907df827', '1545259741-2ea3ebf61fa3'],
    ['1503387762-592deb58ef4e', '1581092160562-40aa08e78837', '1600880292203-757bb62b4baf'],
    ['1580587771525-78b9dba3b914', '1600585154340-be6161a56a0c', '1564013799919-ab600027ffc6', '1582268611958-ebfd161ef9cf', '1605276374104-dee2a0ed3cd6', '1449844908441-8829872d2607'],
    ['1607472586893-edb57bdc0e39', '1558618666-fcd25c85cd64'],
    ['1557597774-9d273605dfa9', '1558002038-1055907df827'],
  ];
  const SUF = [['للمقاولات', 'Contracting'], ['للديكور', 'Interiors'], ['للألمنيوم والزجاج', 'Aluminium & Glass'], ['للكهرباء', 'Electrical'], ['للسباكة', 'Plumbing'], ['للنجارة', 'Carpentry'], ['للمطابخ', 'Kitchens'], ['للحجر والأرضيات', 'Stone & Flooring'], ['للحدائق', 'Landscaping'], ['لتركيب الأثاث', 'Furniture Fitting'], ['لأنظمة الغاز', 'Gas Systems'], ['للعناية بالرخام', 'Marble Care'], ['لخدمات السيارات', 'Auto Services'], ['للنقل', 'Transport'], ['للتكييف', 'Cooling'], ['للبيوت الذكية', 'Smart Homes'], ['للاستشارات الهندسية', 'Engineering Consultants'], ['للتطوير العقاري', 'Developments'], ['لأنظمة الحريق', 'Fire Systems'], ['للأنظمة الأمنية', 'Security Systems']];
  const PRE = [['الريادة', 'Al Riyada'], ['الأفق', 'Al Ufuq'], ['النخبة', 'Al Nukhba'], ['المسار', 'Al Masar'], ['الصفوة', 'Al Safwa'], ['البيان', 'Al Bayan'], ['الرواد', 'Al Rowad'], ['الإتقان', 'Al Itqan'], ['الشموخ', 'Al Shumookh'], ['الماهر', 'Al Maher'], ['الوفاء', 'Al Wafa'], ['الأمانة', 'Al Amana'], ['الدقة', 'Al Diqqa'], ['الخليج', 'Gulf'], ['الجبل الأخضر', 'Green Mountain'], ['السدرة', 'Al Sidra'], ['اللبان', 'Frankincense'], ['الواحة', 'Al Waha']];
  const SVC = [[['بناء الفلل', 'Villa construction'], ['ملاحق ومجالس خارجية', 'Annexes & outdoor majlis']], [['تصميم الصالات', 'Living room design'], ['تصميم غرف النوم', 'Bedroom design']], [['واجهات زجاجية', 'Glass facades'], ['أبواب ونوافذ ألمنيوم', 'Aluminium doors & windows']], [['تمديدات كهربائية', 'Electrical wiring'], ['صيانة اللوحات', 'Panel maintenance']], [['كشف التسربات', 'Leak detection'], ['تمديد شبكات المياه', 'Water network installation']], [['أبواب خشبية', 'Wooden doors'], ['أعمال خشبية حسب الطلب', 'Custom woodwork']], [['مطابخ حسب المقاس', 'Made-to-measure kitchens'], ['تجديد خزائن المطبخ', 'Cabinet refacing']], [['تركيب الحجر الطبيعي', 'Natural stone installation'], ['تركيب البورسلان', 'Porcelain tiling']], [['تنسيق الحدائق', 'Garden landscaping'], ['أنظمة الري', 'Irrigation systems']], [['تركيب أثاث المنازل', 'Home furniture assembly'], ['تركيب أثاث المكاتب', 'Office furniture installation']], [['تمديد أنابيب الغاز', 'Gas pipe installation'], ['فحص تسرب الغاز', 'Gas leak inspection']], [['تلميع الأرضيات الرخامية', 'Marble floor polishing'], ['ترميم الرخام', 'Marble restoration']], [['صيانة دورية للسيارات', 'Routine car servicing'], ['تلميع وحماية الطلاء', 'Paint polish & protection']], [['نقل الأثاث المنزلي', 'Home moving'], ['نقل البضائع', 'Goods transport']], [['تركيب المكيفات', 'AC installation'], ['صيانة المكيفات', 'AC maintenance']], [['أتمتة المنزل', 'Home automation'], ['أقفال ذكية', 'Smart locks']], [['إشراف هندسي', 'Engineering supervision'], ['تصميم معماري', 'Architectural design']], [['تطوير مجمعات سكنية', 'Residential compounds'], ['فلل جاهزة', 'Ready-built villas']], [['أنظمة إنذار الحريق', 'Fire alarm systems'], ['شبكات الرش الآلي', 'Sprinkler networks']], [['تركيب كاميرات المراقبة', 'CCTV installation'], ['أنظمة التحكم بالدخول', 'Access control']]];
  const CITY = [['مسقط', 'Muscat', 'muscat'], ['السيب', 'Seeb', 'muscat'], ['بوشر', 'Bawshar', 'muscat'], ['مطرح', 'Muttrah', 'muscat'], ['صحار', 'Sohar', 'batinah'], ['شناص', 'Shinas', 'batinah'], ['نزوى', 'Nizwa', 'dakhiliyah'], ['بهلاء', 'Bahla', 'dakhiliyah'], ['صلالة', 'Salalah', 'dhofar'], ['صور', 'Sur', 'sharqiyah'], ['إبراء', 'Ibra', 'sharqiyah']];
  for (let c = 0; c < 20; c++) {
    for (let j = 0; j < 6; j++) {
      const id = 'g' + c + '-' + j, p = PRE[(c * 5 + j * 7) % PRE.length], city = CITY[(c * 3 + j * 4) % CITY.length], pool = POOL[c];
      const ar = p[0] + ' ' + SUF[c][0], en = p[1] + ' ' + SUF[c][1];
      const cov = j % 3 === 0 ? ['all'] : j % 3 === 1 ? [city[2]] : Array.from(new Set([city[2], 'muscat']));
      const second = j % 2 ? [(c + 7) % 20] : [];
      COMPANIES.push(C(id, ar, en, [c].concat(second), city[0], city[1], city[2], cov, pool[j % pool.length], {
        logo: 'assets/logos/' + id + '.png', since: 2004 + ((c + j * 3) % 19), verified: (c + j) % 4 !== 0, book: (c + j) % 5 !== 0,
        dar: 'شركة عُمانية متخصصة في ' + CATS[c].ar + '، تخدم عملاءها في ' + city[0] + ' وما حولها مع زيارة معاينة وعرض سعر مفصل.',
        den: 'Omani company specialising in ' + CATS[c].en.toLowerCase() + ', serving ' + city[1] + ' and nearby areas with a site visit and a detailed quotation.',
        branches: [[city[0], city[1], true]],
      }));
      SVC[c].forEach((s, k) => SERVICES.push(S('s' + id + '-' + k, id, c, s[0], s[1], [pool[(j + k) % pool.length], pool[(j + k + 1) % pool.length]], s[0] + ' من ' + ar + '. نبدأ بزيارة للموقع ثم نرسل لك عرض سعر واضح.', s[1] + ' by ' + en + '. We start with a site visit, then send you a clear quotation.')));
      ALBUMS.push(A('a' + id, id, c, SVC[c][j % 2][0] + ' — ' + city[0], SVC[c][j % 2][1] + ' — ' + city[1], city[0], city[1], 6 + ((c * 7 + j * 5) % 20), pool[(j + 1) % pool.length], [pool[j % pool.length], pool[(j + 2) % pool.length]]));
    }
  }

  // Keep 10 categories only; remap old indices
  const MAP = { 0: 0, 16: 0, 14: 1, 3: 2, 4: 3, 1: 4, 2: 5, 19: 6, 18: 7, 8: 8, 6: 9 };
  const NEW = [[0, 'مقاولات البناء واستشارات هندسية', 'Construction & Engineering Consultancy', 'مقاولات وهندسة', 'Construction'], [14, 'أعمال التكييف والتبريد', 'Air Conditioning & Refrigeration', 'تكييف وتبريد', 'AC & cooling'], [3, 'أعمال الكهرباء والطاقة', 'Electrical & Power Works', 'كهرباء وطاقة', 'Electrical & power'], [4, 'السباكة وشبكات المياه', 'Plumbing & Water Systems', 'سباكة', 'Plumbing'], [1, 'التصميم الداخلي والديكور', 'Interior Design & Decoration', 'تصميم داخلي', 'Interiors'], [2, 'الحدادة والألمنيوم والزجاج', 'Metal, Aluminum & Glass Works', 'حدادة وألمنيوم', 'Metal & glass'], [19, 'الكاميرات والأنظمة الأمنية والمراقبة', 'Cameras, Security & Surveillance', 'كاميرات ومراقبة', 'Security & CCTV'], [18, 'أنظمة الحريق والإنذار', 'Fire & Alarm Systems', 'حريق وإنذار', 'Fire & alarm'], [8, 'تصميم الحدائق', 'Garden Design', 'حدائق', 'Gardens'], [6, 'المطابخ والخزانات', 'Kitchens & Cabinets', 'مطابخ', 'Kitchens']];
  const HUES10 = ['orange', 'teal', 'gold', 'sky', 'violet', 'steel', 'indigo', 'ruby', 'green', 'wood'];
  const CATS10 = NEW.map(([o, ar, en, sar, sen], i) => ({ ...CATS[o], i, ar, en, sar, sen, color: HUES10[i] }));
  const mc = x => (x in MAP ? MAP[x] : null);
  const COS = COMPANIES.filter(co => co.id[0] === 'c' ? co.cats.some(x => mc(x) != null) : mc(co.cats[0]) != null)
    .map(co => ({ ...co, cats: Array.from(new Set(co.cats.map(mc).filter(x => x != null))) }));
  const keep = new Set(COS.map(c => c.id));
  const SVCS = SERVICES.filter(s => keep.has(s.co) && mc(s.cat) != null).map(s => ({ ...s, cat: mc(s.cat) }));
  const ALBS = ALBUMS.filter(a => keep.has(a.co) && mc(a.cat) != null).map(a => ({ ...a, cat: mc(a.cat) }));
  window.MJ = { U, CATS: CATS10, GOV, HOURS, COMPANIES: COS, SERVICES: SVCS, ALBUMS: ALBS, QUOTES, BOOKINGS, CHATS };
})();
