import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { SCENE, TRANSITION } from './theme/timing';
import { BrandIntro } from './scenes/BrandIntro';
import { InstallSequence } from './scenes/InstallSequence';
import { ScreenshotShowcase } from './scenes/ScreenshotShowcase';
import { FeatureHighlights } from './scenes/FeatureHighlights';
import { StatsCounter } from './scenes/StatsCounter';
import { EcosystemGrid } from './scenes/EcosystemGrid';
import { RabbitholeCTA } from './scenes/RabbitholeCTA';

// Calculate cumulative start frames with transition overlaps
const starts = {
  brandIntro: 0,
  installSequence: SCENE.brandIntro - TRANSITION,
  screenshotShowcase: SCENE.brandIntro + SCENE.installSequence - 2 * TRANSITION,
  featureHighlights:
    SCENE.brandIntro + SCENE.installSequence + SCENE.screenshotShowcase - 3 * TRANSITION,
  statsCounter:
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights -
    4 * TRANSITION,
  ecosystemGrid:
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights +
    SCENE.statsCounter -
    5 * TRANSITION,
  rabbitholeCTA:
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights +
    SCENE.statsCounter +
    SCENE.ecosystemGrid -
    6 * TRANSITION,
};

export const DemoVideo: React.FC = () => {
  return (
    <>
      <Sequence from={starts.brandIntro} durationInFrames={SCENE.brandIntro}>
        <BrandIntro />
      </Sequence>

      <Sequence from={starts.installSequence} durationInFrames={SCENE.installSequence}>
        <InstallSequence />
      </Sequence>

      <Sequence from={starts.screenshotShowcase} durationInFrames={SCENE.screenshotShowcase}>
        <ScreenshotShowcase />
      </Sequence>

      <Sequence from={starts.featureHighlights} durationInFrames={SCENE.featureHighlights}>
        <FeatureHighlights />
      </Sequence>

      <Sequence from={starts.statsCounter} durationInFrames={SCENE.statsCounter}>
        <StatsCounter />
      </Sequence>

      <Sequence from={starts.ecosystemGrid} durationInFrames={SCENE.ecosystemGrid}>
        <EcosystemGrid />
      </Sequence>

      <Sequence from={starts.rabbitholeCTA} durationInFrames={SCENE.rabbitholeCTA}>
        <RabbitholeCTA />
      </Sequence>
    </>
  );
};
