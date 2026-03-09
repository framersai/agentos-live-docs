import React, { useCallback } from 'react';
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SCENE, TRANSITION, TOTAL_DURATION } from './theme/timing';
import { PainHook } from './scenes/PainHook';
import { ProblemState } from './scenes/ProblemState';
import { BrandIntro } from './scenes/BrandIntro';
import { InstallSequence } from './scenes/InstallSequence';
import { ScreenshotShowcase } from './scenes/ScreenshotShowcase';
import { FeatureHighlights } from './scenes/FeatureHighlights';
import { ProofSection } from './scenes/ProofSection';
import { FinalState } from './scenes/FinalState';
import { RabbitholeCTA } from './scenes/RabbitholeCTA';
import { Watermark } from './components/Watermark';
import { CaptionOverlay } from './components/CaptionOverlay';

// Calculate cumulative start frames with transition overlaps
const starts = {
  painHook: 0,
  problemState: SCENE.painHook - TRANSITION,
  brandIntro: SCENE.painHook + SCENE.problemState - 2 * TRANSITION,
  installSequence: SCENE.painHook + SCENE.problemState + SCENE.brandIntro - 3 * TRANSITION,
  screenshotShowcase:
    SCENE.painHook + SCENE.problemState + SCENE.brandIntro + SCENE.installSequence - 4 * TRANSITION,
  featureHighlights:
    SCENE.painHook +
    SCENE.problemState +
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase -
    5 * TRANSITION,
  proofSection:
    SCENE.painHook +
    SCENE.problemState +
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights -
    6 * TRANSITION,
  finalState:
    SCENE.painHook +
    SCENE.problemState +
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights +
    SCENE.proofSection -
    7 * TRANSITION,
  rabbitholeCTA:
    SCENE.painHook +
    SCENE.problemState +
    SCENE.brandIntro +
    SCENE.installSequence +
    SCENE.screenshotShowcase +
    SCENE.featureHighlights +
    SCENE.proofSection +
    SCENE.finalState -
    8 * TRANSITION,
};

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
      {/* ── Background Soundtrack ── */}
      <Audio src={staticFile('voiceover/soundtrack.mp3')} volume={musicVolume} />

      {/* ── Scene 1: Pain Hook ── */}
      <Sequence from={starts.painHook} durationInFrames={SCENE.painHook}>
        <PainHook />
        <Audio src={staticFile('voiceover/pain-hook.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 2: Problem State ── */}
      <Sequence from={starts.problemState} durationInFrames={SCENE.problemState}>
        <ProblemState />
        <Audio src={staticFile('voiceover/problem-state.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 3: Brand Intro ── */}
      <Sequence from={starts.brandIntro} durationInFrames={SCENE.brandIntro}>
        <BrandIntro />
        <Audio src={staticFile('voiceover/brand-intro.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 4: Install Sequence (setup + chat demos) ── */}
      <Sequence from={starts.installSequence} durationInFrames={SCENE.installSequence}>
        <InstallSequence />
        {/* Phase 1: setup voiceover */}
        <Sequence from={10} durationInFrames={480 - 10}>
          <Audio src={staticFile('voiceover/install-setup.mp3')} volume={0.9} />
        </Sequence>
        {/* Phase 2: chat voiceover */}
        <Sequence from={480 + 10} durationInFrames={480 - 10}>
          <Audio src={staticFile('voiceover/install-chat.mp3')} volume={0.9} />
        </Sequence>
      </Sequence>

      {/* ── Scene 5: Screenshot Showcase ── */}
      <Sequence from={starts.screenshotShowcase} durationInFrames={SCENE.screenshotShowcase}>
        <ScreenshotShowcase />
        <Audio src={staticFile('voiceover/screenshot-showcase.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 6: Feature Highlights ── */}
      <Sequence from={starts.featureHighlights} durationInFrames={SCENE.featureHighlights}>
        <FeatureHighlights />
        <Audio src={staticFile('voiceover/feature-highlights.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 7: Proof Section ── */}
      <Sequence from={starts.proofSection} durationInFrames={SCENE.proofSection}>
        <ProofSection />
        <Audio src={staticFile('voiceover/proof.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Watermark overlay (scenes 2–8) ── */}
      <Sequence
        from={starts.problemState}
        durationInFrames={starts.rabbitholeCTA - starts.problemState}
      >
        <Watermark durationInFrames={starts.rabbitholeCTA - starts.problemState} />
      </Sequence>

      {/* ── Scene 8: Final State ── */}
      <Sequence from={starts.finalState} durationInFrames={SCENE.finalState}>
        <FinalState />
        <Audio src={staticFile('voiceover/final-state.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Scene 9: Rabbithole CTA ── */}
      <Sequence from={starts.rabbitholeCTA} durationInFrames={SCENE.rabbitholeCTA}>
        <RabbitholeCTA />
        <Audio src={staticFile('voiceover/cta.mp3')} volume={0.9} />
      </Sequence>

      {/* ── Animated Captions (global frame timing) ── */}
      <CaptionOverlay />
    </>
  );
};
