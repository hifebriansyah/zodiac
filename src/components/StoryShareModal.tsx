import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  extractEditorialHeadline,
  formatWibTime,
  resolveLuckyColorHex,
  SIGN_MAP,
} from '../data/zodiacMeta';
import { ReadingResponse, ZodiacSignId } from '../types/zodiac';

export interface StoryShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  signId: ZodiacSignId;
  dateLabel: string;
  readingData: ReadingResponse;
}

type CardTheme = 'obsidian' | 'parchment' | 'nebula';

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 6
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + '…', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export const StoryShareModal: React.FC<StoryShareModalProps> = ({
  isOpen,
  onClose,
  signId,
  dateLabel,
  readingData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<CardTheme>('obsidian');
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const meta = SIGN_MAP[signId];
  const { mood, lucky_color, reading, routine } = readingData;
  const luckyHex = resolveLuckyColorHex(lucky_color, meta.accentHex);
  const headline = extractEditorialHeadline(reading.general, meta.name);
  const topRoutine = routine.find((r) => Number(formatWibTime(r.from).slice(0, 2)) >= 8) || routine[0];

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (theme === 'parchment') {
      bgGrad.addColorStop(0, '#F6F1E5');
      bgGrad.addColorStop(1, '#E6DEC8');
    } else if (theme === 'nebula') {
      bgGrad.addColorStop(0, '#130924');
      bgGrad.addColorStop(0.5, '#0B132B');
      bgGrad.addColorStop(1, '#07080D');
    } else {
      bgGrad.addColorStop(0, '#07080D');
      bgGrad.addColorStop(0.55, '#111524');
      bgGrad.addColorStop(1, '#090B12');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Radial Aura Glow
    const auraGrad = ctx.createRadialGradient(W * 0.5, H * 0.24, 30, W * 0.5, H * 0.24, 520);
    auraGrad.addColorStop(0, `${meta.accentHex}55`);
    auraGrad.addColorStop(0.6, `${meta.secondaryHex}22`);
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, W, H);

    const isLight = theme === 'parchment';
    const textPrimary = isLight ? '#12141D' : '#FAF7F0';
    const textSecondary = isLight ? 'rgba(18, 20, 29, 0.68)' : 'rgba(244, 239, 228, 0.72)';
    const borderColor = isLight ? 'rgba(18, 20, 29, 0.18)' : 'rgba(223, 192, 130, 0.28)';
    const goldAccent = isLight ? '#8C6223' : '#DFC082';

    // Editorial Frame Border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, W - 112, H - 112);

    // Top Masthead
    ctx.fillStyle = goldAccent;
    ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ASTRAEA • THE CELESTIAL EDITORIAL DAILY', W / 2, 130);

    ctx.fillStyle = textSecondary;
    ctx.font = '400 24px "JetBrains Mono", monospace';
    ctx.fillText(dateLabel.toUpperCase(), W / 2, 172);

    // Celestial Rings & Glyph Medallion
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W / 2, 410, 145, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.arc(W / 2, 410, 175, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = meta.accentHex;
    ctx.font = '400 135px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(meta.glyph, W / 2, 455);

    // Sign Title & Subtitle
    ctx.fillStyle = textPrimary;
    ctx.font = '700 86px Georgia, serif';
    ctx.fillText(meta.name.toUpperCase(), W / 2, 670);

    ctx.fillStyle = goldAccent;
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillText(`${meta.symbolLatin} • ${meta.element} Element • ${meta.rulingPlanet}`, W / 2, 725);

    // Divider Line
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(120, 775);
    ctx.lineTo(W - 120, 775);
    ctx.stroke();

    // Editorial Headline Quote
    ctx.fillStyle = textPrimary;
    ctx.font = '600 46px Georgia, serif';
    ctx.textAlign = 'left';
    const afterHeadlineY = wrapCanvasText(
      ctx,
      `“${headline}”`,
      120,
      850,
      W - 240,
      60,
      3
    );

    // Body Reading
    ctx.fillStyle = textSecondary;
    ctx.font = '400 31px -apple-system, BlinkMacSystemFont, sans-serif';
    const afterBodyY = wrapCanvasText(
      ctx,
      reading.general,
      120,
      afterHeadlineY + 35,
      W - 240,
      46,
      5
    );

    // 4 Mood Score Cards
    const metricsY = Math.max(1260, afterBodyY + 40);
    const cardW = (W - 240 - 36) / 4;
    const scoreItems = [
      { label: 'VIBE', val: mood.vibe },
      { label: 'HUSTLE', val: mood.hustle },
      { label: 'SUCCESS', val: mood.success },
      { label: 'MAGNET', val: mood.sex },
    ];

    scoreItems.forEach((item, i) => {
      const x = 120 + i * (cardW + 12);
      ctx.fillStyle = isLight ? 'rgba(18, 20, 29, 0.05)' : 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(x, metricsY, cardW, 150);
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(x, metricsY, cardW, 150);

      ctx.fillStyle = goldAccent;
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + cardW / 2, metricsY + 50);

      ctx.fillStyle = textPrimary;
      ctx.font = '700 54px "JetBrains Mono", monospace';
      ctx.fillText(`${item.val}/10`, x + cardW / 2, metricsY + 120);
    });

    // Lucky Color & Cosmic Schedule Highlight Box
    const boxY = metricsY + 190;
    ctx.fillStyle = isLight ? 'rgba(18, 20, 29, 0.06)' : 'rgba(223, 192, 130, 0.07)';
    ctx.fillRect(120, boxY, W - 240, 210);
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(120, boxY, W - 240, 210);

    // Lucky Color Swatch Circle
    ctx.beginPath();
    ctx.arc(185, boxY + 65, 24, 0, Math.PI * 2);
    ctx.fillStyle = luckyHex;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = goldAccent;
    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillText(`WARNA HOKI: ${lucky_color.toUpperCase()}`, 230, boxY + 58);

    ctx.fillStyle = textSecondary;
    ctx.font = '400 22px "JetBrains Mono", monospace';
    ctx.fillText(`AURA FREQUENCY: ${meta.harmonicHz} Hz (${meta.rulingPlanet})`, 230, boxY + 92);

    if (topRoutine) {
      ctx.fillStyle = textPrimary;
      ctx.font = '600 26px Georgia, serif';
      ctx.fillText(
        `Peak Cosmic Window (${formatWibTime(topRoutine.from)}–${formatWibTime(topRoutine.to)} WIB): ${topRoutine.title}`,
        160,
        boxY + 162
      );
    }

    // Footer Signature
    ctx.textAlign = 'center';
    ctx.fillStyle = textSecondary;
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.fillText('zodiac-worker.situs.id • ASTRAEA COSMIC ALMANAC', W / 2, H - 95);
  }, [isOpen, theme, signId, dateLabel, readingData, meta, mood, lucky_color, luckyHex, headline, reading.general, topRoutine]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `astraea-${signId}-story-${readingData.slug}.png`;
    link.href = dataUrl;
    link.click();
    setShareStatus('Story Card berhasil diunduh (1080×1920 PNG).');
  };

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.share) {
        const file = new File([blob], `astraea-${signId}-story.png`, { type: 'image/png' });
        const shareData: ShareData = {
          title: `ASTRAEA • ${meta.name} Daily Cosmic Reading`,
          text: `“${headline}” — Bacaan kosmik harian ${meta.name} (${dateLabel}). Warna Hoki: ${lucky_color} | Vibe ${mood.vibe}/10.`,
        };
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
        await navigator.share(shareData);
        setShareStatus('Berhasil dibagikan melalui menu Share perangkat.');
        return;
      }
    } catch {
      // Fallback to download if user cancels or browser blocks file share
    }
    handleDownloadPng();
  };

  const handleCopyCaption = async () => {
    const caption = `✦ ASTRAEA DAILY • ${meta.glyph} ${meta.name.toUpperCase()} (${dateLabel})\n“${headline}”\n\nVibe: ${mood.vibe}/10 | Hustle: ${mood.hustle}/10 | Success: ${mood.success}/10 | Magnet: ${mood.sex}/10\nWarna Hoki: ${lucky_color} • Frekuensi Aura: ${meta.harmonicHz} Hz`;
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="editorial-card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gold-400/30 shadow-2xl md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-parchment-100/20 bg-cosmos-950/80 text-parchment-200 hover:border-gold-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left: 9:16 Vertical Story Card Preview */}
        <div className="flex items-center justify-center bg-cosmos-950/90 p-5 md:w-1/2">
          <div className="relative aspect-[9/16] w-full max-w-[270px] overflow-hidden rounded-2xl border border-gold-400/30 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Right: Customization & Share Controls */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-7">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
              <Sparkles className="h-3 w-3" />
              Story-Ready Share Card (9:16)
            </span>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-parchment-50 sm:text-3xl">
              Kartu Cerita {meta.name}
            </h3>
            <p className="mt-1 text-sm text-parchment-200/75">
              Diformat khusus dalam rasio vertikal 1080×1920 untuk Instagram Story, WhatsApp Status, dan TikTok.
            </p>

            {/* Editorial Theme Switcher */}
            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-parchment-300/65">
                Pilih Tema Editorial:
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'obsidian', label: 'Obsidian', desc: 'Gelap Kosmik' },
                    { id: 'parchment', label: 'Parchment', desc: 'Kertas Majalah' },
                    { id: 'nebula', label: 'Nebula', desc: 'Astral Ungu' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      theme === t.id
                        ? 'border-gold-400 bg-gold-500/20 text-gold-300'
                        : 'border-parchment-100/10 bg-cosmos-950/60 text-parchment-200 hover:border-gold-400/40'
                    }`}
                  >
                    <p className="font-serif text-sm font-semibold">{t.label}</p>
                    <p className="font-mono text-[10px] text-parchment-300/60">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {shareStatus && (
              <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 font-mono text-xs text-emerald-200">
                {shareStatus}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2.5 border-t border-parchment-100/10 pt-5">
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-cosmos-950 shadow-lg transition hover:brightness-110"
            >
              <Share2 className="h-4 w-4" />
              <span>Bagikan ke Story (Web Share / Unduh)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/35 bg-gold-500/10 px-3 py-2.5 font-mono text-xs text-gold-300 transition hover:bg-gold-500/20"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCaption}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-parchment-100/15 bg-cosmos-950/70 px-3 py-2.5 font-mono text-xs text-parchment-200 transition hover:border-gold-400/40"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Caption'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
