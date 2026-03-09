import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Slight drift right + zoom over entire scene
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 360, scale: 1.06, x: 10, y: 0 },
];

export const WbPersonas: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/personas.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Personas" color={AOS.primaryLight} />
    </AbsoluteFill>
  );
};
