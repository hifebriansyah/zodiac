import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarClock,
  Flame,
  Radio,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  extractEditorialHeadline,
  formatWibTime,
  resolveLuckyColorHex,
  SIGN_MAP,
} from '../data/zodiacMeta';
import { ReadingResponse, ZodiacSignId } from '../types/zodiac';

export interface MagazineCardProps {
  signId: ZodiacSignId;
  readingData: ReadingResponse;
  issueNumber: number;
  isFeatured?: boolean;
  isPlayingAudio?: boolean;
  onToggleAudio?: (signId: ZodiacSignId, readingData: ReadingResponse) => void;
  onOpenShare?: (signId: ZodiacSignId, readingData: ReadingResponse) => void;
  onHoverSign?: (signId: ZodiacSignId) => void;
}

type PillarKey = 'general' | 'career' | 'economy' | 'family';

const PILLAR_LABELS: { key: PillarKey; label: string }[] = [
  { key: 'general', label: 'Umum' },
  { key: 'career', label: 'Karier' },
  { key: 'economy', label: 'Ekonomi' },
  { key: 'family', label: 'Keluarga' },
];

export const MagazineCard: React.FC<MagazineCardProps> = ({
  signId,
  readingData,
  issueNumber,
  isFeatured = false,
  isPlayingAudio = false,
  onToggleAudio,
  onOpenShare,
  onHoverSign,
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('general');
  const meta = SIGN_MAP[signId];
  const { mood, lucky_color, reading, routine, synastries } = readingData;

  const headline = extractEditorialHeadline(reading.general, meta.name);
  const colorHex = resolveLuckyColorHex(lucky_color, meta.accentHex);

  const avgScore = Math.round(((mood.vibe + mood.hustle + mood.success + mood.sex) / 4) * 10) / 10;

  // Find a daytime power block from routine
  const powerBlock =
    routine.find((r) => {
      const h = Number(formatWibTime(r.from).slice(0, 2));
      return h >= 8 && h <= 14;
    }) || routine[0];

  // Find highest average synastry partner
  const bestMatch = React.useMemo(() => {
    if (!synastries || !synastries.length) return 'libra' as ZodiacSignId;
    let topSign: ZodiacSignId = synastries[0].sign;
    let topAvg = -1;
    for (const syn of synastries) {
      const sum = syn.encounters.reduce((acc, e) => acc + e.rating, 0);
      const avg = sum / Math.max(1, syn.encounters.length);
      if (avg > topAvg) {
        topAvg = avg;
        topSign = syn.sign;
      }
    }
    return topSign;
  }, [synastries]);

  const bestMatchMeta = SIGN_MAP[bestMatch] || SIGN_MAP.libra;

  return (
    <article
      onMouseEnter={() => onHoverSign?.(signId)}
      className={`editorial-card editorial-card-hover group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 ${
        isFeatured ? 'ring-1 ring-gold-400/35' : ''
      }`}
    >
      {/* Subtle Top Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-35"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${meta.accentHex}, transparent 72%)`,
        }}
      />

      <div>
        {/* Editorial Meta Header */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-parchment-100/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-parchment-300/70">
              No. {String(issueNumber).padStart(2, '0')}
            </span>
            <span className="text-parchment-300/30">•</span>
            <span
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${meta.badgeClass}`}
            >
              {meta.element}
            </span>
            <span className="hidden font-mono text-[11px] text-parchment-300/60 sm:inline">
              {meta.rulingPlanet}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleAudio?.(signId, readingData)}
              title={isPlayingAudio ? 'Hentikan Audio Aura' : `Putar Audio Aura ${meta.name} (${meta.harmonicHz} Hz)`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition ${
                isPlayingAudio
                  ? 'border-gold-400 bg-gold-500/20 text-gold-300'
                  : 'border-parchment-100/15 bg-cosmos-900/70 text-parchment-200/80 hover:border-gold-400/40 hover:text-parchment-50'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>{meta.harmonicHz}Hz</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenShare?.(signId, readingData)}
              title="Bagikan Story Card"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-parchment-100/15 bg-cosmos-900/70 text-parchment-200/80 transition hover:border-gold-400/40 hover:text-gold-300"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Sign Identity & Vibe Score Medallion */}
        <div className="relative z-10 mt-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-parchment-100/15 text-2xl shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${meta.accentHex}28, rgba(12, 14, 23, 0.9))`,
                color: meta.accentHex,
              }}
            >
              {meta.glyph}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <Link
                  to={`/sign/${signId}`}
                  className="font-serif text-2xl font-semibold tracking-tight text-parchment-50 transition group-hover:text-gold-300 sm:text-3xl"
                >
                  {meta.name}
                </Link>
                <span className="font-serif text-sm italic text-parchment-300/70">
                  {meta.symbolLatin}
                </span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-parchment-300/65">
                {meta.dateRange} • {meta.houseNumber}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-baseline gap-1 rounded-xl border border-gold-400/25 bg-gold-500/10 px-2.5 py-1">
              <Flame className="h-3.5 w-3.5 self-center text-gold-400" />
              <span className="font-mono text-base font-semibold text-gold-300">{avgScore}</span>
              <span className="font-mono text-[10px] text-parchment-300/60">/10</span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-parchment-300/55">
              Vibe Index
            </p>
          </div>
        </div>

        {/* Magazine Editorial Headline */}
        <div className="relative z-10 mt-5">
          <Link to={`/sign/${signId}`} className="block group/headline">
            <h3 className="font-serif text-xl font-medium leading-snug text-parchment-50 transition group-hover/headline:text-gold-300 sm:text-[22px]">
              “{headline}”
            </h3>
          </Link>
        </div>

        {/* Pillar Switcher Tabs */}
        <div className="relative z-10 mt-4 flex items-center gap-1 rounded-xl border border-parchment-100/10 bg-cosmos-950/60 p-1">
          {PILLAR_LABELS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setActivePillar(p.key)}
              className={`flex-1 rounded-lg px-2 py-1 font-mono text-[11px] transition ${
                activePillar === p.key
                  ? 'bg-parchment-100/12 font-medium text-gold-300 shadow-sm'
                  : 'text-parchment-300/65 hover:text-parchment-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reading Excerpt */}
        <p className="relative z-10 mt-3.5 text-sm leading-relaxed text-parchment-200/85">
          {reading[activePillar]}
        </p>
      </div>

      {/* Bottom Telemetry: Vibe Scores, Lucky Metrics & CTA */}
      <div className="relative z-10 mt-6 space-y-4 border-t border-parchment-100/10 pt-4">
        {/* 4 Mood Score Bars */}
        <div className="grid grid-cols-4 gap-2.5">
          {(
            [
              { label: 'Vibe', value: mood.vibe, color: meta.accentHex },
              { label: 'Hustle', value: mood.hustle, color: '#DFC082' },
              { label: 'Success', value: mood.success, color: '#68B684' },
              { label: 'Magnet', value: mood.sex, color: '#E5989B' },
            ] as const
          ).map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-parchment-100/10 bg-cosmos-950/55 px-2.5 py-2"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-parchment-300/70">
                <span>{metric.label}</span>
                <span className="font-semibold text-parchment-50">{metric.value}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-parchment-100/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, metric.value * 10)}%`,
                    backgroundColor: metric.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Lucky Metrics Row */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-parchment-100/10 bg-cosmos-900/50 p-2.5 text-xs">
          {/* Lucky Color */}
          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-white/25 shadow-sm"
              style={{ backgroundColor: colorHex }}
            />
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-widest text-parchment-300/55">
                Warna Hoki
              </p>
              <p className="truncate font-medium text-parchment-100">{lucky_color}</p>
            </div>
          </div>

          {/* Peak Time Block */}
          <div className="flex items-center gap-2 border-l border-parchment-100/10 pl-2">
            <CalendarClock className="h-3.5 w-3.5 shrink-0 text-gold-400" />
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-widest text-parchment-300/55">
                Jam Fokus
              </p>
              <p className="truncate font-mono text-[11px] text-parchment-100">
                {powerBlock ? `${formatWibTime(powerBlock.from)} WIB` : '09:30 WIB'}
              </p>
            </div>
          </div>

          {/* Best Synastry Match */}
          <div className="flex items-center gap-2 border-l border-parchment-100/10 pl-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-300" />
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-widest text-parchment-300/55">
                Sinastri Top
              </p>
              <p className="truncate font-medium text-parchment-100">
                {bestMatchMeta.glyph} {bestMatchMeta.name}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Link */}
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-parchment-300/65">
            <Radio className="h-3 w-3 text-gold-400" />
            <span>{routine.length} Blok Jadwal • 12×7 Sinastri</span>
          </span>

          <Link
            to={`/sign/${signId}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-gold-500/10 px-3.5 py-1.5 font-mono text-xs font-medium text-gold-300 transition hover:bg-gold-500/20 hover:text-parchment-50"
          >
            <span>Buka Dossier</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
