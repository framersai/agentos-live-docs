import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';
import { CaptionOverlay } from '../../components/CaptionOverlay';
import { PLANNING_ENGINE_CAPTIONS } from '../../data/demo-captions';

const KEYFRAMES: VideoKeyframe[] = [
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 1103, scale: 1.04, x: 0, y: -8 },
];

export const DemoPlanningEngine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/workflows.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Planning Engine" color={AOS.warm} />
      <CaptionOverlay captions={PLANNING_ENGINE_CAPTIONS} />
    </AbsoluteFill>
  );
};
