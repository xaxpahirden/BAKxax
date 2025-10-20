import React from 'react';

interface Props {
  highScore: number;
  onStart: () => void;
}

export default function StartScreen({ highScore, onStart }: Props) {
  return (
    <div style={styles.overlay} onClick={onStart} role="button" tabIndex={0}>
      <div style={styles.card}>
        <h1 style={{ margin: 0 }}>Flappy Bird</h1>
        <p>Tap or press Space/Up/W to flap</p>
        <p>Press P to pause, R to restart</p>
        <button onClick={onStart} style={styles.button}>
          Start
        </button>
        <div style={{ marginTop: 12, opacity: 0.8 }}>High score: {highScore}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.25)',
    color: '#fff'
  },
  card: {
    background: 'rgba(0,0,0,0.6)',
    padding: 20,
    borderRadius: 12,
    textAlign: 'center',
    minWidth: 260
  },
  button: {
    fontSize: 16,
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#ffcc00'
  }
};
