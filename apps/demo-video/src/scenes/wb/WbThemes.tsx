import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Gentle zoom out over entire scene
  { frame: 0, scale: 1.05, x: 0, y: 0 },
  { frame: 240, scale: 1.0, x: 0, y: 0 },
];

export const WbThemes: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/themes.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Themes" color={AOS.accentLight} />
    </AbsoluteFill>
  );
};
