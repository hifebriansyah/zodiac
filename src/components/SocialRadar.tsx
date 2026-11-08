import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  Crown,
  Flame,
  Handshake,
  Heart,
  Home,
  Radar,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  ENCOUNTER_TYPES,
  formatWibTime,
  SIGN_MAP,
  ZODIAC_SIGNS,
} from '../data/zodiacMeta';
import { EncounterType, SynastryItem, ZodiacSignId } from '../types/zodiac';

export interface SocialRadarProps {
  signId: ZodiacSignId;
  synastries: SynastryItem[];
  selectedPartnerSign?: ZodiacSignId;
  onSelectPartnerSign?: (partner: ZodiacSignId) => void;
}

const ENCOUNTER_ICONS: Record<EncounterType, React.ComponentType<{ className?: string }>> = {
  family: Home,
  couple: Heart,
  friends: Users,
  colleagues: Briefcase,
  boss: Crown,
  subordinates: UserCheck,
  clients: Handshake,
};

export const SocialRadar: React.FC<SocialRadarProps> = ({
  signId,
  synastries,
  selectedPartnerSign,
  onSelectPartnerSign,
}) => {
  const [internalPartner, setInternalPartner] = useState<ZodiacSignId>('libra');
  const [selectedEncounterFilter, setSelectedEncounterFilter] = useState<EncounterType | 'all'>('all');

  const activePartnerId = selectedPartnerSign || internalPartner;
  const handlePartnerSelect = (id: ZodiacSignId) => {
    setInternalPartner(id);
    onSelectPartnerSign?.(id);
  };

  const primaryMeta = SIGN_MAP[signId];
  const partnerMeta = SIGN_MAP[activePartnerId] || SIGN_MAP.libra;

  const activeSynastry = useMemo(() => {
    return (
      synastries.find((s) => s.sign === activePartnerId) ||
      synastries[0] || {
        sign: activePartnerId,
        encounters: [],
        routine: [],
      }
    );
  }, [synastries, activePartnerId]);

  const partnerAverages = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of synastries) {
      const sum = s.encounters.reduce((acc, e) => acc + e.rating, 0);
      map[s.sign] = Math.round((sum / Math.max(1, s.encounters.length)) * 10) / 10;
    }
    return map;
  }, [synastries]);

  // Compute SVG 7-point radar polygon coordinates
  const radarPoints = useMemo(() => {
    const cx = 140;
    const cy = 140;
    const maxR = 96;
    const encounters = activeSynastry.encounters;

    return ENCOUNTER_TYPES.map((encType, idx) => {
      const angle = (idx / ENCOUNTER_TYPES.length) * Math.PI * 2 - Math.PI / 2;
      const item = encounters.find((e) => e.type === encType.id);
      const rating = item ? item.rating : 7;
      const r = (rating / 10) * maxR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const labelX = cx + Math.cos(angle) * (maxR + 26);
      const labelY = cy + Math.sin(angle) * (maxR + 26);
      const axisX = cx + Math.cos(angle) * maxR;
      const axisY = cy + Math.sin(angle) * maxR;
      return {
        id: encType.id,
        label: encType.indonesianLabel,
        rating,
        x,
        y,
        labelX,
        labelY,
        axisX,
        axisY,
      };
    });
  }, [activeSynastry]);

  const polygonString = radarPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const visibleEncounters = useMemo(() => {
    if (selectedEncounterFilter === 'all') return activeSynastry.encounters;
    return activeSynastry.encounters.filter((e) => e.type === selectedEncounterFilter);
  }, [activeSynastry, selectedEncounterFilter]);

  return (
    <section className="editorial-card rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-parchment-100/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-0.5 font-mono text-[11px] uppercase tracking-widest text-gold-300">
              <Radar className="h-3.5 w-3.5" />
              The Social Radar • Synastry 12 × 7
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-parchment-50 sm:text-4xl">
            Peta Dinamika Sosial & Sinastri
          </h2>
          <p className="mt-1 text-sm text-parchment-200/75">
            Pilih zodiak lawan bicara Anda hari ini untuk memetakan tingkat keselarasan pada{' '}
            <strong className="text-gold-300">7 tipe hubungan</strong> (Keluarga, Pasangan, Sahabat, Rekan Kerja, Atasan, Tim, & Klien).
          </p>
        </div>

        {/* Active Pairing Pill */}
        <div className="flex items-center gap-3 self-start rounded-2xl border border-gold-400/30 bg-cosmos-950/80 px-4 py-3">
          <div className="text-center">
            <span className="text-2xl" style={{ color: primaryMeta.accentHex }}>
              {primaryMeta.glyph}
            </span>
            <p className="font-mono text-[10px] uppercase text-parchment-200">{primaryMeta.name}</p>
          </div>
          <span className="font-serif text-lg italic text-gold-400">×</span>
          <div className="text-center">
            <span className="text-2xl" style={{ color: partnerMeta.accentHex }}>
              {partnerMeta.glyph}
            </span>
            <p className="font-mono text-[10px] uppercase text-parchment-200">{partnerMeta.name}</p>
          </div>
          <div className="ml-2 border-l border-parchment-100/15 pl-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
              Skor Harmoni
            </p>
            <p className="font-mono text-lg font-bold text-gold-300">
              {partnerAverages[activePartnerId] || 7.8}
              <span className="text-xs font-normal text-parchment-300/60">/10</span>
            </p>
          </div>
        </div>
      </div>

      {/* 12 Zodiac Sign Selector Bar */}
      <div className="mt-6">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-parchment-300/65">
          1. Pilih Zodiak Lawan Interaksi (12 Zodiak):
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = sign.id === activePartnerId;
            const avg = partnerAverages[sign.id] || 7.5;
            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => handlePartnerSelect(sign.id)}
                className={`group flex flex-col items-center justify-center rounded-2xl border p-2.5 transition ${
                  isSelected
                    ? 'border-gold-400 bg-gold-500/20 shadow-md'
                    : 'border-parchment-100/10 bg-cosmos-950/60 hover:border-gold-400/40 hover:bg-cosmos-900'
                }`}
              >
                <span
                  className="text-2xl transition group-hover:scale-110"
                  style={{ color: isSelected ? '#DFC082' : sign.accentHex }}
                >
                  {sign.glyph}
                </span>
                <span className="mt-1 font-sans text-xs font-medium text-parchment-100">
                  {sign.name}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-gold-300/85">
                  ★ {avg}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by 7 Relationship Types */}
      <div className="mt-6">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-parchment-300/65">
          2. Filter Konteks Hubungan (7 Tipe Encounter):
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedEncounterFilter('all')}
            className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
              selectedEncounterFilter === 'all'
                ? 'border-gold-400/50 bg-gold-500/20 text-gold-300'
                : 'border-parchment-100/10 bg-cosmos-950/60 text-parchment-300/75 hover:text-parchment-100'
            }`}
          >
            Semua (7 Konteks)
          </button>
          {ENCOUNTER_TYPES.map((enc) => {
            const Icon = ENCOUNTER_ICONS[enc.id];
            const isSelected = selectedEncounterFilter === enc.id;
            return (
              <button
                key={enc.id}
                type="button"
                onClick={() => setSelectedEncounterFilter(enc.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                  isSelected
                    ? 'border-gold-400/50 bg-gold-500/20 text-gold-300'
                    : 'border-parchment-100/10 bg-cosmos-950/60 text-parchment-300/75 hover:text-parchment-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{enc.indonesianLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Radar + 7 Encounter Cards Grid */}
      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: 7-Axis Polar Radar Visualization & Joint Routine */}
        <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-parchment-100/10 bg-cosmos-950/65 p-5 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-300">
                Geometri Sinastri 7-Sumbu
              </span>
              <span className="font-mono text-xs text-parchment-300/65">
                {primaryMeta.element} × {partnerMeta.element}
              </span>
            </div>

            {/* SVG Radar Chart */}
            <div className="my-4 flex items-center justify-center">
              <svg viewBox="0 0 280 280" className="h-64 w-64 overflow-visible">
                {/* Concentric Radar Rings */}
                {[0.25, 0.5, 0.75, 1].map((scale) => (
                  <circle
                    key={scale}
                    cx={140}
                    cy={140}
                    r={96 * scale}
                    fill="none"
                    stroke="rgba(244, 239, 228, 0.12)"
                    strokeDasharray={scale < 1 ? '3 3' : undefined}
                  />
                ))}

                {/* 7 Spokes */}
                {radarPoints.map((pt) => (
                  <line
                    key={pt.id}
                    x1={140}
                    y1={140}
                    x2={pt.axisX}
                    y2={pt.axisY}
                    stroke="rgba(244, 239, 228, 0.15)"
                    strokeWidth="1"
                  />
                ))}

                {/* Filled Harmony Polygon */}
                <polygon
                  points={polygonString}
                  fill={`${partnerMeta.accentHex}35`}
                  stroke={partnerMeta.accentHex}
                  strokeWidth="2"
                />

                {/* Vertex Dots & Labels */}
                {radarPoints.map((pt) => (
                  <g key={pt.id}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={4.5}
                      fill="#FAF7F0"
                      stroke={partnerMeta.accentHex}
                      strokeWidth="2"
                    />
                    <text
                      x={pt.labelX}
                      y={pt.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-parchment-200 font-mono text-[9px] uppercase tracking-wider"
                    >
                      {pt.label} ({pt.rating})
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Recommended Joint Routine with Partner Sign */}
          <div className="border-t border-parchment-100/10 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <h4 className="font-serif text-lg font-semibold text-parchment-50">
                Jadwal Bersama ({primaryMeta.name} × {partnerMeta.name})
              </h4>
            </div>
            <div className="mt-3 space-y-2.5">
              {activeSynastry.routine.map((block, i) => (
                <div
                  key={`${block.from}-${i}`}
                  className="rounded-xl border border-parchment-100/10 bg-cosmos-900/70 p-3"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-gold-300">
                    <span>
                      {formatWibTime(block.from)} – {formatWibTime(block.to)} WIB
                    </span>
                    <span>Sinastri Aktif</span>
                  </div>
                  <p className="mt-1 font-serif text-base font-semibold text-parchment-50">
                    {block.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-parchment-200/80">
                    {block.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: The 7 Specific Relationship Cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-7">
          {visibleEncounters.map((enc) => {
            const metaInfo = ENCOUNTER_TYPES.find((t) => t.id === enc.type) || ENCOUNTER_TYPES[0];
            const Icon = ENCOUNTER_ICONS[enc.type] || Users;
            const isHigh = enc.rating >= 8;

            return (
              <div
                key={enc.type}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                  enc.type === 'couple'
                    ? 'sm:col-span-2 border-rose-400/30 bg-gradient-to-r from-rose-950/25 to-cosmos-950/75'
                    : 'border-parchment-100/10 bg-cosmos-950/60 hover:border-gold-400/35'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-parchment-100/15 bg-cosmos-900 text-gold-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-parchment-50">
                          {metaInfo.indonesianLabel}{' '}
                          <span className="font-mono text-xs font-normal text-parchment-300/60">
                            ({metaInfo.label})
                          </span>
                        </h4>
                        <p className="font-mono text-[10px] text-parchment-300/55">
                          {metaInfo.tagline}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 font-mono text-xs font-semibold ${
                        isHigh
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                          : 'border-gold-400/30 bg-gold-500/10 text-gold-300'
                      }`}
                    >
                      <Flame className="h-3.5 w-3.5" />
                      <span>{enc.rating}/10</span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-parchment-100/90">
                    {enc.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-parchment-100/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${enc.rating * 10}%`,
                        backgroundColor: isHigh ? '#68B684' : partnerMeta.accentHex,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
