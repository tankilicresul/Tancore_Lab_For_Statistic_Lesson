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
    // Check initial mute preference from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tancore_sound_enabled');
        if (saved !== null) {
          this.isMuted = saved === 'false';
        }
      } catch {
        this.isMuted = false;
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
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
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
  // 1. SORUYU DOĞRU BİLME SESİ (Success Major Arpeggio & Chime)
  // ─────────────────────────────────────────────────────────────
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // G5 (783.99), C6 (1046.50), E6 (1318.51), G6 (1567.98)
    const frequencies = [783.99, 1046.5, 1318.51, 1567.98];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const startTime = now + idx * 0.07;
      const duration = 0.38;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. SORUYU YANLIŞ BİLME SESİ (Soft Constructive Low Thud)
  // ─────────────────────────────────────────────────────────────
  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    // Gentle downward slide (165Hz down to 85Hz)
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. TANCO BUTONU DİJİTAL SESİ (Futuristic Cyber AI Sparkle)
  // ─────────────────────────────────────────────────────────────
  public playTancoActivation() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Dual fast high-tech digital sequence: E5 (659.25), A5 (880), B5 (987.77), E6 (1318.51)
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
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. LİDERLİK TABLOSU ÇARK TIKIRTISI (Ratchet / Wheel Tick)
  // ─────────────────────────────────────────────────────────────
  public playWheelTick() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Crisp high-frequency micro impulse simulating mechanical click
    const bufferSize = Math.floor(ctx.sampleRate * 0.018); // 18ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Damped impulse with decaying noise
      const decay = Math.exp(-i / (bufferSize * 0.25));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2400, now);
    bandpass.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  // ─────────────────────────────────────────────────────────────
  // 5. SÜPER KAHRAMAN YERE İNİŞİ (Superhero Landing Sub-Bass Slam)
  // ─────────────────────────────────────────────────────────────
  public playSuperheroLanding() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // ── Phase A: Falling Whoosh (Air rush cutting down from above, 0.2s) ──
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
    whooshFilter.frequency.setValueAtTime(1200, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(240, now + 0.22);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.001, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.25, now + 0.16);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    whoosh.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(now);

    // ── Phase B: Cinematic Ground Impact Slam (starts at 0.19s) ──
    const impactTime = now + 0.19;

    // Deep sub-bass punch (130Hz diving to 32Hz)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(135, impactTime);
    subOsc.frequency.exponentialRampToValueAtTime(32, impactTime + 0.65);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.001, impactTime);
    subGain.gain.exponentialRampToValueAtTime(0.48, impactTime + 0.025);
    subGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.75);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(impactTime);
    subOsc.stop(impactTime + 0.8);

    // Mid-range crunchy earth hit
    const hitOsc = ctx.createOscillator();
    hitOsc.type = 'triangle';
    hitOsc.frequency.setValueAtTime(95, impactTime);
    hitOsc.frequency.exponentialRampToValueAtTime(40, impactTime + 0.18);

    const hitGain = ctx.createGain();
    hitGain.gain.setValueAtTime(0.001, impactTime);
    hitGain.gain.exponentialRampToValueAtTime(0.35, impactTime + 0.015);
    hitGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.25);

    hitOsc.connect(hitGain);
    hitGain.connect(ctx.destination);
    hitOsc.start(impactTime);
    hitOsc.stop(impactTime + 0.3);
  }

  // ─────────────────────────────────────────────────────────────
  // 6. LAV AKMA / ATEŞ SESİ (Ambient Lava Flow & Ember Warmth)
  // ─────────────────────────────────────────────────────────────
  public playLavaFlow(volume: number = 0.18) {
    if (this.isMuted) return;
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Continuous brown/pink noise buffer for molten bubbling rumble
    const bufferSize = ctx.sampleRate * 2; // 2 seconds looped
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for deep molten magma rumble
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    // Low rumble oscillator (sub bubbling)
    const rumbleOsc = ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(54, ctx.currentTime);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.12, ctx.currentTime);
    rumbleOsc.connect(rumbleGain);

    // Master ambient gain with smooth fade-in
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.8);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    rumbleGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    whiteNoise.start();
    rumbleOsc.start();

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
              rumbleOsc.stop();
              whiteNoise.disconnect();
              rumbleOsc.disconnect();
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
  // 7. SOĞUK RÜZGAR SESİ (Ambient Cold Howling Wind)
  // ─────────────────────────────────────────────────────────────
  public playColdWind(volume: number = 0.18) {
    if (this.isMuted) return;
    this.stopAmbient();

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // White noise source
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Resonant bandpass filter that sweeps back and forth like howling wind
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.8, ctx.currentTime);
    filter.frequency.setValueAtTime(380, ctx.currentTime);

    // LFO for howling sweep
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.28, ctx.currentTime); // 0.28Hz wind gust oscillation

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(220, ctx.currentTime); // sweep range +/- 220Hz

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
  // 8. AMBİYANS SESİNİ DURDURMA (Stop Ambient)
  // ─────────────────────────────────────────────────────────────
  public stopAmbient() {
    if (this.activeAmbientNodes) {
      this.activeAmbientNodes.stop();
      this.activeAmbientNodes = null;
    }
  }
}

export const soundService = new SoundService();
