import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';
import { CaptionOverlay } from '../../components/CaptionOverlay';
import { RAG_MEMORY_CAPTIONS } from '../../data/demo-captions';

const KEYFRAMES: VideoKeyframe[] = [
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 991, scale: 1.04, x: 0, y: -6 },
];

export const DemoRagMemory: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/evaluation.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="RAG Memory" color={AOS.accent} />
      <CaptionOverlay captions={RAG_MEMORY_CAPTIONS} />
    </AbsoluteFill>
  );
};
