/**
 * FoundIt - University Lost & Found System
 * Campus Taxonomy, Seed Data & Constants
 */

const CAMPUS_ZONES = [
  { id: 'MAIN_LIBRARY', name: 'Main Campus Library', ar: 'المكتبة المركزية', building: 'Bldg A', coords: 'Floor 1-3' },
  { id: 'ENGINEERING_HALL', name: 'Engineering Hall', ar: 'مبنى الهندسة', building: 'Bldg E', coords: 'Rooms 101-305' },
  { id: 'SCIENCE_LECTURE_HALLS', name: 'Science & Medical Lecture Halls', ar: 'مدرجات العلوم والطب', building: 'Bldg S', coords: 'Hall A & B' },
  { id: 'STUDENT_CENTER', name: 'Student Union & Cafeteria', ar: 'مجمع اتحاد الطلاب والمطعم', building: 'Bldg U', coords: 'Ground Level' },
  { id: 'CAMPUS_GYMNASIUM', name: 'Campus Gymnasium & Sports Arena', ar: 'الصالة الرياضية والملاعب', building: 'Sports Complex', coords: 'West Wing' },
  { id: 'MATHEMATICS_LABS', name: 'Mathematics & Computer Labs', ar: 'معامل الحاسب والرياضيات', building: 'Bldg M', coords: 'Lab 3B & 4A' },
  { id: 'DESIGN_STUDIOS', name: 'Design Studios & Architecture', ar: 'استوديوهات العمارة والتصميم', building: 'Bldg D', coords: 'Studio 101' },
  { id: 'BUS_TERMINAL', name: 'East Campus Bus & Transit Hub', ar: 'محطة حافلات الحرم الجامعي', building: 'Transit Zone', coords: 'Gate 4' },
  { id: 'OTHER_ZONE', name: 'Other Outdoor Campus Area', ar: 'المساحات الخارجية والممرات', building: 'Campus Grounds', coords: 'Central Quad' }
];

const ITEM_CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Gadgets', ar: 'الإلكترونيات والأجهزة', icon: 'laptop', color: 'blue' },
  { id: 'ids', name: 'Student Cards & IDs', ar: 'البطاقات الجامعية والهويات', icon: 'credit-card', color: 'indigo' },
  { id: 'books', name: 'Books, Notes & Binders', ar: 'الكتب والدفاتر والمذكرات', icon: 'book-open', color: 'emerald' },
  { id: 'keys', name: 'Keys & Campus Lanyards', ar: 'المفاتيح وأشرطة التعليق', icon: 'key', color: 'amber' },
  { id: 'bottles', name: 'Water Bottles & Mugs', ar: 'قوارير المياه والأكواب', icon: 'cup-soda', color: 'teal' },
  { id: 'bags', name: 'Backpacks & Sleeves', ar: 'حقائب الظهر وأغلفة الحواسيب', icon: 'backpack', color: 'sky' },
  { id: 'eyewear', name: 'Eyewear & Glasses', ar: 'النظارات والعدسات', icon: 'glasses', color: 'purple' },
  { id: 'accessories', name: 'Clothing & Accessories', ar: 'الملابس والإكسسوارات', icon: 'watch', color: 'rose' }
];

const SAFE_HANDOVER_POINTS = [
  { name: 'Campus Security Central Desk', ar: 'مكتب الأمن الجامعي الرئيسي', location: 'Administration Bldg, Gate 1', phone: 'Ext. 4001', hours: '24/7' },
  { name: 'Student Union Help Desk', ar: 'مكتب خدمات اتحاد الطلاب', location: 'Student Union Bldg, 1st Floor', phone: 'Ext. 4220', hours: '8:00 AM - 6:00 PM' },
  { name: 'Main Library Circulation Desk', ar: 'مكتب استعارة المكتبة المركزية', location: 'Library Ground Floor', phone: 'Ext. 3105', hours: '7:30 AM - 10:00 PM' },
  { name: 'Engineering Dean Office Concierge', ar: 'استقبال كلية الهندسة', location: 'Engineering Hall, Lobby', phone: 'Ext. 5110', hours: '8:00 AM - 4:30 PM' }
];

// 10 realistic university records as requested
const SEED_REPORTS = [
  {
    id: 'RPT-2026-001',
    type: 'found',
    title: 'Blue University Student ID Card (Sarah Jenkins)',
    category: 'ids',
    description: 'Found an official student ID card belonging to Sarah Jenkins (Faculty of Engineering, Department of Computer Science). Found left behind on a study desk on the 2nd floor.',
    date: '2026-10-22',
    zone: 'MAIN_LIBRARY',
    locationDetail: '2nd Floor Quiet Study Area, Desk #42',
    keywords: 'student id card engineering sarah jenkins card blue',
    status: 'open',
    reporterRef: 'staff_lib_02',
    reporterName: 'Library Staff (Front Desk)',
    contactMethod: 'library_desk',
    image: 'https://images.unsplash.com/photo-1578852612716-854e527abf2e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-22T09:15:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-002',
    type: 'lost',
    title: 'Sony WH-1000XM4 Black Wireless Headphones',
    category: 'electronics',
    description: 'Left my matte black Sony noise-canceling headphones in Room 204 after the Computer Architecture midterm review lecture. They were in a dark gray zip case.',
    date: '2026-10-22',
    zone: 'ENGINEERING_HALL',
    locationDetail: 'Lecture Room 204, Second row from back',
    keywords: 'sony headphones black over-ear bluetooth wireless case audio',
    status: 'open',
    reporterRef: 'student_eng_902',
    reporterName: 'Student (Eng. Senior)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-22T13:40:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-003',
    type: 'found',
    title: 'Matte Black Sony Over-Ear Noise-Canceling Headphones',
    category: 'electronics',
    description: 'Found a premium pair of black Sony wireless headphones sitting on a lecture chair. Turned them over to the department receptionist for safekeeping.',
    date: '2026-10-23',
    zone: 'ENGINEERING_HALL',
    locationDetail: 'Room 204 hallway bench right outside the lecture hall',
    keywords: 'sony headphones black audio wireless over-ear',
    status: 'open',
    reporterRef: 'student_ta_104',
    reporterName: 'Teaching Assistant (ECE)',
    contactMethod: 'dept_office',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-23T08:30:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-004',
    type: 'lost',
    title: 'Advanced Calculus MTH201 Spiral Notebook',
    category: 'books',
    description: 'Navy blue 5-subject Five Star spiral notebook filled with handwritten multivariable calculus lecture notes and problem set assignments for Dr. Henderson’s class.',
    date: '2026-10-20',
    zone: 'SCIENCE_LECTURE_HALLS',
    locationDetail: 'Science Hall B, Left aisle seat near podium',
    keywords: 'notebook calculus math blue spiral notes mth201 henderson',
    status: 'open',
    reporterRef: 'student_sci_431',
    reporterName: 'Student (Math Minor)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-20T16:00:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-005',
    type: 'found',
    title: 'Set of Brass Dorm Keys with Red Campus Lanyard',
    category: 'keys',
    description: 'Three brass door keys and an RFID gate fob attached to a university crimson lanyard with a small metal carabiner and mini LED flashlight.',
    date: '2026-10-24',
    zone: 'STUDENT_CENTER',
    locationDetail: 'Dining Hall tray return conveyor belt',
    keywords: 'keys dorm lanyard brass red rfid fob dining cafeteria',
    status: 'open',
    reporterRef: 'staff_dining_05',
    reporterName: 'Dining Services Staff',
    contactMethod: 'union_desk',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-24T12:15:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-006',
    type: 'lost',
    title: 'Hydro Flask 32oz Teal Insulated Water Bottle',
    category: 'bottles',
    description: 'Teal wide-mouth Hydro Flask bottle covered in stickers: IEEE club, NASA worm logo, and a local coffee shop sticker. Slightly dented bottom rim.',
    date: '2026-10-24',
    zone: 'CAMPUS_GYMNASIUM',
    locationDetail: 'Main basketball court bleachers, 3rd row',
    keywords: 'hydro flask teal water bottle hydroflask gym stickers sports',
    status: 'open',
    reporterRef: 'student_ath_778',
    reporterName: 'Student (Athletics)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-24T14:50:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-007',
    type: 'lost',
    title: 'TI-84 Plus CE Graphing Calculator (Rose Gold)',
    category: 'electronics',
    description: 'Rose Gold Texas Instruments TI-84 Plus CE graphing calculator with a transparent protective slide cover. Has student initials "E.K." etched with permanent marker on rear battery bay.',
    date: '2026-10-21',
    zone: 'MATHEMATICS_LABS',
    locationDetail: 'Lab 3B, Computer Station #18',
    keywords: 'calculator ti84 ti-84 graphing texas instruments rose gold math lab',
    status: 'open',
    reporterRef: 'student_mat_520',
    reporterName: 'Student (Statistics)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-21T11:00:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-008',
    type: 'lost',
    title: 'North Face Borealis Navy Backpack with 15" Laptop',
    category: 'bags',
    description: 'Deep navy North Face backpack containing a silver 15-inch laptop, engineering drafting pens, and a spiral notebook. Accidental swap or left on bench.',
    date: '2026-10-23',
    zone: 'BUS_TERMINAL',
    locationDetail: 'Sheltered bus stop bench next to Route 4 express shelter',
    keywords: 'backpack north face navy bag laptop bus terminal transit',
    status: 'under_review',
    reporterRef: 'student_eng_611',
    reporterName: 'Student (Civil Eng.)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-23T18:20:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-009',
    type: 'found',
    title: 'Apple AirPods Pro (2nd Gen) with White Case',
    category: 'electronics',
    description: 'Pair of AirPods Pro inside a white charging case with a green silicone sleeve and a metal keychain clip. Found on table near espresso counter.',
    date: '2026-10-24',
    zone: 'STUDENT_CENTER',
    locationDetail: 'Student Union Cafeteria, Coffee Corner lounge table',
    keywords: 'airpods apple earbuds wireless case white silicone cafeteria',
    status: 'under_review',
    reporterRef: 'student_bus_319',
    reporterName: 'Student (Business)',
    contactMethod: 'safe_relay',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-24T17:05:00Z',
    isSample: true
  },
  {
    id: 'RPT-2026-010',
    type: 'found',
    title: 'Silver 67W USB-C Power Adapter for MacBook',
    category: 'electronics',
    description: 'Original Apple 67W USB-C wall charger with 2-meter braided white cable plugged into the power strip beneath desk 14.',
    date: '2026-10-23',
    zone: 'DESIGN_STUDIOS',
    locationDetail: 'Architecture Studio 101, Drafting Desk 14',
    keywords: 'charger macbook apple usb-c cable adapter design studio',
    status: 'matched',
    reporterRef: 'student_arch_804',
    reporterName: 'Student (Architecture)',
    contactMethod: 'dept_office',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-23T20:10:00Z',
    isSample: true
  }
];

window.FOUNDIT_DATA = {
  CAMPUS_ZONES,
  ITEM_CATEGORIES,
  SAFE_HANDOVER_POINTS,
  SEED_REPORTS
};
