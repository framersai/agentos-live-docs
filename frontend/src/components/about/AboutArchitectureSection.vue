<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDownIcon, CodeBracketSquareIcon } from '@heroicons/vue/24/outline';
import DiagramViewer from '@/components/DiagramViewer.vue';
import { themeManager } from '@/theme/ThemeManager';

const diagrams = {
  systemOverview: `
    graph TD
      subgraph User Interaction Layer [dY"? User Interaction Layer]
        UI[dYO? User Interface (Ephemeral Harmony)]
      end
      subgraph Orchestration & Intelligence Core [?sT?,? Orchestration & Intelligence Core]
        Orchestrator[?s? AgentOS Orchestrator]
        GMI{"dY? Generalized Mind Instance (GMI)"}
      end
      subgraph Core Services [dY>??,? Core Services]
        Persona[dYZ- Persona Engine]
        Memory[dY'_ Memory Core]
        Knowledge[dY"s Knowledge Interface (RAG)]
        Tools[dY" Tool & Function Executor]
      end
      subgraph External Systems [?~??,? External Systems]
        LLMs[dY- LLM Providers]
        APIs[dY"O External APIs & Services]
        DataSources[dY"S User Data Sources]
      end

      UI --> Orchestrator;
      Orchestrator --> GMI;
      GMI --> Persona; GMI --> Memory; GMI --> Knowledge; GMI --> Tools;
      GMI --> LLMs;
      Knowledge --> DataSources; Tools --> APIs;

      classDef default fill:var(--color-bg-tertiary),stroke:var(--color-border-primary),color:var(--color-text-primary),rx:var(--radius-md),ry:var(--radius-md);
      classDef userInteraction fill:var(--color-accent-primary-light-hsl, var(--color-accent-primary)),stroke:var(--color-accent-primary),color:var(--color-text-on-primary),fontWeight:bold;
      classDef orchestration fill:var(--color-accent-secondary-light-hsl, var(--color-accent-secondary)),stroke:var(--color-accent-secondary),color:var(--color-text-on-secondary),fontWeight:bold;
      classDef coreSvc fill:hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), calc(var(--color-bg-tertiary-l) + 8%)),stroke:var(--color-border-primary),color:var(--color-text-primary);
      classDef external fill:var(--color-bg-secondary),stroke:var(--color-border-primary),color:var(--color-text-primary);

      class UI userInteraction;
      class Orchestrator,GMI orchestration;
      class Persona,Memory,Knowledge,Tools coreSvc;
      class LLMs,APIs,DataSources external;
  `,
  dataFlow: `
    sequenceDiagram
      participant User
      participant F as Frontend (UI)
      participant O as AgentOS Orchestrator
      participant KB as Knowledge Base (RAG)
      participant LLM as Large Language Model

      User->>+F: Input (Voice/Text)
      F->>+O: API Request (Input, Context)
      O->>O: 1. Analyze Intent
      O->>+KB: 2. Query Knowledge
      KB-->>-O: 3. Retrieved Info
      O->>O: 4. Build Adaptive Prompt
      O->>+LLM: 5. Send Prompt to LLM
      LLM-->>-O: 6. LLM Response
      O->>O: 7. Process & Format Response
      O-->>-F: 8. Structured Output
      F->>-User: Display / Speak
  `,
  promptEngine: `
    graph LR
      UserInput[dY-??,? User Input] --> QueryAnalyzer;
      SessionCtx[dY"? Session Context] --> QueryAnalyzer;
      QueryAnalyzer -- Intent & Entities --> PromptStrategist;
      subgraph PersonaContext [dYZ- Active Persona]
        PersonaDef[Core Directives]
        PersonaMem[Memories]
        PersonaStyle[Style]
      end
      subgraph KnowledgeContext [dY"s Knowledge]
        Docs[Retrieved Docs (RAG)]
        DBRes[DB Results]
      end
      subgraph ToolContext [dY>??,? Tools]
        ToolDefs[Tool Signatures]
      end
      PromptStrategist --> PromptAssembler;
      PersonaContext --> PromptStrategist;
      KnowledgeContext --> PromptStrategist;
      ToolContext --> PromptStrategist;
      PromptAssembler --> FinalFormatter;
      FinalFormatter --> OptimizedLLMPrompt[dYs? Optimized Prompt];
  `,
};

const isOpen = ref(false);
const isDarkMode = computed(() => themeManager.getCurrentTheme().value?.isDark || false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <section id="architecture" class="architecture-diagrams-about content-section-ephemeral">
    <button @click="toggle" class="expandable-header-button-about section-title-main --expandable">
      <span class="expandable-title-text"><CodeBracketSquareIcon class="section-title-icon" />AgentOS Technical Architecture</span>
      <ChevronDownIcon class="chevron-indicator-about --section-title" :class="{ rotated: isOpen }" />
    </button>
    <div class="expandable-content-wrapper-about" :class="{ open: isOpen }">
      <div class="diagrams-grid-about">
        <div class="diagram-card-about card-glass-interactive">
          <h4 class="diagram-card-title">System Overview</h4>
          <p class="diagram-card-description">High-level view of AgentOS, from UI to LLMs, highlighting the Orchestrator and GMI.</p>
          <DiagramViewer :diagramCode="diagrams.systemOverview" diagramType="mermaid" :is-dark-mode="isDarkMode" class="diagram-viewer-about" />
        </div>
        <div class="diagram-card-about card-glass-interactive">
          <h4 class="diagram-card-title">Data Flow Architecture</h4>
          <p class="diagram-card-description">Illustrates data processing from user input to AI response, including RAG and prompt generation.</p>
          <DiagramViewer :diagramCode="diagrams.dataFlow" diagramType="mermaid" :is-dark-mode="isDarkMode" class="diagram-viewer-about" />
        </div>
        <div class="diagram-card-about card-glass-interactive">
          <h4 class="diagram-card-title">Adaptive Prompt Engine</h4>
          <p class="diagram-card-description">Details the dynamic construction of optimized LLM prompts.</p>
          <DiagramViewer :diagramCode="diagrams.promptEngine" diagramType="mermaid" :is-dark-mode="isDarkMode" class="diagram-viewer-about" />
        </div>
      </div>
    </div>
  </section>
</template>
