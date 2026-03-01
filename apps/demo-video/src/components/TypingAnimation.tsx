import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface TypingAnimationProps {
  text: string;
  startFrame: number;
  typingDuration: number; // frames to type the full text
  color?: string;
  prefix?: React.ReactNode;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  startFrame,
  typingDuration,
  color = '#f0eeff',
  prefix,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  const revealedChars = Math.floor(
    interpolate(elapsed, [0, typingDuration], [0, text.length], {
      extrapolateRight: 'clamp',
    })
  );

  const displayText = text.substring(0, revealedChars);
  const isTyping = revealedChars < text.length;
  const cursorVisible = isTyping && Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{ color }}>
      {prefix}
      {displayText}
      {cursorVisible && <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>|</span>}
    </div>
  );
};
