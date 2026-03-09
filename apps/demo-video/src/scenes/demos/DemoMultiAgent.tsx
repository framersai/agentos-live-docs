import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AOS } from '../../theme/colors';
import { VideoClip, VideoKeyframe } from '../../components/VideoClip';
import { SceneBadge } from '../../components/SceneBadge';
import { CaptionOverlay } from '../../components/CaptionOverlay';
import { MULTI_AGENT_CAPTIONS } from '../../data/demo-captions';

const KEYFRAMES: VideoKeyframe[] = [
  { frame: 0, scale: 1.0, x: 0, y: 0 },
  { frame: 1312, scale: 1.04, x: 0, y: -8 },
];

export const DemoMultiAgent: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: AOS.bgGradient }}>
      <VideoClip src="recordings/agency.mp4" keyframes={KEYFRAMES} chrome />
      <SceneBadge label="Multi-Agent System" color={AOS.emerald} />
      <CaptionOverlay captions={MULTI_AGENT_CAPTIONS} />
    </AbsoluteFill>
  );
};
