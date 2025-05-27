// File: frontend/src/views/About.vue
/**
 * @file About.vue - Ephemeral Harmony Theme
 * @description About page showcasing AgentOS philosophy, architecture, plans, and roadmap.
 * Styled with the "Ephemeral Harmony" design system.
 * @version 3.1.0 - Full Ephemeral Harmony redesign, data integration, and TS fixes.
 */
<script setup lang="ts">
import { ref, reactive, type Component as VueComponent } from 'vue';
import { useRouter } from 'vue-router';
import DiagramViewer from '@/components/DiagramViewer.vue'; // Ensure this is the refactored version

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  SparklesIcon, // Outline by default is fine for lists
  UsersIcon,
  RocketLaunchIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  CubeTransparentIcon,
  // For GitHub icons, using a simple path or importing a dedicated SVG component is often better
  // For simplicity, I'll use a placeholder or assume you have a way to render GitHub icons.
  // If not, Heroicons doesn't have a direct GitHub mark.
} from '@heroicons/vue/24/outline';
// Import other icons as needed by your actual data

const router = useRouter();

/**
 * Navigates to the main application page.
 * @function goHome
 */
const goHome = (): void => {
  // Assuming 'PrivateHome' is the main authenticated route, or 'PublicHome' if it's the general entry
  router.push({ name: 'PrivateHome' });
};

// --- Data for Expandable Sections ---
type OpenSectionsKeys = 'philosophy' | 'components'; // Add more keys as sections are added
const openSections = reactive<Record<OpenSectionsKeys, boolean>>({
  philosophy: true, // Default to open
  components: false,
});

/**
 * Toggles the visibility of an expandable section.
 * @function toggleSection
 * @param {OpenSectionsKeys} sectionKey - The key of the section to toggle.
 */
const toggleSection = (sectionKey: OpenSectionsKeys): void => {
  openSections[sectionKey] = !openSections[sectionKey];
};

// --- AgentOS Components Data ---
interface AgentOsComponentItem {
  name: string;
  icon: VueComponent; // Using VueComponent type
}
const agentOsComponents = ref<AgentOsComponentItem[]>([
  { name: 'Adaptive Context Engine', icon: SparklesIcon },
  { name: 'Dynamic Persona Manager', icon: SparklesIcon },
  { name: 'Multi-Layered Memory Core', icon: SparklesIcon },
  { name: 'LLM Orchestration & Failover', icon: SparklesIcon },
  { name: 'Knowledge Synthesis (RAG+)', icon: SparklesIcon },
  { name: 'Real-time Voice I/O Pipeline', icon: SparklesIcon },
  { name: 'Extensible Tool Integration Bus', icon: SparklesIcon },
  { name: 'Proactive Goal & Task Planner', icon: SparklesIcon },
  { name: 'Ethical AI & Safety Governor', icon: SparklesIcon },
  { name: 'User Preference & Learning Module', icon: SparklesIcon },
]);

// --- Mermaid Diagrams Data ---
const diagrams = ref({
  systemOverview: `
    graph TD
      subgraph User Interaction Layer
        UI[🌐 User Interface (Ephemeral Harmony)]
      end
      subgraph Orchestration & Intelligence Core
        Orchestrator[⚡ AgentOS Orchestrator]
        GMI{"🧠 Generalized Mind Instance (GMI)"}
      end
      subgraph Core Services
        Persona[🎭 Persona Engine]
        Memory[💾 Memory Core (Short/Long Term)]
        Knowledge[📚 Knowledge Interface (RAG)]
        Tools[🛠️ Tool & Function Executor]
      end
      subgraph External Systems
        LLMs[☁️ LLM Providers (OpenAI, OpenRouter, etc.)]
        APIs[🔌 External APIs & Services]
        DataSources[📊 User Data Sources]
      end

      UI --> Orchestrator;
      Orchestrator --> GMI;
      GMI --> Persona;
      GMI --> Memory;
      GMI --> Knowledge;
      GMI --> Tools;
      GMI --> LLMs;
      Knowledge --> DataSources;
      Tools --> APIs;

      classDef default fill:var(--color-bg-tertiary),stroke:var(--color-border-primary),color:var(--color-text-primary);
      classDef accent fill:var(--color-accent-primary),stroke:var(--color-bg-primary),color:var(--color-text-on-primary),fontWeight:bold;
      class UI,Orchestrator,LLMs,APIs,DataSources accent;
  `,
  dataFlow: `
    sequenceDiagram
      actor User
      participant F as Frontend (Ephemeral Harmony UI)
      participant O as AgentOS Orchestrator (Backend)
      participant KB as Knowledge Base (VectorDB/RAG)
      participant LLM as Large Language Model

      User->>+F: Input (Voice/Text)
      F->>+O: Secure API Request (Input, Session Context, AgentID)
      O->>O: 1. Analyze Context & Intent
      O->>+KB: 2. Query Relevant Knowledge
      KB-->>-O: 3. Retrieved Information Chunks
      O->>O: 4. Construct Adaptive Prompt (Persona, History, Knowledge, Tools)
      O->>+LLM: 5. Optimized Prompt to LLM
      LLM-->>-O: 6. Raw LLM Response (Text, Tool Calls)
      O->>O: 7. Process Response (Format, Safety Check, Tool Invocation if any)
      O-->>-F: 8. Structured Output (Text, UI Directives)
      F->>-User: Display Formatted Response / Speak
  `,
  promptEngine: `
    graph LR
      UserInput[🗣️ User Input] --> QueryAnalyzer;
      SessionCtx[📝 Session Context] --> QueryAnalyzer;
      QueryAnalyzer -- Intent & Entities --> PromptStrategist;

      subgraph PersonaContext [🎭 Active Persona Profile]
        PersonaDef[Core Directives]
        PersonaMem[Persona-specific Memories]
        PersonaStyle[Communication Style]
      end

      subgraph KnowledgeContext [📚 Knowledge Retrieval]
        RelevantDocs[Retrieved Documents (RAG)]
        DBQueries[Database Query Results]
      end

      subgraph ToolContext [🛠️ Available Tools]
        ToolDefinitions[Tool Signatures & Descriptions]
      end

      PromptStrategist -- Selected Elements --> PromptAssembler;
      PersonaContext --> PromptStrategist;
      KnowledgeContext --> PromptStrategist;
      ToolContext --> PromptStrategist;

      PromptAssembler -- Structured Prompt Segments --> FinalFormatter;
      FinalFormatter --> OptimizedLLMPrompt[🚀 Optimized LLM Prompt];

      classDef node fill:var(--color-bg-secondary),stroke:var(--color-border-primary),color:var(--color-text-secondary);
      classDef process fill:var(--color-accent-secondary),stroke:var(--color-bg-primary),color:var(--color-text-on-secondary),fontWeight:bold;
      classDef data fill:var(--color-bg-tertiary),stroke:var(--color-border-primary),color:var(--color-text-muted);
      class QueryAnalyzer,PromptStrategist,PromptAssembler,FinalFormatter process;
      class UserInput,SessionCtx,OptimizedLLMPrompt data;
  `,
});

// --- Roadmap Data ---
interface RoadmapFeature {
  name: string;
  description?: string; // Optional more detailed description
  status: 'Idea' | 'Planned' | 'In Progress' | 'Beta' | 'Completed';
}
interface RoadmapQuarter {
  id: string; // e.g., "q3-2025"
  quarter: string; // e.g., "Q3"
  year: number;
  themeTitle: string; // Main theme for the quarter
  features: RoadmapFeature[];
}
const roadmapItems = ref<RoadmapQuarter[]>([
  {
    id: 'q3-2025', quarter: 'Q3', year: 2025, themeTitle: 'Deeper Context & Personalization',
    features: [
      { name: 'Proactive Suggestion Engine (v1)', status: 'In Progress', description: 'AI anticipates needs based on ongoing tasks and history.' },
      { name: 'User-Uploaded Knowledge Integration', status: 'In Progress', description: 'Allow users to securely connect personal document repositories.' },
      { name: 'Cross-Session Memory Linking', status: 'Planned', description: 'Enable recalling relevant information from distinct past conversations.' },
    ],
  },
  {
    id: 'q4-2025', quarter: 'Q4', year: 2025, themeTitle: 'Richer Interactions & Outputs',
    features: [
      { name: 'Basic Image Comprehension (via multimodal LLM)', status: 'Planned', description: 'Allow users to input images for context or queries.' },
      { name: 'Structured Data Generation (Tables, Lists)', status: 'Planned', description: 'AI can format responses as structured data, not just text.' },
      { name: 'Interactive Holographic Avatar (Proof of Concept)', status: 'Idea', description: 'Early exploration into more embodied AI representation.' },
    ],
  },
  {
    id: 'q1-2026', quarter: 'Q1', year: 2026, themeTitle: 'Extensibility & Developer Focus',
    features: [
      { name: 'AgentOS Core API (Alpha)', status: 'Planned', description: 'Expose core functionalities for third-party developers.' },
      { name: 'Simplified Tool Creation Framework', status: 'Planned', description: 'Easier SDK for building and integrating custom tools.' },
      { name: 'Community Hub for Agents & Tools (Concept)', status: 'Idea', description: 'A place to share and discover AgentOS extensions.' },
    ],
  },
]);

// --- Pricing Tiers Data ---
interface PlanFeatureItem { text: string; available: boolean; }
interface PricingPlanItem {
  name: string; price: string; period: string; features: PlanFeatureItem[];
  buttonText: string; buttonClass: string[]; isFeatured?: boolean; action?: () => void;
  glowColorVar?: string; // CSS variable name for featured glow
}
const pricingPlans = ref<PricingPlanItem[]>([
  {
    name: 'Explorer', price: '$0', period: '/month',
    features: [
      { text: 'Limited Daily Interactions', available: true }, { text: 'Standard AI Models', available: true },
      { text: 'Core Voice Capabilities', available: true }, { text: '1 Personal Agent Profile', available: true },
      { text: 'Basic Contextual Memory', available: true }, { text: 'Community Forum Support', available: true },
      { text: 'Limited Diagram Generation', available: false }, { text: 'Advanced RAG Features', available: false },
    ],
    buttonText: 'Start Exploring', buttonClass: ['btn-secondary-ephemeral'], // Use new button classes
    action: () => router.push({ name: 'PublicHome' })
  },
  {
    name: 'Creator', price: '$29', period: '/month', isFeatured: true, glowColorVar: '--color-accent-primary',
    features: [
      { text: 'High Volume Interactions', available: true }, { text: 'Premium AI Models (GPT-4, Claude 3)', available: true },
      { text: 'Full Voice & Audio Features', available: true }, { text: 'Up to 5 Agent Profiles', available: true },
      { text: 'Enhanced Memory & RAG', available: true }, { text: 'Full Diagram Generation', available: true },
      { text: 'Early Access to New Features', available: true }, { text: 'Priority Email Support', available: true },
    ],
    buttonText: 'Unlock Creator', buttonClass: ['btn-primary-ephemeral'],
    action: () => { /* router.push('/subscribe/creator') or similar */ }
  },
  {
    name: 'Architect', price: 'Custom', period: '(Contact Us)',
    features: [
      { text: 'Everything in Creator Plan', available: true }, { text: 'Enterprise-Grade Interaction Volume', available: true },
      { text: 'Custom Model Fine-Tuning', available: true }, { text: 'Dedicated API Access & SLAs', available: true },
      { text: 'Unlimited Agent Profiles & Teams', available: true }, { text: 'On-Premise Deployment Options', available: true },
      { text: 'Bespoke Feature Development', available: true }, { text: 'Dedicated Architect Support', available: true },
    ],
    buttonText: 'Contact Sales', buttonClass: ['btn-secondary-ephemeral'],
    action: () => { /* router.push('/contact-sales') */ }
  },
]);

// Icons for mission section
const missionIcons = {
  innovate: RocketLaunchIcon,
  empower: UsersIcon,
  transform: SparklesIcon,
};
</script>

<template>
  <div class="about-page-ephemeral">
    <header class="about-header-ephemeral">
      <div class="header-content-wrapper">
        <div class="logo-title-group">
          <img src="/src/assets/logo.svg" alt="Voice Chat Assistant Logo" class="logo-img" />
          <h1 class="page-title">About VCA & AgentOS</h1>
        </div>
        <button @click="goHome" class="btn btn-ghost btn-sm">
          <ArrowLeftIcon class="icon-sm mr-1.5" />
          Back to App
        </button>
      </div>
    </header>

    <main class="about-main-content">
      <section class="hero-section">
        <div class="hero-logo-wrapper">
          <img src="/src/assets/logo.svg" alt="AgentOS Logo" class="hero-logo" />
        </div>
        <h2 class="hero-title">The Future is Conversational.</h2>
        <p class="hero-subtitle">
          Voice Chat Assistant, powered by the <strong class="font-semibold text-[var(--color-accent-secondary)]">AgentOS</strong> framework,
          redefines human-AI interaction. Experience truly adaptive intelligence that understands, remembers, and evolves with you.
        </p>
      </section>

      <section class="mission-section">
        <h3 class="section-title-ephemeral">Our Mission</h3>
        <div class="mission-grid">
          <div class="mission-item-card card-glass-interactive">
             <div class="mission-icon-wrapper" style="background-image: linear-gradient(135deg, hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)) 0%, hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), calc(var(--color-accent-secondary-l) - 10%)) 100%);">
              <component :is="missionIcons.innovate" class="icon" />
            </div>
            <h4 class="mission-item-title">Innovate</h4>
            <p class="mission-item-description">Push the boundaries of AI interaction with cutting-edge voice technology and adaptive intelligence.</p>
          </div>
          <div class="mission-item-card card-glass-interactive">
            <div class="mission-icon-wrapper" style="background-image: linear-gradient(135deg, hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l)) 0%, hsl(180, 70%, 50%) 100%);"> {/* Example direct HSL */}
              <component :is="missionIcons.empower" class="icon" />
            </div>
            <h4 class="mission-item-title">Empower</h4>
            <p class="mission-item-description">Enable developers, creators, and users to achieve more through intuitive and personalized AI assistance.</p>
          </div>
          <div class="mission-item-card card-glass-interactive">
             <div class="mission-icon-wrapper" style="background-image: linear-gradient(135deg, hsl(180, 70%, 50%) 0%, hsl(145, 60%, 55%) 100%);">  {/* Example direct HSL */}
              <component :is="missionIcons.transform" class="icon" />
            </div>
            <h4 class="mission-item-title">Transform</h4>
            <p class="mission-item-description">Reshape how humans and AI collaborate, making technology a natural extension of thought.</p>
          </div>
        </div>
      </section>

      <section class="agentos-deep-dive">
        <h3 class="section-title-ephemeral">Deep Dive into AgentOS</h3>
        <div class="space-y-8"> {/* Increased spacing */}
          <div class="expandable-section-card card-neo-interactive">
            <button @click="toggleSection('philosophy')" class="expandable-header-button">
              <span class="flex items-center gap-2"> <CubeTransparentIcon class="icon-base text-[var(--color-accent-primary)]" /> Foundation & Philosophy</span>
              <ChevronDownIcon class="chevron-icon" :class="{'rotated': openSections.philosophy}" />
            </button>
            <div class="expandable-content-wrapper" :class="{'open': openSections.philosophy}">
              <div class="prose-content-ephemeral prose dark:prose-invert max-w-none">
                <h4>Beyond Static AI: The Adaptive Intelligence Paradigm</h4>
                <p>Traditional AI systems often follow a linear path: Input → Fixed Processing → Output. AgentOS introduces a dynamic, cyclical model: <strong>Context → Adaptation → Personalized Intelligence → Action → Feedback → Context Refinement</strong>. This allows for continuous learning and evolution.</p>
                <h5>Core Philosophical Principles:</h5>
                <ul>
                  <li><strong>Context is King:</strong> Deep understanding of the immediate task, user history, environmental cues, and emotional tone.</li>
                  <li><strong>Personas as Cognitive Frameworks:</strong> Agents operate with defined yet adaptable personas, ensuring consistent behavior while allowing for nuanced responses.</li>
                  <li><strong>Memory for Continuity & Growth:</strong> Robust short-term (session) and long-term (persistent) memory systems enable learning from past interactions and user preferences.</li>
                  <li><strong>Safety & Ethics by Design:</strong> Incorporating "Constitutional AI" principles and customizable guardrails for responsible and context-aware decision-making.</li>
                </ul>
                <p class="italic opacity-80">An AgentOS Generalized Mind Instance (GMI) is not just a chatbot; it's an adaptive AI entity designed for complex, ongoing interaction and task completion.</p>
              </div>
            </div>
          </div>

          <div class="expandable-section-card card-neo-interactive">
            <button @click="toggleSection('components')" class="expandable-header-button">
               <span class="flex items-center gap-2"> <SparklesIcon class="icon-base text-[var(--color-accent-secondary)]" /> Core System Components</span>
              <ChevronDownIcon class="chevron-icon" :class="{'rotated': openSections.components}" />
            </button>
            <div class="expandable-content-wrapper" :class="{'open': openSections.components}">
              <div class="prose-content-ephemeral prose dark:prose-invert max-w-none">
                <p>AgentOS is architected with modularity and scalability at its core, featuring components like:</p>
                <ul class="agentos-components-list">
                  <li v-for="item in agentOsComponents" :key="item.name">
                    <component :is="item.icon" class="icon" /> {{ item.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="architecture-diagrams">
        <h3 class="section-title-ephemeral">AgentOS Technical Architecture</h3>
        <div class="space-y-10"> {/* Increased spacing */}
          <div class="diagram-section-card card-glass-interactive">
            <h4 class="diagram-title">System Overview</h4>
            <p class="diagram-description">A high-level view of AgentOS, showcasing its major interacting components from user interface to LLM providers, emphasizing the central role of the Orchestrator and Generalized Mind Instance (GMI).</p>
            <DiagramViewer :diagramCode="diagrams.systemOverview" diagramType="mermaid" />
          </div>
          <div class="diagram-section-card card-glass-interactive">
            <h4 class="diagram-title">Data Flow Architecture</h4>
            <p class="diagram-description">Illustrates the typical sequence of data processing from user input to AI response, highlighting context analysis, knowledge retrieval (RAG), and adaptive prompt generation.</p>
            <DiagramViewer :diagramCode="diagrams.dataFlow" diagramType="mermaid" />
          </div>
          <div class="diagram-section-card card-glass-interactive">
            <h4 class="diagram-title">Prompt Engine Architecture</h4>
            <p class="diagram-description">Details the internal workings of the Prompt Engine, which dynamically constructs optimized prompts by selecting and assembling persona definitions, contextual elements, and knowledge.</p>
            <DiagramViewer :diagramCode="diagrams.promptEngine" diagramType="mermaid" />
          </div>
        </div>
      </section>

      <section class="pricing-section">
        <h3 class="section-title-ephemeral">Subscription Tiers</h3>
        <div class="pricing-grid">
          <div v-for="plan in pricingPlans" :key="plan.name"
               class="pricing-card-ephemeral"
               :class="[
                  plan.isFeatured ? 'card-neo-interactive featured-plan' : 'card-glass-interactive',
                  { 'featured-glow-primary': plan.isFeatured && plan.glowColorVar === '--color-accent-primary' },
                  { 'featured-glow-secondary': plan.isFeatured && plan.glowColorVar === '--color-accent-secondary' }
               ]">
            <div v-if="plan.isFeatured" class="plan-chip">{{ plan.name === 'Creator' ? 'Most Popular' : 'Premium' }}</div>
            <div class="plan-title-wrapper">
              <h4 class="plan-title">{{ plan.name }}</h4>
              <div class="plan-price-wrapper">
                <span class="plan-price">{{ plan.price }}</span>
                <span class="price-period">{{ plan.period }}</span>
              </div>
            </div>
            <ul class="plan-features-list">
              <li v-for="feature in plan.features" :key="feature.text">
                <component :is="feature.available ? CheckIcon : XMarkIcon" class="icon" :class="feature.available ? 'icon-success' : 'icon-error'" />
                {{ feature.text }}
              </li>
            </ul>
            <button :class="['btn', ...plan.buttonClass, 'plan-button']" @click="plan.action ? plan.action() : null">
              {{ plan.buttonText }}
            </button>
          </div>
        </div>
      </section>

      <section class="roadmap-section">
        <h3 class="section-title-ephemeral">Product Roadmap</h3>
        <div class="roadmap-container-ephemeral">
          <div v-for="(item, index) in roadmapItems" :key="item.id"
               class="roadmap-item-ephemeral"
               :class="{ 'item-right-aligned': index % 2 !== 0 }"> {/* Basic alignment for now, more complex via CSS */}
            <div class="roadmap-dot-ephemeral"></div>
            <div class="roadmap-content-card card-neo-interactive">
              <h4 class="quarter-title">
                {{ item.quarter }} {{ item.year }}
              </h4>
              <p class="roadmap-theme-title">{{ item.themeTitle }}</p>
              <ul class="features-list">
                <li v-for="feature in item.features" :key="feature.name">
                  <strong>
                    {{ feature.name }}
                    <span class="status-badge" :class="`status-${feature.status.toLowerCase().replace(' ', '-')}`">{{ feature.status }}</span>
                  </strong>
                  <p v-if="feature.description" class="text-xs opacity-80 ml-4">{{ feature.description }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer class="about-footer-ephemeral">
        <div class="footer-card card-glass">
          <p class="footer-text">
            Voice Chat Assistant is an innovative project <strong class="text-[var(--color-accent-primary)]">Powered by AgentOS</strong>.
            <br class="hidden sm:inline">
            Proudly developed in collaboration by
            <a href="https://frame.dev" target="_blank" rel="noopener noreferrer">The Framers</a> &amp;
            <a href="https://manic.agency" target="_blank" rel="noopener noreferrer">Manic Inc</a>.
          </p>
          <div class="social-links-group">
             <a href="https://github.com/AgentOSAIs/AgentOS" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="AgentOS GitHub">
              <CubeTransparentIcon class="icon" />
            </a>
            <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="The Framers GitHub">
              <UsersIcon class="icon" />
            </a>
             <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Manic Inc. GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="icon w-[1.6rem] h-[1.6rem]">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
          <p class="copyright-text">&copy; {{ new Date().getFullYear() }} AgentOS Initiative. All rights reserved.</p>
        </div>
      </footer>
    </main>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/views/_about-page.scss
// Ensure this file is imported in main.scss
</style>