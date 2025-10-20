export type LoopCallback = (dt: number) => void;

export class GameLoop {
  private lastTime = 0;
  private running = false;
  private rafId = 0;
  private cb: LoopCallback;

  constructor(cb: LoopCallback) {
    this.cb = cb;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const step = (time: number) => {
      if (!this.running) return;
      const dtMs = time - this.lastTime;
      this.lastTime = time;
      // Convert to seconds and clamp to avoid huge jumps when tab hidden
      const dt = Math.min(dtMs / 1000, 0.05);
      this.cb(dt);
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  isRunning() {
    return this.running;
  }
}
