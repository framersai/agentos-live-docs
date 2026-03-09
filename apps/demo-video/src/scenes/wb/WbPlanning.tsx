import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Drift left + zoom out over entire scene
  { frame: 0, scale: 1.06, x: -10, y: 0 },
  { frame: 360, scale: 1.0, x: 0, y: 0 },
];

export const WbPlanning: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/workflows.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Planning" color={AOS.accent} />
    </AbsoluteFill>
  );
};
