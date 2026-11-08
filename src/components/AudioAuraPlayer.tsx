import React, { useEffect, useRef, useState } from 'react';
import {
  Disc3,
  Mic,
  MicOff,
  Pause,
  Play,
  Radio,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { SIGN_MAP } from '../data/zodiacMeta';
import { audioAuraEngine } from '../services/audioAuraEngine';
import { MoodScores, ZodiacSignId } from '../types/zodiac';

export interface AudioAuraPlayerProps {
  signId: ZodiacSignId;
  mood: MoodScores;
  narrationText: string;
  luckyColor: string;
  compact?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const AudioAuraPlayer: React.FC<AudioAuraPlayerProps> = ({
  signId,
  mood,
  narrationText,
  luckyColor,
  compact = false,
  onPlayStateChange,
}) => {
  const meta = SIGN_MAP[signId];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const status = audioAuraEngine.getStatus();
    setIsPlaying(status.isPlaying && status.currentSign === signId);
  }, [signId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let phase = 0;

    const renderBars = () => {
      animId = requestAnimationFrame(renderBars);
      phase += 0.06;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 28;
      const gap = 4;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const freqData = audioAuraEngine.getFrequencyData();

      for (let i = 0; i < barCount; i++) {
        let ratio = 0.16;
        if (isPlaying) {
          const val = freqData[i % freqData.length] || 32;
          const wave = Math.sin(phase + i * 0.35) * 0.22 + 0.35;
          ratio = Math.min(0.95, Math.max(0.15, (val / 255) * 0.7 + wave));
        } else {
          ratio = 0.14 + Math.sin(phase * 0.4 + i * 0.3) * 0.05;
        }

        const barHeight = Math.max(4, ratio * height);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, meta.accentHex);
        grad.addColorStop(1, meta.secondaryHex);

        ctx.fillStyle = isPlaying ? grad : 'rgba(244, 239, 228, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }
    };

    renderBars();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, meta.accentHex, meta.secondaryHex]);

  const togglePlay = () => {
    if (isPlaying) {
      audioAuraEngine.stopAura();
      setIsPlaying(false);
      setIsNarrating(false);
      onPlayStateChange?.(false);
    } else {
      audioAuraEngine.startAura(signId, mood, volume);
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }
  };

  const toggleNarration = () => {
    if (isNarrating) {
      audioAuraEngine.stopNarration();
      setIsNarrating(false);
      return;
    }
    if (!isPlaying) {
      audioAuraEngine.startAura(signId, mood, volume * 0.65);
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }
    const ok = audioAuraEngine.speakNarration(narrationText, () => {
      setIsNarrating(false);
    });
    setIsNarrating(ok);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    audioAuraEngine.setVolume(v);
  };

  return (
    <div className="editorial-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: meta.accentHex }}
      />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={togglePlay}
            className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-cosmos-900 text-gold-300 shadow-lg transition hover:scale-105 hover:border-gold-300"
            style={{
              boxShadow: isPlaying ? `0 0 25px -4px ${meta.accentHex}70` : undefined,
            }}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-gold-300" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5 text-gold-300" />
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
                <Radio className="h-3 w-3" />
                Daily Audio Aura
              </span>
              <span className="font-mono text-xs text-parchment-300/75">
                {meta.harmonicHz} Hz • {meta.rulingPlanet} Harmonic
              </span>
            </div>

            <h4 className="mt-1 font-serif text-xl font-semibold text-parchment-50 sm:text-2xl">
              {meta.auraTagline}
            </h4>
            <p className="font-mono text-[11px] text-parchment-300/65">
              Chord: {meta.chordNotes.map((n) => `${Math.round(n)}Hz`).join(' · ')} • Aura Color: {luckyColor}
            </p>
          </div>
        </div>

        {/* Controls: Vocal Narration & Volume */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={toggleNarration}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs transition ${
              isNarrating
                ? 'border-rose-400/50 bg-rose-500/20 text-rose-200'
                : 'border-parchment-100/15 bg-cosmos-950/70 text-parchment-200 hover:border-gold-400/40'
            }`}
          >
            {isNarrating ? (
              <>
                <Mic className="h-3.5 w-3.5 animate-pulse text-rose-300" />
                <span>Narasi Aktif</span>
              </>
            ) : (
              <>
                <MicOff className="h-3.5 w-3.5 text-parchment-300/70" />
                <span>Bacakan Bacaan</span>
              </>
            )}
          </button>

          {!compact && (
            <div className="flex items-center gap-2 rounded-xl border border-parchment-100/10 bg-cosmos-950/70 px-3 py-2">
              <Volume2 className="h-3.5 w-3.5 text-parchment-300/70" />
              <input
                type="range"
                min="0.05"
                max="0.7"
                step="0.02"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume Audio Aura"
                className="h-1.5 w-20 cursor-pointer accent-gold-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Waveform Visualizer Canvas */}
      <div className="relative z-10 mt-4 rounded-xl border border-parchment-100/10 bg-cosmos-950/75 p-3">
        <canvas
          ref={canvasRef}
          width={560}
          height={52}
          className="h-12 w-full"
        />
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-parchment-300/55">
          <span className="inline-flex items-center gap-1">
            <Disc3 className={`h-3 w-3 ${isPlaying ? 'animate-spin text-gold-400' : ''}`} />
            {isPlaying ? 'Binaural Synthesizer Active' : 'Siap Diputar • Web Audio Harmonic Engine'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-gold-400" />
            Vibe Tempo {mood.vibe}/10 • Hustle Pulse {mood.hustle}/10
          </span>
        </div>
      </div>
    </div>
  );
};
