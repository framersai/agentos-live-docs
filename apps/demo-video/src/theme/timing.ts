export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in frames
export const SCENE = {
  brandIntro: 150, // 5s
  installSequence: 210, // 7s
  screenshotShowcase: 300, // 10s
  featureHighlights: 240, // 8s
  statsCounter: 180, // 6s
  ecosystemGrid: 150, // 5s
  rabbitholeCTA: 120, // 4s
} as const;

export const TRANSITION = 15; // 0.5s crossfade overlap

export const TOTAL_DURATION =
  SCENE.brandIntro +
  SCENE.installSequence +
  SCENE.screenshotShowcase +
  SCENE.featureHighlights +
  SCENE.statsCounter +
  SCENE.ecosystemGrid +
  SCENE.rabbitholeCTA -
  6 * TRANSITION; // 6 transitions between 7 scenes
