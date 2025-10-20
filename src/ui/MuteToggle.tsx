import React from 'react';

interface Props {
  muted: boolean;
  onToggle: () => void;
}

export default function MuteToggle({ muted, onToggle }: Props) {
  return (
    <button onClick={onToggle} title={muted ? 'Unmute' : 'Mute'} style={styles.button}>
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    border: 'none',
    background: 'rgba(255,255,255,0.8)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    fontSize: 18
  }
};
