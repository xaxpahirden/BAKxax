type Callback = () => void;

export class Input {
  private flapCbs: Callback[] = [];
  private pauseCbs: Callback[] = [];
  private restartCbs: Callback[] = [];

  private pointerHandler = () => this.emitFlap();
  private keyHandler = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      this.emitFlap();
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      this.emitPause();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      this.emitRestart();
    }
  };

  attach(el: HTMLElement | Window) {
    el.addEventListener('pointerdown', this.pointerHandler);
    window.addEventListener('keydown', this.keyHandler);
  }

  detach(el: HTMLElement | Window) {
    el.removeEventListener('pointerdown', this.pointerHandler);
    window.removeEventListener('keydown', this.keyHandler);
  }

  onFlap(cb: Callback) {
    this.flapCbs.push(cb);
  }
  onPause(cb: Callback) {
    this.pauseCbs.push(cb);
  }
  onRestart(cb: Callback) {
    this.restartCbs.push(cb);
  }

  private emitFlap() {
    for (const cb of this.flapCbs) cb();
  }
  private emitPause() {
    for (const cb of this.pauseCbs) cb();
  }
  private emitRestart() {
    for (const cb of this.restartCbs) cb();
  }
}
