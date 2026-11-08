import { SIGN_MAP } from '../data/zodiacMeta';
import { MoodScores, ZodiacSignId } from '../types/zodiac';

class AudioAuraSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private isPlaying = false;
  private currentSign: ZodiacSignId | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  public startAura(sign: ZodiacSignId, mood?: MoodScores, volume = 0.28): void {
    this.stopAura();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const meta = SIGN_MAP[sign];
    const vibeFactor = mood ? mood.vibe / 10 : 0.8;
    const hustleFactor = mood ? mood.hustle / 10 : 0.75;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(Math.max(0.05, volume), this.ctx.currentTime + 1.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420 + vibeFactor * 520, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.85;

    // Subtle LFO modulating filter cutoff for breathing cosmic aura
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.14 + hustleFactor * 0.22, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const oscList: OscillatorNode[] = [];
    const waveTypes: OscillatorType[] = ['sine', 'triangle', 'sine', 'sine'];

    meta.chordNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = waveTypes[idx % waveTypes.length];
      // Slight detune for warm binaural shimmer
      const detuneCents = idx === 1 ? 6 : idx === 2 ? -6 : idx === 3 ? 11 : 0;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(detuneCents, this.ctx.currentTime);

      const baseNoteAmp = idx === 0 ? 0.42 : idx === 1 ? 0.28 : 0.16;
      noteGain.gain.setValueAtTime(baseNoteAmp, this.ctx.currentTime);

      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start();
      oscList.push(osc);
    });

    filter.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(this.ctx.destination);

    this.masterGain = masterGain;
    this.analyser = analyser;
    this.oscillators = oscList;
    this.lfo = lfo;
    this.isPlaying = true;
    this.currentSign = sign;
  }

  public setVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0.001, volume), this.ctx.currentTime, 0.15);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser || !this.isPlaying) {
      return new Uint8Array(32).fill(8);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public speakNarration(text: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.96;
    utterance.pitch = 0.98;
    const voices = window.speechSynthesis.getVoices();
    const indoVoice = voices.find((v) => v.lang.toLowerCase().includes('id'));
    if (indoVoice) utterance.voice = indoVoice;
    utterance.onend = () => {
      this.speechUtterance = null;
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      this.speechUtterance = null;
      if (onEnd) onEnd();
    };
    this.speechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stopNarration(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speechUtterance = null;
  }

  public stopAura(): void {
    this.stopNarration();
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
      } catch {
        // Ignore
      }
    }
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore
      }
    });
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch {
        // Ignore
      }
    }
    this.oscillators = [];
    this.lfo = null;
    this.isPlaying = false;
    this.currentSign = null;
  }

  public getStatus(): { isPlaying: boolean; currentSign: ZodiacSignId | null } {
    return { isPlaying: this.isPlaying, currentSign: this.currentSign };
  }
}

export const audioAuraEngine = new AudioAuraSynthesizer();
