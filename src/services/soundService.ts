/**
 * Sound Service for TanCoreLab
 * Pure Web Audio API procedural synthesis engine.
 * Zero external audio files, zero load latency, zero broken links.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeAmbientNodes: {
    stop: () => void;
    gainNode: GainNode;
  } | null = null;

  constructor() {
    this.isMuted = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tancore_sound_enabled', 'true');
      } catch {
        // ignore
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    return this.audioCtx;
  }

  /**
   * Guarantees that AudioContext is resumed before scheduling sounds.
   * Browsers suspend AudioContext until user interaction; this prevents silent or delayed playback.
   */
  private ensureContext(cb: (ctx: AudioContext) => void) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          cb(ctx);
        })
        .catch(() => {});
    } else {
      cb(ctx);
    }
  }

  public setEnabled(enabled: boolean) {
    this.isMuted = !enabled;
    if (this.isMuted) {
      this.stopAmbient();
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tancore_sound_enabled', String(enabled));
      } catch {
        // ignore
      }
    }
  }

  public isEnabled(): boolean {
    return !this.isMuted;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. SORUYU DOĞRU BİLME SESİ (Crystal Bell Success Arpeggio)
  // ─────────────────────────────────────────────────────────────
  public playCorrect() {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      // Bright, cheerful 4-note ascending major arpeggio: Eb5 (622), G5 (784), Bb5 (932), Eb6 (1244)
      const notes = [
        { freq: 622.25, time: 0.0, dur: 0.28, vol: 0.24 },
        { freq: 783.99, time: 0.07, dur: 0.28, vol: 0.26 },
        { freq: 932.33, time: 0.14, dur: 0.32, vol: 0.28 },
        { freq: 1244.5, time: 0.21, dur: 0.55, vol: 0.32 },
      ];

      notes.forEach((note) => {
        const startTime = now + note.time;

        // 1. Fundamental sine wave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(note.vol, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + note.dur + 0.05);

        // 2. Crystalline harmonic overtone (gives that authentic glockenspiel sparkle)
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(note.freq * 2.0, startTime);

        overGain.gain.setValueAtTime(0.0001, startTime);
        overGain.gain.exponentialRampToValueAtTime(note.vol * 0.35, startTime + 0.006);
        overGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur * 0.65);

        overtone.connect(overGain);
        overGain.connect(ctx.destination);
        overtone.start(startTime);
        overtone.stop(startTime + note.dur * 0.7);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. SORUYU YANLIŞ BİLME SESİ (Warm Dual-Tone "Uh-Oh" Buzzer)
  // ─────────────────────────────────────────────────────────────
  public playWrong() {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([10, 50, 10]);
      } catch {
        // ignore
      }
    }
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;

      // Pulse 1: Dissonant higher step (0.0s - 0.13s)
      this.playBuzzerStep(ctx, now, 164.81, 233.08, 0.13, 0.22);

      // Pulse 2: Lower stepped resolving dissonance (0.16s - 0.36s)
      this.playBuzzerStep(ctx, now + 0.15, 138.59, 196.0, 0.20, 0.24);
    });
  }

  private playBuzzerStep(
    ctx: AudioContext,
    startTime: number,
    f1: number,
    f2: number,
    dur: number,
    vol: number
  ) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Sawtooth passed through warm low-pass creates classic game buzzer sound without harshness
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(f1, startTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(f2, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + dur + 0.02);
    osc2.stop(startTime + dur + 0.02);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. XP FLOAT-UP SÜZÜLME VE DOPAMİN SESİ (+15 XP Float)
  // ─────────────────────────────────────────────────────────────
  public playXpFloat() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      // High-pitched retro coin flutter with Glockenspiel chime
      const tones = [
        { freq: 1318.51, time: 0.0, dur: 0.12, vol: 0.18 }, // E6
        { freq: 1760.0, time: 0.06, dur: 0.14, vol: 0.22 }, // A6
        { freq: 2093.0, time: 0.12, dur: 0.35, vol: 0.26 }, // C7
      ];

      tones.forEach((t) => {
        const startTime = now + t.time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(t.vol, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + t.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + t.dur + 0.02);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. MİKRO BUTON KLİĞİ (Tactile Membrane Click - .btn-press)
  // ─────────────────────────────────────────────────────────────
  public playBtnPress() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.018);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 5. ALT MENÜ / SEKME DEĞİŞİMİ (Organic Bubble Pop - BottomNav)
  // ─────────────────────────────────────────────────────────────
  public playNavSwitch() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.035);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. MODAL AÇILIŞ VE KAPANIŞ SESLERİ (Elastic Pop & Suction)
  // ─────────────────────────────────────────────────────────────
  public playModalOpen() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  public playModalClose() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. 8 BASAMAKLI OTP RAKAM GİRİŞİ (Ascending Chromatic Crystal Step)
  // ─────────────────────────────────────────────────────────────
  public playOtpStep(digitIndex: number = 0) {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
      const targetFreq = scale[Math.min(digitIndex, scale.length - 1)] || 523.25;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(targetFreq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 8. İNTERAKTİF SLIDER / POTANSİYOMETRE (InteractiveCalc Ticks)
  // ─────────────────────────────────────────────────────────────
  public playSliderTick() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 150, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 9. SİMÜLASYON TAMAMLANMA & ÇAN (ProbabilityLab / Monte Carlo)
  // ─────────────────────────────────────────────────────────────
  public playSimComplete() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const overGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.0, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(1760.0, now);
      overGain.gain.setValueAtTime(0.0001, now);
      overGain.gain.exponentialRampToValueAtTime(0.08, now + 0.008);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      overtone.connect(overGain);
      gain.connect(ctx.destination);
      overGain.connect(ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.65);
      overtone.stop(now + 0.4);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 10. FORMÜL & SÖZLÜK AKORDEON AÇILIŞI (Technical Parchment Snap)
  // ─────────────────────────────────────────────────────────────
  public playFormulaToggle() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.03);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 11. GÖZLÜK IŞILTISI & KARİZMA PARILTISI (Cool Tanco Lens Gleam)
  // ─────────────────────────────────────────────────────────────
  public playSunglassesGleam() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3135.96, now); // G7
      osc.frequency.exponentialRampToValueAtTime(4186.01, now + 0.08); // C8

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 12. SIVI LAV DAMLASI (Viscous Lava Drop Pop)
  // ─────────────────────────────────────────────────────────────
  public playLavaDrip() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.025);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 13. BUZ KRİSTALİ VE AYAZ ÇITIRTISI (Crystal Frost Crackle)
  // ─────────────────────────────────────────────────────────────
  public playIceFrost() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const tones = [4400, 5600, 6800];
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.02 + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.02);
        osc.stop(now + idx * 0.02 + 0.04);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 14. PUANIN ARTMASI SESİ (XP Count-up Tick & Complete)
  // ─────────────────────────────────────────────────────────────
  public playXpCountTick() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // High-pitched retro coin counter tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600 + Math.random() * 200, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    });
  }

  public playXpCountComplete() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      // Satisfying golden chime: G5 -> C6
      const tones = [
        { freq: 783.99, time: 0.0, dur: 0.22 },
        { freq: 1046.5, time: 0.08, dur: 0.45 },
      ];

      tones.forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, now + t.time);

        gain.gain.setValueAtTime(0.0001, now + t.time);
        gain.gain.exponentialRampToValueAtTime(0.24, now + t.time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t.time + t.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t.time);
        osc.stop(now + t.time + t.dur + 0.02);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. SIRALAMANIN YUKARI ÇIKMA SÜRECİ (Rising Wheel / Ratchet Tick)
  // ─────────────────────────────────────────────────────────────
  public playWheelTick(progress: number = 0) {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;

      // As user climbs higher towards the top, pitch subtly rises for suspense
      const clampedProg = Math.max(0, Math.min(1, progress));
      const targetFreq = 1800 + clampedProg * 1000;

      const bufferSize = Math.floor(ctx.sampleRate * 0.02); // 20ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.2));
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(targetFreq, now);
      bandpass.Q.setValueAtTime(4.0, now);

      // Micro wooden/plastic tooth resonance click
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(targetFreq * 0.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);

      noise.connect(bandpass);
      bandpass.connect(gain);
      clickOsc.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 5. SÜPER KAHRAMAN İNİŞİ VE YERE OTURMA (Sub-Bass Slam + Whoosh)
  // ─────────────────────────────────────────────────────────────
  public playSuperheroLanding(isPodium: boolean = false) {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;

      // Phase A: Falling Whoosh (Air cutting down from above, 0.22s)
      const whooshLen = Math.floor(ctx.sampleRate * 0.24);
      const whooshBuffer = ctx.createBuffer(1, whooshLen, ctx.sampleRate);
      const whooshData = whooshBuffer.getChannelData(0);
      for (let i = 0; i < whooshLen; i++) {
        whooshData[i] = Math.random() * 2 - 1;
      }

      const whoosh = ctx.createBufferSource();
      whoosh.buffer = whooshBuffer;

      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.Q.setValueAtTime(2.0, now);
      whooshFilter.frequency.setValueAtTime(1400, now);
      whooshFilter.frequency.exponentialRampToValueAtTime(220, now + 0.22);

      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.001, now);
      whooshGain.gain.exponentialRampToValueAtTime(0.3, now + 0.16);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      whoosh.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whoosh.start(now);

      // Phase B: Cinematic Ground Impact Slam (starts at 0.18s)
      const impactTime = now + 0.18;

      // Deep sub-bass punch (140Hz diving to 32Hz)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(145, impactTime);
      subOsc.frequency.exponentialRampToValueAtTime(32, impactTime + 0.7);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.001, impactTime);
      subGain.gain.exponentialRampToValueAtTime(0.55, impactTime + 0.025);
      subGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.85);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(impactTime);
      subOsc.stop(impactTime + 0.9);

      // Mid-range crunchy earth shock
      const hitOsc = ctx.createOscillator();
      hitOsc.type = 'triangle';
      hitOsc.frequency.setValueAtTime(110, impactTime);
      hitOsc.frequency.exponentialRampToValueAtTime(42, impactTime + 0.2);

      const hitGain = ctx.createGain();
      hitGain.gain.setValueAtTime(0.001, impactTime);
      hitGain.gain.exponentialRampToValueAtTime(0.4, impactTime + 0.015);
      hitGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.28);

      hitOsc.connect(hitGain);
      hitGain.connect(ctx.destination);
      hitOsc.start(impactTime);
      hitOsc.stop(impactTime + 0.3);

      // If user reaches Top 3 Podium: Glorious victory chime fanfare
      if (isPodium) {
        const fanfareTime = impactTime + 0.28;
        const podiumChords = [523.25, 659.25, 783.99, 1046.5]; // C Major
        podiumChords.forEach((freq, idx) => {
          const pOsc = ctx.createOscillator();
          const pGain = ctx.createGain();
          pOsc.type = 'sine';
          pOsc.frequency.setValueAtTime(freq, fanfareTime + idx * 0.06);

          pGain.gain.setValueAtTime(0.0001, fanfareTime + idx * 0.06);
          pGain.gain.exponentialRampToValueAtTime(0.22, fanfareTime + idx * 0.06 + 0.01);
          pGain.gain.exponentialRampToValueAtTime(0.0001, fanfareTime + idx * 0.06 + 0.55);

          pOsc.connect(pGain);
          pGain.connect(ctx.destination);
          pOsc.start(fanfareTime + idx * 0.06);
          pOsc.stop(fanfareTime + idx * 0.06 + 0.6);
        });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. TANCO BUTONU DİJİTAL SESİ (Futuristic Cyber AI Sparkle)
  // ─────────────────────────────────────────────────────────────
  public playTancoActivation() {
    this.ensureContext((ctx) => {
      const now = ctx.currentTime;
      const tones = [
        { freq: 659.25, time: 0.0 },
        { freq: 880.0, time: 0.05 },
        { freq: 987.77, time: 0.1 },
        { freq: 1318.51, time: 0.16 },
      ];

      tones.forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now + tone.time);

        const startTime = now + tone.time;
        const duration = 0.18;

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. LAV AKMA / ATEŞ SESİ (Ambient Lava Flow & Ember Warmth)
  // ─────────────────────────────────────────────────────────────
  public playLavaFlow(volume: number = 0.16) {
    if (this.isMuted) return;
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // 4-second pink noise buffer with crossfaded seamless looping (zero pop/seam thump)
    const bufferDuration = 4.0;
    const bufferSize = Math.floor(ctx.sampleRate * bufferDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }

    // Seamless loop crossfade at ends (100ms) to ensure mathematically zero seam thump/click
    const fadeLen = Math.floor(ctx.sampleRate * 0.1);
    for (let i = 0; i < fadeLen; i++) {
      const ratio = i / fadeLen;
      output[i] = output[i] * ratio + output[bufferSize - fadeLen + i] * (1 - ratio);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle flowing bandpass filter (pure wind-like flowing warm stream, no harsh resonance)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.1, ctx.currentTime);

    // Subtle, slow natural flowing stream breathing (0.18Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(55, ctx.currentTime); // gentle +/- 55Hz variation

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Master ambient gain with smooth fade-in
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.9);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    whiteNoise.start();
    lfo.start();

    this.activeAmbientNodes = {
      gainNode: masterGain,
      stop: () => {
        try {
          const stopTime = ctx.currentTime + 0.4;
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
          setTimeout(() => {
            try {
              whiteNoise.stop();
              lfo.stop();
              whiteNoise.disconnect();
              lfo.disconnect();
            } catch {
              // ignore
            }
          }, 450);
        } catch {
          // ignore
        }
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 8. SOĞUK RÜZGAR SESİ (Ambient Cold Howling Wind)
  // ─────────────────────────────────────────────────────────────
  public playColdWind(volume: number = 0.18) {
    if (this.isMuted) return;
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.8, ctx.currentTime);
    filter.frequency.setValueAtTime(380, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.28, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(220, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.9);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    whiteNoise.start();
    lfo.start();

    this.activeAmbientNodes = {
      gainNode: masterGain,
      stop: () => {
        try {
          const stopTime = ctx.currentTime + 0.4;
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
          setTimeout(() => {
            try {
              whiteNoise.stop();
              lfo.stop();
              whiteNoise.disconnect();
              lfo.disconnect();
            } catch {
              // ignore
            }
          }, 450);
        } catch {
          // ignore
        }
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 9. AMBİYANS SESİNİ DURDURMA (Stop Ambient)
  // ─────────────────────────────────────────────────────────────
  public stopAmbient() {
    if (this.activeAmbientNodes) {
      this.activeAmbientNodes.stop();
      this.activeAmbientNodes = null;
    }
  }
}

export const soundService = new SoundService();
