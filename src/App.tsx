import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import {
  BellRing,
  Compass,
  Pause,
  Radio,
  Share2,
  Sparkles,
} from 'lucide-react';
import { CelestialCanvas } from './components/CelestialCanvas';
import { PwaHabitLoop } from './components/PwaHabitLoop';
import { StoryShareModal } from './components/StoryShareModal';
import {
  buildFallbackReading,
  extractEditorialHeadline,
  formatReadableDate,
  SIGN_MAP,
  ZODIAC_SIGNS,
} from './data/zodiacMeta';
import { MagazineGridPage } from './pages/MagazineGridPage';
import { SignDetailPage } from './pages/SignDetailPage';
import { audioAuraEngine } from './services/audioAuraEngine';
import { fetchGeneralReadings, fetchSignReading } from './services/zodiacApi';
import {
  CareerArchetype,
  LifeEra,
  ReadingResponse,
  ZodiacSignId,
} from './types/zodiac';

export const App: React.FC = () => {
  const [dateParam, setDateParam] = useState<string>('20261109');
  const [era, setEra] = useState<LifeEra>('builder');
  const [career, setCareer] = useState<CareerArchetype>('professional');
  const [activeSign, setActiveSign] = useState<ZodiacSignId>('scorpio');

  const [readingsBySign, setReadingsBySign] = useState<Record<ZodiacSignId, ReadingResponse>>(() => {
    const initial = {} as Record<ZodiacSignId, ReadingResponse>;
    for (const s of ZODIAC_SIGNS) {
      initial[s.id] = buildFallbackReading(s.id, 'builder', 'professional', '20261109');
    }
    return initial;
  });

  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [isLoadingSign, setIsLoadingSign] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<'live' | 'cached' | 'editorial-preview'>('editorial-preview');

  const [playingSign, setPlayingSign] = useState<ZodiacSignId | null>(null);
  const [shareModalSign, setShareModalSign] = useState<ZodiacSignId | null>(null);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  const syncGeneralReadings = useCallback(
    async (bust = false) => {
      setIsLoadingApi(true);
      try {
        const baseMap = {} as Record<ZodiacSignId, ReadingResponse>;
        for (const s of ZODIAC_SIGNS) {
          baseMap[s.id] = buildFallbackReading(s.id, era, career, dateParam);
        }

        const generalRes = await fetchGeneralReadings(dateParam, { bust });
        if (generalRes && Array.isArray(generalRes.readings)) {
          for (const item of generalRes.readings) {
            if (item.sign && baseMap[item.sign]) {
              baseMap[item.sign] = {
                ...baseMap[item.sign],
                reading: item,
                _source: generalRes._source || 'live',
              };
            }
          }
          setApiSource(generalRes._source || 'live');
        }
        setReadingsBySign(baseMap);
      } finally {
        setIsLoadingApi(false);
      }
    },
    [dateParam, era, career]
  );

  const handleFetchSpecificSign = useCallback(
    async (signId: ZodiacSignId, bust = false) => {
      setIsLoadingSign(true);
      try {
        const detail = await fetchSignReading(signId, era, career, dateParam, { bust });
        setReadingsBySign((prev) => ({
          ...prev,
          [signId]: detail,
        }));
        if (detail._source === 'live' || detail._source === 'cached') {
          setApiSource(detail._source);
        }
      } finally {
        setIsLoadingSign(false);
      }
    },
    [era, career, dateParam]
  );

  useEffect(() => {
    syncGeneralReadings(false);
  }, [syncGeneralReadings]);

  const handleToggleAudio = (signId: ZodiacSignId, data: ReadingResponse) => {
    if (playingSign === signId) {
      audioAuraEngine.stopAura();
      setPlayingSign(null);
    } else {
      audioAuraEngine.startAura(signId, data.mood, 0.3);
      setPlayingSign(signId);
      setActiveSign(signId);
    }
  };

  const handleOpenShare = (signId: ZodiacSignId) => {
    setShareModalSign(signId);
  };

  const activeSignData = readingsBySign[activeSign] || readingsBySign.scorpio;
  const activeHeadline = extractEditorialHeadline(
    activeSignData.reading.general,
    SIGN_MAP[activeSign].name
  );

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <div className="relative min-h-screen bg-cosmos-950 text-parchment-50">
        <CelestialCanvas
          activeSign={activeSign}
          vibeScore={activeSignData.mood.vibe}
          mode="background"
        />

        <nav className="sticky top-0 z-30 border-b border-parchment-100/10 bg-cosmos-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/40 bg-gold-500/10 text-gold-300 transition group-hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-parchment-50">
                  ASTRAEA
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-gold-300 sm:block">
                  Celestial Editorial Daily
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                className="hidden items-center gap-1.5 rounded-full border border-parchment-100/12 bg-cosmos-900/70 px-3.5 py-1.5 font-mono text-xs text-parchment-200 transition hover:border-gold-400/40 hover:text-gold-300 md:inline-flex"
              >
                <Compass className="h-3.5 w-3.5 text-gold-400" />
                <span>Magazine Grid</span>
              </Link>

              <button
                type="button"
                onClick={() => handleOpenShare(activeSign)}
                className="inline-flex items-center gap-1.5 rounded-full border border-parchment-100/15 bg-cosmos-900/80 px-3.5 py-1.5 font-mono text-xs text-parchment-200 transition hover:border-gold-400/40 hover:text-gold-300"
              >
                <Share2 className="h-3.5 w-3.5 text-gold-400" />
                <span className="hidden sm:inline">Story Card</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPwaModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-500/15 px-3.5 py-1.5 font-mono text-xs font-medium text-gold-300 transition hover:bg-gold-500/25"
              >
                <BellRing className="h-3.5 w-3.5" />
                <span>07:00 AM & PWA</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <MagazineGridPage
                  dateParam={dateParam}
                  onChangeDateParam={setDateParam}
                  era={era}
                  onChangeEra={setEra}
                  career={career}
                  onChangeCareer={setCareer}
                  readingsBySign={readingsBySign}
                  isLoadingApi={isLoadingApi}
                  apiSource={apiSource}
                  onRefreshApi={() => syncGeneralReadings(true)}
                  playingSign={playingSign}
                  onToggleAudio={handleToggleAudio}
                  onOpenShare={(signId) => handleOpenShare(signId)}
                  onHoverSign={setActiveSign}
                />
              }
            />
            <Route
              path="/sign/:signId"
              element={
                <SignDetailPage
                  dateParam={dateParam}
                  era={era}
                  onChangeEra={setEra}
                  career={career}
                  onChangeCareer={setCareer}
                  readingsBySign={readingsBySign}
                  onFetchSpecificSign={handleFetchSpecificSign}
                  isLoadingSign={isLoadingSign}
                  onOpenShare={(signId) => handleOpenShare(signId)}
                  onActiveSignChange={setActiveSign}
                />
              }
            />
          </Routes>
        </main>

        {playingSign && (
          <div className="fixed bottom-5 left-1/2 z-40 flex w-[92%] max-w-xl -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-gold-400/40 bg-cosmos-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/30 text-xl"
                style={{ color: SIGN_MAP[playingSign].accentHex }}
              >
                {SIGN_MAP[playingSign].glyph}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-gold-300">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Audio Aura Aktif
                  </span>
                  <span className="font-mono text-[11px] text-parchment-300/70">
                    {SIGN_MAP[playingSign].harmonicHz} Hz
                  </span>
                </div>
                <p className="font-serif text-base font-semibold text-parchment-50">
                  {SIGN_MAP[playingSign].name} • {SIGN_MAP[playingSign].auraTagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/sign/${playingSign}`}
                className="rounded-xl border border-parchment-100/15 px-3 py-1.5 font-mono text-xs text-parchment-200 hover:border-gold-400/40"
              >
                Buka Dossier
              </Link>
              <button
                type="button"
                onClick={() => {
                  audioAuraEngine.stopAura();
                  setPlayingSign(null);
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-gold-400 px-3 py-1.5 font-mono text-xs font-semibold text-cosmos-950"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        )}

        {shareModalSign && (
          <StoryShareModal
            isOpen={Boolean(shareModalSign)}
            onClose={() => setShareModalSign(null)}
            signId={shareModalSign}
            dateLabel={formatReadableDate(dateParam)}
            readingData={readingsBySign[shareModalSign]}
          />
        )}

        <PwaHabitLoop
          isOpen={isPwaModalOpen}
          onClose={() => setIsPwaModalOpen(false)}
          favoriteSign={activeSign}
          headline={activeHeadline}
          luckyColor={activeSignData.lucky_color}
          vibeScore={activeSignData.mood.vibe}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
