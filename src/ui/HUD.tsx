import React from 'react';

interface Props {
  score: number;
  highScore: number;
  paused: boolean;
}

export default function HUD({ score, highScore, paused }: Props) {
  return (
    <div style={styles.hud}>
      <div style={styles.left}>Best: {highScore}</div>
      <div style={styles.center}>{score}</div>
      <div style={styles.right}>{paused ? 'Paused (P)' : ''}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  hud: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    color: '#233',
    fontWeight: 700,
    textShadow: '0 1px 0 rgba(255,255,255,0.4)'
  },
  left: { fontSize: 14 },
  center: { fontSize: 28 },
  right: { fontSize: 14 }
};
