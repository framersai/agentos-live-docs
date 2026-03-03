import React, { useCallback } from 'react';
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SCENE, TRANSITION, TOTAL_DURATION } from './theme/timing';
import { BrandIntro } from './scenes/BrandIntro';
import { InstallSequence } from './scenes/InstallSequence';
import { ScreenshotShowcase } from './scenes/ScreenshotShowcase';
import { FeatureHighlights } from './scenes/FeatureHighlights';
import { StatsCounter } from './scenes/StatsCounter';
import { EcosystemGrid } from './scenes/EcosystemGrid';
import { RabbitholeCTA } from './scenes/RabbitholeCTA';
import { Watermark } from './components/Watermark';
import { CaptionOverlay } from './components/CaptionOverlay';

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

const PHASE_DURATION = 480; // each install phase

const FADE_IN_FRAMES = 3; // ~0.1s near-instant fade-in
const FADE_OUT_FRAMES = 75; // 2.5s gentle fade-out

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Background music: fast fade-in, gentle fade-out
  const musicVolume = useCallback((f: number) => {
    const fadeIn = interpolate(f, [0, FADE_IN_FRAMES], [0, 0.35], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [TOTAL_DURATION - FADE_OUT_FRAMES, TOTAL_DURATION], [0.35, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.min(fadeIn, fadeOut);
  }, []);

  return (
    <>
      {/* ── Background Soundtrack (145s extended track, covers full ~138s video) ── */}
      <Audio src={staticFile('voiceover/soundtrack.mp3')} volume={musicVolume} />

      {/* ── Scene 1: Brand Intro ── */}
      <Sequence from={starts.brandIntro} durationInFrames={SCENE.brandIntro}>
        <BrandIntro />
        <Audio src={staticFile('voiceover/brand-intro.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 2: Install Sequence (3 phases) ── */}
      <Sequence from={starts.installSequence} durationInFrames={SCENE.installSequence}>
        <InstallSequence />
        {/* Phase 1 voiceover */}
        <Sequence from={10} durationInFrames={PHASE_DURATION - 10}>
          <Audio src={staticFile('voiceover/install-phase1.mp3')} volume={0.9} />
        </Sequence>
        {/* Phase 2 voiceover */}
        <Sequence from={PHASE_DURATION + 10} durationInFrames={PHASE_DURATION - 10}>
          <Audio src={staticFile('voiceover/install-phase2.mp3')} volume={0.9} />
        </Sequence>
        {/* Phase 3 voiceover (shorter: 345 frames) */}
        <Sequence from={PHASE_DURATION * 2 + 10} durationInFrames={345 - 10}>
          <Audio src={staticFile('voiceover/install-phase3.mp3')} volume={0.9} />
        </Sequence>
      </Sequence>

      {/* ── Scene 3: Screenshot Showcase ── */}
      <Sequence from={starts.screenshotShowcase} durationInFrames={SCENE.screenshotShowcase}>
        <ScreenshotShowcase />
        <Audio src={staticFile('voiceover/screenshots.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 4: Feature Highlights ── */}
      <Sequence from={starts.featureHighlights} durationInFrames={SCENE.featureHighlights}>
        <FeatureHighlights />
        <Audio src={staticFile('voiceover/features.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 5: Stats Counter ── */}
      <Sequence from={starts.statsCounter} durationInFrames={SCENE.statsCounter}>
        <StatsCounter />
        <Audio src={staticFile('voiceover/stats.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 6: Ecosystem Grid ── */}
      <Sequence from={starts.ecosystemGrid} durationInFrames={SCENE.ecosystemGrid}>
        <EcosystemGrid />
        <Audio src={staticFile('voiceover/ecosystem.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Watermark overlay (scenes 2–6) ── */}
      <Sequence
        from={starts.installSequence}
        durationInFrames={starts.rabbitholeCTA - starts.installSequence}
      >
        <Watermark durationInFrames={starts.rabbitholeCTA - starts.installSequence} />
      </Sequence>

      {/* ── Scene 7: Rabbithole CTA ── */}
      <Sequence from={starts.rabbitholeCTA} durationInFrames={SCENE.rabbitholeCTA}>
        <RabbitholeCTA />
        <Audio src={staticFile('voiceover/cta.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Animated Captions (global frame timing, not wrapped in Sequence) ── */}
      <CaptionOverlay />
    </>
  );
};
