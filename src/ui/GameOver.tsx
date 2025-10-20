import React from 'react';

interface Props {
  score: number;
  highScore: number;
  onRetry: () => void;
}

export default function GameOver({ score, highScore, onRetry }: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Game Over</h2>
        <div style={{ fontSize: 18, marginBottom: 6 }}>Score: {score}</div>
        <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>Best: {highScore}</div>
        <button onClick={onRetry} style={styles.button}>
          Retry
        </button>
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
    background: 'rgba(0,0,0,0.35)',
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
