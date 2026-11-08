import {
  CareerArchetype,
  EncounterType,
  LifeEra,
  ReadingObject,
  ReadingResponse,
  RoutineItem,
  SynastryItem,
  ZodiacSignId,
  ZodiacSignMetadata,
} from '../types/zodiac';

export const ZODIAC_SIGNS: ZodiacSignMetadata[] = [
  {
    id: 'aries',
    name: 'Aries',
    indonesianName: 'Aries • Sang Pelopor',
    glyph: '♈',
    symbolLatin: 'The Ram',
    dateRange: '21 Mar – 19 Apr',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    houseNumber: 'House I',
    harmonicHz: 144.72,
    chordNotes: [144.72, 217.08, 289.44, 361.8],
    auraTagline: 'Solar Ignition & Unfiltered Velocity',
    accentHex: '#E85D4A',
    secondaryHex: '#F4A261',
    badgeClass: 'text-orange-300 border-orange-400/30 bg-orange-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-6',
    editorialQuote: 'Keberanian bukan ketiadaan ragu, melainkan keputusan untuk bergerak sebelum keraguan membeku.',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    indonesianName: 'Taurus • Sang Penjaga Bumi',
    glyph: '♉',
    symbolLatin: 'The Bull',
    dateRange: '20 Apr – 20 May',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    houseNumber: 'House II',
    harmonicHz: 221.23,
    chordNotes: [110.62, 165.92, 221.23, 276.54],
    auraTagline: 'Velvet Resonance & Material Gravitas',
    accentHex: '#68B684',
    secondaryHex: '#DFC082',
    badgeClass: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Kemewahan sejati lahir dari ritme yang tenang dan konsistensi yang tak tergoyahkan.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    indonesianName: 'Gemini • Sang Kurator Ide',
    glyph: '♊',
    symbolLatin: 'The Twins',
    dateRange: '21 May – 20 Jun',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    houseNumber: 'House III',
    harmonicHz: 141.27,
    chordNotes: [141.27, 211.9, 282.54, 353.17],
    auraTagline: 'Quicksilver Dialectic & Dual Frequency',
    accentHex: '#72DDF7',
    secondaryHex: '#DFC082',
    badgeClass: 'text-sky-300 border-sky-400/30 bg-sky-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Satu percakapan yang tepat di pagi hari mampu mengubah arah seluruh minggu Anda.',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    indonesianName: 'Cancer • Sang Penjaga Pasang',
    glyph: '♋',
    symbolLatin: 'The Crab',
    dateRange: '21 Jun – 22 Jul',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    houseNumber: 'House IV',
    harmonicHz: 210.42,
    chordNotes: [105.21, 157.82, 210.42, 315.63],
    auraTagline: 'Lunar Tide & Intuitive Sanctuary',
    accentHex: '#8E9AAF',
    secondaryHex: '#CBC0D3',
    badgeClass: 'text-indigo-200 border-indigo-300/30 bg-indigo-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-4',
    editorialQuote: 'Intuisi Anda membaca ruangan jauh sebelum kata pertama diucapkan.',
  },
  {
    id: 'leo',
    name: 'Leo',
    indonesianName: 'Leo • Sang Sovereign Surya',
    glyph: '♌',
    symbolLatin: 'The Lion',
    dateRange: '23 Jul – 22 Aug',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    houseNumber: 'House V',
    harmonicHz: 126.22,
    chordNotes: [126.22, 189.33, 252.44, 315.55],
    auraTagline: 'Heliocentric Gold & Magnetic Presence',
    accentHex: '#F3B659',
    secondaryHex: '#E85D4A',
    badgeClass: 'text-amber-300 border-amber-400/30 bg-amber-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-4',
    editorialQuote: 'Bersinarlah tanpa meminta izin; hangatnya visi Anda adalah kompas bagi tim Anda.',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    indonesianName: 'Virgo • Sang Arsitek Presisi',
    glyph: '♍',
    symbolLatin: 'The Maiden',
    dateRange: '23 Aug – 22 Sep',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    houseNumber: 'House VI',
    harmonicHz: 141.27,
    chordNotes: [141.27, 176.59, 211.9, 282.54],
    auraTagline: 'Botanical Clarity & Sacred Order',
    accentHex: '#95B89C',
    secondaryHex: '#DFC082',
    badgeClass: 'text-teal-200 border-teal-400/30 bg-teal-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-4',
    editorialQuote: 'Keindahan tersembunyi di balik detail kecil yang dirawat dengan kesadaran penuh.',
  },
  {
    id: 'libra',
    name: 'Libra',
    indonesianName: 'Libra • Sang Diplomat Estetika',
    glyph: '♎',
    symbolLatin: 'The Scales',
    dateRange: '23 Sep – 22 Oct',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    houseNumber: 'House VII',
    harmonicHz: 221.23,
    chordNotes: [221.23, 276.54, 331.85, 442.46],
    auraTagline: 'Rose Quartz Symmetry & Social Poise',
    accentHex: '#E5989B',
    secondaryHex: '#B5838D',
    badgeClass: 'text-rose-200 border-rose-400/30 bg-rose-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-5',
    editorialQuote: 'Harmoni sejati bukan berarti menghindari keputusan, melainkan memilih dengan elegan.',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    indonesianName: 'Scorpio • Sang Alkemis Bayangan',
    glyph: '♏',
    symbolLatin: 'The Scorpion',
    dateRange: '23 Oct – 21 Nov',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto & Mars',
    houseNumber: 'House VIII',
    harmonicHz: 140.25,
    chordNotes: [140.25, 168.3, 210.38, 280.5],
    auraTagline: 'Obsidian Depth & Transformative Alchemy',
    accentHex: '#C94A6A',
    secondaryHex: '#7A2848',
    badgeClass: 'text-pink-300 border-pink-400/30 bg-pink-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-7',
    editorialQuote: 'Ketika Anda melepaskan apa yang tak lagi esensial, fokus Anda menjadi tak tertandingi.',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    indonesianName: 'Sagittarius • Sang Penjelajah Cakrawala',
    glyph: '♐',
    symbolLatin: 'The Archer',
    dateRange: '22 Nov – 21 Dec',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    houseNumber: 'House IX',
    harmonicHz: 183.58,
    chordNotes: [183.58, 229.48, 275.37, 367.16],
    auraTagline: 'Celestial Horizon & Expansive Philosophy',
    accentHex: '#E07A5F',
    secondaryHex: '#F2CC8F',
    badgeClass: 'text-orange-200 border-orange-400/30 bg-orange-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Anak panah yang melesat jauh selalu ditarik mundur dengan ketenangan penuh.',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    indonesianName: 'Capricorn • Sang Maestro Waktu',
    glyph: '♑',
    symbolLatin: 'The Sea-Goat',
    dateRange: '22 Dec – 19 Jan',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    houseNumber: 'House X',
    harmonicHz: 147.85,
    chordNotes: [147.85, 184.81, 221.78, 295.7],
    auraTagline: 'Monolithic Discipline & Legacy Architecture',
    accentHex: '#C8A45D',
    secondaryHex: '#8D99AE',
    badgeClass: 'text-stone-200 border-stone-400/30 bg-stone-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Reputasi dibangun dari janji-janji kecil yang Anda tepati kepada diri sendiri setiap pagi.',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    indonesianName: 'Aquarius • Sang Visioner Kosmik',
    glyph: '♒',
    symbolLatin: 'The Water Bearer',
    dateRange: '20 Jan – 18 Feb',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus & Saturn',
    houseNumber: 'House XI',
    harmonicHz: 207.36,
    chordNotes: [207.36, 259.2, 311.04, 414.72],
    auraTagline: 'Electric Aether & Radical Futurism',
    accentHex: '#64DFDF',
    secondaryHex: '#7400B8',
    badgeClass: 'text-cyan-200 border-cyan-400/30 bg-cyan-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Masa depan selalu terlihat ganjil bagi mereka yang masih terpaku pada pola kemarin.',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    indonesianName: 'Pisces • Sang Penyair Astral',
    glyph: '♓',
    symbolLatin: 'The Fishes',
    dateRange: '19 Feb – 20 Mar',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune & Jupiter',
    houseNumber: 'House XII',
    harmonicHz: 211.44,
    chordNotes: [105.72, 158.58, 211.44, 317.16],
    auraTagline: 'Dreamweaver Mist & Oceanic Empathy',
    accentHex: '#A992FA',
    secondaryHex: '#64DFDF',
    badgeClass: 'text-violet-200 border-violet-400/30 bg-violet-500/10',
    gridSpanClass: 'md:col-span-6 lg:col-span-3',
    editorialQuote: 'Imajinasi yang diberi struktur akan berubah menjadi karya yang menggerakkan banyak hati.',
  },
];

export const SIGN_MAP: Record<ZodiacSignId, ZodiacSignMetadata> = Object.fromEntries(
  ZODIAC_SIGNS.map((s) => [s.id, s])
) as Record<ZodiacSignId, ZodiacSignMetadata>;

export const LIFE_ERAS: { id: LifeEra; label: string; subtitle: string; ageHint: string }[] = [
  { id: 'explorer', label: 'Explorer', subtitle: 'Menjelajah & Mencari Jati Diri', ageHint: '20s • Discovery' },
  { id: 'builder', label: 'Builder', subtitle: 'Membangun Fondasi & Karier', ageHint: '30s • Momentum' },
  { id: 'executive', label: 'Executive', subtitle: 'Memimpin & Tanggung Jawab Besar', ageHint: '40s–50s • Mastery' },
  { id: 'sage', label: 'Sage', subtitle: 'Kebijaksanaan & Warisan Makna', ageHint: '60+ • Legacy' },
];

export const CAREER_ARCHETYPES: { id: CareerArchetype; label: string; subtitle: string }[] = [
  { id: 'professional', label: 'Professional', subtitle: 'Spesialis & Eksekutif Organisasi' },
  { id: 'leader', label: 'Leader', subtitle: 'Nakhoda Tim & Pengambil Keputusan' },
  { id: 'independent', label: 'Independent', subtitle: 'Wirausaha, Kreator & Mandiri' },
  { id: 'public', label: 'Public', subtitle: 'Figur Publik & Pelayan Komunitas' },
];

export const ENCOUNTER_TYPES: {
  id: EncounterType;
  label: string;
  indonesianLabel: string;
  tagline: string;
}[] = [
  { id: 'family', label: 'Family', indonesianLabel: 'Keluarga', tagline: 'Ikatan rumah & lintas generasi' },
  { id: 'couple', label: 'Couple', indonesianLabel: 'Pasangan', tagline: 'Romansa, keintiman & afeksi' },
  { id: 'friends', label: 'Friends', indonesianLabel: 'Sahabat', tagline: 'Lingkar sosial & dukungan' },
  { id: 'colleagues', label: 'Colleagues', indonesianLabel: 'Rekan Kerja', tagline: 'Kolaborasi & ritme tim' },
  { id: 'boss', label: 'Boss', indonesianLabel: 'Atasan', tagline: 'Otoritas, ekspektasi & negosiasi' },
  { id: 'subordinates', label: 'Subordinates', indonesianLabel: 'Tim / Bawahan', tagline: 'Delegasi, empati & arahan' },
  { id: 'clients', label: 'Clients', indonesianLabel: 'Klien / Mitra', tagline: 'Kepercayaan & nilai komersial' },
];

const COLOR_HEX_DICTIONARY: Record<string, string> = {
  'merah marun': '#800020',
  'merah': '#D64045',
  'merah bata': '#B84A39',
  'merah delima': '#9B111E',
  'crimson': '#DC143C',
  'biru': '#3B82F6',
  'biru dongker': '#1E3A8A',
  'biru laut': '#0284C7',
  'biru langit': '#38BDF8',
  'biru elektrik': '#2563EB',
  'biru safir': '#0F52BA',
  'hijau': '#22C55E',
  'hijau zamrud': '#10B981',
  'hijau botol': '#065F46',
  'hijau sage': '#84A98C',
  'hijau zaitun': '#65A30D',
  'emerald': '#10B981',
  'kuning': '#EAB308',
  'kuning kunyit': '#D97706',
  'kuning gading': '#FEF08A',
  'emas': '#DFC082',
  'gold': '#DFC082',
  'perak': '#CBD5E1',
  'silver': '#CBD5E1',
  'ungu': '#9333EA',
  'ungu lembayung': '#A855F7',
  'ungu tua': '#581C87',
  'lavender': '#C084FC',
  'oranye': '#F97316',
  'terakota': '#E07A5F',
  'tembaga': '#B87333',
  'cokelat': '#78350F',
  'cokelat kopi': '#451A03',
  'hitam': '#1E293B',
  'hitam obsidian': '#0F172A',
  'abu-abu': '#64748B',
  'putih': '#F8FAFC',
  'putih mutiara': '#F1F5F9',
  'merah muda': '#EC4899',
  'rose gold': '#E5989B',
  'toska': '#14B8A6',
  'pirus': '#06B6D4',
};

export function resolveLuckyColorHex(colorName: string, fallbackHex = '#DFC082'): string {
  if (!colorName) return fallbackHex;
  const normalized = colorName.toLowerCase().trim();
  if (COLOR_HEX_DICTIONARY[normalized]) return COLOR_HEX_DICTIONARY[normalized];
  for (const [key, hex] of Object.entries(COLOR_HEX_DICTIONARY)) {
    if (normalized.includes(key)) return hex;
  }
  return fallbackHex;
}

export function extractEditorialHeadline(text: string, signName: string): string {
  if (!text) return `${signName}: Momentum Kosmik & Kejelasan Strategis`;
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || text;
  if (firstSentence.length <= 92) return firstSentence;
  return firstSentence.slice(0, 88).trim() + '…';
}

export function formatDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatInputDate(dateParam: string): string {
  if (!/^\d{8}$/.test(dateParam)) return '2026-11-09';
  return `${dateParam.slice(0, 4)}-${dateParam.slice(4, 6)}-${dateParam.slice(6, 8)}`;
}

export function inputDateToParam(inputDate: string): string {
  const cleaned = inputDate.replace(/-/g, '');
  if (/^\d{8}$/.test(cleaned)) return cleaned;
  return formatDateParam(new Date());
}

export function formatReadableDate(dateParam: string): string {
  if (!/^\d{8}$/.test(dateParam)) return dateParam;
  const y = Number(dateParam.slice(0, 4));
  const m = Number(dateParam.slice(4, 6)) - 1;
  const d = Number(dateParam.slice(6, 8));
  const dateObj = new Date(Date.UTC(y, m, d));
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatWibTime(unixSeconds: number): string {
  // Convert unix seconds to WIB (UTC+7) HH:MM
  const wibMillis = (unixSeconds + 7 * 3600) * 1000;
  const d = new Date(wibMillis);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const FALLBACK_COLORS = [
  'Merah Marun',
  'Hijau Zamrud',
  'Biru Safir',
  'Emas Surya',
  'Ungu Lembayung',
  'Terakota Hangat',
  'Biru Dongker',
  'Hijau Sage',
  'Putih Mutiara',
  'Tembaga Klasik',
  'Pirus Astral',
  'Rose Gold',
];

const CURATED_READINGS: Record<ZodiacSignId, Omit<ReadingObject, 'sign'>> = {
  aries: {
    general: 'Transit Mars memberi dorongan keberanian ekstra pagi ini untuk menyelesaikan satu keputusan yang sempat tertunda. Jangan biarkan distraksi kecil mengaburkan prioritas utama yang sudah Anda susun sejak awal pekan.',
    career: 'Inisiatif cepat Anda menjadi pembeda di ruang diskusi. Sampaikan proposal secara lugas dengan angka konkret sebelum pukul 11.00 WIB.',
    economy: 'Arus kas bergerak stabil, namun tahan godaan membeli perangkat atau langganan baru secara impulsif sore nanti.',
    family: 'Percakapan singkat di meja makan membawa kelegaan jika Anda memilih mendengarkan lebih dulu tanpa langsung memberi solusi.',
  },
  taurus: {
    general: 'Venus menenangkan ritme batin Anda dan membuka ruang bagi produktivitas yang matang. Fokus pada kualitas eksekusi hari ini akan memberi hasil berlipat dibanding terburu-buru.',
    career: 'Ketenangan Anda saat menghadapi revisi mendadak meningkatkan kepercayaan pimpinan maupun mitra strategis.',
    economy: 'Waktu yang tepat untuk meninjau ulang alokasi tabungan jangka menengah atau menegosiasikan nilai kontrak.',
    family: 'Kehangatan suasana rumah tumbuh lewat perhatian sederhana seperti menyiapkan hidangan favorit bersama.',
  },
  gemini: {
    general: 'Merkurius mempertajam intuisi verbal Anda; ide yang muncul sepintas di pagi hari layak dicatat sebelum hilang. Pilih dua agenda terpenting agar energi Anda tidak terpecah.',
    career: 'Kolaborasi lintas divisi berjalan cair berkat kemampuan Anda menjembatani dua sudut pandang yang berbeda.',
    economy: 'Peluang pemasukan tambahan muncul dari jejaring lama yang kembali menghubungi Anda siang ini.',
    family: 'Saudara atau kerabat dekat membutuhkan saran ringan yang jujur namun tetap disampaikan dengan humor hangat.',
  },
  cancer: {
    general: 'Fase Bulan menguatkan kepekaan Anda terhadap atmosfer sekitar. Jadikan batas waktu istirahat sebagai prioritas agar kejernihan emosional tetap terjaga sepanjang hari.',
    career: 'Empati Anda membantu meredakan ketegangan tim dan membuka jalan keluar yang adil bagi semua pihak.',
    economy: 'Evaluasi pengeluaran rumah tangga minggu ini; ada pos langganan yang bisa dipangkas dengan rapi.',
    family: 'Momen nostalgia bersama keluarga di malam hari menghadirkan rasa aman dan energi baru.',
  },
  leo: {
    general: 'Pancaran energi Matahari menempatkan Anda di pusat perhatian secara alami hari ini. Gunakan karisma tersebut untuk mengangkat kontribusi orang-orang di sekitar Anda.',
    career: 'Presentasi atau negosiasi penting mendapat respons positif ketika Anda memadukan visi besar dengan langkah realistis.',
    economy: 'Investasi pada peningkatan keahlian atau penampilan profesional memberi dampak jangka panjang yang solid.',
    family: 'Apresiasi tulus yang Anda ucapkan kepada pasangan atau orang tua mencairkan suasana yang sempat kaku.',
  },
  virgo: {
    general: 'Ketelitian Anda menemukan celah krusial yang terlewat oleh orang lain. Setelah menyempurnakan sistem kerja pagi ini, beri ruang bagi pikiran untuk rileks di sore hari.',
    career: 'Dokumen atau perencanaan strategis yang Anda rapikan hari ini menjadi acuan penting bagi tim.',
    economy: 'Disiplin anggaran Anda mulai menunjukkan hasil nyata; pertahankan ritme ini hingga akhir bulan.',
    family: 'Bantuan praktis yang Anda berikan di rumah jauh lebih bermakna daripada janji panjang.',
  },
  libra: {
    general: 'Keseimbangan antara ambisi pribadi dan diplomasi sosial mencapai titik harmonis hari ini. Jangan ragu mengambil sikap tegas ketika nilai utama Anda diuji.',
    career: 'Kemampuan mediasi Anda mempercepat kesepakatan yang sebelumnya berjalan alot.',
    economy: 'Pertimbangkan nilai fungsi jangka panjang sebelum menyetujui pengeluaran berbasis estetika semata.',
    family: 'Suasana rumah terasa lebih sejuk saat Anda menghadirkan percakapan terbuka tanpa menghakimi.',
  },
  scorpio: {
    general: 'Fokus magnetis Anda sedang berada di puncak; satu pekerjaan berat dapat tuntas lebih cepat jika Anda menutup ruang interupsi selama dua jam penuh pagi ini.',
    career: 'Strategi di balik layar yang Anda matangkan mulai memperlihatkan keunggulan kompetitif yang nyata.',
    economy: 'Periksa kembali detail klausul pembayaran atau bagi hasil sebelum menandatangani komitmen baru.',
    family: 'Kejujuran emosional yang disampaikan dengan nada lembut memperdalam rasa saling percaya di rumah.',
  },
  sagittarius: {
    general: 'Optimisme Jupiter membuka perspektif segar atas tantangan yang kemarin terasa buntu. Langkah berani mencoba pendekatan baru akan disambut antusias.',
    career: 'Gagasan ekspansi atau proyek lintas bidang mendapat dukungan dari sosok yang berpengalaman.',
    economy: 'Sisihkan ruang dana untuk pengembangan wawasan, namun tetap patuhi batas anggaran mingguan.',
    family: 'Rencana aktivitas akhir pekan bersama keluarga membangkitkan semangat seluruh isi rumah.',
  },
  capricorn: {
    general: 'Struktur yang Anda bangun dengan sabar kini menjadi pijakan kuat untuk melangkah lebih tinggi. Delegasikan tugas teknis agar Anda dapat fokus pada keputusan bernilai tinggi.',
    career: 'Otoritas profesional Anda diakui lewat konsistensi hasil, bukan sekadar retorika.',
    economy: 'Perencanaan aset jangka panjang berada di jalur sehat; hindari spekulasi berisiko tinggi hari ini.',
    family: 'Luangkan waktu tiga puluh menit tanpa gawai di malam hari untuk hadir sepenuhnya bagi keluarga.',
  },
  aquarius: {
    general: 'Terobosan orisinal muncul saat Anda berani mempertanyakan prosedur lama yang sudah tidak efisien. Bagikan visi Anda dengan bahasa yang mudah dipahami rekan sekitar.',
    career: 'Solusi inovatif yang Anda tawarkan memangkas waktu kerja tim secara signifikan.',
    economy: 'Peluang finansial berbasis teknologi atau kolaborasi komunitas patut dipelajari lebih dalam.',
    family: 'Menghargai ruang mandiri masing-masing anggota keluarga justru membuat komunikasi terasa lebih hangat.',
  },
  pisces: {
    general: 'Kepekaan artistik dan intuisi Neptunus berpadu dengan ketenangan batin hari ini. Tuangkan inspirasi Anda ke dalam bentuk nyata sebelum jam makan siang.',
    career: 'Sentuhan kreatif dan pendekatan humanis Anda memenangkan hati klien maupun kolega.',
    economy: 'Pastikan setiap komitmen finansial tercatat tertulis agar tidak terjadi salah paham di kemudian hari.',
    family: 'Kehadiran Anda yang penuh perhatian menjadi tempat pulang yang menenangkan bagi orang terdekat.',
  },
};

export function buildFallbackReading(
  sign: ZodiacSignId,
  era: LifeEra,
  career: CareerArchetype,
  dateParam: string
): ReadingResponse {
  const seed = hashSeed(`${sign}-${era}-${career}-${dateParam}`);
  const y = Number(dateParam.slice(0, 4)) || 2026;
  const m = (Number(dateParam.slice(4, 6)) || 11) - 1;
  const d = Number(dateParam.slice(6, 8)) || 9;
  const midnightWibUnix = Math.floor(Date.UTC(y, m, d) / 1000) - 7 * 3600;

  const baseReading = CURATED_READINGS[sign];
  const color = FALLBACK_COLORS[seed % FALLBACK_COLORS.length];

  const mood = {
    sex: 6 + (seed % 5),
    hustle: 6 + ((seed >> 3) % 5),
    vibe: 7 + ((seed >> 6) % 4),
    success: 6 + ((seed >> 9) % 5),
  };

  const routineBlocks: { fromH: number; fromM: number; toH: number; toM: number; title: string; description: string }[] = [
    {
      fromH: 0,
      fromM: 0,
      toH: 6,
      toM: 0,
      title: 'Restorasi Astral & Tidur Dalam',
      description: 'Biarkan gelombang bawah sadar memproses residu emosi kemarin tanpa gangguan layar di dekat tempat tidur.',
    },
    {
      fromH: 6,
      fromM: 0,
      toH: 7,
      toM: 30,
      title: 'Penyelarasan Pagi & Hidrasi Sadar',
      description: 'Awali pagi dengan cahaya matahari alami dan tarik napas dalam sebelum membuka pesan atau notifikasi kerja.',
    },
    {
      fromH: 7,
      fromM: 30,
      toH: 9,
      toM: 30,
      title: 'Perencanaan Strategis & Prioritas',
      description: 'Tentukan tiga target utama hari ini selaras dengan transit planet penguasa zodiak Anda.',
    },
    {
      fromH: 9,
      fromM: 30,
      toH: 12,
      toM: 15,
      title: 'Blok Fokus Tinggi & Eksekusi Inti',
      description: 'Momentum kognitif berada di titik tertinggi untuk menuntaskan pekerjaan bernilai strategis atau negosiasi penting.',
    },
    {
      fromH: 12,
      fromM: 15,
      toH: 13,
      toM: 30,
      title: 'Jeda Nutrisi & Reset Energi Siang',
      description: 'Makan siang dengan tenang dan beri jeda sejenak dari layar agar fokus sore hari tetap tajam.',
    },
    {
      fromH: 13,
      fromM: 30,
      toH: 17,
      toM: 0,
      title: 'Sinergi Sosial & Kolaborasi Tim',
      description: 'Waktu ideal untuk rapat penyelarasan, presentasi klien, dan menindaklanjuti koneksi profesional.',
    },
    {
      fromH: 17,
      fromM: 0,
      toH: 19,
      toM: 30,
      title: 'Dekonstruksi Beban & Transisi Senja',
      description: 'Tutup daftar pekerjaan dengan rapi dan lakukan gerakan ringan atau jalan sore untuk melepas ketegangan bahu.',
    },
    {
      fromH: 19,
      fromM: 30,
      toH: 22,
      toM: 0,
      title: 'Keintiman Keluarga & Koneksi Hangat',
      description: 'Hadirkan perhatian utuh bagi pasangan, keluarga, atau sahabat lewat obrolan berkualitas.',
    },
    {
      fromH: 22,
      fromM: 0,
      toH: 23,
      toM: 45,
      title: 'Jurnal Refleksi & Hening Malam',
      description: 'Catat satu hal yang patut disyukuri hari ini sebelum memasuki siklus istirahat malam.',
    },
  ];

  const routine: RoutineItem[] = routineBlocks.map((b) => ({
    from: midnightWibUnix + b.fromH * 3600 + b.fromM * 60,
    to: midnightWibUnix + b.toH * 3600 + b.toM * 60,
    title: b.title,
    description: b.description,
  }));

  const synastries: SynastryItem[] = ZODIAC_SIGNS.map((partner, idx) => {
    const pairSeed = hashSeed(`${sign}-${partner.id}-${dateParam}`);
    const encounters = ENCOUNTER_TYPES.map((enc, encIdx) => {
      const rating = 5 + ((pairSeed + encIdx * 7 + idx) % 6); // 5..10
      const descriptions: Record<EncounterType, string> = {
        family: `Dinamika keluarga dengan ${partner.name} menuntut komunikasi yang hangat; hindari mengungkit hal lama dan fokus pada solusi praktis di rumah.`,
        couple: `Resonansi romantis bersama ${partner.name} terasa magnetis hari ini. Ungkapkan apresiasi spesifik untuk mempererat keintiman emosional.`,
        friends: `Pertemuan dengan sahabat ${partner.name} memantik ide segar dan tawa lepas yang memulihkan energi sosial Anda.`,
        colleagues: `Kolaborasi kerja dengan rekan ${partner.name} berjalan efektif bila pembagian peran disepakati secara tertulis sejak pagi.`,
        boss: `Atasan berzodiak ${partner.name} menghargai ringkasan padat berbasis data; bawa dua opsi solusi saat melaporkan perkembangan.`,
        subordinates: `Anggota tim ${partner.name} merespons arahan dengan antusias saat Anda memberi konteks tujuan besar tanpa mikromanajemen.`,
        clients: `Klien ${partner.name} tertarik pada kepastian jadwal dan nilai tambah jangka panjang; tekankan kredibilitas dan ketepatan waktu.`,
      };
      return {
        type: enc.id,
        rating,
        description: descriptions[enc.id],
      };
    });

    const partnerRoutine: RoutineItem[] = [
      {
        from: midnightWibUnix + 8 * 3600,
        to: midnightWibUnix + 9 * 3600 + 30 * 60,
        title: `Kopi Pagi & Penyelarasan Visi (${SIGN_MAP[sign].name} × ${partner.name})`,
        description: `Diskusikan rencana harian secara santai selama 20 menit untuk menyamakan ekspektasi tanpa terburu-buru.`,
      },
      {
        from: midnightWibUnix + 13 * 3600,
        to: midnightWibUnix + 15 * 3600,
        title: 'Sesi Kolaborasi & Eksekusi Bersama',
        description: `Padukan kekuatan elemen ${SIGN_MAP[sign].element} dan ${partner.element} untuk menyelesaikan satu agenda krusial berdua.`,
      },
      {
        from: midnightWibUnix + 19 * 3600 + 30 * 60,
        to: midnightWibUnix + 21 * 3600 + 30 * 60,
        title: 'Makan Malam & Percakapan Tanpa Gawai',
        description: `Waktu terbaik bagi ${SIGN_MAP[sign].name} dan ${partner.name} untuk berbagi cerita personal dan merayakan capaian kecil hari ini.`,
      },
    ];

    return {
      sign: partner.id,
      encounters,
      routine: partnerRoutine,
    };
  });

  return {
    slug: `${sign}-${era}-${career}-${dateParam}`,
    lucky_color: color,
    reading: {
      sign,
      ...baseReading,
    },
    mood,
    routine,
    synastries,
    _source: 'editorial-preview',
  };
}

export function buildFallbackGeneralReadings(dateParam: string): ReadingObject[] {
  return ZODIAC_SIGNS.map((s) => ({
    sign: s.id,
    ...CURATED_READINGS[s.id],
  }));
}
