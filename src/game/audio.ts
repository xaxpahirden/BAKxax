export class AudioManager {
  private ctx: AudioContext | null = null;
  private _enabled = false;
  private _muted = true;

  get enabled() {
    return this._enabled;
  }
  get muted() {
    return this._muted;
  }

  async initOnUserGesture() {
    if (this._enabled) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this._enabled = true;
      // Start muted by default; user toggles later
      this._muted = true;
    } catch {
      this._enabled = false;
    }
  }

  setMuted(muted: boolean) {
    this._muted = muted;
  }

  private beep(frequency: number, duration = 0.08, type: OscillatorType = 'sine', gain = 0.02) {
    if (!this.ctx || this._muted) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + duration);
  }

  flap() {
    // quick up chirp
    this.beep(700, 0.05, 'square', 0.03);
  }
  score() {
    this.beep(500, 0.08, 'triangle', 0.03);
  }
  hit() {
    this.beep(120, 0.2, 'sawtooth', 0.04);
  }
}
