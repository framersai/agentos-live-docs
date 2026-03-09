export { FPS, WIDTH, HEIGHT } from './timing';

export const TRANSITION = 15; // 0.5s crossfade overlap (matches existing)

export const WB_SCENE = {
  intro: 150, // 5s — title card
  streaming: 540, // 18s — SSE chunk inspector
  agency: 540, // 18s — multi-agent delegation
  personas: 360, // 12s — persona catalog + wizard
  planning: 360, // 12s — workflows + planning dashboard
  evaluation: 300, // 10s — eval runner
  themes: 240, // 8s — theme showcase
  closingCTA: 210, // 7s — CTA
} as const;

const sceneValues = Object.values(WB_SCENE);
const numTransitions = sceneValues.length - 1; // 7 transitions between 8 scenes

export const WB_TOTAL_DURATION =
  sceneValues.reduce((a, b) => a + b, 0) - numTransitions * TRANSITION;
// = 2700 - 105 = 2595 frames ≈ 86.5s
