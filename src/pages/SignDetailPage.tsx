import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Coins,
  Compass,
  Flame,
  Home,
  RefreshCw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { AudioAuraPlayer } from '../components/AudioAuraPlayer';
import { CelestialCanvas } from '../components/CelestialCanvas';
import { CosmicSchedule } from '../components/CosmicSchedule';
import { SocialRadar } from '../components/SocialRadar';
import {
  CAREER_ARCHETYPES,
  extractEditorialHeadline,
  formatReadableDate,
  LIFE_ERAS,
  resolveLuckyColorHex,
  SIGN_MAP,
  ZODIAC_SIGNS,
} from '../data/zodiacMeta';
import {
  CareerArchetype,
  LifeEra,
  ReadingResponse,
  ZodiacSignId,
} from '../types/zodiac';

export interface SignDetailPageProps {
  dateParam: string;
  era: LifeEra;
  onChangeEra: (e: LifeEra) => void;
  career: CareerArchetype;
  onChangeCareer: (c: CareerArchetype) => void;
  readingsBySign: Record<ZodiacSignId, ReadingResponse>;
  onFetchSpecificSign: (signId: ZodiacSignId, bust?: boolean) => Promise<void>;
  isLoadingSign: boolean;
  onOpenShare: (signId: ZodiacSignId, readingData: ReadingResponse) => void;
  onActiveSignChange: (signId: ZodiacSignId) => void;
}

export const SignDetailPage: React.FC<SignDetailPageProps> = ({
  dateParam,
  era,
  onChangeEra,
  career,
  onChangeCareer,
  readingsBySign,
  onFetchSpecificSign,
  isLoadingSign,
  onOpenShare,
  onActiveSignChange,
}) => {
  const { signId: rawSignId } = useParams<{ signId: string }>();
  const validSignId: ZodiacSignId =
    rawSignId && rawSignId in SIGN_MAP
      ? (rawSignId as ZodiacSignId)
      : 'aries';

  const [partnerSignId, setPartnerSignId] = useState<ZodiacSignId>('libra');

  useEffect(() => {
    onActiveSignChange(validSignId);
    onFetchSpecificSign(validSignId, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [validSignId, era, career, dateParam]);

  const meta = SIGN_MAP[validSignId];
  const readingData = readingsBySign[validSignId];
  const { reading, mood, lucky_color, routine, synastries } = readingData;
  const readableDate = formatReadableDate(dateParam);
  const luckyHex = resolveLuckyColorHex(lucky_color, meta.accentHex);
  const headline = extractEditorialHeadline(reading.general, meta.name);

  const selectedPartnerSynastry = synastries.find((s) => s.sign === partnerSignId);

  return (
    <div className="space-y-10 pb-24">
      {/* Top Quick Sign Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-100/10 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-parchment-100/15 bg-cosmos-900/80 px-4 py-2 font-mono text-xs text-parchment-100 transition hover:border-gold-400/40 hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Magazine Grid</span>
        </Link>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {ZODIAC_SIGNS.map((s) => {
            const active = s.id === validSignId;
            return (
              <Link
                key={s.id}
                to={`/sign/${s.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition ${
                  active
                    ? 'border-gold-400 bg-gold-500/20 font-semibold text-gold-300'
                    : 'border-parchment-100/10 bg-cosmos-900/60 text-parchment-300/70 hover:border-gold-400/30 hover:text-parchment-100'
                }`}
              >
                <span>{s.glyph}</span>
                <span className="hidden sm:inline">{s.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hero Editorial Spread for Sign */}
      <header className="editorial-card relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: meta.accentHex }}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 8 Columns: Editorial Dossier & 4 Reading Pillars */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-parchment-300/75">
              <span
                className={`rounded-full border px-3 py-0.5 uppercase tracking-widest ${meta.badgeClass}`}
              >
                {meta.element} • {meta.modality}
              </span>
              <span>•</span>
              <span>{meta.dateRange}</span>
              <span>•</span>
              <span>Penguasa: {meta.rulingPlanet}</span>
              <span>•</span>
              <span>{readableDate}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-4">
              <h1 className="font-serif text-5xl font-semibold tracking-tight text-parchment-50 sm:text-6xl">
                {meta.glyph} {meta.name}
              </h1>
              <span className="font-serif text-2xl italic text-gold-300">
                {meta.indonesianName}
              </span>
            </div>

            <blockquote className="mt-4 border-l-2 border-gold-400/50 pl-4 font-serif text-2xl italic leading-snug text-parchment-100">
              “{headline}”
            </blockquote>

            {/* Era & Career Context Switcher */}
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-parchment-100/12 bg-cosmos-950/65 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  Era:
                </span>
                <select
                  value={era}
                  onChange={(e) => onChangeEra(e.target.value as LifeEra)}
                  className="rounded-lg border border-parchment-100/15 bg-cosmos-900 px-2.5 py-1 font-mono text-xs text-parchment-100"
                >
                  {LIFE_ERAS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} ({item.ageHint})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-300">
                  Karier:
                </span>
                <select
                  value={career}
                  onChange={(e) => onChangeCareer(e.target.value as CareerArchetype)}
                  className="rounded-lg border border-parchment-100/15 bg-cosmos-900 px-2.5 py-1 font-mono text-xs text-parchment-100"
                >
                  {CAREER_ARCHETYPES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onFetchSpecificSign(validSignId, true)}
                  disabled={isLoadingSign}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-parchment-100/15 bg-cosmos-900 px-3 py-1.5 font-mono text-xs text-parchment-200 transition hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingSign ? 'animate-spin text-gold-400' : ''}`} />
                  <span>{isLoadingSign ? 'Memuat API…' : 'Tarik Ulang API'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenShare(validSignId, readingData)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gold-400 px-3.5 py-1.5 font-mono text-xs font-semibold text-cosmos-950 transition hover:bg-gold-300"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Bagikan Story Card</span>
                </button>
              </div>
            </div>

            {/* 4 Categorized Editorial Reading Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-parchment-100/10 bg-cosmos-950/60 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold-300">
                  <Compass className="h-4 w-4" />
                  <span>Bacaan Umum (General)</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
                  {reading.general}
                </p>
              </div>

              <div className="rounded-2xl border border-parchment-100/10 bg-cosmos-950/60 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-300">
                  <Briefcase className="h-4 w-4" />
                  <span>Karier & Eksekusi ({era} • {career})</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
                  {reading.career}
                </p>
              </div>

              <div className="rounded-2xl border border-parchment-100/10 bg-cosmos-950/60 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-300">
                  <Coins className="h-4 w-4" />
                  <span>Prospek Ekonomi & Finansial</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
                  {reading.economy}
                </p>
              </div>

              <div className="rounded-2xl border border-parchment-100/10 bg-cosmos-950/60 p-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-rose-300">
                  <Home className="h-4 w-4" />
                  <span>Harmoni Keluarga & Rumah</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
                  {reading.family}
                </p>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: 3D Celestial Medallion, Lucky Color Swatch & 4 Vibe Scores */}
          <div className="flex flex-col justify-between rounded-3xl border border-parchment-100/12 bg-cosmos-950/80 p-5 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-parchment-300/70">
                <span>ASTRAEA TELEMETRY</span>
                <span>{meta.houseNumber}</span>
              </div>

              <div className="relative my-3 h-52 w-full">
                <CelestialCanvas
                  activeSign={validSignId}
                  vibeScore={mood.vibe}
                  mode="medallion"
                  className="h-full w-full"
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl" style={{ color: meta.accentHex }}>
                    {meta.glyph}
                  </span>
                </div>
              </div>

              {/* Lucky Color Card */}
              <div className="flex items-center justify-between rounded-2xl border border-parchment-100/12 bg-cosmos-900/80 p-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full border border-white/30 shadow-md"
                    style={{ backgroundColor: luckyHex }}
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-parchment-300/60">
                      Warna Keberuntungan Hari Ini
                    </p>
                    <p className="font-serif text-lg font-semibold text-parchment-50">
                      {lucky_color}
                    </p>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 text-gold-400" />
              </div>
            </div>

            {/* 4 Mood Metrics */}
            <div className="mt-5 space-y-2.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-parchment-300/65">
                Indeks Energi Harian (Mood 1–10):
              </p>
              {(
                [
                  { label: 'Vibe & Aura', val: mood.vibe, color: meta.accentHex },
                  { label: 'Hustle & Fokus', val: mood.hustle, color: '#DFC082' },
                  { label: 'Success & Peluang', val: mood.success, color: '#68B684' },
                  { label: 'Sex & Daya Tarik', val: mood.sex, color: '#E5989B' },
                ] as const
              ).map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-parchment-200">{m.label}</span>
                    <span className="font-semibold text-parchment-50">{m.val}/10</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-parchment-100/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${m.val * 10}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Feature 4: Daily "Audio Auras" */}
      <AudioAuraPlayer
        signId={validSignId}
        mood={mood}
        luckyColor={lucky_color}
        narrationText={`${meta.name}. Warna keberuntungan hari ini: ${lucky_color}. ${reading.general} Untuk karier: ${reading.career}`}
      />

      {/* Feature 2: The Cosmic Schedule (Google Calendar-style Timeline) */}
      <CosmicSchedule
        signId={validSignId}
        dateLabel={readableDate}
        routine={routine}
        partnerSignId={partnerSignId}
        partnerRoutine={selectedPartnerSynastry?.routine}
      />

      {/* Feature 3: The Social Radar (Synastry across 12 signs & 7 relationship types) */}
      <SocialRadar
        signId={validSignId}
        synastries={synastries}
        selectedPartnerSign={partnerSignId}
        onSelectPartnerSign={setPartnerSignId}
      />
    </div>
  );
};
