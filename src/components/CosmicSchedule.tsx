import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  CalendarPlus,
  Clock,
  Coffee,
  Compass,
  HeartHandshake,
  MoonStar,
  Sparkles,
  Sun,
  Sunset,
  Users,
} from 'lucide-react';
import { formatWibTime, SIGN_MAP } from '../data/zodiacMeta';
import { RoutineItem, ZodiacSignId } from '../types/zodiac';

export interface CosmicScheduleProps {
  signId: ZodiacSignId;
  dateLabel: string;
  routine: RoutineItem[];
  partnerSignId?: ZodiacSignId | null;
  partnerRoutine?: RoutineItem[];
}

type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';

interface ClassifiedBlock extends RoutineItem {
  startStr: string;
  endStr: string;
  startHour: number;
  durationMinutes: number;
  durationLabel: string;
  category: string;
  astroContext: string;
  accentColor: string;
  badgeBg: string;
  isJoint?: boolean;
}

function classifyRoutineBlock(item: RoutineItem, signId: ZodiacSignId, isJoint = false): ClassifiedBlock {
  const meta = SIGN_MAP[signId];
  const startStr = formatWibTime(item.from);
  const endStr = formatWibTime(item.to);
  const startHour = Number(startStr.slice(0, 2));
  const durationMinutes = Math.max(15, Math.round((item.to - item.from) / 60));
  const hrs = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationLabel = hrs > 0 ? `${hrs}j ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;

  const lower = `${item.title} ${item.description}`.toLowerCase();

  if (isJoint) {
    return {
      ...item,
      startStr,
      endStr,
      startHour,
      durationMinutes,
      durationLabel,
      category: 'Synastry Alignment',
      astroContext: 'Harmoni Transit Berpasangan',
      accentColor: '#E5989B',
      badgeBg: 'border-rose-400/35 bg-rose-500/15 text-rose-200',
      isJoint: true,
    };
  }

  if (startHour < 6 || lower.includes('tidur') || lower.includes('restorasi') || lower.includes('malam')) {
    return {
      ...item,
      startStr,
      endStr,
      startHour,
      durationMinutes,
      durationLabel,
      category: 'Restorasi & Bawah Sadar',
      astroContext: 'Fase Lunar & Pemulihan Ritme Sirkadian',
      accentColor: '#8E9AAF',
      badgeBg: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-200',
    };
  }

  if (lower.includes('fokus') || lower.includes('strategi') || lower.includes('eksekusi') || lower.includes('kerja')) {
    return {
      ...item,
      startStr,
      endStr,
      startHour,
      durationMinutes,
      durationLabel,
      category: 'Deep Work & Eksekusi',
      astroContext: `Puncak Transit ${meta.rulingPlanet} • Fokus Kognitif`,
      accentColor: meta.accentHex,
      badgeBg: 'border-amber-400/35 bg-amber-500/15 text-amber-200',
    };
  }

  if (lower.includes('sosial') || lower.includes('kolaborasi') || lower.includes('keluarga') || lower.includes('koneksi')) {
    return {
      ...item,
      startStr,
      endStr,
      startHour,
      durationMinutes,
      durationLabel,
      category: 'Koneksi & Diplomasi',
      astroContext: `Harmoni Elemen ${meta.element} • Resonansi Interpersonal`,
      accentColor: '#68B684',
      badgeBg: 'border-emerald-400/35 bg-emerald-500/15 text-emerald-200',
    };
  }

  return {
    ...item,
    startStr,
    endStr,
    startHour,
    durationMinutes,
    durationLabel,
    category: 'Mindfulness & Penyelarasan',
    astroContext: `Kalibrasi Energi ${meta.name} (${meta.harmonicHz} Hz)`,
    accentColor: '#72DDF7',
    badgeBg: 'border-sky-400/35 bg-sky-500/15 text-sky-200',
  };
}

export const CosmicSchedule: React.FC<CosmicScheduleProps> = ({
  signId,
  dateLabel,
  routine,
  partnerSignId,
  partnerRoutine,
}) => {
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [showJointOverlay, setShowJointOverlay] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const meta = SIGN_MAP[signId];
  const partnerMeta = partnerSignId ? SIGN_MAP[partnerSignId] : null;

  // Current WIB hour for live Google Calendar indicator line
  const currentWibHour = useMemo(() => {
    const nowUtcSec = Math.floor(Date.now() / 1000);
    const wibDate = new Date((nowUtcSec + 7 * 3600) * 1000);
    return wibDate.getUTCHours() + wibDate.getUTCMinutes() / 60;
  }, []);

  const blocks = useMemo(() => {
    const base = routine.map((r) => classifyRoutineBlock(r, signId, false));
    if (showJointOverlay && partnerRoutine && partnerRoutine.length > 0) {
      const joint = partnerRoutine.map((r) => classifyRoutineBlock(r, signId, true));
      return [...base, ...joint].sort((a, b) => a.from - b.from);
    }
    return base;
  }, [routine, signId, showJointOverlay, partnerRoutine]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      if (filter === 'morning') return b.startHour >= 0 && b.startHour < 12;
      if (filter === 'afternoon') return b.startHour >= 12 && b.startHour < 18;
      if (filter === 'evening') return b.startHour >= 18 && b.startHour <= 24;
      return true;
    });
  }, [blocks, filter]);

  const handleExportIcs = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ASTRAEA//Cosmic Schedule//ID',
      'CALSCALE:GREGORIAN',
    ];

    const toIcsDate = (unixSec: number) => {
      const d = new Date(unixSec * 1000);
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    routine.forEach((item, idx) => {
      lines.push(
        'BEGIN:VEVENT',
        `UID:astraea-${signId}-${item.from}-${idx}@situs.id`,
        `DTSTAMP:${toIcsDate(Math.floor(Date.now() / 1000))}`,
        `DTSTART:${toIcsDate(item.from)}`,
        `DTEND:${toIcsDate(item.to)}`,
        `SUMMARY:[${meta.glyph} ${meta.name}] ${item.title}`,
        `DESCRIPTION:${item.description.replace(/\n/g, ' ')}`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astraea-cosmic-schedule-${signId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="editorial-card rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-parchment-100/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-0.5 font-mono text-[11px] uppercase tracking-widest text-gold-300">
              <Clock className="h-3.5 w-3.5" />
              The Cosmic Schedule
            </span>
            <span className="font-mono text-xs text-parchment-300/65">WIB (UTC+7) • {dateLabel}</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-parchment-50 sm:text-4xl">
            Linimasa Kosmik Harian {meta.name}
          </h2>
          <p className="mt-1 text-sm text-parchment-200/75">
            Blok waktu kronologis pengganti paragraf statis—dirancang selaras dengan pergerakan planet penguasa{' '}
            <span className="text-gold-300">{meta.rulingPlanet}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {partnerMeta && partnerRoutine && partnerRoutine.length > 0 && (
            <button
              type="button"
              onClick={() => setShowJointOverlay((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition ${
                showJointOverlay
                  ? 'border-rose-400/50 bg-rose-500/20 text-rose-200'
                  : 'border-parchment-100/15 bg-cosmos-950/70 text-parchment-200 hover:border-rose-400/40'
              }`}
            >
              <HeartHandshake className="h-4 w-4 text-rose-300" />
              <span>
                {showJointOverlay
                  ? `Sembunyikan Jadwal × ${partnerMeta.name}`
                  : `Tampilkan Jadwal Bersama ${partnerMeta.glyph} ${partnerMeta.name}`}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportIcs}
            className="inline-flex items-center gap-2 rounded-xl border border-gold-400/35 bg-gold-500/10 px-3.5 py-2 font-mono text-xs font-medium text-gold-300 transition hover:bg-gold-500/20"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Ekspor ke Google / Apple Calendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* Time-of-Day Filter Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-parchment-100/10 bg-cosmos-950/70 p-1.5">
          {(
            [
              { id: 'all', label: '24 Jam Penuh', icon: Compass },
              { id: 'morning', label: 'Pagi (00:00–12:00)', icon: Sun },
              { id: 'afternoon', label: 'Siang–Sore (12:00–18:00)', icon: Coffee },
              { id: 'evening', label: 'Malam (18:00–24:00)', icon: MoonStar },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs transition ${
                  filter === tab.id
                    ? 'bg-gold-500/20 font-medium text-gold-300 border border-gold-400/30'
                    : 'text-parchment-300/70 hover:text-parchment-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-parchment-300/65">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            WIB Saat Ini: {String(Math.floor(currentWibHour)).padStart(2, '0')}:
            {String(Math.round((currentWibHour % 1) * 60)).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Google Calendar-Style Vertical Timeline Grid */}
      <div className="relative mt-6 space-y-3">
        {filteredBlocks.map((block, idx) => {
          const endHour = Number(block.endStr.slice(0, 2)) + Number(block.endStr.slice(3, 5)) / 60;
          const startHourDec = Number(block.startStr.slice(0, 2)) + Number(block.startStr.slice(3, 5)) / 60;
          const isCurrentNow = currentWibHour >= startHourDec && currentWibHour < endHour;
          const isExpanded = selectedIndex === idx;

          return (
            <div
              key={`${block.from}-${block.title}-${idx}`}
              onClick={() => setSelectedIndex(isExpanded ? null : idx)}
              className={`group relative grid cursor-pointer grid-cols-1 gap-3 rounded-2xl border p-4 transition duration-300 sm:grid-cols-12 sm:gap-5 sm:p-5 ${
                isCurrentNow
                  ? 'border-gold-400/55 bg-gradient-to-r from-gold-500/15 via-cosmos-900/90 to-cosmos-900/90 shadow-lg'
                  : block.isJoint
                  ? 'border-rose-400/35 bg-rose-950/20 hover:border-rose-400/60'
                  : 'border-parchment-100/10 bg-cosmos-950/55 hover:border-gold-400/35 hover:bg-cosmos-900/75'
              }`}
            >
              {/* Left Accent Bar (Google Calendar event stripe) */}
              <div
                className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full"
                style={{ backgroundColor: block.accentColor }}
              />

              {/* Column 1: Time Ruler & Duration */}
              <div className="flex items-center justify-between sm:col-span-3 sm:flex-col sm:items-start sm:justify-center sm:border-r sm:border-parchment-100/10 sm:pr-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-semibold tracking-tight text-parchment-50 sm:text-lg">
                      {block.startStr} – {block.endStr}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-parchment-300/60">
                    Durasi {block.durationLabel}
                  </span>
                </div>

                {isCurrentNow && (
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Sedang Berlangsung
                  </span>
                )}
              </div>

              {/* Column 2: Activity Focus & Astrological Context */}
              <div className="sm:col-span-9">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${block.badgeBg}`}
                    >
                      {block.isJoint ? (
                        <Users className="h-3 w-3" />
                      ) : block.category.includes('Deep') ? (
                        <Briefcase className="h-3 w-3" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {block.category}
                    </span>

                    <span className="font-mono text-[11px] text-parchment-300/65">
                      {block.astroContext}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-widest text-parchment-300/45 group-hover:text-gold-300">
                    {isExpanded ? 'Tutup Detail' : ' Fokus Aktivitas'}
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-xl font-semibold text-parchment-50 sm:text-2xl">
                  {block.title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-parchment-200/85">
                  {block.description}
                </p>

                {isExpanded && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-3 rounded-xl border border-parchment-100/10 bg-cosmos-950/75 px-3.5 py-2.5 font-mono text-xs text-parchment-200/80">
                    <span>
                      • Transit Planet: <strong className="text-gold-300">{meta.rulingPlanet}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Frekuensi Harmonik: <strong className="text-gold-300">{meta.harmonicHz} Hz</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Elemen: <strong className="text-gold-300">{meta.element}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
