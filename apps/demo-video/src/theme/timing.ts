export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene durations in frames — must exceed voiceover duration + ~1s buffer
export const SCENE = {
  brandIntro: 750, // 25s (voiceover ~23.7s — includes Ollama offline line)
  installSequence: 1305, // 43.5s (phases 1+2: 480 each, phase 3: 345 compressed)
  screenshotShowcase: 720, // 24s (voiceover ~10.9s + human-readable slide durations)
  featureHighlights: 420, // 14s (voiceover ~12.3s)
  statsCounter: 500, // 16.7s (voiceover ~15.3s)
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
