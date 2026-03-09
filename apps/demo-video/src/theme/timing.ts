export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in frames
export const SCENE = {
  painHook: 180, // 6s
  problemState: 500, // 16.7s — real competitor CLIs
  brandIntro: 525, // 17.5s
  installSequence: 960, // 32s — 2 phases × 480
  screenshotShowcase: 750, // 25s — 7 slides
  featureHighlights: 300, // 10s — 4 cards + radar
  proofSection: 540, // 18s — animated counters
  finalState: 600, // 20s — command center showcase
  rabbitholeCTA: 270, // 9s — final CTA
} as const;

export const TRANSITION = 15; // 0.5s crossfade overlap

export const TOTAL_DURATION =
  SCENE.painHook +
  SCENE.problemState +
  SCENE.brandIntro +
  SCENE.installSequence +
  SCENE.screenshotShowcase +
  SCENE.featureHighlights +
  SCENE.proofSection +
  SCENE.finalState +
  SCENE.rabbitholeCTA -
  8 * TRANSITION; // 8 transitions between 9 scenes
