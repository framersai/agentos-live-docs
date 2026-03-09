import { CaptionEntry } from './captions';

// streaming.mp4 — 44s / 1320 frames
export const STREAMING_CAPTIONS: CaptionEntry[] = [
  { text: 'Send a prompt and watch every token stream back in real-time', from: 30, to: 210 },
  { text: 'Color-coded output: text, tool calls, and metadata', from: 280, to: 460 },
  { text: 'Streaming responses with full context awareness', from: 530, to: 710 },
  { text: 'Inspect token-level telemetry in the bottom bar', from: 780, to: 960 },
  { text: 'End-to-end streaming — prompt to complete response', from: 1030, to: 1260 },
];

// personas.mp4 — 180s / 5400 frames (full wizard walkthrough)
export const AGENT_CREATION_CAPTIONS: CaptionEntry[] = [
  { text: 'Browse the persona catalog', from: 60, to: 300 },
  { text: 'Open the creation wizard', from: 420, to: 660 },
  { text: 'Step 1 — Name, description, tags, and traits', from: 780, to: 1200 },
  { text: 'Step 2 — System prompt, model, and cost strategy', from: 1500, to: 1920 },
  { text: 'Step 3 — Safety guardrails and compliance policies', from: 2220, to: 2640 },
  { text: 'Step 4 — Attach tools and integrations', from: 2940, to: 3360 },
  { text: 'Finalize and create the persona', from: 3660, to: 3960 },
  { text: 'Market Intelligence Analyst — ready for sessions', from: 4200, to: 5200 },
];

// agency.mp4 — 44s / 1312 frames
export const MULTI_AGENT_CAPTIONS: CaptionEntry[] = [
  { text: 'Spin up multi-agent teams with role-based delegation', from: 30, to: 220 },
  { text: 'Researcher, Analyst, Creator — working in parallel', from: 290, to: 480 },
  { text: 'Watch agents coordinate and hand off tasks in real-time', from: 550, to: 740 },
  { text: 'Aggregated results from all agents in a unified view', from: 810, to: 1000 },
  { text: 'Full orchestration — from task to final output', from: 1070, to: 1260 },
];

// evaluation.mp4 — 33s / 991 frames
export const RAG_MEMORY_CAPTIONS: CaptionEntry[] = [
  { text: 'Run evaluation suites to track quality over time', from: 30, to: 200 },
  { text: 'Pass/fail per test case with detailed scoring metrics', from: 270, to: 450 },
  { text: 'Compare results across model versions side by side', from: 520, to: 700 },
  { text: 'Continuous monitoring — catch regressions before they ship', from: 770, to: 940 },
];

// workflows.mp4 — 37s / 1103 frames
export const PLANNING_ENGINE_CAPTIONS: CaptionEntry[] = [
  { text: 'Multi-step task decomposition with confidence scores', from: 30, to: 210 },
  { text: 'Pause, resume, and advance — full execution control', from: 280, to: 460 },
  { text: 'Each step tracked with status and dependencies', from: 530, to: 700 },
  { text: 'Complete workflow orchestration from plan to execution', from: 770, to: 1050 },
];
