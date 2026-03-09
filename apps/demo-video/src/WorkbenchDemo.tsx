import React from 'react';
import { Sequence } from 'remotion';
import { WB_SCENE, TRANSITION } from './theme/wb-timing';
import { WbIntro } from './scenes/wb/WbIntro';
import { WbStreaming } from './scenes/wb/WbStreaming';
import { WbAgency } from './scenes/wb/WbAgency';
import { WbPersonas } from './scenes/wb/WbPersonas';
import { WbPlanning } from './scenes/wb/WbPlanning';
import { WbEvaluation } from './scenes/wb/WbEvaluation';
import { WbThemes } from './scenes/wb/WbThemes';
import { WbClosingCTA } from './scenes/wb/WbClosingCTA';
import { Watermark } from './components/Watermark';
import { CaptionOverlay } from './components/CaptionOverlay';
import { WB_CAPTIONS } from './data/wb-captions';

// Calculate cumulative start frames with transition overlaps
const S = WB_SCENE;
const T = TRANSITION;

const starts = {
  intro: 0,
  streaming: S.intro - T,
  agency: S.intro + S.streaming - 2 * T,
  personas: S.intro + S.streaming + S.agency - 3 * T,
  planning: S.intro + S.streaming + S.agency + S.personas - 4 * T,
  evaluation: S.intro + S.streaming + S.agency + S.personas + S.planning - 5 * T,
  themes: S.intro + S.streaming + S.agency + S.personas + S.planning + S.evaluation - 6 * T,
  closingCTA:
    S.intro + S.streaming + S.agency + S.personas + S.planning + S.evaluation + S.themes - 7 * T,
};

export const WorkbenchDemo: React.FC = () => {
  return (
    <>
      {/* ── Scene 1: Intro Title Card ── */}
      <Sequence from={starts.intro} durationInFrames={S.intro}>
        <WbIntro />
      </Sequence>

      {/* ── Scene 2: Streaming Inspector ── */}
      <Sequence from={starts.streaming} durationInFrames={S.streaming}>
        <WbStreaming />
      </Sequence>

      {/* ── Scene 3: Multi-Agent Orchestration ── */}
      <Sequence from={starts.agency} durationInFrames={S.agency}>
        <WbAgency />
      </Sequence>

      {/* ── Scene 4: Persona Catalog ── */}
      <Sequence from={starts.personas} durationInFrames={S.personas}>
        <WbPersonas />
      </Sequence>

      {/* ── Scene 5: Workflow & Planning ── */}
      <Sequence from={starts.planning} durationInFrames={S.planning}>
        <WbPlanning />
      </Sequence>

      {/* ── Scene 6: Evaluation Runner ── */}
      <Sequence from={starts.evaluation} durationInFrames={S.evaluation}>
        <WbEvaluation />
      </Sequence>

      {/* ── Watermark overlay (scenes 2–7) ── */}
      <Sequence from={starts.streaming} durationInFrames={starts.closingCTA - starts.streaming}>
        <Watermark
          durationInFrames={starts.closingCTA - starts.streaming}
          icon="agentos-icon.png"
          label="agentos.sh"
        />
      </Sequence>

      {/* ── Scene 7: Theme Showcase ── */}
      <Sequence from={starts.themes} durationInFrames={S.themes}>
        <WbThemes />
      </Sequence>

      {/* ── Scene 8: Closing CTA ── */}
      <Sequence from={starts.closingCTA} durationInFrames={S.closingCTA}>
        <WbClosingCTA />
      </Sequence>

      {/* ── Animated Captions (global frame timing) ── */}
      <CaptionOverlay captions={WB_CAPTIONS} />
    </>
  );
};
