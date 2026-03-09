import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Gentle zoom out over entire scene
  { frame: 0, scale: 1.08, x: 0, y: -10 },
  { frame: 540, scale: 1.0, x: 0, y: 0 },
];

export const WbAgency: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/agency.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Multi-Agent" color={AOS.emerald} />
    </AbsoluteFill>
  );
};
