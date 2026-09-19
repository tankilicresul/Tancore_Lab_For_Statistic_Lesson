/**
 * Default 3D Avatar Helper for TanCoreLab
 * Provides stylized 3D student character avatars with gender-aware smart matching.
 */

export const MALE_AVATARS: string[] = [
  '/avatars/avatar-1.jpg', // Male: curly brown hair, black glasses, mustache
  '/avatars/avatar-3.jpg', // Male: short fade black hair, warm smile
  '/avatars/avatar-5.jpg', // Male: neat light brown hair, friendly smile
  '/avatars/avatar-7.jpg', // Male: messy dark wavy hair, wireframe glasses, orange tee
];

export const FEMALE_AVATARS: string[] = [
  '/avatars/avatar-2.jpg', // Female: wavy chestnut brown hair, rose-gold glasses
  '/avatars/avatar-4.jpg', // Female: sleek black hair ponytail, round glasses
  '/avatars/avatar-6.jpg', // Female: curly afro high puff bun, warm smile
  '/avatars/avatar-8.jpg', // Female: blonde bob haircut, friendly hazel eyes
];

export const DEFAULT_AVATARS: string[] = [
  ...MALE_AVATARS,
  ...FEMALE_AVATARS,
];

// Comprehensive Turkish & international female names set (normalized lowercase, no diacritics)
const FEMALE_NAMES = new Set([
  'ayse', 'ayşe', 'fatma', 'emine', 'hatice', 'zeynep', 'elif', 'merve', 'busra', 'büşra',
  'esra', 'gamze', 'kubra', 'kübra', 'seda', 'ebru', 'tugba', 'tuğba', 'hilal', 'gizem',
  'sinem', 'beyza', 'irem', 'yasemin', 'duygu', 'pelin', 'melis', 'selin', 'asli', 'aslı',
  'damla', 'dilara', 'ceren', 'ezgi', 'burcu', 'derya', 'rabia', 'cansu', 'ece', 'simge',
  'yagmur', 'yağmur', 'eylul', 'eylül', 'defne', 'azra', 'nehir', 'duru', 'leyla', 'sibel',
  'pinar', 'pınar', 'ozlem', 'özlem', 'sevil', 'sevgi', 'seyma', 'şeyma', 'gul', 'gül',
  'gulay', 'gülay', 'nergis', 'berna', 'hande', 'demet', 'hale', 'jale', 'lale', 'nil',
  'nilufer', 'nilüfer', 'aylin', 'begum', 'begüm', 'beril', 'cagla', 'çağla', 'melike',
  'zehra', 'sude', 'naz', 'nazli', 'nazlı', 'aleyna', 'sila', 'sıla', 'sule', 'şule',
  'feyza', 'humeyra', 'hümeyra', 'nida', 'rana', 'rumeysa', 'rümeysa', 'sema', 'serife',
  'şerife', 'tulay', 'tülay', 'ummu', 'ümmiye', 'vildan', 'zeliha', 'zubeyde', 'zübeyde',
  'sena', 'mine', 'selen', 'bengu', 'bengü', 'didem', 'ilknur', 'ilkay', 'songul', 'songül',
  'ayten', 'aysel', 'nur', 'betul', 'betül', 'gokce', 'gökçe', 'tugce', 'tuğçe', 'ozge',
  'özge', 'bilge', 'buse', 'eda', 'sevde', 'serra', 'iclal', 'feride', 'nurgul', 'nurgül',
  'semra', 'neslihan', 'banu', 'basak', 'başak', 'gulsah', 'gülşah', 'sumeyye', 'sümeyye',
  'arzu', 'canan', 'filiz', 'belgin', 'nermin', 'sezen', 'didem', 'gonca', 'incilay',
  'inci', 'kumru', 'melodi', 'narin', 'oya', 'su', 'sueda', 'sahika', 'şahika', 'tutku',
  'vildan', 'yonca', 'yildiz', 'yıldız', 'zerrin', 'nuray', 'nurcan', 'nurten', 'gulin',
  'gülin', 'gulten', 'gülten', 'gulsen', 'gülşen', 'aysun', 'aysen', 'ayşen', 'hazal',
  'beste', 'oyku', 'öykü', 'derin', 'masal', 'ada', 'gece', 'doga', 'doğa', 'lina', 'alara',
  'selma', 'melek', 'havva', 'meryem', 'asya', 'kader', 'hacer', 'sukran', 'şükran',
  'turkan', 'türkan', 'perihan', 'mualla', 'nebahat', 'muazzez', 'sabahat', 'nuran', 'suzan',
  // International
  'emma', 'olivia', 'sophia', 'isabella', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn',
  'abigail', 'emily', 'elizabeth', 'mila', 'ella', 'avery', 'sofia', 'camila', 'aria',
  'scarlett', 'victoria', 'madison', 'luna', 'grace', 'chloe', 'penelope', 'layla', 'riley',
  'zoey', 'nora', 'lily', 'eleanor', 'hannah', 'lillian', 'addison', 'aubrey', 'ellie',
  'stella', 'natalie', 'zoe', 'leah', 'hazel', 'violet', 'aurora', 'savannah', 'audrey',
  'brooklyn', 'bella', 'claire', 'skylar', 'lucy', 'paisley', 'everly', 'anna', 'caroline',
  'nova', 'genesis', 'emilia', 'kennedy', 'samantha', 'maya', 'willow', 'kinsley', 'naomi',
  'aaliyah', 'elena', 'sarah', 'ariana', 'allison', 'gabriella', 'alice', 'madelyn', 'cora',
  'ruby', 'eva', 'serenity', 'autumn', 'adeline', 'hailey', 'gianna', 'valentina', 'isla',
  'eliana', 'quinn', 'nevaeh', 'ivy', 'sadie', 'piper', 'lydia', 'alexa', 'josephine',
  'emery', 'julia', 'delilah', 'arianna', 'vivian', 'kaylee', 'sophie', 'brielle', 'madeline',
]);

// Comprehensive Turkish & international male names set (normalized lowercase, no diacritics)
const MALE_NAMES = new Set([
  'mehmet', 'mustafa', 'ahmet', 'ali', 'huseyin', 'hüseyin', 'hasan', 'ibrahim', 'ismail',
  'ismail', 'ismail', 'osman', 'halil', 'suleyman', 'süleyman', 'yusuf', 'omer', 'ömer',
  'ramazan', 'murat', 'mahmut', 'recep', 'fatih', 'emre', 'furkan', 'burak', 'enes',
  'resul', 'tan', 'can', 'kaan', 'berke', 'kerem', 'arda', 'emircan', 'batuhan', 'eren',
  'mert', 'onur', 'hakan', 'serkan', 'baris', 'barış', 'volkan', 'tolga', 'tayfun',
  'ugur', 'uğur', 'alper', 'bugra', 'buğra', 'oguz', 'oğuz', 'oguzhan', 'oğuzhan',
  'dogukan', 'doğukan', 'berk', 'doruk', 'ege', 'efe', 'utku', 'yigit', 'yiğit', 'umut',
  'cihan', 'cenk', 'cem', 'sinan', 'soner', 'selim', 'kadir', 'kemal', 'levent', 'metin',
  'nihat', 'orhan', 'riza', 'rıza', 'sabri', 'sadik', 'sadık', 'sahin', 'şahin', 'turgut',
  'vedat', 'yasar', 'yaşar', 'zafer', 'zeki', 'harun', 'berat', 'ensar', 'melih', 'samet',
  'tarik', 'tarık', 'yunus', 'gokhan', 'gökhan', 'alican', 'serdar', 'adem', 'bekir',
  'bilal', 'bunyamin', 'bünyamin', 'cagri', 'çağrı', 'ceyhun', 'ercan', 'erdal', 'erdogan',
  'erdoğan', 'erhan', 'erkan', 'ferhat', 'guney', 'güney', 'gurkan', 'gürkan', 'hamza',
  'huseyin', 'hüseyin', 'ihsan', 'ilker', 'irfan', 'kaan', 'koray', 'kursat', 'kürşat',
  'mahir', 'muhsin', 'muhammed', 'muhammet', 'nazim', 'nazım', 'necat', 'necati', 'okan',
  'oruc', 'oruç', 'polat', 'rahmi', 'rasim', 'ruhi', 'salih', 'sami', 'sedat', 'selcuk',
  'selçuk', 'semih', 'serhat', 'sezgin', 'suat', 'tahir', 'talha', 'taner', 'taylan',
  'tekin', 'tolgahan', 'tufan', 'tuna', 'tuncay', 'ufuk', 'ulvi', 'umit', 'ümit', 'veysel',
  'volkan', 'yasin', 'yavuz', 'yekta', 'yilmaz', 'yılmaz', 'ziya', 'aykut', 'bahadir',
  'bahadır', 'baki', 'baran', 'batu', 'bayram', 'bedirhan', 'berkay', 'boran', 'bulent',
  'bülent', 'cavit', 'celal', 'cemal', 'cengiz', 'cetin', 'çetin', 'coskun', 'coşkun',
  'cuneyt', 'cüneyt', 'davut', 'demir', 'devrim', 'dursun', 'ediz', 'ekrem', 'emin',
  'emrah', 'engin', 'enver', 'ercument', 'ercüment', 'erdem', 'ergin', 'ergün', 'ergun',
  'ertan', 'ertugrul', 'ertuğrul', 'esat', 'eyup', 'eyüp', 'faruk', 'fazil', 'fazıl',
  'feridun', 'fikret', 'fuat', 'galip', 'gani', 'giray', 'gorkem', 'görkem', 'guven',
  'güven', 'hakki', 'hakkı', 'halit', 'haluk', 'hasip', 'hayati', 'haydar', 'hayri',
  'hikmet', 'hilmi', 'hulusi', 'hurrem', 'hürrem', 'husamettin', 'hüsamettin', 'idris',
  'ilham', 'ilhami', 'ilyas', 'iskender', 'islam', 'izzet', 'kaan', 'kamil', 'kasim',
  'kasım', 'kazim', 'kazım', 'kenan', 'kerim', 'korcan', 'korkut', 'kubilay', 'kudret',
  'latif', 'lokman', 'lutfullah', 'lütfullah', 'macit', 'malkoc', 'malkoç', 'mansur',
  'mazhar', 'mecnun', 'medet', 'memduh', 'menderes', 'mercan', 'merih', 'mesut', 'mete',
  'metehan', 'mithat', 'muammer', 'mucahit', 'mücahit', 'mufit', 'müfit', 'muhittin',
  'muhtar', 'mukerrem', 'mükerrem', 'mumin', 'mümin', 'munir', 'münir', 'murathan',
  'musa', 'muslum', 'müslüm', 'muzaffer', 'naci', 'nadir', 'nail', 'namik', 'namık',
  'nasuh', 'nasuhi', 'nazif', 'nazmi', 'necip', 'nejat', 'neset', 'neşet', 'nevzat',
  'nihal', 'nizamettin', 'noh', 'nuh', 'nurettin', 'nuri', 'nusret', 'oguz', 'oğuz',
  'okay', 'oktay', 'omer', 'ömer', 'onder', 'önder', 'onuralp', 'orhan', 'osman', 'otman',
  'ozan', 'özen', 'ozcan', 'özcan', 'ozdemir', 'özdemir', 'ozden', 'özden', 'ozer', 'özer',
  'ozgur', 'özgür', 'ozkan', 'özkan', 'pasha', 'paşa', 'poyraz', 'ragip', 'ragıp', 'raif',
  'rakim', 'rakım', 'ramis', 'rasit', 'raşit', 'refik', 'remzi', 'resat', 'reşat', 'resit',
  'reşit', 'ridvan', 'rıdvan', 'rifat', 'rıfat', 'riza', 'rıza', 'rüstem', 'rustem',
  'ruzgar', 'rüzgar', 'sabahattin', 'sabri', 'sadeddin', 'sadettin', 'sadi', 'sait',
  'sakip', 'sakıp', 'salim', 'samih', 'samim', 'sancar', 'sarper', 'sarp', 'savas',
  'savaş', 'saygin', 'saygın', 'sebahattin', 'seckin', 'seçkin', 'sedat', 'sefer', 'seha',
  'selahattin', 'selami', 'selcuk', 'selçuk', 'selman', 'semer', 'sergen', 'serhan',
  'serhat', 'sertac', 'sertaç', 'server', 'servet', 'seyfi', 'seyfullah', 'seyit', 'sezai',
  'sezer', 'sidki', 'sıdkı', 'sirri', 'sırrı', 'suha', 'süha', 'sukru', 'şükrü', 'suleyman',
  'süleyman', 'tacettin', 'tahir', 'tahsin', 'talat', 'tanju', 'tankut', 'tarkan', 'taskin',
  'taşkın', 'taylan', 'tayyar', 'tekin', 'temel', 'tevfik', 'timur', 'timucin', 'timuçin',
  'togan', 'tolga', 'tonguc', 'tonguç', 'toprak', 'tufan', 'tugrul', 'tuğrul', 'tuna',
  'tunc', 'tunç', 'tuncay', 'turan', 'turgay', 'turgut', 'turhan', 'turker', 'türker',
  'tutku', 'ufuk', 'ugur', 'uğur', 'uluc', 'uluç', 'ulvi', 'umit', 'ümit', 'umran', 'ümran',
  'umut', 'unal', 'ünal', 'unsal', 'ünsal', 'uraz', 'urhan', 'utku', 'uygar', 'uzay',
  'uzeyir', 'üzeyir', 'vahap', 'vahdet', 'vahit', 'vakur', 'valit', 'varol', 'vedat',
  'vefa', 'vehbi', 'veli', 'volkan', 'vural', 'yahya', 'yakup', 'yalcin', 'yalçın',
  'yalim', 'yalım', 'yalın', 'yalin', 'yaman', 'yasar', 'yaşar', 'yasin', 'yavuz', 'yener',
  'yetkin', 'yigit', 'yiğit', 'yigitcan', 'yiğitcan', 'yilmaz', 'yılmaz', 'yucel', 'yücel',
  'yuksel', 'yüksel', 'yunus', 'yurdaer', 'yurdakul', 'yurdanur', 'yusuf', 'zafer', 'zahir',
  'zahit', 'zekai', 'zekeriya', 'zeki', 'zeynel', 'ziya', 'zulfu', 'zülfü',
  // International
  'john', 'james', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas',
  'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'donald', 'mark', 'paul',
  'steven', 'andrew', 'kenneth', 'joshua', 'george', 'kevin', 'brian', 'edward', 'ronald',
  'timothy', 'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric', 'jonathan',
  'stephen', 'larry', 'justin', 'scott', 'brandon', 'benjamin', 'samuel', 'gregory',
  'frank', 'alexander', 'raymond', 'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron',
  'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter',
  'ethan', 'jeremy', 'harold', 'keith', 'christian', 'roger', 'noah', 'gerald', 'carl',
  'terry', 'sean', 'austin', 'arthur', 'lawrence', 'jesse', 'dylan', 'bryan', 'joe',
  'jordan', 'billy', 'bruce', 'albert', 'willie', 'gabriel', 'logan', 'alan', 'juan',
  'wayne', 'elijah', 'randy', 'liam', 'vincent', 'mason', 'lucas', 'lucas', 'oliver',
]);

/**
 * Normalizes a Turkish / Latin string for reliable name matching
 */
function normalizeName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z]/g, '');
}

/**
 * Detects gender from name, email, or emoji clues.
 * Returns 'female' | 'male' | 'unknown'
 */
export function detectGender(identifier?: string | null, emoji?: string | null): 'female' | 'male' | 'unknown' {
  // Check emoji clue if explicitly female or male
  if (emoji) {
    if (/👩|👧|👱‍♀️|👵|👸|💃|🤱|👩‍🎓|👩‍🏫|👩‍⚕️|👩‍🔬|👩‍💻/.test(emoji)) {
      return 'female';
    }
    if (/👨|👦|👱‍♂️|👴|🤴|🕺|👨‍🎓|👨‍🏫|👨‍⚕️|👨‍🔬|👨‍💻/.test(emoji)) {
      return 'male';
    }
  }

  if (!identifier || typeof identifier !== 'string') return 'unknown';

  let raw = identifier.trim();

  // If email is passed (e.g. "zeynep.kaya@gmail.com" or "ahmet123@itu.edu.tr")
  if (raw.includes('@')) {
    raw = raw.split('@')[0];
  }

  // Split on spaces, dots, underscores, dashes, numbers to extract name tokens
  const tokens = raw
    .split(/[\s._\-0-9]+/)
    .map(normalizeName)
    .filter((t) => t.length >= 2);

  if (tokens.length === 0) return 'unknown';

  // Check each token (first name first)
  for (const token of tokens) {
    if (FEMALE_NAMES.has(token)) return 'female';
    if (MALE_NAMES.has(token)) return 'male';

    // Check distinctive Turkish suffixes
    if (token.endsWith('nur') || token.endsWith('gul') || token.endsWith('su') || token.endsWith('naz')) {
      return 'female';
    }
    if (token.endsWith('han') || token.endsWith('can') || token.endsWith('alp') || token.endsWith('bey')) {
      return 'male';
    }
  }

  return 'unknown';
}

/**
 * Computes a deterministic default avatar for a user based on their name/email/ID and detected gender.
 * - If detected as female -> chooses deterministically from female 3D avatars
 * - If detected as male -> chooses deterministically from male 3D avatars
 * - If unknown -> chooses deterministically from all 3D avatars
 */
export function getDefaultAvatarForUser(identifier?: string | null, emoji?: string | null): string {
  const gender = detectGender(identifier, emoji);

  const pool = gender === 'female'
    ? FEMALE_AVATARS
    : gender === 'male'
      ? MALE_AVATARS
      : DEFAULT_AVATARS;

  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return pool[0];
  }

  const str = identifier.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

/**
 * Gets effective avatar URL: user's custom avatarUrl or deterministic gender-aware default avatar
 */
export function getEffectiveAvatarUrl(avatarUrl?: string | null, identifier?: string | null, emoji?: string | null): string {
  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
    return avatarUrl;
  }
  return getDefaultAvatarForUser(identifier, emoji);
}

/**
 * Check if the given avatarUrl is one of our default preset 3D avatars
 */
export function isPresetDefaultAvatar(url?: string | null): boolean {
  if (!url) return false;
  return DEFAULT_AVATARS.includes(url) || url.startsWith('/avatars/avatar-');
}
