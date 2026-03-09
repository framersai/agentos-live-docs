import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const TRANSITION = 15; // frames of overlap for crossfade

interface Chapter {
  label: string;
  durationInFrames: number;
  src: string;
  /** Frame offset into source video (source is 25fps) */
  startFrom: number;
  playbackRate: number;
  keyframes: VideoKeyframe[];
  badgeColor: string;
}

// Source: personas.mp4 — 85.6s @ 25fps (2141 frames), recorded with Playwright.
// Content timeline (25fps):
//   0-3s (f0-75):     Black intro
//   3-14s (f75-350):  Persona Catalog visible
//   15-20s (f375-500): Wizard opens, Step 1 empty
//   20-25s (f500-625): Step 1 filled (Market Intelligence Analyst)
//   25-35s (f625-875): Step 2 Config (system prompt, model, tokens)
//   35-45s (f875-1125): Step 3 Guardrails → Step 4 Extensions
//   45-55s (f1125-1375): Extensions checked, create button
//   55-60s (f1375-1500): Created! Back to catalog with 5 personas
//   60-65s (f1500-1625): Compose tab opens
//   65-75s (f1625-1875): Streaming response in progress → complete
//   75-85s (f1875-2141): Completed response visible
const chapters: Chapter[] = [
  {
    label: 'Persona Catalog',
    durationInFrames: 120, // 4s at 30fps output
    src: 'recordings/personas.mp4',
    startFrom: 100, // ~4s in — skip black, show catalog
    playbackRate: 1.5,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 120, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.primaryLight,
  },
  {
    label: 'Name & Description',
    durationInFrames: 150, // 5s
    src: 'recordings/personas.mp4',
    startFrom: 375, // 15s — wizard opens
    playbackRate: 2,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 150, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.accent,
  },
  {
    label: 'System Prompt & Model',
    durationInFrames: 120, // 4s
    src: 'recordings/personas.mp4',
    startFrom: 625, // 25s — Step 2 Config
    playbackRate: 2,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 120, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.accent,
  },
  {
    label: 'Guardrails & Extensions',
    durationInFrames: 150, // 5s
    src: 'recordings/personas.mp4',
    startFrom: 875, // 35s — Step 3 guardrails
    playbackRate: 2.5,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 150, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.emerald,
  },
  {
    label: 'Persona Created',
    durationInFrames: 120, // 4s
    src: 'recordings/personas.mp4',
    startFrom: 1450, // 58s — creation complete, catalog shows 5 personas
    playbackRate: 1.5,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 120, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.cyan,
  },
  {
    label: 'Streaming Response',
    durationInFrames: 180, // 6s
    src: 'recordings/personas.mp4',
    startFrom: 1700, // 68s — compose with prompt typed, streaming begins
    playbackRate: 1.5,
    keyframes: [
      { frame: 0, scale: 1.0, x: 0, y: 0 },
      { frame: 180, scale: 1.0, x: 0, y: 0 },
    ],
    badgeColor: AOS.primaryLight,
  },
];

// Calculate cumulative start frames with transition overlap
function getChapterStarts(): number[] {
  const starts: number[] = [0];
  for (let i = 1; i < chapters.length; i++) {
    starts.push(starts[i - 1] + chapters[i - 1].durationInFrames - TRANSITION);
  }
  return starts;
}

const chapterStarts = getChapterStarts();

export const DEMO_AGENT_CREATION_DURATION =
  chapterStarts[chapterStarts.length - 1] + chapters[chapters.length - 1].durationInFrames;

export const DemoAgentCreation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      {chapters.map((ch, i) => (
        <Sequence key={ch.label} from={chapterStarts[i]} durationInFrames={ch.durationInFrames}>
          <VideoClip
            src={ch.src}
            keyframes={ch.keyframes}
            startFrom={ch.startFrom}
            playbackRate={ch.playbackRate}
            chrome
          />
          <SceneBadge label={ch.label} color={ch.badgeColor} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
