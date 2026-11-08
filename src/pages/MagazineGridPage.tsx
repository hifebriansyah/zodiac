import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  Compass,
  Filter,
  Flame,
  RefreshCw,
  Share2,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { CelestialCanvas } from '../components/CelestialCanvas';
import { MagazineCard } from '../components/MagazineCard';
import {
  CAREER_ARCHETYPES,
  extractEditorialHeadline,
  formatInputDate,
  formatReadableDate,
  formatWibTime,
  inputDateToParam,
  LIFE_ERAS,
  resolveLuckyColorHex,
  SIGN_MAP,
  ZODIAC_SIGNS,
} from '../data/zodiacMeta';
import {
  CareerArchetype,
  LifeEra,
  ReadingResponse,
  ZodiacElement,
  ZodiacSignId,
} from '../types/zodiac';

export interface MagazineGridPageProps {
  dateParam: string;
  onChangeDateParam: (d: string) => void;
  era: LifeEra;
  onChangeEra: (e: LifeEra) => void;
  career: CareerArchetype;
  onChangeCareer: (c: CareerArchetype) => void;
  readingsBySign: Record<ZodiacSignId, ReadingResponse>;
  isLoadingApi: boolean;
  apiSource: 'live' | 'cached' | 'editorial-preview';
  onRefreshApi: () => void;
  playingSign: ZodiacSignId | null;
  onToggleAudio: (signId: ZodiacSignId, readingData: ReadingResponse) => void;
  onOpenShare: (signId: ZodiacSignId, readingData: ReadingResponse) => void;
  onHoverSign: (signId: ZodiacSignId) => void;
}

export const MagazineGridPage: React.FC<MagazineGridPageProps> = ({
  dateParam,
  onChangeDateParam,
  era,
  onChangeEra,
  career,
  onChangeCareer,
  readingsBySign,
  isLoadingApi,
  apiSource,
  onRefreshApi,
  playingSign,
  onToggleAudio,
  onOpenShare,
  onHoverSign,
}) => {
  const [elementFilter, setElementFilter] = useState<ZodiacElement | 'All'>('All');
  const [sortBy, setSortBy] = useState<'zodiac' | 'vibe' | 'hustle'>('zodiac');
  const [featuredSign, setFeaturedSign] = useState<ZodiacSignId>('scorpio');

  const readableDate = formatReadableDate(dateParam);

  const filteredSigns = useMemo(() => {
    const list = ZODIAC_SIGNS.filter((s) =>
      elementFilter === 'All' ? true : s.element === elementFilter
    );

    if (sortBy === 'vibe') {
      return [...list].sort((a, b) => {
        const ra = readingsBySign[a.id]?.mood;
        const rb = readingsBySign[b.id]?.mood;
        const avgA = ra ? (ra.vibe + ra.hustle + ra.success + ra.sex) / 4 : 0;
        const avgB = rb ? (rb.vibe + rb.hustle + rb.success + rb.sex) / 4 : 0;
        return avgB - avgA;
      });
    }

    if (sortBy === 'hustle') {
      return [...list].sort(
        (a, b) =>
          (readingsBySign[b.id]?.mood.hustle || 0) -
          (readingsBySign[a.id]?.mood.hustle || 0)
      );
    }

    return list;
  }, [elementFilter, sortBy, readingsBySign]);

  const leadMeta = SIGN_MAP[featuredSign];
  const leadData = readingsBySign[featuredSign];
  const leadHeadline = extractEditorialHeadline(leadData.reading.general, leadMeta.name);
  const leadColorHex = resolveLuckyColorHex(leadData.lucky_color, leadMeta.accentHex);

  return (
    <div className="space-y-10 pb-20">
      {/* Editorial Issue Masthead */}
      <header className="relative overflow-hidden rounded-3xl border border-parchment-100/15 bg-gradient-to-b from-cosmos-900/90 via-cosmos-950/95 to-cosmos-950 p-6 sm:p-10">
        {/* Top Issue Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-100/10 pb-4 font-mono text-xs text-parchment-300/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-gold-300">
              <Sparkles className="h-3.5 w-3.5" />
              EDISI HARIAN • VOL. XI
            </span>
            <span>•</span>
            <span>{readableDate}</span>
            <span>•</span>
            <span className="hidden sm:inline">WIB (UTC+7)</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${
                apiSource === 'live'
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                  : apiSource === 'cached'
                  ? 'border-sky-400/40 bg-sky-500/15 text-sky-300'
                  : 'border-gold-400/35 bg-gold-500/10 text-gold-300'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {apiSource === 'live'
                ? 'Live API • zodiac-worker.situs.id'
                : apiSource === 'cached'
                ? 'Offline Cache Ready'
                : 'Synced Almanac • zodiac-worker.situs.id'}
            </span>

            <button
              type="button"
              onClick={onRefreshApi}
              disabled={isLoadingApi}
              className="inline-flex items-center gap-1.5 rounded-full border border-parchment-100/15 bg-cosmos-900 px-3 py-1 text-[11px] text-parchment-200 transition hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingApi ? 'animate-spin text-gold-400' : ''}`} />
              <span>{isLoadingApi ? 'Menyelaraskan…' : 'Segarkan API'}</span>
            </button>
          </div>
        </div>

        {/* Masthead Title & Lead Spread */}
        <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-300">
              THE CELESTIAL EDITORIAL ALMANAC
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-parchment-50 sm:text-6xl">
              Kosmologi Harian dalam Tata Letak Majalah Modern.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-parchment-200/80">
              Pindai headline utama, metrik keberuntungan, jadwal kosmik bergaya kalender, radar sinastri 12×7 hubungan, serta frekuensi audio aura harian yang dipersonalisasi sesuai fase hidup dan arketipe karier Anda.
            </p>

            {/* Personalization Controls: Date, Life Era, Career Archetype */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Date Picker */}
              <label className="block rounded-2xl border border-parchment-100/12 bg-cosmos-950/75 p-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  <Calendar className="h-3 w-3" />
                  Tanggal Bacaan
                </span>
                <input
                  type="date"
                  value={formatInputDate(dateParam)}
                  onChange={(e) => onChangeDateParam(inputDateToParam(e.target.value))}
                  className="mt-1.5 w-full bg-transparent font-mono text-sm text-parchment-50 focus:outline-none"
                />
              </label>

              {/* Life Era Selector */}
              <label className="block rounded-2xl border border-parchment-100/12 bg-cosmos-950/75 p-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  <Compass className="h-3 w-3" />
                  Fase Hidup (Era)
                </span>
                <select
                  value={era}
                  onChange={(e) => onChangeEra(e.target.value as LifeEra)}
                  className="mt-1.5 w-full bg-cosmos-950 font-sans text-sm font-medium text-parchment-50 focus:outline-none"
                >
                  {LIFE_ERAS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} — {item.ageHint}
                    </option>
                  ))}
                </select>
              </label>

              {/* Career Archetype Selector */}
              <label className="block rounded-2xl border border-parchment-100/12 bg-cosmos-950/75 p-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  <Flame className="h-3 w-3" />
                  Arketipe Karier
                </span>
                <select
                  value={career}
                  onChange={(e) => onChangeCareer(e.target.value as CareerArchetype)}
                  className="mt-1.5 w-full bg-cosmos-950 font-sans text-sm font-medium text-parchment-50 focus:outline-none"
                >
                  {CAREER_ARCHETYPES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} — {item.subtitle}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Right Column: Interactive Three.js Medallion & Featured Sign Spotlight */}
          <div className="relative rounded-3xl border border-gold-400/25 bg-cosmos-950/80 p-5 sm:p-6 lg:col-span-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold-300">
                ✦ Sorotan Utama Hari Ini
              </span>
              <div className="flex items-center gap-1">
                {(['scorpio', 'leo', 'aries', 'aquarius'] as ZodiacSignId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setFeaturedSign(id);
                      onHoverSign(id);
                    }}
                    className={`rounded-lg px-2 py-0.5 font-mono text-xs transition ${
                      featuredSign === id
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-400/40'
                        : 'text-parchment-300/60 hover:text-parchment-100'
                    }`}
                  >
                    {SIGN_MAP[id].glyph} {SIGN_MAP[id].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Three.js 3D Astrolabe Medallion */}
            <div className="relative my-2 h-48 w-full">
              <CelestialCanvas
                activeSign={featuredSign}
                vibeScore={leadData.mood.vibe}
                mode="medallion"
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  className="text-4xl drop-shadow-lg"
                  style={{ color: leadMeta.accentHex }}
                >
                  {leadMeta.glyph}
                </span>
                <span className="mt-1 font-serif text-2xl font-semibold text-parchment-50">
                  {leadMeta.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  {leadMeta.element} • {leadMeta.harmonicHz} Hz
                </span>
              </div>
            </div>

            <p className="font-serif text-lg italic leading-snug text-parchment-100">
              “{leadHeadline}”
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-100/10 pt-3.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-white/30"
                  style={{ backgroundColor: leadColorHex }}
                />
                <span className="font-mono text-xs text-parchment-200">
                  Hoki: <strong>{leadData.lucky_color}</strong>
                </span>
                <span className="text-parchment-300/30">•</span>
                <span className="font-mono text-xs text-gold-300">
                  Vibe {leadData.mood.vibe}/10
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleAudio(featuredSign, leadData)}
                  className="inline-flex items-center gap-1 rounded-full border border-parchment-100/15 bg-cosmos-900 px-3 py-1 font-mono text-xs text-parchment-200 hover:border-gold-400/40"
                >
                  <Volume2 className="h-3.5 w-3.5 text-gold-400" />
                  <span>Aura</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenShare(featuredSign, leadData)}
                  className="inline-flex items-center gap-1 rounded-full border border-parchment-100/15 bg-cosmos-900 px-3 py-1 font-mono text-xs text-parchment-200 hover:border-gold-400/40"
                >
                  <Share2 className="h-3.5 w-3.5 text-gold-400" />
                  <span>Story</span>
                </button>
                <Link
                  to={`/sign/${featuredSign}`}
                  className="inline-flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1 font-mono text-xs font-semibold text-cosmos-950 hover:bg-gold-300"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter & Sort Editorial Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-b border-parchment-100/10 pb-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-parchment-300/70">
            <Filter className="h-3.5 w-3.5 text-gold-400" />
            Elemen:
          </span>
          {(['All', 'Fire', 'Earth', 'Air', 'Water'] as const).map((el) => (
            <button
              key={el}
              type="button"
              onClick={() => setElementFilter(el)}
              className={`rounded-full border px-3.5 py-1 font-mono text-xs transition ${
                elementFilter === el
                  ? 'border-gold-400 bg-gold-500/20 font-medium text-gold-300'
                  : 'border-parchment-100/10 bg-cosmos-900/60 text-parchment-300/75 hover:border-gold-400/35 hover:text-parchment-100'
              }`}
            >
              {el === 'All' ? 'Semua (12 Zodiak)' : el}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-parchment-300/65">
            Urutkan:
          </span>
          {(
            [
              { id: 'zodiac', label: 'Urutan Zodiak' },
              { id: 'vibe', label: 'Vibe Tertinggi' },
              { id: 'hustle', label: 'Hustle Tertinggi' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id)}
              className={`rounded-xl border px-3 py-1 font-mono text-xs transition ${
                sortBy === s.id
                  ? 'border-gold-400/45 bg-gold-500/15 text-gold-300'
                  : 'border-parchment-100/10 bg-cosmos-900/50 text-parchment-300/70 hover:text-parchment-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Masonry Magazine Grid for all 12 Zodiac Signs */}
      <section aria-label="Editorial Magazine Grid">
        <div className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
          {filteredSigns.map((sign, index) => {
            const signReading = readingsBySign[sign.id];
            return (
              <div key={sign.id} className="break-inside-avoid">
                <MagazineCard
                  signId={sign.id}
                  readingData={signReading}
                  issueNumber={index + 1}
                  isFeatured={sign.id === featuredSign}
                  isPlayingAudio={playingSign === sign.id}
                  onToggleAudio={onToggleAudio}
                  onOpenShare={onOpenShare}
                  onHoverSign={onHoverSign}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
