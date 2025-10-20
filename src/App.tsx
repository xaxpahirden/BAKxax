import React, { useEffect, useRef, useState } from 'react';
import { GameLoop } from './game/loop';
import { Input } from './game/input';
import { AudioManager } from './game/audio';
import type { GameState, World } from './game/types';
import { createBird, flap as birdFlap, updateBird } from './game/bird';
import {
  PIPE_SPAWN_INTERVAL,
  createPipe,
  updatePipes,
  cullPipes,
  checkPipeCollisions,
  updateScore,
  PIPE_MIN_Y,
  PIPE_MAX_Y,
  PIPE_SPEED
} from './game/pipes';
import { clearCanvas, drawBackground, drawGround, drawPipes, drawBird } from './canvas/renderer';
import StartScreen from './ui/StartScreen';
import GameOver from './ui/GameOver';
import HUD from './ui/HUD';
import MuteToggle from './ui/MuteToggle';

function getStoredHighScore(): number {
  try {
    const v = localStorage.getItem('highScore');
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}
function setStoredHighScore(v: number) {
  try {
    localStorage.setItem('highScore', String(v));
  } catch {}
}

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef<number>(1);

  const [phase, setPhase] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore());
  const [muted, setMuted] = useState(true);

  const worldRef = useRef<World>({ width: 360, height: 640, groundHeight: 90 });

  const stateRef = useRef<GameState | null>(null);
  const groundOffsetRef = useRef(0);

  const audioRef = useRef(new AudioManager());
  const inputRef = useRef(new Input());
  const loopRef = useRef<GameLoop | null>(null);

  // Initialize canvas and pixel ratio scaling
  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const rect = container.getBoundingClientRect();
      worldRef.current.width = Math.max(320, Math.floor(rect.width));
      worldRef.current.height = Math.max(480, Math.floor(rect.height));
      canvas.width = Math.floor(worldRef.current.width * dpr);
      canvas.height = Math.floor(worldRef.current.height * dpr);
      canvas.style.width = worldRef.current.width + 'px';
      canvas.style.height = worldRef.current.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, []);

  // Game state setup and loop
  useEffect(() => {
    function resetGame() {
      const world = worldRef.current;
      const bird = createBird(world);
      stateRef.current = {
        phase: 'menu',
        paused: false,
        score: 0,
        highScore: getStoredHighScore(),
        bird,
        pipes: [],
        timeSinceSpawn: 0
      };
      groundOffsetRef.current = 0;
      setScore(0);
      setPhase('menu');
      setPaused(false);
    }

    resetGame();

    const input = inputRef.current;
    const canvas = canvasRef.current!;
    input.attach(canvas);

    input.onFlap(async () => {
      if (!audioRef.current.enabled) {
        await audioRef.current.initOnUserGesture();
        setMuted(audioRef.current.muted);
      }
      const st = stateRef.current!;
      if (st.phase === 'menu') {
        st.phase = 'playing';
        setPhase('playing');
      }
      if (!st.paused && st.phase === 'playing') {
        birdFlap(st.bird);
        audioRef.current.flap();
      }
    });
    input.onPause(() => {
      const st = stateRef.current!;
      if (st.phase === 'playing') {
        st.paused = !st.paused;
        setPaused(st.paused);
      }
    });
    input.onRestart(() => {
      resetGame();
    });

    const loop = new GameLoop((dt) => {
      const ctx = ctxRef.current;
      const st = stateRef.current!;
      const world = worldRef.current;
      if (!ctx) return;

      // Update
      if (st.phase === 'playing' && !st.paused) {
        // bird
        updateBird(st.bird, dt, world);

        // pipes spawn and update
        st.timeSinceSpawn += dt;
        if (st.timeSinceSpawn >= PIPE_SPAWN_INTERVAL) {
          st.timeSinceSpawn = 0;
          const minY = Math.max(PIPE_MIN_Y, 80);
          const maxY = Math.min(world.height - world.groundHeight - 80, PIPE_MAX_Y);
          const gapY = Math.round(minY + Math.random() * (maxY - minY));
          st.pipes.push(createPipe(world, gapY));
        }
        updatePipes(st.pipes, dt);
        st.pipes = cullPipes(st.pipes, world);

        // score update
        const prevScore = st.score;
        st.score = updateScore(st.pipes, st.bird, st.score);
        if (st.score !== prevScore) {
          setScore(st.score);
          audioRef.current.score();
        }

        // collisions with pipes
        if (checkPipeCollisions(st.pipes, st.bird, world)) {
          audioRef.current.hit();
          st.phase = 'gameover';
          setPhase('gameover');
        }

        // ground collision
        const groundY = world.height - world.groundHeight;
        if (st.bird.y + st.bird.radius >= groundY - 0.5) {
          audioRef.current.hit();
          st.phase = 'gameover';
          setPhase('gameover');
        }

        groundOffsetRef.current += PIPE_SPEED * dt;
      }

      // Render
      clearCanvas(ctx, world);
      drawBackground(ctx, world);
      drawPipes(ctx, world, stateRef.current!.pipes);
      drawGround(ctx, world, groundOffsetRef.current);
      drawBird(ctx, stateRef.current!.bird);
    });

    loopRef.current = loop;
    loop.start();

    return () => {
      input.detach(canvas);
      loop.stop();
    };
  }, []);

  // Update high score on gameover
  useEffect(() => {
    if (phase === 'gameover') {
      const st = stateRef.current!;
      const newHigh = Math.max(st.highScore, st.score);
      st.highScore = newHigh;
      setHighScore(newHigh);
      setStoredHighScore(newHigh);
    }
  }, [phase]);

  const onRetry = () => {
    // reset by emitting restart
    const st = stateRef.current!;
    st.phase = 'menu';
    st.paused = false;
    st.score = 0;
    st.bird = createBird(worldRef.current);
    st.pipes = [];
    st.timeSinceSpawn = 0;
    groundOffsetRef.current = 0;
    setScore(0);
    setPhase('playing');
  };

  const toggleMute = () => {
    const am = audioRef.current;
    if (!am.enabled) return; // must interact first
    am.setMuted(!am.muted);
    setMuted(am.muted);
  };

  const startGame = () => {
    const st = stateRef.current!;
    if (st.phase !== 'playing') {
      st.phase = 'playing';
      setPhase('playing');
    }
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* UI Overlay */}
      {phase === 'menu' && <StartScreen highScore={highScore} onStart={startGame} />}
      {phase === 'playing' && <HUD score={score} highScore={highScore} paused={paused} />}
      {phase === 'gameover' && <GameOver score={score} highScore={highScore} onRetry={onRetry} />}

      <MuteToggle muted={muted} onToggle={toggleMute} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
    touchAction: 'manipulation'
  }
};
