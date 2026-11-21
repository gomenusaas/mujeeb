/** Admin app strings: [arabic, english]. */
export const STR = {
  brand: ['مجيب', 'MUJEEB'], tag: ['الإدارة', 'Admin'], otherLang: ['English', 'العربية'], menu: ['القائمة', 'Menu'],
  needSupabase: ['لوحة الإدارة تعمل مع قاعدة البيانات فقط. أضف إعدادات Supabase إلى ‎.env.local‎.', 'The admin app only runs against the database. Add the Supabase settings to .env.local.'],

  // Sign in
  signInTitle: ['دخول الإدارة', 'Admin sign in'], signInSub: ['لإدارة منصة مجيب: الشركات والمستخدمين والمشرفين.', 'Manage the MUJEEB platform: companies, users and admins.'],
  email: ['البريد الإلكتروني', 'Email'], password: ['كلمة المرور', 'Password'], signIn: ['تسجيل الدخول', 'Sign in'], signOut: ['تسجيل الخروج', 'Sign out'],
  forgot: ['نسيت كلمة المرور؟', 'Forgot password?'], resetSent: ['أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك.', 'We sent a password reset link to your email.'],
  badLogin: ['البريد أو كلمة المرور غير صحيحة.', 'Email or password is incorrect.'], unconfirmed: ['أكّد بريدك أولًا من الرابط الذي أرسلناه إليك.', 'Confirm your email first using the link we sent you.'],
  enterEmail: ['أدخل بريدك الإلكتروني أولًا.', 'Enter your email first.'], required: ['مطلوب', 'Required'],
  notAdmin: ['هذا الحساب ليس مشرفًا', 'This account isn’t an admin'], notAdminBody: ['لوحة الإدارة لمشرفي مجيب فقط. اطلب من مشرف إضافتك.', 'The admin app is for MUJEEB admins only. Ask an admin to add you.'],
  newPassword: ['كلمة مرور جديدة', 'New password'], setPassword: ['حفظ كلمة المرور', 'Save password'], passwordShort: ['٨ أحرف على الأقل', 'At least 8 characters'],

  // Navigation
  overview: ['نظرة عامة', 'Overview'], companies: ['الشركات', 'Companies'], users: ['المستخدمون', 'Users'], admins: ['المشرفون', 'Admins'],
  locations: ['المواقع', 'Locations'],
  subServices: ['الخدمات الفرعية', 'Sub-services'],
  homeServices: ['خدمات الرئيسية', 'Home services'],
  homeServicesSub: ['المربعات في قسم «الخدمات» في الصفحة الرئيسية لتطبيق العملاء، بالترتيب الذي تراه هنا (٣ في كل صف). لكل مربع اسم قصير وأيقونة والصفحة التي يفتحها. حتى ٩ مربعات، ويعرض «عرض الكل» جميع الخدمات.', 'The tiles in the «Services» section on the customer app’s home page, in the order shown here (3 per row). Each tile has a short name, an icon and the service page it opens. Up to 9 tiles; «See all» shows every service.'],
  addTile: ['إضافة مربع', 'Add tile'], editTile: ['تعديل المربع', 'Edit tile'], noTiles: ['لا توجد مربعات. يعرض التطبيق أول الخدمات بأسمائها المختصرة.', 'No tiles. The app shows the first services with their short names.'],
  tileName: ['الاسم في المربع', 'Name on the tile'], tileNameHelp: ['قصير ليتسع في المربع، مثل «مقاولات وهندسة».', 'Short enough to fit the tile, e.g. «Construction».'],
  tileIcon: ['الأيقونة', 'Icon'], iconOfService: ['أيقونة الخدمة', 'The service’s icon'],
  opensPage: ['يفتح صفحة', 'Opens the page'], opensX: ['يفتح: {x}', 'Opens: {x}'], tilesFull: ['وصلت إلى ٩ مربعات.', 'You’ve reached 9 tiles.'],
  deleteTileBody: ['سيختفي المربع من الصفحة الرئيسية. صفحة الخدمة نفسها تبقى.', 'The tile disappears from the home page. The service page itself stays.'],
  subServicesSub: ['قائمة ثابتة لكل فئة. تختار الشركات منها عند إضافة خدمة، وتظهر للعملاء كأزرار تصفية في صفحة الفئة بالترتيب الذي تراه هنا. المخفية لا تظهر.', 'A fixed list per category. Companies pick from it when they add a service, and customers see it as filter chips on the category page, in the order shown here. Hidden ones aren’t shown.'],
  addSub: ['إضافة خدمة فرعية', 'Add sub-service'], editSub: ['تعديل الخدمة الفرعية', 'Edit sub-service'], noSubs: ['لا توجد خدمات فرعية بعد.', 'No sub-services yet.'],
  deleteSubBody: ['ستُزال من الخدمات التي اختارتها. يمكنك إخفاؤها بدل حذفها.', 'It’s removed from the services that picked it. You can hide it instead.'],
  customSubsT: ['كتبتها الشركات', 'Typed by companies'], customSubsHelp: ['خدمات فرعية كتبتها الشركات لأنها لم تجدها في القائمة. أضف المفيد منها إلى القائمة.', 'Sub-services companies typed because they weren’t in the list. Add the useful ones to the list.'],
  usesN: ['{n} خدمة', '{n} services'], addToList: ['إضافة للقائمة', 'Add to list'],
  locationsSub: ['المحافظات والولايات التي يختار منها العملاء «موقع الخدمة»، بالترتيب الذي تراه هنا. المخفية لا تظهر للعملاء.', 'The governorates and wilayats customers pick their service location from, in the order shown here. Hidden ones aren’t shown to customers.'],
  addGov: ['إضافة محافظة', 'Add governorate'], editGov: ['تعديل المحافظة', 'Edit governorate'], addWil: ['إضافة ولاية', 'Add wilayat'], editWil: ['تعديل الولاية', 'Edit wilayat'],
  region: ['منطقة التغطية', 'Coverage region'], regionHelp: ['تربط المحافظة بمناطق تغطية الشركات في التطبيق.', 'Links the governorate to the companies’ coverage regions in the app.'], noRegion: ['بدون', 'None'],
  shown: ['ظاهرة للعملاء', 'Shown to customers'], hiddenFromCustomers: ['مخفية عن العملاء', 'Hidden from customers'], hiddenTag: ['مخفية', 'Hidden'],
  moveUp: ['تحريك للأعلى', 'Move up'], moveDown: ['تحريك للأسفل', 'Move down'], sortAZ: ['ترتيب أبجدي', 'Sort A–Z'],
  deleteGovBody: ['ستُحذف المحافظة وكل ولاياتها. العملاء الذين اختاروا ولاية منها يعودون إلى الموقع الافتراضي.', 'The governorate and all its wilayats are deleted. Customers who picked one of them go back to the default location.'],
  deleteWilBody: ['العملاء الذين اختاروا هذه الولاية يعودون إلى الموقع الافتراضي. يمكنك إخفاؤها بدل حذفها.', 'Customers who picked this wilayat go back to the default location. You can hide it instead of deleting it.'],

  // Overview
  overviewSub: ['حالة المنصة الآن ونشاط آخر ٧ أيام.', 'The platform right now, and activity over the last 7 days.'],
  liveCompanies: ['شركات ظاهرة', 'Live companies'], pendingReview: ['بانتظار المراجعة', 'Waiting for review'], hiddenCompanies: ['شركات مخفية', 'Hidden companies'],
  rejectedCompanies: ['شركات مرفوضة', 'Rejected companies'], customers: ['العملاء', 'Customers'], companyAccounts: ['حسابات الشركات', 'Company accounts'],
  newAccounts7: ['حسابات جديدة (٧ أيام)', 'New accounts (7 days)'], contacts7: ['تواصل مع الشركات (٧ أيام)', 'Contact taps (7 days)'], activity7: ['نشاط العملاء (٧ أيام)', 'Customer activity (7 days)'],
  follows: ['متابعات', 'Follows'], favorites: ['مفضلة', 'Favorites'], services: ['الخدمات', 'Services'], projects: ['المشاريع', 'Projects'], liveStories: ['قصص نشطة', 'Live stories'],
  reviewQueue: ['قائمة المراجعة', 'Review queue'], reviewAll: ['مراجعة الكل', 'Review all'], nothingPending: ['لا توجد شركات بانتظار المراجعة.', 'No companies are waiting for review.'],
  contactNote: ['واتساب والاتصال والاتجاهات. النقرات تفاعلات وليست أعمالًا مؤكدة.', 'WhatsApp, calls and directions. Taps are interactions, not confirmed business.'],

  // Companies
  companiesSub: ['راجع الشركات الجديدة وأدِر كل الشركات على المنصة.', 'Review new sign-ups and manage every company on the platform.'],
  fPending: ['بانتظار المراجعة', 'Pending'], fLive: ['ظاهرة', 'Live'], fHidden: ['مخفية', 'Hidden'], fRejected: ['مرفوضة', 'Rejected'], fAll: ['الكل', 'All'],
  searchCompanies: ['ابحث بالاسم أو الهاتف', 'Search by name or phone'], noCompanies: ['لا توجد شركات هنا', 'No companies here'],
  stPending: ['بانتظار المراجعة', 'Pending'], stLive: ['ظاهرة', 'Live'], stHidden: ['مخفية', 'Hidden'], stRejected: ['مرفوضة', 'Rejected'], verified: ['موثّقة', 'Verified'],
  owner: ['المالك', 'Owner'], followers: ['متابع', 'followers'], submitted: ['أُرسلت', 'Submitted'], joined: ['انضمت', 'Joined'],
  approve: ['موافقة', 'Approve'], approveVerify: ['موافقة وتوثيق', 'Approve + verify'], reject: ['رفض', 'Reject'],
  rejectReason: ['سبب الرفض (تراه الشركة)', 'Reason (the company will see it)'], rejectedNote: ['سبب الرفض', 'Rejection note'],
  approvedT: ['تمت الموافقة، الشركة ظاهرة للعملاء الآن', 'Approved. Customers can see it now'], rejectedT: ['تم الرفض', 'Rejected'],
  visible: ['ظاهرة للعملاء', 'Visible to customers'], visibleHelp: ['أوقفها لإخفاء الشركة وكل محتواها من تطبيق العملاء.', 'Turn off to hide the company and all its content from the customer app.'],
  verifiedHelp: ['تظهر علامة التوثيق بجانب اسم الشركة.', 'Shows the verified badge next to the company name.'],
  details: ['البيانات الأساسية', 'Basic details'], nameAr: ['الاسم بالعربية', 'Name (Arabic)'], nameEn: ['الاسم بالإنجليزية', 'Name (English)'], phone: ['الهاتف', 'Phone'],
  cityAr: ['المدينة بالعربية', 'City (Arabic)'], cityEn: ['المدينة بالإنجليزية', 'City (English)'], governorate: ['المحافظة', 'Governorate'],
  aboutAr: ['النبذة بالعربية', 'About (Arabic)'], aboutEn: ['النبذة بالإنجليزية', 'About (English)'],
  categories: ['الفئات', 'Categories'], categoriesHelp: ['حتى ٣ فئات؛ الأولى هي الرئيسية. الشركات لا تستطيع تغييرها.', 'Up to 3; the first is the main one. Companies can’t change these.'],
  team: ['فريق الشركة', 'Company team'], teamHelp: ['الحسابات التي تدير هذه الشركة في تطبيق الشركات.', 'Accounts that manage this company in the provider app.'],
  addMember: ['إضافة عضو', 'Add member'], memberEmail: ['بريد الحساب', 'Account email'], role: ['الدور', 'Role'], roleOwner: ['مالك', 'Owner'], roleEditor: ['محرر', 'Editor'],
  mustSignUp: ['يجب أن يكون الشخص قد أنشأ حسابًا أولًا.', 'The person must have an account already.'], noSuchAccount: ['لا يوجد حساب بهذا البريد.', 'No account with this email.'],
  memberAdded: ['أُضيف العضو', 'Member added'], memberRemoved: ['أُزيل العضو', 'Member removed'], noMembers: ['لا يوجد أعضاء.', 'No members.'],
  featuredT: ['مشاريع مميزة', 'Featured projects'], featuredHelp: ['تختارها الشركة (حتى ٧) لتظهر أولًا على صفحتها. أزل أي مشروع غير مناسب.', 'Picked by the company (up to 7) to show first on its page. Take off any that aren’t suitable.'],
  noFeatured: ['لم تختر الشركة مشاريع مميزة بعد؛ تظهر أحدث مشاريعها بدلًا منها.', 'The company hasn’t picked any yet; its newest projects show instead.'],
  unfeature: ['إزالة من المميزة', 'Take off'], unfeatured: ['أُزيل من المشاريع المميزة', 'Removed from featured projects'], hiddenProject: ['مخفي', 'Hidden'],
  keywordsT: ['كلمات البحث', 'Search keywords'], keywordsHelp: ['تضيفها الشركة لكل خدمة (حتى ٧) ليجدها العملاء في البحث، ولا تظهر لهم. راجعها بحثًا عن كلمات لا علاقة لها بالخدمة.', 'Added by the company to each service (up to 7) so customers find it in search; customers don’t see them. Check for words unrelated to the service.'],
  noKeywords: ['لم تُضف الشركة كلمات بحث بعد.', 'The company hasn’t added any search keywords yet.'], noKeywordsSvc: ['بلا كلمات', 'No keywords'],
  openInApp: ['فتح في تطبيق العملاء', 'Open in customer app'], deleteCompany: ['حذف الشركة', 'Delete company'],
  deleteCompanyBody: ['ستُحذف الشركة نهائيًا مع خدماتها ومشاريعها وقصصها وفروعها ومتابعيها. حسابات أعضائها تبقى.', 'The company is deleted for good with its services, projects, stories, branches and followers. Its members’ accounts stay.'],
  dangerZone: ['منطقة الخطر', 'Danger zone'], noCover: ['بلا غلاف', 'No cover'], noLogo: ['بلا شعار', 'No logo'],

  // Users
  usersSub: ['كل الحسابات: العملاء وحسابات الشركات.', 'Every account: customers and company accounts.'],
  fCustomers: ['العملاء', 'Customers'], fProviders: ['حسابات الشركات', 'Company accounts'], searchUsers: ['ابحث بالبريد أو الاسم', 'Search by email or name'],
  kindCustomer: ['عميل', 'Customer'], kindProvider: ['شركة', 'Company'], viaGoogle: ['Google', 'Google'], viaEmail: ['بريد وكلمة مرور', 'Email + password'],
  created: ['أُنشئ', 'Created'], lastSignIn: ['آخر دخول', 'Last sign-in'], never: ['لم يدخل بعد', 'Never'],
  blocked: ['محظور', 'Blocked'], unconfirmedTag: ['بريد غير مؤكد', 'Email not confirmed'], adminTag: ['مشرف', 'Admin'], you: ['أنت', 'You'],
  sendReset: ['إرسال رابط كلمة مرور', 'Send password reset'], resetSentTo: ['أُرسل رابط إعادة التعيين إلى', 'Password reset link sent to'],
  block: ['حظر', 'Block'], unblock: ['إلغاء الحظر', 'Unblock'], blockedT: ['تم الحظر', 'Blocked'], unblockedT: ['أُلغي الحظر', 'Unblocked'],
  blockBody: ['لن يتمكن من تسجيل الدخول، ويُسجَّل خروجه خلال ساعة.', 'They won’t be able to sign in, and are signed out within the hour.'],
  deleteUser: ['حذف الحساب', 'Delete account'], deleteUserBody: ['سيُحذف الحساب نهائيًا مع مفضلته ومتابعاته، ومعه أي شركة هو عضوها الوحيد.', 'The account is deleted for good with its favorites and follows, plus any company where it is the only member.'],
  noUsers: ['لا يوجد مستخدمون هنا', 'No users here'],

  // Admins
  adminsSub: ['من يستطيع الدخول إلى لوحة الإدارة.', 'Who can sign in to the admin app.'], addAdmin: ['إضافة مشرف', 'Add admin'],
  addAdminHelp: ['يجب أن يكون للشخص حساب على مجيب أولًا (في تطبيق العملاء أو الشركات).', 'The person needs a MUJEEB account first (in the customer or provider app).'],
  adminAdded: ['لهذا البريد حساب، وأصبح مشرفًا الآن', 'That email already had an account; it’s an admin now'],
  inviteAdmin: ['دعوة مشرف', 'Invite an admin'], invite: ['إرسال الدعوة', 'Send invite'], adminName: ['الاسم (اختياري)', 'Name (optional)'],
  inviteAdminHelp: ['نرسل إلى البريد رابطًا لتعيين كلمة مرور، ثم يدخل مباشرة إلى لوحة الإدارة. إن كان للبريد حساب على مجيب يصبح مشرفًا فورًا.', 'We email a link to set a password, then they land straight in the admin app. If the email already has a MUJEEB account, it becomes an admin right away.'],
  inviteSent: ['أُرسلت الدعوة إلى', 'Invite sent to'], badEmail: ['البريد الإلكتروني غير صحيح.', 'That email address isn’t valid.'],
  inviteNotAllowed: ['لا يمكن إرسال بريد إلى هذا العنوان بعد (يلزم ربط خدمة بريد).', 'Can’t email this address yet (an email service needs to be connected).'], removeAdmin: ['إزالة صلاحية المشرف', 'Remove admin access'], adminRemoved: ['أُزيلت الصلاحية', 'Admin access removed'],
  since: ['منذ', 'Since'],

  // Common
  save: ['حفظ', 'Save'], saved: ['تم الحفظ', 'Saved'], cancel: ['إلغاء', 'Cancel'], delete: ['حذف', 'Delete'], deleteForGood: ['حذف نهائيًا', 'Delete for good'],
  deleted: ['تم الحذف', 'Deleted'], remove: ['إزالة', 'Remove'], add: ['إضافة', 'Add'], close: ['إغلاق', 'Close'], refresh: ['تحديث', 'Refresh'],
  failed: ['تعذّر الإكمال. حاول مرة أخرى.', 'Something went wrong. Try again.'], loadFailed: ['تعذّر تحميل البيانات.', 'Couldn’t load the data.'], retry: ['إعادة المحاولة', 'Try again'],
} as const;

export type StrKey = keyof typeof STR;
export type T = Record<StrKey, string>;
export const strings = (ar: boolean): T => Object.fromEntries(Object.entries(STR).map(([k, v]) => [k, v[ar ? 0 : 1]])) as T;
export const arDigits = (n: number | string) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
