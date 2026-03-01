import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { W } from '../theme/colors';
import { syne, jetbrainsMono } from '../theme/fonts';
import { Terminal } from '../components/Terminal';
import { TypingAnimation } from '../components/TypingAnimation';
import { FloatingParticles } from '../components/FloatingParticles';

const LINES = [
  { type: 'comment', text: '# Install globally', start: 5 },
  { type: 'cmd', text: 'npm install -g wunderland', start: 15, typeDuration: 25 },
  { type: 'output', text: '  added 1 package in 2.4s', start: 50 },
  { type: 'blank', start: 60 },
  { type: 'comment', text: '# Interactive setup wizard', start: 65 },
  { type: 'cmd', text: 'wunderland setup', start: 75, typeDuration: 18 },
  { type: 'output', text: '  Choose a preset: Research Assistant', start: 100 },
  { type: 'output', text: '  LLM Provider: openai (gpt-4o)', start: 110 },
  { type: 'output', text: '  Skills: web-search, summarize, github', start: 120 },
  { type: 'output', text: '  Channel: telegram', start: 130 },
  { type: 'blank', start: 140 },
  { type: 'comment', text: '# Start chatting', start: 145 },
  { type: 'cmd', text: 'wunderland chat', start: 155, typeDuration: 16 },
  { type: 'output', text: '  Agent "Research Assistant" ready.', start: 178 },
  { type: 'output', text: '  HEXACO: H:0.9 E:0.3 X:0.4 A:0.7 C:0.95 O:0.85', start: 188 },
  { type: 'output', text: '  Mood: NEUTRAL (P:0.0 A:0.0 D:0.0)', start: 198 },
] as const;

export const InstallSequence: React.FC = () => {
  const frame = useCurrentFrame();

  const terminalScale = interpolate(frame, [0, 15], [0.95, 1], { extrapolateRight: 'clamp' });
  const terminalOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: W.bgVoid, justifyContent: 'center', alignItems: 'center' }}>
      <FloatingParticles count={15} />

      <div
        style={{
          width: 900,
          zIndex: 1,
          transform: `scale(${terminalScale})`,
          opacity: terminalOpacity,
        }}
      >
        <div
          style={{
            fontFamily: syne,
            fontSize: 18,
            color: W.textTertiary,
            textAlign: 'center',
            marginBottom: 16,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
          }}
        >
          Get Running in 60 Seconds
        </div>

        <Terminal title="terminal">
          {LINES.map((line, i) => {
            if (line.type === 'blank') return <div key={i} style={{ height: 8 }} />;

            const lineOpacity =
              line.type === 'cmd'
                ? 1
                : interpolate(frame, [line.start, line.start + 8], [0, 1], {
                    extrapolateRight: 'clamp',
                  });

            if (frame < line.start) return null;

            if (line.type === 'comment') {
              return (
                <div
                  key={i}
                  style={{ opacity: lineOpacity, color: W.textTertiary, fontFamily: jetbrainsMono }}
                >
                  {line.text}
                </div>
              );
            }

            if (line.type === 'cmd') {
              return (
                <TypingAnimation
                  key={i}
                  text={line.text}
                  startFrame={line.start}
                  typingDuration={line.typeDuration ?? 20}
                  prefix={<span style={{ color: W.accent }}>$ </span>}
                />
              );
            }

            return (
              <div
                key={i}
                style={{ opacity: lineOpacity, color: W.emerald, fontFamily: jetbrainsMono }}
              >
                {line.text}
              </div>
            );
          })}
        </Terminal>
      </div>
    </AbsoluteFill>
  );
};
