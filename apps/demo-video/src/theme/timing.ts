export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in frames — must exceed voiceover duration + ~1s buffer
export const SCENE = {
  brandIntro: 540, // 18s (voiceover ~16.7s)
  installSequence: 1380, // 46s (phases 1+2: 480 each, phase 3: 420 compressed)
  screenshotShowcase: 540, // 18s (voiceover ~10.9s + readable slide durations)
  featureHighlights: 420, // 14s (voiceover ~12.3s)
  statsCounter: 340, // 11.3s (voiceover ~10.1s)
  ecosystemGrid: 360, // 12s (voiceover ~10.3s)
  rabbitholeCTA: 330, // 11s (voiceover ~9.4s)
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
