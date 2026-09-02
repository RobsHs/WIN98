// Web Audio API Retro Sound Synthesizer for Windows 98 Experience

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.8;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol / 100));
  }

  private getContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Windows 98 Startup Chime (Nostalgic multi-layered chord progression)
  public playStartup() {
    const ctx = this.getContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Chord 1: Eb Major / F minor shimmer
    const notes1 = [311.13, 392.00, 466.16, 622.25]; // Eb4, G4, Bb4, Eb5
    notes1.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + 2.4);
    });

    // Main Swell / Pad Chord
    const chordTime = now + 0.4;
    const notes2 = [233.08, 349.23, 466.16, 587.33, 698.46, 932.33]; // Bb3, F4, Bb4, D5, F5, Bb5
    notes2.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, chordTime);

      gain.gain.setValueAtTime(0, chordTime);
      gain.gain.linearRampToValueAtTime(0.2, chordTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 3.0);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(chordTime);
      osc.stop(chordTime + 3.2);
    });

    // High Crystal Sparkle
    const sparkleTime = now + 0.8;
    [1046.50, 1396.91, 1760.00, 2093.00].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, sparkleTime + idx * 0.12);

      gain.gain.setValueAtTime(0, sparkleTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, sparkleTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + idx * 0.12 + 1.6);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(sparkleTime + idx * 0.12);
      osc.stop(sparkleTime + idx * 0.12 + 1.8);
    });
  }

  // Windows 98 Asterisk / Information Sound (Soft high dual bell)
  public playAsterisk() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.5, now);
    masterGain.connect(ctx.destination);

    [1046.5, 1318.51].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  // Windows 98 Critical Stop / Error Sound (Deep brassy chord)
  public playCriticalStop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.6, now);
    masterGain.connect(ctx.destination);

    const freqs = [174.61, 220.00, 261.63, 349.23]; // F3, A3, C4, F4
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  // Windows 98 Exclamation / Warning Sound (Two-tone beep)
  public playExclamation() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.5, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(784.00, now); // G5
    osc.frequency.setValueAtTime(523.25, now + 0.12); // C5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setValueAtTime(0.2, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Windows 98 Question Sound
  public playQuestion() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.5, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.2); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Windows 98 Shutdown Sequence Sound
  public playShutdown() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.6, now);
    masterGain.connect(ctx.destination);

    // Descending chime notes
    const notes = [659.25, 587.33, 493.88, 392.00, 329.63]; // E5, D5, B4, G4, E4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.8);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.9);
    });
  }

  // Navigation Click Sound
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.15, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundService = new SoundService();

