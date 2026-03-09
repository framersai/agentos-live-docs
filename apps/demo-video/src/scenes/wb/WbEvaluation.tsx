import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Gentle zoom in over entire scene
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 300, scale: 1.08, x: 0, y: -12 },
];

export const WbEvaluation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/evaluation.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Evaluation" color={AOS.rose} />
    </AbsoluteFill>
  );
};
