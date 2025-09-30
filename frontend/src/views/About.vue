// File: frontend/src/views/About.vue
/**
 * @file About.vue - Ephemeral Harmony Theme
 * @description About page showcasing AgentOS philosophy, architecture, plans, and roadmap.
 * Fully redesigned with the "Ephemeral Harmony" design system for a modern, engaging, and
 * visually striking presentation.
 * @version 4.0.0 - Complete Ephemeral Harmony redesign.
 */
<script setup lang="ts">
import { ref, reactive, type Component as VueComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import DiagramViewer from '@/components/DiagramViewer.vue';
import { themeManager } from '@/theme/ThemeManager'; // To potentially influence diagram themes dynamically
import logoSvg from '@/assets/logo.svg';

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  SparklesIcon,
  UsersIcon,
  RocketLaunchIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  CubeTransparentIcon,
  AcademicCapIcon, // For Philosophy
  AdjustmentsHorizontalIcon, // For Components
  MapIcon, // For Roadmap
  CurrencyDollarIcon, // For Pricing
  CodeBracketSquareIcon, // For Architecture
  LightBulbIcon, // For Mission
} from '@heroicons/vue/24/outline';

const router = useRouter();
const currentThemeIsDark = computed(() => themeManager.getCurrentTheme().value?.isDark || false);

/**
 * Navigates to the main application page.
 */
const goHome = (): void => {
  router.push({ name: 'PublicHome' }); // Or AuthenticatedHome if appropriate context
};

// Data for Expandable Sections
type OpenSectionsKeys = 'philosophy' | 'components' | 'architecture';
const openSections = reactive<Record<OpenSectionsKeys, boolean>>({
  philosophy: true,
  components: false,
  architecture: false,
});

/**
 * Toggles the visibility of an expandable section.
 */
const toggleSection = (sectionKey: OpenSectionsKeys): void => {
  openSections[sectionKey] = !openSections[sectionKey];
};

// AgentOS Components Data
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

// Mermaid Diagrams Data
const diagrams = ref({
  systemOverview: `
    graph TD
      subgraph User Interaction Layer [📱 User Interaction Layer]
        UI[🌐 User Interface (Ephemeral Harmony)]
      end
      subgraph Orchestration & Intelligence Core [⚙️ Orchestration & Intelligence Core]
        Orchestrator[⚡ AgentOS Orchestrator]
        GMI{"🧠 Generalized Mind Instance (GMI)"}
      end
      subgraph Core Services [🛠️ Core Services]
        Persona[🎭 Persona Engine]
        Memory[💾 Memory Core]
        Knowledge[📚 Knowledge Interface (RAG)]
        Tools[🔧 Tool & Function Executor]
      end
      subgraph External Systems [☁️ External Systems]
        LLMs[🤖 LLM Providers]
        APIs[🔌 External APIs & Services]
        DataSources[📊 User Data Sources]
      end

      UI --> Orchestrator;
      Orchestrator --> GMI;
      GMI --> Persona; GMI --> Memory; GMI --> Knowledge; GMI --> Tools;
      GMI --> LLMs;
      Knowledge --> DataSources; Tools --> APIs;

      classDef default fill:var(--color-bg-tertiary),stroke:var(--color-border-primary),color:var(--color-text-primary),rx:var(--radius-md),ry:var(--radius-md);
      classDef userInteraction fill:var(--color-accent-primary-light-hsl, var(--color-accent-primary)),stroke:var(--color-accent-primary),color:var(--color-text-on-primary),fontWeight:bold;
      classDef orchestration fill:var(--color-accent-secondary-light-hsl, var(--color-accent-secondary)),stroke:var(--color-accent-secondary),color:var(--color-text-on-secondary),fontWeight:bold;
      classDef coreSvc fill:hsla(var(--color-bg-tertiary-h),var(--color-bg-tertiary-s),var(--color-bg-tertiary-l),0.8),stroke:var(--color-border-secondary);
      classDef external fill:hsla(var(--color-bg-secondary-h),var(--color-bg-secondary-s),var(--color-bg-secondary-l),0.7),stroke:var(--color-border-secondary);

      class UI,UserInteractionLayer userInteraction;
      class Orchestrator,GMI,OrchestrationIntelligenceCore orchestration;
      class Persona,Memory,Knowledge,Tools,CoreServices coreSvc;
      class LLMs,APIs,DataSources,ExternalSystems external;
  `,
  // Data Flow and Prompt Engine diagrams are good as they are, ensure DiagramViewer handles them.
  dataFlow: `
    sequenceDiagram
      actor User
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
      UserInput[🗣️ User Input] --> QueryAnalyzer;
      SessionCtx[📝 Session Context] --> QueryAnalyzer;
      QueryAnalyzer -- Intent & Entities --> PromptStrategist;
      subgraph PersonaContext [🎭 Active Persona]
        PersonaDef[Core Directives]
        PersonaMem[Memories]
        PersonaStyle[Style]
      end
      subgraph KnowledgeContext [📚 Knowledge]
        Docs[Retrieved Docs (RAG)]
        DBRes[DB Results]
      end
      subgraph ToolContext [🛠️ Tools]
        ToolDefs[Tool Signatures]
      end
      PromptStrategist --> PromptAssembler;
      PersonaContext --> PromptStrategist;
      KnowledgeContext --> PromptStrategist;
      ToolContext --> PromptStrategist;
      PromptAssembler --> FinalFormatter;
      FinalFormatter --> OptimizedLLMPrompt[🚀 Optimized Prompt];
  `,
});

// Roadmap Data (simplified structure for example, expand as needed)
interface RoadmapFeature { name: string; status: 'Idea' | 'Planned' | 'In Progress' | 'Beta' | 'Completed'; description?: string; }
interface RoadmapQuarter { id: string; quarter: string; year: number; themeTitle: string; features: RoadmapFeature[]; }
const roadmapItems = ref<RoadmapQuarter[]>([
  { id: 'q3-2025', quarter: 'Q3', year: 2025, themeTitle: 'Enhanced Context & Personalization', features: [
    { name: 'Proactive Suggestion Engine (v1)', status: 'In Progress', description: 'AI anticipates user needs.' },
    { name: 'User Document Integration', status: 'Planned', description: 'Connect personal knowledge repositories.' },
  ]},
  { id: 'q4-2025', quarter: 'Q4', year: 2025, themeTitle: 'Richer Interactions & Outputs', features: [
    { name: 'Basic Image Comprehension', status: 'Planned', description: 'Allow image inputs for context.' },
    { name: 'Structured Data Generation', status: 'Idea', description: 'AI formats responses like tables/lists.' },
  ]},
]);

// Pricing Tiers Data (simplified structure)
interface PlanFeatureItem { text: string; available: boolean; }
interface PricingPlanItem { name: string; price: string; period: string; features: PlanFeatureItem[]; buttonText: string; isFeatured?: boolean; }
const pricingPlans = ref<PricingPlanItem[]>([
  { name: 'Explorer', price: '$0', period: '/month', features: [
    { text: 'Limited Daily Interactions', available: true }, { text: 'Standard AI Models', available: true },
    { text: 'Basic Contextual Memory', available: true },{ text: 'Community Support', available: true },
    { text: 'Advanced RAG', available: false }, { text: 'Priority Support', available: false },
  ], buttonText: 'Start Exploring' },
  { name: 'Creator', price: '$29', period: '/month', isFeatured: true, features: [
    { text: 'High Volume Interactions', available: true }, { text: 'Premium AI Models', available: true },
    { text: 'Enhanced Memory & RAG', available: true }, { text: 'Full Diagram Generation', available: true },
    { text: 'Early Access Features', available: true }, { text: 'Priority Email Support', available: true },
  ], buttonText: 'Unlock Creator' },
]);

// Mission Data
const missionItems = ref([
    { title: 'Innovate', description: 'Push the boundaries of AI interaction with cutting-edge voice technology and adaptive intelligence.', icon: RocketLaunchIcon, accentVar: '--color-accent-primary' },
    { title: 'Empower', description: 'Enable developers, creators, and users to achieve more through intuitive and personalized AI assistance.', icon: UsersIcon, accentVar: '--color-accent-secondary' },
    { title: 'Transform', description: 'Reshape how humans and AI collaborate, making technology a natural extension of thought.', icon: SparklesIcon, accentVar: '--color-info' /* Example different accent */ },
]);

</script>

<template>
  <div class="about-page-ephemeral">
    <header class="about-header-ephemeral">
      <div class="header-content-container">
        <div class="logo-title-group text-center">
          <!-- <img src="@/assets/logo.svg" alt="Voice Chat Assistant Logo" class="header-logo-img" /> -->
          <h1 class="main-page-title">About <strong>Voice Chat Assistant</strong> and <strong>AgentOS</strong></h1>
        </div>
        <button @click="goHome" class="btn btn-secondary-ephemeral btn-sm back-button-ephemeral">
          <ArrowLeftIcon class="icon-sm" />
          Back to App
        </button>
      </div>
    </header>

    <main class="about-main-content-area">
      <section class="hero-section-about card-glass-interactive">
        <div class="hero-logo-wrapper">
          <img :src="logoSvg" alt="AgentOS Logo" class="hero-logo-main spinning-glow-logo" />
        </div>
        <h2 class="hero-main-title">The Future is a Conversation.</h2>
        <p class="hero-sub-title">
          <strong>
          Seamlessly intelligent experiences through natural language
          </strong>
        </p>
        <p class="hero-sub-title">
          Voice Chat Assistant, powered by the open-source <strong class="highlight-text"><a href="https://github.com/wearetheframers/agentos" target="_blank">AgentOS</a></strong> framework,
          redefines human-AI interaction. Experience truly adaptive intelligence that understands, remembers, and evolves with you.
          <br>
          <strong class="highlight-text">
          For support, contact us at <a href="mailto:team@manic.agency" class="footer-link">team@manic.agency</a>.
          </strong>
        </p>
         <a href="#pricing" class="btn btn-primary-ephemeral btn-lg hero-cta-button hover:text-white">Sign Up</a>
      </section>

      <section id="permissions" class="permissions-section-about content-section-ephemeral">
        <h3 class="section-title-main">🎤 Microphone Permissions</h3>
        <div class="permissions-card card-glass-interactive">
          <h4>Why Voice Chat Assistant Needs Microphone Access</h4>
          <p class="mb-4">
            Voice Chat Assistant provides a hands-free, natural language interface powered by advanced speech recognition.
            Microphone access enables:
          </p>
          <ul class="permissions-features-list">
            <li>✓ Real-time voice transcription using browser-native or Whisper API</li>
            <li>✓ Continuous listening mode for seamless conversation</li>
            <li>✓ Push-to-talk for controlled recording</li>
            <li>✓ Wake word detection ("Hey V") for hands-free activation</li>
            <li>✓ Low-latency voice interactions with AI assistants</li>
          </ul>
          <p class="mt-4">
            <strong>Privacy First:</strong> Audio is processed locally in your browser or sent directly to transcription services.
            We never store or share your voice recordings. Microphone access is only requested when you interact with voice features.
          </p>
          <p class="mt-4 text-sm opacity-80">
            Note: You can revoke microphone permissions at any time through your browser settings.
          </p>
        </div>
      </section>

      <section id="mission" class="mission-section-about content-section-ephemeral">
        <h3 class="section-title-main"><LightBulbIcon class="section-title-icon"/>Our Mission</h3>
        <div class="mission-grid-about">
          <div v-for="item in missionItems" :key="item.title"
               class="mission-item-card-about card-neo-interactive"
               :style="{'--card-accent-color': `hsl(var(${item.accentVar}-h), var(${item.accentVar}-s), var(${item.accentVar}-l))`}">
            <div class="mission-card-icon-wrapper">
              <component :is="item.icon" class="mission-card-icon" />
            </div>
            <h4 class="mission-card-title">{{ item.title }}</h4>
            <p class="mission-card-description">{{ item.description }}</p>
          </div>
        </div>
      </section>

      <section id="agentos" class="agentos-deep-dive-about content-section-ephemeral">
        <h3 class="section-title-main"><CubeTransparentIcon class="section-title-icon"/>Deep Dive into AgentOS</h3>
        <div class="expandable-sections-container">
          <div class="expandable-section-card-about card-glass-interactive">
            <button @click="toggleSection('philosophy')" class="expandable-header-button-about">
              <span class="expandable-title-text"><AcademicCapIcon class="expandable-title-icon"/>Foundation & Philosophy</span>
              <ChevronDownIcon class="chevron-indicator-about" :class="{'rotated': openSections.philosophy}" />
            </button>
            <div class="expandable-content-wrapper-about" :class="{'open': openSections.philosophy}">
              <div class="prose-enhanced-about">
                <h4>Beyond Static AI: The Adaptive Intelligence Paradigm</h4>
                <p>Traditional AI systems often follow a linear path: Input → Fixed Processing → Output. AgentOS introduces a dynamic, cyclical model: <strong>Context → Adaptation → Personalized Intelligence → Action → Feedback → Context Refinement</strong>. This allows for continuous learning and evolution.</p>
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
              <span class="expandable-title-text"><AdjustmentsHorizontalIcon class="expandable-title-icon"/>Core System Components</span>
              <ChevronDownIcon class="chevron-indicator-about" :class="{'rotated': openSections.components}" />
            </button>
            <div class="expandable-content-wrapper-about" :class="{'open': openSections.components}">
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

      <section id="pricing" class="pricing-section-about content-section-ephemeral">
        <h3 class="section-title-main"><CurrencyDollarIcon class="section-title-icon"/>Subscription Tiers</h3>
        <div class="pricing-grid-about">
          <div v-for="plan in pricingPlans" :key="plan.name"
               class="pricing-plan-card-about"
               :class="[plan.isFeatured ? 'card-neo-interactive featured-plan-glow' : 'card-glass-interactive']">
            <div v-if="plan.isFeatured" class="featured-chip-about">Most Popular</div>
            <h4 class="plan-title-about">{{ plan.name }}</h4>
            <div class="plan-price-container-about">
              <span class="plan-price-value">{{ plan.price }}</span>
              <span class="plan-price-period">{{ plan.period }}</span>
            </div>
            <ul class="plan-features-list-about">
              <li v-for="feature in plan.features" :key="feature.text" class="plan-feature-item">
                <component :is="feature.available ? CheckIcon : XMarkIcon"
                           class="feature-icon" :class="feature.available ? 'icon-success' : 'icon-error'" />
                {{ feature.text }}
              </li>
            </ul>
            <button class="btn plan-button-about" :class="[plan.isFeatured ? 'btn-primary-ephemeral' : 'btn-secondary-ephemeral']">
              {{ plan.buttonText }}
            </button>
          </div>
        </div>
      </section>


      <section id="architecture" class="architecture-diagrams-about content-section-ephemeral">
         <button @click="toggleSection('architecture')" class="expandable-header-button-about section-title-main --expandable">
            <span class="expandable-title-text"><CodeBracketSquareIcon class="section-title-icon"/>AgentOS Technical Architecture</span>
            <ChevronDownIcon class="chevron-indicator-about --section-title" :class="{'rotated': openSections.architecture}" />
        </button>
        <div class="expandable-content-wrapper-about" :class="{'open': openSections.architecture}">
            <div class="diagrams-grid-about">
                <div class="diagram-card-about card-glass-interactive">
                <h4 class="diagram-card-title">System Overview</h4>
                <p class="diagram-card-description">High-level view of AgentOS, from UI to LLMs, highlighting the Orchestrator and GMI.</p>
                <DiagramViewer :diagramCode="diagrams.systemOverview" diagramType="mermaid" :is-dark-mode="currentThemeIsDark" class="diagram-viewer-about"/>
                </div>
                <div class="diagram-card-about card-glass-interactive">
                <h4 class="diagram-card-title">Data Flow Architecture</h4>
                <p class="diagram-card-description">Illustrates data processing from user input to AI response, including RAG and prompt generation.</p>
                <DiagramViewer :diagramCode="diagrams.dataFlow" diagramType="mermaid" :is-dark-mode="currentThemeIsDark" class="diagram-viewer-about"/>
                </div>
                <div class="diagram-card-about card-glass-interactive">
                <h4 class="diagram-card-title">Adaptive Prompt Engine</h4>
                <p class="diagram-card-description">Details the dynamic construction of optimized LLM prompts.</p>
                <DiagramViewer :diagramCode="diagrams.promptEngine" diagramType="mermaid" :is-dark-mode="currentThemeIsDark" class="diagram-viewer-about"/>
                </div>
            </div>
        </div>
      </section>


      <section id="roadmap" class="roadmap-section-about content-section-ephemeral"> 
        <h3 class="section-title-main"><MapIcon class="section-title-icon"/>Product Roadmap</h3>
        <div class="roadmap-timeline-container-about">
          <div v-for="(item, index) in roadmapItems" :key="item.id"
               class="roadmap-item-container-about"
               :class="{ 'align-right': index % 2 !== 0 }">
            <div class="roadmap-item-dot"></div>
            <div class="roadmap-item-line"></div>
            <div class="roadmap-item-content-card card-neo-subtle">
              <h4 class="roadmap-quarter-title">{{ item.quarter }} {{ item.year }}</h4>
              <p class="roadmap-quarter-theme">{{ item.themeTitle }}</p>
              <ul class="roadmap-features-list">
                <li v-for="feature in item.features" :key="feature.name" class="roadmap-feature-item">
                  <strong class="feature-name-roadmap">{{ feature.name }}</strong>
                  <span class="status-badge-roadmap" :class="`status-${feature.status.toLowerCase().replace(/\s+/g, '-')}`">
                    {{ feature.status }}
                  </span>
                  <p v-if="feature.description" class="feature-description-roadmap">{{ feature.description }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer class="about-page-footer-ephemeral">
        <div class="footer-content-inner-about card-glass">
          <p class="footer-credits-text max-w-full w-full">
            Voice Chat Assistant is a first-class initiative <strong class="highlight-text">powered by <a href="https://github.com/wearetheframers/agentos" target="_blank">AgentOS</a></strong>.
            <br class="hidden sm:inline">
            Developed by <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" class="footer-link">The Framers</a> &amp;
            <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" class="footer-link">Manic Inc</a>.
          </p>
          <div class="footer-social-links-group">
             </div>
          <p class="copyright-text-about max-w-full w-full">
            Manic.agency is an experimental open-source collective and development and design agency.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<style lang="scss">
// Styles will be in frontend/src/styles/views/_about-page.scss
// Ensure this file is imported in main.scss
</style>