/**
 * FoundIt - Internationalization & RTL Toggle Support
 * Full English & Arabic translation dictionaries
 */

const I18N = {
  en: {
    // Brand & Header
    brandName: 'FoundIt',
    tagline: "Lost something? Let's bring it home.",
    systemTitle: 'Smart University Lost & Found System',
    navHome: 'Home',
    navBrowse: 'Browse Items',
    navReport: 'Report an Item',
    navMatching: 'Smart Matching',
    navMyReports: 'My Reports',
    navAdmin: 'Review Dashboard',
    navAbout: 'About & Academic Core',
    langToggle: 'العربية',
    switchRole: 'Role',
    roleStudent: 'Student View',
    roleAdmin: 'Staff / Admin View',

    // Hero Section
    heroBadge: 'Official Campus Recovery Hub',
    heroTitle: 'Lost something on campus?\nWe bring items home.',
    heroSubtitle: 'Intelligent matchmaking, campus building indexing, and secure handover protocols for university students and faculty.',
    btnReportLost: 'Report Lost Item',
    btnReportFound: 'Report Found Item',
    searchPlaceholder: 'Search lost student IDs, black headphones, notebooks, keys...',
    btnSearch: 'Find Item',

    // Quick Stats
    statRecovered: 'Items Reunited',
    statActive: 'Active Reports',
    statMatchRate: 'Match Accuracy',
    statHandoverTime: 'Avg Handover Time',

    // Category Shortcuts
    categoriesTitle: 'Browse by Campus Category',
    categoriesSubtitle: 'Quickly explore recently cataloged items across student departments',
    viewAllCategories: 'View all listings',

    // How It Works
    howTitle: 'How FoundIt Works',
    howSubtitle: 'Engineered for speed, privacy, and reliable campus reunification',
    howStep1Title: '1. Report Detailed Item',
    howStep1Desc: 'Submit a Lost or Found item with key identifying characteristics, photo, campus zone, and date.',
    howStep2Title: '2. Algorithmic Matchmaking',
    howStep2Desc: 'Heuristic scoring evaluates category parity, keyword tokens, building proximity, and timestamp deltas.',
    howStep3Title: '3. Safe Campus Handover',
    howStep3Desc: 'Reclaim items safely at designated campus security desks without disclosing private personal contacts.',

    // Trust & Success Stories
    successTitle: 'Recent Campus Reunited Items',
    successSubtitle: 'Real university students getting back their essential study gear',
    trustTitle: 'Privacy-First Campus Network',
    trustBullet1: 'Zero Public Contact Exposure: Secure claim verification before any details are shared.',
    trustBullet2: 'Verified Handover Desks: Items deposited at official Dean or Library service desks.',
    trustBullet3: 'C++ Algorithmic Core: Manual Hash Table & Queue ensure robust campus operations.',

    // Browse Page
    browseTitle: 'Campus Item Directory',
    browseSubtitle: 'Search, filter, and inspect reported lost and found items across all campus buildings',
    filterAll: 'All Items',
    filterLost: 'Lost Items',
    filterFound: 'Found Items',
    filterCategory: 'Category',
    filterZone: 'Campus Building',
    filterStatus: 'Status',
    filterSort: 'Sort By',
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    sortTitleAZ: 'Title (A-Z)',
    viewGrid: 'Grid',
    viewList: 'List',
    showingResults: 'Showing',
    ofResults: 'of',
    itemsWord: 'items',
    clearFilters: 'Clear All Filters',
    noResultsTitle: 'No Matching Items Found',
    noResultsDesc: 'Try adjusting your search terms, changing the campus building filter, or submit a new report.',

    // Badges & Statuses
    statusOpen: 'Active / Open',
    statusUnderReview: 'Under Review',
    statusMatched: 'Match Found',
    statusReturned: 'Returned to Owner',
    statusClosed: 'Closed',
    badgeSample: 'Sample Campus Record',
    badgeStrong: 'Strong Match',
    badgePossible: 'Possible Match',
    badgeLow: 'Low Match',

    // Item Details Modal
    detailsTitle: 'Item Report Details',
    reportedOn: 'Reported Date',
    campusLocation: 'Campus Location',
    reporterBadge: 'Reporter Verification',
    reporterSafe: 'University Verified Reporter',
    btnClaim: 'Claim This Item',
    btnContact: 'Contact Reporter Safely',
    btnClose: 'Close',
    potentialMatches: 'Potential Matching Reports',
    potentialMatchesSubtitle: 'Calculated using our heuristic matching algorithm',

    // Safe Claim Modal
    claimModalTitle: 'Secure Item Claim Verification',
    claimModalSubtitle: 'To protect student property, please answer identifying verification questions.',
    claimQuestion1: 'Describe unique markings, scratches, or stickers:',
    claimQuestion2: 'Approximate time or specific desk where you recall leaving it:',
    claimQuestion3: 'Provide lock-screen passcode hint or serial number (if applicable):',
    btnSubmitClaim: 'Submit Verification Claim',
    claimSentSuccess: 'Claim successfully submitted to campus moderators for verification!',

    // Report Form Wizard
    reportWizardTitle: 'Submit an Item Report',
    reportWizardSubtitle: 'Fill out this report to enter your item into the university matching system.',
    step1: '1. Type & Category',
    step2: '2. Item Details',
    step3: '3. Location & Date',
    step4: '4. Contact & Submit',
    lblType: 'What happened?',
    optLost: 'I Lost an Item',
    optFound: 'I Found an Item',
    lblCategory: 'Item Category',
    lblTitle: 'Item Title',
    titlePlaceholder: 'e.g. Sony WH-1000XM4 Black Headphones',
    lblDescription: 'Detailed Description & Identifying Marks',
    descPlaceholder: 'Color, brand, distinguishing scratches, contents, key fobs, stickers...',
    lblDate: 'Date Lost or Found',
    lblZone: 'Campus Zone / Building',
    lblSpecificLoc: 'Exact Room / Hallway / Desk Details',
    locPlaceholder: 'e.g. 2nd Floor Study Room 204, desk row 3',
    lblImagePreset: 'Item Image / Representative Preset',
    lblContactPref: 'Safe Contact & Claim Channel',
    optSafeRelay: 'Campus Anonymous Relay (Recommended)',
    optSecurityDesk: 'Campus Security Desk Deposit',
    btnPrev: 'Back',
    btnNext: 'Next Step',
    btnSubmitReport: 'Submit University Report',
    errRequired: 'This field is required',
    errFutureDate: 'Date cannot be in the future',
    errTitleShort: 'Title must be at least 4 characters long',

    // Smart Matching Page
    matchingTitle: 'Smart Heuristic Matchmaker',
    matchingSubtitle: 'Algorithmically correlates Lost and Found reports with transparent multi-factor scoring',
    selectReportToMatch: 'Select a Report to Find Matches For:',
    matchingDisclaimer: 'Academic Notice: Match percentages are computed heuristic estimates derived from category compatibility, tokenized keyword overlap, building proximity, and date deltas. They are not legal proof of ownership.',
    matchScoreBreakdown: 'Match Score Breakdown',
    scoreCategory: 'Category Parity (Max 35)',
    scoreKeywords: 'Keyword & Term Overlap (Max 30)',
    scoreLocation: 'Campus Proximity (Max 20)',
    scoreDate: 'Date Closeness (Max 15)',

    // My Reports Page
    myReportsTitle: 'My Submitted Reports',
    myReportsSubtitle: 'Manage your active listings, track moderation progress, and review candidate matches',
    btnUndoAction: 'Undo Last Change',
    btnDelete: 'Delete Report',
    btnEdit: 'Edit Report',
    btnViewMatches: 'View Matches',
    confirmDeleteTitle: 'Delete this report?',
    confirmDeleteDesc: 'Are you sure you want to remove this report? You can undo this action immediately via the Undo Stack.',
    emptyMyReports: 'You have not submitted any personal reports yet. Use "Report an Item" to get started.',

    // Admin Dashboard
    adminTitle: 'Administrative Review Hub',
    adminSubtitle: 'Enforces moderation rules, handles report queues in FIFO sequence, and verifies safe handovers',
    adminBannerText: 'Administrator Privilege Active — Review Queue & Data Structure Moderation Enabled',
    statQueueSize: 'Queue Awaiting Review',
    statTotalCatalog: 'Total Cataloged',
    statReturnedRate: 'Reunited Items',
    statDupAlerts: 'Duplicate Alerts',
    queueTitle: 'Reports Awaiting Moderation (FIFO Queue)',
    queueSubtitle: 'First-in, first-out sequence governed by Queue data structure',
    btnApprove: 'Approve & Publish',
    btnReject: 'Flag Duplicate / Reject',
    btnMarkReturned: 'Mark as Returned',
    recentActivity: 'System Audit Log',
    duplicateScannerTitle: 'Duplicate Detection Engine',

    // Academic & About Page
    academicTitle: 'Academic Core & Data Structures Architecture',
    academicSubtitle: 'Course Requirement: Manual C++17 implementations of classic data structures with Zero-STL reliance',
    academicStatementTitle: 'Architectural Disclosure & Separation of Concerns',
    academicStatementBody: 'This web application serves as a high-fidelity presentation prototype for testing human interactions, mobile layouts, and campus workflows. The underlying core data structures required for the course are modeled and implemented in clean, compilable C++ (located in the /cpp repository directory), featuring manual implementations of Hash Table, Linked List, Queue, Stack, and Array without standard container dependencies.',
    tabVisualizer: 'Live Data Structures Visualizer',
    tabCode: 'C++ Source Code Viewer',
    tabComplexity: 'Complexity & Test Suite',
    btnDownloadCpp: 'Download C++ Core Package (.zip / .cpp)',
    btnRunTests: 'Re-run Virtual Test Suite',

    // Footer
    footerDesc: 'Smart University Lost & Found System. Built for campus student safety, fast item recovery, and academic rigor in Data Structures.',
    footerAcademicNote: 'University Data Structures Capstone Project • C++17 Core + Modern Web Prototype',
    footerLinks: 'Campus Handover Desks',
    btnResetData: 'Restore Sample Campus Data',
    toastResetSuccess: 'All seed data and data structures have been reset to default state.',

    // Authentication & RBAC (English)
    navDashboard: 'Dashboard',
    btnSignIn: 'Sign In',
    btnSignOut: 'Sign Out',
    btnRegister: 'Register',
    btnContinueGoogle: 'Continue with Google',
    loginTitle: 'Sign In to FoundIt',
    loginSubtitle: 'Access university lost & found reports, tracking, and claims',
    registerTitle: 'Create Student Account',
    registerSubtitle: 'Join the campus recovery network with your university email',
    verifyEmailTitle: 'Verify Your University Email',
    verifyEmailSubtitle: 'Enter the 6-digit verification code dispatched to',
    forgotPasswordTitle: 'Recover Account Access',
    forgotPasswordSubtitle: 'We will send a single-use verification link to your registered email',
    resetPasswordTitle: 'Choose New Password',
    resetPasswordSubtitle: 'Enter a strong, secure password for your campus account',
    accessDeniedTitle: 'Access Denied (403 Forbidden)',
    accessDeniedDesc: 'This area is restricted to campus administrators. Your current student role cannot access administrative moderation tools.',
    sessionExpiredTitle: 'Session Expired',
    sessionExpiredDesc: 'Your session has timed out due to inactivity to protect campus data. Please sign in again to continue.',
    btnSignInAgain: 'Sign In Again',
    btnReturnDashboard: 'Return to Student Dashboard',
    studentDashboardTitle: 'Student Command Dashboard',
    studentDashboardSubtitle: 'Manage your active reports, track potential matches, and check ownership claims',
    adminDashboardTitle: 'University Administration Console',
    adminDashboardSubtitle: 'Manage the FIFO review queue, review claims, inspect audit trails, and configure OAuth'
  },

  ar: {
    // Brand & Header
    brandName: 'فاوند إت (FoundIt)',
    tagline: 'أضعت شيئاً في الحرم الجامعي؟ دعنا نعيده إليك.',
    systemTitle: 'النظام الذكي للمفقودات والمعثورات الجامعية',
    navHome: 'الرئيسية',
    navBrowse: 'تصفح المعروضات',
    navReport: 'إبلاغ عن غرض',
    navMatching: 'المطابقة الذكية',
    navMyReports: 'بلاغاتي',
    navAdmin: 'لوحة المشرفين',
    navAbout: 'النواة الأكاديمية وهياكل البيانات',
    langToggle: 'English',
    switchRole: 'الصفة',
    roleStudent: 'عرض الطالب',
    roleAdmin: 'عرض المشرف / الإدارة',

    // Hero Section
    heroBadge: 'المنصة الرسمية لاستعادة المفقودات بالحرم الجامعي',
    heroTitle: 'فقدت شيئاً في الجامعة؟\nنعيده إلى يديك بأمان وسرعة.',
    heroSubtitle: 'مطابقة خوارزمية ذكية، وفهرسة مباني الجامعة، وإجراءات تسليم مؤمنة وموثوقة للطلاب وهيئة التدريس.',
    btnReportLost: 'إبلاغ عن غرض مفقود',
    btnReportFound: 'إبلاغ عن غرض معثور عليه',
    searchPlaceholder: 'ابحث عن بطاقات جامعية، سماعات سوداء، دفاتر، مفاتيح...',
    btnSearch: 'بحث عن الغرض',

    // Quick Stats
    statRecovered: 'أغراض تم تسليمها',
    statActive: 'بلاغات نشطة',
    statMatchRate: 'دقة المطابقة',
    statHandoverTime: 'متوسط وقت التسليم',

    // Category Shortcuts
    categoriesTitle: 'تصفح حسب تصنيفات الحرم الجامعي',
    categoriesSubtitle: 'استكشف بسرعة الأغراض المسجلة حديثاً في مختلف الكليات والمرافق',
    viewAllCategories: 'عرض جميع المعروضات',

    // How It Works
    howTitle: 'كيف يعمل نظام FoundIt',
    howSubtitle: 'مصمم لتحقيق أعلى درجات السرعة والخصوصية في استرداد مقتنياتك',
    howStep1Title: '١. تقديم بلاغ مفصل',
    howStep1Desc: 'سجل غرضاً مفقوداً أو معثوراً عليه بمواصفاته المميزة، موقعه بالحرم، وتاريخه بدقة.',
    howStep2Title: '٢. المطابقة الخوارزمية الذكية',
    howStep2Desc: 'يقوم محرك المطابقة بمقارنة الفئات والكلمات المفتاحية وتقارب المباني والفارق الزمني.',
    howStep3Title: '٣. الاستلام الآمن بالحرم',
    howStep3Desc: 'استلم مقتنياتك من مكاتب الأمن أو استعلامات المكتبة دون كشف أرقامك وهويتك الشخصية.',

    // Trust & Success Stories
    successTitle: 'أحدث الأغراض التي استعادها الطلاب',
    successSubtitle: 'قصص حقيقية لعودة المقتنيات الدراسية الهامة لأصحابها بالجامعة',
    trustTitle: 'شبكة جامعية تحترم الخصوصية',
    trustBullet1: 'حجب كامل لبيانات الاتصال الشخصية: يتم التحقق عبر أسئلة الملكية قبل أي تواصل.',
    trustBullet2: 'نقاط تسليم معتمدة: تسليم واستلام رسمي بمكاتب الأمن وإدارات الكليات.',
    trustBullet3: 'نواة برمجية بـ C++: هياكل بيانات وجدول تجزئة يضمنان كفاءة العمليات وسرعتها.',

    // Browse Page
    browseTitle: 'دليل مفقودات ومعثورات الجامعة',
    browseSubtitle: 'ابحث، وفلتر، وافحص الأغراض المبلغ عنها عبر كافة المباني والمدرجات',
    filterAll: 'كافة الأغراض',
    filterLost: 'المفقودات',
    filterFound: 'المعثورات',
    filterCategory: 'التصنيف',
    filterZone: 'مبنى / منطقة الحرم',
    filterStatus: 'الحالة',
    filterSort: 'الترتيب',
    sortNewest: 'الأحدث أولاً',
    sortOldest: 'الأقدم أولاً',
    sortTitleAZ: 'الاسم (أ - ي)',
    viewGrid: 'شبكة',
    viewList: 'قائمة',
    showingResults: 'عرض',
    ofResults: 'من أصل',
    itemsWord: 'أغراض',
    clearFilters: 'إعادة ضبط الفلاتر',
    noResultsTitle: 'لم يتم العثور على نتائج مطابقة',
    noResultsDesc: 'جرب تغيير كلمات البحث، أو اختيار مبنى جامعي آخر، أو أضف بلاغاً جديداً.',

    // Badges & Statuses
    statusOpen: 'نشط / قيد البحث',
    statusUnderReview: 'قيد مراجعة الإشراف',
    statusMatched: 'تم العثور على تطابق',
    statusReturned: 'تم التسليم لصاحبه',
    statusClosed: 'مغلق',
    badgeSample: 'سجل تجريبي للحرم',
    badgeStrong: 'تطابق قوي جداً',
    badgePossible: 'تطابق محتمل',
    badgeLow: 'تطابق ضعيف',

    // Item Details Modal
    detailsTitle: 'تفاصيل البلاغ المسجل',
    reportedOn: 'تاريخ التسجيل',
    campusLocation: 'الموقع بالحرم الجامعي',
    reporterBadge: 'حالة التحقق من المبلغ',
    reporterSafe: 'مبلغ معتمد من مجتمع الجامعة',
    btnClaim: 'المطالبة بهذا الغرض',
    btnContact: 'التواصل الآمن مع المبلغ',
    btnClose: 'إغلاق',
    potentialMatches: 'أغراض ذات صلة ومطابقة محتملة',
    potentialMatchesSubtitle: 'تم احتسابها تلقائياً باستخدام خوارزمية المطابقة الاستدلالية',

    // Safe Claim Modal
    claimModalTitle: 'التحقق الآمن من ملكية الغرض',
    claimModalSubtitle: 'لحماية ممتلكات الطلاب، يرجى الإجابة عن أسئلة إثبات الملكية التالية:',
    claimQuestion1: 'صف العلامات المميزة، أو الخدوش، أو الملصقات على الغرض:',
    claimQuestion2: 'الوقت التقريبي أو رقم المقعد / المكتب الذي تتذكر تركه عليه:',
    claimQuestion3: 'تلميح لكلمة مرور الشاشة أو الرقم التسلسلي (إن وجد):',
    btnSubmitClaim: 'إرسال طلب إثبات الملكية',
    claimSentSuccess: 'تم إرسال طلب الملكية بنجاح إلى مشرفي الجامعة للتحقق والمطابقة!',

    // Report Form Wizard
    reportWizardTitle: 'تسجيل بلاغ غرض جديد',
    reportWizardSubtitle: 'أدخل تفاصيل الغرض ليتم إدراجه في خوارزمية المطابقة الذكية بالجامعة.',
    step1: '١. النوع والتصنيف',
    step2: '٢. مواصفات الغرض',
    step3: '٣. الموقع والتاريخ',
    step4: '٤. وسيلة الاتصال والتأكيد',
    lblType: 'ما هو نوع البلاغ؟',
    optLost: 'أضعت غرضاً (مفقود)',
    optFound: 'عثرت على غرض (معثور عليه)',
    lblCategory: 'تصنيف الغرض',
    lblTitle: 'عنوان البلاغ',
    titlePlaceholder: 'مثال: سماعة رأس سوني سوداء WH-1000XM4',
    lblDescription: 'الوصف التفصيلي والعلامات المميزة',
    descPlaceholder: 'اللون، الماركة، الخدوش المميزة، المحتويات، الميداليات، الملصقات...',
    lblDate: 'تاريخ الفقد أو العثور',
    lblZone: 'مبنى / منطقة الحرم الجامعي',
    lblSpecificLoc: 'الموقع الدقيق (رقم القاعة أو المكتب)',
    locPlaceholder: 'مثال: مدرج ٢٠٤، الصف الثالث بالقرب من المنصة',
    lblImagePreset: 'صورة الغرض أو نموذج مطابق',
    lblContactPref: 'قناة الاستلام والتواصل الآمن',
    optSafeRelay: 'نظام المراسلة المشفر بالجامعة (موصى به)',
    optSecurityDesk: 'إيداع رسمي بمكتب الأمن الجامعي',
    btnPrev: 'السابق',
    btnNext: 'التالي',
    btnSubmitReport: 'تسجيل البلاغ بالجامعة',
    errRequired: 'هذا الحقل مطلوب إدخاله',
    errFutureDate: 'لا يمكن اختيار تاريخ مستقبلي',
    errTitleShort: 'يجب ألا يقل العنوان عن ٤ أحرف',

    // Smart Matching Page
    matchingTitle: 'محرك المطابقة الاستدلالية الذكية',
    matchingSubtitle: 'يقوم بمضاهاة المفقودات والمعثورات بشفافية تامة وفق معايير متعددة موزونة',
    selectReportToMatch: 'اختر بلاغاً للبحث عن مطابقات له في النظام:',
    matchingDisclaimer: 'تنويه أكاديمي: نسب المطابقة هي تقديرات استدلالية مبنية على تطابق الفئة والكلمات الدلالية وموقع المبنى والفارق الزمني وليست دليلاً قاطعاً على الملكية.',
    matchScoreBreakdown: 'تفصيل درجات احتساب المطابقة',
    scoreCategory: 'تطابق الفئة والتصنيف (الحد الأقصى ٣٥)',
    scoreKeywords: 'تطابق الكلمات المفتاحية والعنوان (الحد الأقصى ٣٠)',
    scoreLocation: 'تقارب المبنى والموقع بالحرم (الحد الأقصى ٢٠)',
    scoreDate: 'التقارب الزمني للتاريخ (الحد الأقصى ١٥)',

    // My Reports Page
    myReportsTitle: 'سجل بلاغاتي الشخصية',
    myReportsSubtitle: 'إدارة البلاغات النشطة، ومتابعة مراجعة الإشراف، ومراجعة المطابقات المقترحة',
    btnUndoAction: 'تراجع عن آخر إجراء (Undo)',
    btnDelete: 'حذف البلاغ',
    btnEdit: 'تعديل البلاغ',
    btnViewMatches: 'عرض المطابقات',
    confirmDeleteTitle: 'تأكيد حذف البلاغ؟',
    confirmDeleteDesc: 'هل أنت متأكد من رغبتك في حذف هذا البلاغ؟ يمكنك التراجع فوراً باستخدام مكدس التراجع (Stack).',
    emptyMyReports: 'لم تقم بتقديم أي بلاغات حتى الآن. اضغط على "إبلاغ عن غرض" للبدء.',

    // Admin Dashboard
    adminTitle: 'مركز المراجعة والإشراف الإداري',
    adminSubtitle: 'إدارة طابور المراجعة بنظام FIFO وتأكيد عمليات التسليم وكشف البلاغات المكررة',
    adminBannerText: 'وضع الإشراف مفعل — يمكنك إدارة طابور المراجعة وهياكل البيانات بنجاح',
    statQueueSize: 'طابور المراجعة (Queue)',
    statTotalCatalog: 'إجمالي المسجل بالنظام',
    statReturnedRate: 'أغراض تمت إعادتها',
    statDupAlerts: 'تنبيهات التكرار',
    queueTitle: 'بلاغات في انتظار المراجعة (طابور FIFO)',
    queueSubtitle: 'تتابع البلاغات بحسب أسبقية الوصول تحت إدارة هيكل الطابور Queue',
    btnApprove: 'اعتماد ونشر',
    btnReject: 'رفض / بلاغ مكرر',
    btnMarkReturned: 'تأكيد التسليم لصاحبه',
    recentActivity: 'سجل نشاط النظام (Audit Log)',
    duplicateScannerTitle: 'فاحص البلاغات المكررة',

    // Academic & About Page
    academicTitle: 'الهندسة البرمجية وهياكل البيانات بلغة C++',
    academicSubtitle: 'متطلب مقرر هياكل البيانات الجامعي: بناء يدوي لهياكل البيانات بلغة C++17 بدون مكتبات خارجية STL',
    academicStatementTitle: 'الإفصاح الأكاديمي وفصل الطبقات البرمجية',
    academicStatementBody: 'هذه الواجهة التفاعلية هي نموذج عرض متطور لاختبار تجربة المستخدم والأنظمة المتجاوبة. أما هياكل البيانات الفعلية والتعقيد الحسابي وإدارة الذاكرة فقد تمت كتابتها بلغة C++ الخالصة (داخل مجلد cpp/)، متضمنةً بناءً يدوياً لجدول التجزئة (Hash Table)، والقائمة المتصلة (Linked List)، والطابور (Queue)، والمكدس (Stack)، والمصفوفة الثابتة (Array) دون أي اعتماد على حاويات STL الجاهزة.',
    tabVisualizer: 'المحاكي التفاعلي لهياكل البيانات',
    tabCode: 'مستعرض كود C++ المصدري',
    tabComplexity: 'التعقيد الحسابي وحالات الاختبار',
    btnDownloadCpp: 'تحميل حزمة مشروع C++ كاملة',
    btnRunTests: 'إعادة تشغيل الاختبارات الأكاديمية',

    // Footer
    footerDesc: 'نظام FoundIt الذكي للمفقودات والمعثورات الجامعية. صمم لتوفير الأمان وخدمة طلاب وأعضاء الجامعة وتطبيق مبادئ هياكل البيانات بدقة.',
    footerAcademicNote: 'مشروع تخرج مقرر هياكل البيانات • نواة برمجية بـ C++17 + واجهة تفاعلية حديثة',
    footerLinks: 'مكاتب استلام المفقودات بالحرم',
    btnResetData: 'استعادة بيانات الحرم التجريبية',
    toastResetSuccess: 'تمت استعادة السجلات التجريبية وهياكل البيانات إلى وضعها الأصلي بنجاح.',

    // Authentication & RBAC (Arabic)
    navDashboard: 'لوحة التحكم',
    btnSignIn: 'تسجيل الدخول',
    btnSignOut: 'تسجيل الخروج',
    btnRegister: 'إنشاء حساب',
    btnContinueGoogle: 'المتابعة باستخدام Google',
    loginTitle: 'تسجيل الدخول إلى FoundIt',
    loginSubtitle: 'الوصول إلى بلاغات المفقودات، ومتابعة المطابقات، وإدارة البلاغات',
    registerTitle: 'إنشاء حساب طالب جديد',
    registerSubtitle: 'انضم لشبكة استعادة المفقودات الجامعية ببريدك الأكاديمي',
    verifyEmailTitle: 'تأكيد البريد الإلكتروني الجامعي',
    verifyEmailSubtitle: 'أدخل رمز التحقق المكون من 6 أرقام المرسل إلى',
    forgotPasswordTitle: 'استعادة الوصول للحساب',
    forgotPasswordSubtitle: 'سنرسل رابط تحقق صالح لمرة واحدة لبريدك المسجل',
    resetPasswordTitle: 'تعيين كلمة مرور جديدة',
    resetPasswordSubtitle: 'اختر كلمة مرور قوية ومؤمنة لحسابك الجامعي',
    accessDeniedTitle: 'تم رفض الوصول (غير مصرح 403)',
    accessDeniedDesc: 'هذه الصفحة مخصصة لمشرفي إدارة الحرم الجامعي فقط. حسابك الحالي كطالب لا يمتلك صلاحية الوصول لهذه الأدوات.',
    sessionExpiredTitle: 'انتهت صلاحية الجلسة',
    sessionExpiredDesc: 'انتهت صلاحية جلستك بسبب عدم النشاط لحماية بيانات الحرم الجامعي. يرجى تسجيل الدخول مجدداً للمتابعة بأمان.',
    btnSignInAgain: 'تسجيل الدخول مجدداً',
    btnReturnDashboard: 'العودة إلى لوحة تحكم الطالب',
    studentDashboardTitle: 'لوحة تحكم الطالب',
    studentDashboardSubtitle: 'إدارة بلاغاتك النشطة، ومتابعة المطابقات المقترحة، والتحقق من طلبات الاستلام',
    adminDashboardTitle: 'مركز الإدارة والإشراف الجامعي',
    adminDashboardSubtitle: 'إدارة طابور المراجعة بنظام FIFO وتدقيق طلبات الاستلام ومراجعة سجلات الأمان وإعدادات السحابة'
  }
};

let currentLang = 'en';

function getLang() {
  return currentLang;
}

function setLang(lang) {
  if (lang !== 'en' && lang !== 'ar') return;
  currentLang = lang;
  localStorage.setItem('foundit_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  window.dispatchEvent(new CustomEvent('foundit_lang_changed', { detail: { lang } }));
}

function t(key) {
  return I18N[currentLang][key] || I18N['en'][key] || key;
}

// Auto init from stored preference
(function initLang() {
  const saved = localStorage.getItem('foundit_lang');
  if (saved === 'ar' || saved === 'en') {
    currentLang = saved;
  }
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
})();

window.FOUNDIT_I18N = {
  t,
  getLang,
  setLang,
  I18N
};
