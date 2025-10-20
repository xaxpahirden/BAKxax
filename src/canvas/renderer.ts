import type { Bird, PipePair, World } from '../game/types';

export interface RenderState {
  world: World;
  bird: Bird;
  pipes: PipePair[];
  score: number;
  paused: boolean;
  phase: 'menu' | 'playing' | 'gameover';
  groundOffset: number; // scrolling offset
}

export function clearCanvas(ctx: CanvasRenderingContext2D, world: World) {
  ctx.clearRect(0, 0, world.width, world.height);
}

export function drawBackground(ctx: CanvasRenderingContext2D, world: World) {
  const grd = ctx.createLinearGradient(0, 0, 0, world.height);
  grd.addColorStop(0, '#87ceeb');
  grd.addColorStop(1, '#bde0fe');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, world.width, world.height);
}

export function drawGround(ctx: CanvasRenderingContext2D, world: World, offset: number) {
  const gh = world.groundHeight;
  ctx.fillStyle = '#ded39f';
  ctx.fillRect(0, world.height - gh, world.width, gh);

  // Draw repeating pattern of darker stripes
  const stripeW = 30;
  const y = world.height - gh + 10;
  ctx.fillStyle = '#c4b97f';
  for (let x = -((offset % stripeW) + stripeW); x < world.width + stripeW; x += stripeW) {
    ctx.fillRect(x, y, 20, 8);
  }
}

export function drawPipes(ctx: CanvasRenderingContext2D, world: World, pipes: PipePair[]) {
  for (const p of pipes) {
    // top pipe
    ctx.fillStyle = '#3cb043';
    const topH = p.gapY - p.gapHeight / 2;
    ctx.fillRect(p.x, 0, p.width, topH);
    // lip
    ctx.fillStyle = '#2e8b57';
    ctx.fillRect(p.x - 4, topH - 16, p.width + 8, 16);

    // bottom pipe
    ctx.fillStyle = '#3cb043';
    const bottomY = p.gapY + p.gapHeight / 2;
    const bottomH = world.height - bottomY - world.groundHeight;
    ctx.fillRect(p.x, bottomY, p.width, bottomH);
    ctx.fillStyle = '#2e8b57';
    ctx.fillRect(p.x - 4, bottomY, p.width + 8, 16);
  }
}

export function drawBird(ctx: CanvasRenderingContext2D, bird: Bird) {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rotation);

  // body
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bird.radius * 0.3, -bird.radius * 0.3, bird.radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(bird.radius * 0.45, -bird.radius * 0.3, bird.radius * 0.16, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = '#ff7f11';
  ctx.beginPath();
  ctx.moveTo(bird.radius * 0.9, 0);
  ctx.lineTo(bird.radius * 1.4, bird.radius * 0.2);
  ctx.lineTo(bird.radius * 1.4, -bird.radius * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawHUD(ctx: CanvasRenderingContext2D, world: World, score: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(score), world.width / 2, 60);
}
