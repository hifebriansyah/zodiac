import React, { useEffect, useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  DownloadCloud,
  Smartphone,
  Sparkles,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { SIGN_MAP } from '../data/zodiacMeta';
import { ZodiacSignId } from '../types/zodiac';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PwaHabitLoopProps {
  favoriteSign: ZodiacSignId;
  headline: string;
  luckyColor: string;
  vibeScore: number;
  isOpen: boolean;
  onClose: () => void;
}

const HABIT_STORAGE_KEY = 'astraea_habit_7am_enabled';
const STREAK_STORAGE_KEY = 'astraea_daily_streak';

export const PwaHabitLoop: React.FC<PwaHabitLoopProps> = ({
  favoriteSign,
  headline,
  luckyColor,
  vibeScore,
  isOpen,
  onClose,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem(HABIT_STORAGE_KEY) === 'true';
  });
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [swReady, setSwReady] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState<number>(3);

  const meta = SIGN_MAP[favoriteSign];

  useEffect(() => {
    const savedStreak = Number(localStorage.getItem(STREAK_STORAGE_KEY) || '4');
    setStreakCount(savedStreak);

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Calculate countdown to next 07:00 AM
  const nextSevenAmLabel = React.useMemo(() => {
    const now = new Date();
    const target = new Date();
    target.setHours(7, 0, 0, 0);
    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = target.getTime() - now.getTime();
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return `${hrs} jam ${mins} menit menuju 07:00 AM`;
  }, []);

  const handleToggle7AmNotification = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem(HABIT_STORAGE_KEY, 'false');
      setFeedbackMsg('Pengingat rutin pukul 07:00 pagi dinonaktifkan.');
      return;
    }

    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setFeedbackMsg('Izin notifikasi browser belum diberikan, namun jadwal lokal tetap disimpan.');
      }
    }

    setNotificationsEnabled(true);
    localStorage.setItem(HABIT_STORAGE_KEY, 'true');
    setFeedbackMsg(
      `Pengingat harian 07:00 AM diaktifkan untuk ${meta.glyph} ${meta.name}! (${nextSevenAmLabel})`
    );
  };

  const handleSendTestNotification = async () => {
    const title = `07:00 AM Cosmic Briefing • ${meta.glyph} ${meta.name}`;
    const body = `${headline} (Vibe ${vibeScore}/10 • Warna Hoki: ${luckyColor})`;

    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'TRIGGER_MORNING_NOTIFICATION',
          payload: {
            signName: `${meta.glyph} ${meta.name}`,
            headline,
            luckyColor,
            vibeScore,
            url: `/sign/${favoriteSign}`,
          },
        });
        setFeedbackMsg('Notifikasi 07:00 AM dikirim melalui Service Worker!');
        return;
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: `${import.meta.env.BASE_URL}favicon.svg` });
      setFeedbackMsg('Notifikasi 07:00 AM berhasil ditampilkan!');
    } else {
      setFeedbackMsg(`Simulasi Push 07:00 AM: "${title} — ${body}"`);
    }
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setFeedbackMsg('ASTRAEA berhasil ditambahkan ke Home Screen!');
      }
      setDeferredPrompt(null);
    } else {
      setFeedbackMsg(
        'Untuk menambahkan ke Home Screen: klik ikon Share / Menu di bilah alamat browser lalu pilih "Add to Home Screen" atau "Install App".'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="editorial-card relative w-full max-w-xl rounded-3xl border border-gold-400/35 p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-parchment-100/15 bg-cosmos-950/80 text-parchment-200 hover:border-gold-400"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gold-300">
            <Sparkles className="h-3 w-3" />
            PWA Habit Loop & Offline Engine
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
            🔥 {streakCount} Hari Berturut-turut
          </span>
        </div>

        <h3 className="mt-3 font-serif text-3xl font-semibold text-parchment-50">
          Ritual Pagi 07:00 AM & Akses Offline
        </h3>
        <p className="mt-1 text-sm text-parchment-200/75">
          Jadikan penyelarasan kosmik sebagai kebiasaan pagi yang tenang—tersedia bahkan saat Anda berada di mode pesawat atau tanpa sinyal.
        </p>

        <div className="mt-6 space-y-4">
          {/* 1. Daily 7:00 AM Push Notification */}
          <div className="rounded-2xl border border-parchment-100/12 bg-cosmos-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-500/10 text-gold-300">
                  {notificationsEnabled ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-parchment-50">
                    Notifikasi Harian 07:00 AM WIB
                  </h4>
                  <p className="text-xs text-parchment-200/75">
                    Terima ringkasan headline, warna hoki, dan jam fokus {meta.name} setiap pukul 07:00 pagi.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-gold-300">{nextSevenAmLabel}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle7AmNotification}
                className={`shrink-0 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition ${
                  notificationsEnabled
                    ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                    : 'border-gold-400/40 bg-gold-500/15 text-gold-300 hover:bg-gold-500/25'
                }`}
              >
                {notificationsEnabled ? 'Aktif (07:00)' : 'Aktifkan 07:00'}
              </button>
            </div>

            <div className="mt-3 flex justify-end border-t border-parchment-100/10 pt-2.5">
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="font-mono text-[11px] text-gold-300 underline decoration-gold-400/40 underline-offset-4 hover:text-parchment-50"
              >
                Uji Kirim Notifikasi 07:00 AM Sekarang →
              </button>
            </div>
          </div>

          {/* 2. Service Worker Offline Mode Status */}
          <div className="rounded-2xl border border-parchment-100/12 bg-cosmos-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-300">
                  {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5 text-amber-300" />}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-parchment-50">
                    Mode Offline & Service Worker Cache
                  </h4>
                  <p className="text-xs text-parchment-200/75">
                    Bacaan dari <code className="font-mono text-gold-300">zodiac-worker.situs.id</code> disimpan otomatis agar tetap dapat dibaca tanpa internet.
                  </p>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {swReady ? 'SW Siap' : 'Cache Aktif'}
              </span>
            </div>
          </div>

          {/* 3. Add to Home Screen Prompt */}
          <div className="rounded-2xl border border-parchment-100/12 bg-cosmos-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/10 text-purple-300">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-parchment-50">
                    Pasang di Layar Utama (Add to Home Screen)
                  </h4>
                  <p className="text-xs text-parchment-200/75">
                    Buka ASTRAEA layaknya aplikasi native layar penuh tanpa bilah navigasi browser.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstallPwa}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gold-400/40 bg-gold-500/15 px-3.5 py-2 font-mono text-xs font-medium text-gold-300 transition hover:bg-gold-500/25"
              >
                <DownloadCloud className="h-4 w-4" />
                <span>Install App</span>
              </button>
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 rounded-xl border border-gold-400/35 bg-gold-500/10 px-4 py-3 font-mono text-xs text-gold-200">
            {feedbackMsg}
          </div>
        )}
      </div>
    </div>
  );
};
