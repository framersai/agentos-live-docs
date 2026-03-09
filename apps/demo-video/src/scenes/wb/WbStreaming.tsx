import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';

const KEYFRAMES: VideoKeyframe[] = [
  // Gentle slow zoom in over entire scene
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 540, scale: 1.08, x: 0, y: -15 },
];

export const WbStreaming: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/streaming.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Streaming Inspector" color={AOS.cyan} />
    </AbsoluteFill>
  );
};
