<script setup lang="ts">
import { ref, reactive, type Component as VueComponent } from 'vue';
import {
  CubeTransparentIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  SparklesIcon,
  UsersIcon,
  RocketLaunchIcon,
  MapIcon,
  CheckIcon,
  CodeBracketSquareIcon,
  LightBulbIcon,
} from '@heroicons/vue/24/outline';

interface AgentOsComponentItem {
  name: string;
  icon: VueComponent;
  description: string;
}

const agentOsComponents = ref<AgentOsComponentItem[]>([
  { name: 'Adaptive Context Engine', icon: SparklesIcon, description: 'Dynamically understands and utilizes conversational context.' },
  { name: 'Dynamic Persona Manager', icon: UsersIcon, description: 'Manages and adapts AI personas for consistent and tailored interactions.' },
  { name: 'Multi-Layered Memory Core', icon: CubeTransparentIcon, description: 'Handles short-term, long-term, and semantic memory.' },
  { name: 'LLM Orchestration & Failover', icon: RocketLaunchIcon, description: 'Intelligently routes requests to various LLMs with robust error handling.' },
  { name: 'Knowledge Synthesis (RAG+)', icon: AcademicCapIcon, description: 'Advanced Retrieval Augmented Generation for informed responses.' },
  { name: 'Real-time Voice I/O Pipeline', icon: AdjustmentsHorizontalIcon, description: 'Optimized for low-latency voice transcription and synthesis.' },
  { name: 'Extensible Tool Integration Bus', icon: CodeBracketSquareIcon, description: 'Allows seamless integration of external tools and APIs.' },
  { name: 'Proactive Goal & Task Planner', icon: MapIcon, description: 'Enables agents to set and pursue complex goals.' },
  { name: 'Ethical AI & Safety Governor', icon: CheckIcon, description: 'Ensures responsible AI behavior with configurable guardrails.' },
  { name: 'User Preference & Learning Module', icon: LightBulbIcon, description: 'Learns from interactions to personalize the user experience.' },
]);

type SectionKey = 'philosophy' | 'components';
const openSections = reactive<Record<SectionKey, boolean>>({
  philosophy: true,
  components: false,
});

const toggleSection = (sectionKey: SectionKey): void => {
  openSections[sectionKey] = !openSections[sectionKey];
};
</script>

<template>
  <section id="agentos" class="agentos-deep-dive-about content-section-ephemeral">
    <h3 class="section-title-main"><CubeTransparentIcon class="section-title-icon" />Deep Dive into AgentOS</h3>
    <div class="expandable-sections-container">
      <div class="expandable-section-card-about card-glass-interactive">
        <button @click="toggleSection('philosophy')" class="expandable-header-button-about">
          <span class="expandable-title-text"><AcademicCapIcon class="expandable-title-icon" />Foundation & Philosophy</span>
          <ChevronDownIcon class="chevron-indicator-about" :class="{ rotated: openSections.philosophy }" />
        </button>
        <div class="expandable-content-wrapper-about" :class="{ open: openSections.philosophy }">
          <div class="prose-enhanced-about">
            <h4>Beyond Static AI: The Adaptive Intelligence Paradigm</h4>
            <p>
              Traditional AI systems often follow a linear path: Input ?+' Fixed Processing ?+' Output. AgentOS introduces a dynamic, cyclical model:
              <strong>Context ?+' Adaptation ?+' Personalized Intelligence ?+' Action ?+' Feedback ?+' Context Refinement</strong>. This allows for continuous learning and evolution.
            </p>
            <h5>Core Philosophical Principles:</h5>
            <ul>
              <li><strong>Context is King:</strong> Deep understanding of tasks, history, cues, and tone.</li>
              <li><strong>Personas as Cognitive Frameworks:</strong> Defined yet adaptable personas for consistency.</li>
              <li><strong>Memory for Continuity & Growth:</strong> Robust short & long-term memory systems.</li>
              <li><strong>Safety & Ethics by Design:</strong> "Constitutional AI" principles and guardrails.</li>
            </ul>
            <p class="italic opacity-80">An AgentOS Generalized Mind Instance (GMI) is an adaptive AI entity for complex, ongoing interaction.</p>
          </div>
        </div>
      </div>

      <div class="expandable-section-card-about card-glass-interactive">
        <button @click="toggleSection('components')" class="expandable-header-button-about">
          <span class="expandable-title-text"><AdjustmentsHorizontalIcon class="expandable-title-icon" />Core System Components</span>
          <ChevronDownIcon class="chevron-indicator-about" :class="{ rotated: openSections.components }" />
        </button>
        <div class="expandable-content-wrapper-about" :class="{ open: openSections.components }">
          <p class="mb-4 text-lg">AgentOS is architected with modularity and scalability, featuring:</p>
          <div class="components-grid-about">
            <div v-for="item in agentOsComponents" :key="item.name" class="component-item-card-about card-neo-subtle">
              <component :is="item.icon" class="component-item-icon" />
              <h5 class="component-item-name">{{ item.name }}</h5>
              <p class="component-item-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
