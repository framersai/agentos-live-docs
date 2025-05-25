<script lang="ts">
/**
 * @file AboutView.vue
 * @description Provides comprehensive, engaging information about the Voice Chat Assistant.
 * This view details its purpose, core features, the technology stack, its foundation on AgentOS,
 * upcoming subscription tiers, and privacy commitments. It is designed to be visually appealing,
 * informative, and reflect the SOTA nature of the application.
 * @version 2.0.0
 * @author Manic.Agency
 *
 * @component AboutView
 * @description The main view for presenting information about the application.
 * It uses various child components and imported icons to display content in a structured
 * and aesthetically pleasing manner.
 */

import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
  LinkIcon,
  UserIcon,
  MicrophoneIcon,
  SparklesIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
  DocumentTextIcon,
  TvIcon,
  PresentationChartLineIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  SunIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline';

export default defineComponent({
  name: 'AboutView',
  components: {
    ArrowLeftIcon,
    QuestionMarkCircleIcon,
    BoltIcon,
    CubeTransparentIcon,
    ShieldCheckIcon,
    LinkIcon,
    UserIcon,
    MicrophoneIcon,
    SparklesIcon,
    CodeBracketSquareIcon,
    CpuChipIcon,
    DocumentTextIcon,
    TvIcon,
    PresentationChartLineIcon,
    AdjustmentsHorizontalIcon,
    CurrencyDollarIcon,
    SunIcon,
    CheckBadgeIcon,
    GlobeAltIcon,
    RocketLaunchIcon,
    AcademicCapIcon,
    UsersIcon,
    WrenchScrewdriverIcon,
    EyeIcon,
    ScaleIcon
  },
  setup() {
    const router = useRouter();
    const goHome = () => router.push('/');
    const currentYear = computed(() => new Date().getFullYear());

    const subscriptionTiers = [
      {
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        description: 'Basic voice chat functionality with limited usage.',
        features: [
          'Core Voice Chat',
          'Limited Conversation History (10 turns)',
          '1 Active Assistant Profile',
          'Basic AI Models',
          'Community Support'
        ],
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        textColor: 'text-slate-700 dark:text-slate-300',
        buttonClass: 'btn-secondary',
        highlight: false
      },
      {
        name: 'Basic',
        priceMonthly: 9.99,
        priceYearly: 99.99,
        description: 'Enhanced voice chat with more features and higher limits.',
        features: [
          'All Free Features',
          'Extended History (50 turns)',
          '3 Active Assistant Profiles',
          'Advanced AI Models Option',
          'Custom Personas',
          'Conversation Export',
          'Email Support'
        ],
        bgColor: 'bg-primary-50 dark:bg-primary-900/30',
        textColor: 'text-primary-700 dark:text-primary-300',
        buttonClass: 'btn-primary',
        highlight: true
      },
      {
        name: 'Pro',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        description: 'Advanced features with extensive usage and priority support.',
        features: [
          'All Basic Features',
          'Unlimited History (200 turns)',
          '10 Active Assistant Profiles',
          'Premium AI Models Access',
          'Advanced Tools Integration (Coming Soon)',
          'API Access (Coming Soon)',
          'Team Collaboration (Coming Soon)',
          'Priority Support'
        ],
        bgColor: 'bg-sky-50 dark:bg-sky-900/20',
        textColor: 'text-sky-700 dark:text-sky-300',
        buttonClass: 'btn-holographic',
        highlight: false
      }
    ];

    return { goHome, currentYear, subscriptionTiers };
  }
});
</script>

<template>
  <div class="about-page-container min-h-screen bg-gradient-to-br from-[var(--bg-base)] via-[var(--bg-subtle)] to-[var(--accent-500)]/10 dark:from-[var(--bg-base)] dark:via-gray-950 dark:to-[var(--accent-500)]/5 text-[var(--text-primary)]">
    <!-- Header -->
    <header class="sticky top-0 z-30 glass-pane shadow-md border-b-[var(--glass-border)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Chat Assistant Logo" class="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              About Voice Chat Assistant
            </h1>
          </div>
          <button @click="goHome" class="btn btn-ghost btn-sm" title="Back to Home">
            <ArrowLeftIcon class="h-4 w-4" />
            Back to App
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="space-y-16 sm:space-y-24">
        <!-- Hero Section -->
        <section class="text-center py-12 sm:py-16 rounded-xl card-base relative overflow-hidden border-fx-glow-primary">
          <div class="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="heroPattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="scale(2) rotate(45)">
                  <path d="M0 50V0H50" fill="none" stroke="hsl(var(--primary-hue) 92% 60% / 0.5)" stroke-width="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroPattern)" />
            </svg>
          </div>
          <div class="relative z-10">
            <img src="/src/assets/logo.svg" alt="Voice Chat Assistant Logo" class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 p-3 bg-[var(--bg-subtle)] dark:bg-[var(--bg-surface-rgb)] rounded-full shadow-xl border border-[var(--border-color)]" />
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight text-shadow-soft">
              <span class="block">The Future of Interaction is Voice.</span>
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-500)] via-[var(--accent-500)] to-teal-500 text-shadow-glow-primary">
                Meet Voice Chat Assistant
              </span>
            </h2>
            <p class="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Revolutionize your workflow. Speak your code, design systems, analyze meetings, and engage with AI that truly understands context, powered by the groundbreaking AgentOS framework.
            </p>
            <div class="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
              <span class="chip">Version: 2.0.0 (SaaS Evolution)</span>
              <span class="chip">Core AI: AgentOS Powered</span>
              <span class="chip">Tech: Vue 3 + TypeScript</span>
            </div>
          </div>
        </section>

        <!-- Coming Soon Banner -->
        <section class="py-10 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[var(--primary-600)] via-[var(--accent-500)] to-teal-600 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 opacity-20">
            <SparklesIcon class="w-48 h-48 transform rotate-12" />
          </div>
          <div class="relative z-10 text-center">
            <RocketLaunchIcon class="w-16 h-16 mx-auto mb-4 text-white/80" />
            <h3 class="text-3xl sm:text-4xl font-bold mb-3">Full SaaS Experience Unleashed Soon!</h3>
            <p class="text-lg sm:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Get ready! Advanced features, powerful tools, and flexible subscription tiers are on their way to elevate your AI interactions to unprecedented levels.
            </p>
            <a href="#subscription-tiers" class="btn bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              Explore Upcoming Tiers
            </a>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="content-section card-base" aria-labelledby="how-to-use-title">
          <div class="section-icon-bg">
            <QuestionMarkCircleIcon class="section-icon-svg" />
          </div>
          <h3 id="how-to-use-title" class="section-title-text">How It Works</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div class="instruction-card glass-pane-interactive">
              <div class="mb-4 text-[var(--primary-500)]"><UserIcon class="w-10 h-10 mx-auto" /></div>
              <h4 class="font-semibold text-lg mb-2 text-[var(--text-primary)]">1. Select Your Assistant</h4>
              <p class="text-sm text-[var(--text-secondary)]">Choose a specialized AI persona (e.g., Code Architect, Meeting Analyst) to tailor expertise for your task.</p>
            </div>
            <div class="instruction-card glass-pane-interactive">
              <div class="mb-4 text-green-500"><MicrophoneIcon class="w-10 h-10 mx-auto" /></div>
              <h4 class="font-semibold text-lg mb-2 text-[var(--text-primary)]">2. Engage with Voice</h4>
              <p class="text-sm text-[var(--text-secondary)]">Activate voice input. Use natural language for commands, queries, or dictation. Control modes in Settings.</p>
            </div>
            <div class="instruction-card glass-pane-interactive">
              <div class="mb-4 text-purple-500"><SparklesIcon class="w-10 h-10 mx-auto" /></div>
              <h4 class="font-semibold text-lg mb-2 text-[var(--text-primary)]">3. Experience AI Assistance</h4>
              <p class="text-sm text-[var(--text-secondary)]">The AI processes your request, dynamically providing code, diagrams, insights, or summaries in an adaptive interface.</p>
            </div>
          </div>
        </section>

        <!-- Features Showcase -->
        <section class="content-section card-base" aria-labelledby="features-title">
          <div class="section-icon-bg">
            <BoltIcon class="section-icon-svg" />
          </div>
          <h3 id="features-title" class="section-title-text">Powerful Features at Your Fingertips</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            <!-- Advanced Voice Interaction -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30">
                <MicrophoneIcon class="feature-icon text-[var(--primary-500)]" />
              </div>
              <div>
                <h4 class="feature-name">Advanced Voice Interaction</h4>
                <p class="feature-desc">Real-time STT (Whisper & Web Speech API), LLM intent parsing, and full voice control.</p>
              </div>
            </div>

            <!-- AI-Driven Dynamic UI -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-green-100 dark:bg-green-900/30">
                <CodeBracketSquareIcon class="feature-icon text-green-500" />
              </div>
              <div>
                <h4 class="feature-name">AI-Driven Dynamic UI</h4>
                <p class="feature-desc">Interface adapts in real-time, presenting contextually relevant information and tools.</p>
              </div>
            </div>

            <!-- Intelligent AgentOS Assistants -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-purple-100 dark:bg-purple-900/30">
                <CpuChipIcon class="feature-icon text-purple-500" />
              </div>
              <div>
                <h4 class="feature-name">Intelligent AgentOS Assistants</h4>
                <p class="feature-desc">Sophisticated AI personas with custom capabilities and complex reasoning.</p>
              </div>
            </div>

            <!-- Adaptive Content Display -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-sky-100 dark:bg-sky-900/30">
                <TvIcon class="feature-icon text-sky-500" />
              </div>
              <div>
                <h4 class="feature-name">Adaptive Content Display</h4>
                <p class="feature-desc">Complex info broken into digestible slides, plus Mermaid.js diagram rendering.</p>
              </div>
            </div>

            <!-- Rich Content Tools -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-yellow-100 dark:bg-yellow-900/30">
                <DocumentTextIcon class="feature-icon text-yellow-500" />
              </div>
              <div>
                <h4 class="feature-name">Rich Content Tools</h4>
                <p class="feature-desc">Meeting summaries, code explanations, system design, interview practice, and more.</p>
              </div>
            </div>

            <!-- Highly Customizable -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-indigo-100 dark:bg-indigo-900/30">
                <AdjustmentsHorizontalIcon class="feature-icon text-indigo-500" />
              </div>
              <div>
                <h4 class="feature-name">Highly Customizable</h4>
                <p class="feature-desc">Personalize themes (Light, Dark, Holographic), audio settings, personas, and more.</p>
              </div>
            </div>

            <!-- Transparent Cost Tracking -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-rose-100 dark:bg-rose-900/30">
                <CurrencyDollarIcon class="feature-icon text-rose-500" />
              </div>
              <div>
                <h4 class="feature-name">Transparent Cost Tracking</h4>
                <p class="feature-desc">Monitor API usage costs in real-time with configurable session limits.</p>
              </div>
            </div>

            <!-- Secure User Management -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-pink-100 dark:bg-pink-900/30">
                <UsersIcon class="feature-icon text-pink-500" />
              </div>
              <div>
                <h4 class="feature-name">Secure User Management</h4>
                <p class="feature-desc">Robust authentication, profile management, and upcoming subscription tiers.</p>
              </div>
            </div>

            <!-- Beautiful Themes -->
            <div class="feature-item">
              <div class="feature-icon-wrapper bg-lime-100 dark:bg-lime-900/30">
                <SunIcon class="feature-icon text-lime-500" />
              </div>
              <div>
                <h4 class="feature-name">Beautiful Themes</h4>
                <p class="feature-desc">Light, Dark, and a unique Holographic mode for a stunning visual experience.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Powered by AgentOS -->
        <section class="content-section card-base-hover" aria-labelledby="agentos-title">
          <div class="section-icon-bg">
            <AcademicCapIcon class="section-icon-svg opacity-50 dark:opacity-30" />
          </div>
          <h3 id="agentos-title" class="section-title-text">Empowered by <span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-500)] to-teal-400">AgentOS</span></h3>
          <div class="prose dark:prose-invert max-w-none text-[var(--text-secondary)] text-lg leading-relaxed">
            <p>
              Voice Chat Assistant's intelligence is supercharged by <strong>AgentOS</strong>, our revolutionary, in-development framework designed to build truly adaptive, context-aware AI systems. AgentOS moves beyond traditional AI by creating Generalized Mind Instances (GMIs) – AI entities that understand context, learn from interactions, and deliver personalized experiences.
            </p>
            <p>
              AgentOS is a collaborative effort by <strong>The Framers</strong> (GitHub: <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer">wearetheframers</a>) and <strong>Manic Inc.</strong> (GitHub: <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer">manicinc</a>). This foundational technology will be hosted and shared via <a href="https://frame.dev" target="_blank" rel="noopener noreferrer">frame.dev</a> and <a href="https://manic.agency" target="_blank" rel="noopener noreferrer">manic.agency</a>.
            </p>
            <h4 class="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-3">Current AgentOS Capabilities in VCA:</h4>
            <ul class="list-disc list-inside space-y-1 marker:text-[var(--primary-500)]">
              <li>Dynamic UI rendering based on conversational context.</li>
              <li>Management of specialized AI assistant personas and modes.</li>
              <li>Sophisticated prompt engineering for nuanced AI responses.</li>
            </ul>
          </div>
        </section>

        <!-- AgentOS Roadmap -->
        <section class="content-section card-base" aria-labelledby="agentos-roadmap-title">
          <div class="section-icon-bg">
            <RocketLaunchIcon class="section-icon-svg opacity-50 dark:opacity-30" />
          </div>
          <h3 id="agentos-roadmap-title" class="section-title-text"><span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-500)] to-teal-400">AgentOS</span>: The Road Ahead (Exciting Developments Incoming!)</h3>
          <div class="prose dark:prose-invert max-w-none text-[var(--text-secondary)] text-lg leading-relaxed">
            <p>While AgentOS already brings significant power to VCA, its full potential is rapidly unfolding. We are actively working on expanding its capabilities:</p>
            <p class="mb-6">
              <strong>Current Agent Focus:</strong> Our agents within VCA are primarily focused on advanced conversational tasks and dynamic information presentation.
              <span class="block mt-2 p-3 bg-[var(--bg-subtle)] dark:bg-gray-800/60 border-l-4 border-[var(--primary-500)] rounded-md text-sm">
                <strong>Note:</strong> Features like external tool integration, direct inter-agent communication, and advanced visual understanding are part of our exciting future roadmap and are not yet enabled in the current VCA version.
              </span>
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="flex items-start gap-3">
                <WrenchScrewdriverIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">Advanced Tool System & Orchestration:</strong> Enabling agents to seamlessly utilize external tools and APIs.</div>
              </div>
              <div class="flex items-start gap-3">
                <AcademicCapIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">Sophisticated RAG & Knowledge Integration:</strong> Deeper knowledge grounding for highly accurate and context-rich responses.</div>
              </div>
              <div class="flex items-start gap-3">
                <UsersIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">Multi-Agent Coordination:</strong> Allowing multiple GMIs to collaborate intelligently on complex tasks.</div>
              </div>
              <div class="flex items-start gap-3">
                <EyeIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">Vision Capabilities:</strong> Empowering agents to understand and process images and visual data.</div>
              </div>
              <div class="flex items-start gap-3">
                <ScaleIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">Constitutional AI & Enhanced Safety:</strong> Implementing robust ethical frameworks and safety protocols.</div>
              </div>
              <div class="flex items-start gap-3">
                <SparklesIcon class="w-7 h-7 text-[var(--primary-500)] flex-shrink-0 mt-1" />
                <div><strong class="text-[var(--text-primary)]">And much more:</strong> Continuously evolving to create truly adaptive and intelligent AI systems.</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Subscription Tiers -->
        <section id="subscription-tiers" class="content-section card-base" aria-labelledby="subscription-tiers-title">
          <div class="section-icon-bg">
            <CurrencyDollarIcon class="section-icon-svg opacity-60 dark:opacity-30" />
          </div>
          <h3 id="subscription-tiers-title" class="section-title-text">Unlock More Power: Upcoming Subscription Tiers</h3>
          <p class="text-center text-lg text-[var(--text-secondary)] -mt-4 mb-10 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All paid plans include yearly options for extra savings! (Final features and pricing subject to change upon official launch.)
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            <div
              v-for="tier in subscriptionTiers"
              :key="tier.name"
              :class="[
                'tier-card card-base p-6 sm:p-8 flex flex-col rounded-xl transition-all duration-300 ease-out hover:shadow-2xl',
                tier.bgColor,
                tier.highlight ? 'border-2 border-[var(--primary-500)] scale-105 shadow-2xl relative z-10' : 'border border-[var(--border-color)]'
              ]"
            >
              <div v-if="tier.highlight" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[var(--primary-500)] text-white text-xs font-semibold rounded-full shadow-md">Most Popular</div>
              <h4 :class="['text-2xl font-bold mb-2 text-center', tier.textColor]">{{ tier.name }}</h4>
              <div class="text-center mb-4">
                <span :class="['text-4xl font-extrabold', tier.textColor]">${{ tier.priceMonthly.toFixed(2) }}</span>
                <span :class="['text-sm', tier.textColor, 'opacity-80']">/month</span>
              </div>
              <p :class="['text-sm text-center mb-6 min-h-[40px]', tier.textColor, 'opacity-90']">{{ tier.description }}</p>

              <ul class="space-y-3 mb-8 flex-grow">
                <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2">
                  <CheckBadgeIcon :class="['w-5 h-5 flex-shrink-0 mt-0.5', tier.textColor, 'opacity-70']" />
                  <span :class="['text-sm', tier.textColor]">{{ feature }}</span>
                </li>
              </ul>
              <button :class="['btn w-full mt-auto', tier.buttonClass, tier.highlight ? '' : 'opacity-80 hover:opacity-100']">
                Coming Soon
              </button>
              <div v-if="tier.priceYearly > 0" :class="['text-xs text-center mt-3', tier.textColor, 'opacity-70']">
                Or ${{ tier.priceYearly.toFixed(2) }}/year (Save ~16%)
              </div>
            </div>
          </div>
        </section>

        <!-- Tech Stack -->
        <section class="content-section card-base" aria-labelledby="tech-stack-title">
          <div class="section-icon-bg">
            <CubeTransparentIcon class="section-icon-svg" />
          </div>
          <h3 id="tech-stack-title" class="section-title-text">Built With SOTA Technologies</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 text-center">
            <div class="tech-item-futuristic">Vue.js 3</div>
            <div class="tech-item-futuristic">TypeScript</div>
            <div class="tech-item-futuristic">Tailwind CSS</div>
            <div class="tech-item-futuristic">Vite</div>
            <div class="tech-item-futuristic">Node.js / Express.js</div>
            <div class="tech-item-futuristic">AgentOS</div>
            <div class="tech-item-futuristic">OpenAI & OpenRouter</div>
            <div class="tech-item-futuristic">PostgreSQL & Prisma</div>
            <div class="tech-item-futuristic">Docker</div>
            <div class="tech-item-futuristic">LemonSqueezy (Planned)</div>
          </div>
        </section>

        <!-- Privacy & Security -->
        <section class="content-section card-base" aria-labelledby="privacy-title">
          <div class="section-icon-bg">
            <ShieldCheckIcon class="section-icon-svg" />
          </div>
          <h3 id="privacy-title" class="section-title-text">Your Privacy & Security Matters</h3>
          <ul class="space-y-4 text-[var(--text-secondary)] text-sm sm:text-base">
            <li class="flex items-start gap-3"><CheckBadgeIcon class="privacy-icon text-green-500 dark:text-green-400" /><span><strong>Client-Side Processing Emphasis:</strong> Many operations, including initial voice processing (WebSpeech), are handled directly in your browser to minimize data transmission.</span></li>
            <li class="flex items-start gap-3"><CheckBadgeIcon class="privacy-icon text-green-500 dark:text-green-400" /><span><strong>Secure API Communication:</strong> All communication with backend services and AI APIs is encrypted over HTTPS.</span></li>
            <li class="flex items-start gap-3"><CheckBadgeIcon class="privacy-icon text-green-500 dark:text-green-400" /><span><strong>No Long-Term Voice Storage by Us:</strong> Voice recordings sent for transcription (e.g., to Whisper) are processed by third-party API providers according to their policies and are not stored long-term on our servers.</span></li>
            <li class="flex items-start gap-3"><CheckBadgeIcon class="privacy-icon text-green-500 dark:text-green-400" /><span><strong>User-Controlled Data:</strong> You control your preferences for audio input, data display, conversation history, and API cost limits.</span></li>
            <li class="flex items-start gap-3"><CheckBadgeIcon class="privacy-icon text-green-500 dark:text-green-400" /><span><strong>Open & Transparent:</strong> Key parts of the application's code will be available for review, fostering trust and community collaboration. (Source code links coming soon).</span></li>
          </ul>
        </section>

        <!-- Credits -->
        <section class="content-section card-base" aria-labelledby="credits-title">
          <div class="section-icon-bg">
            <LinkIcon class="section-icon-svg" />
          </div>
          <h3 id="credits-title" class="section-title-text">Credits & Community</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <h4 class="font-semibold text-[var(--text-primary)] text-lg mb-3">Developed & Powered By:</h4>
              <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" class="link-item-futuristic group">
                <GlobeAltIcon class="link-icon" />
                <span class="link-text">Manic.Agency</span>
                <span class="link-description">Digital Artisans Crafting SOTA Solutions</span>
              </a>
              <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" class="link-item-futuristic group mt-3">
                <svg viewBox="0 0 24 24" class="link-icon fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                <span class="link-text">Frame.dev (AgentOS Platform)</span>
                <span class="link-description">The Future of Adaptive AI Frameworks</span>
              </a>
            </div>
            <div>
              <h4 class="font-semibold text-[var(--text-primary)] text-lg mb-3">Connect with Our Teams:</h4>
              <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer" class="link-item-futuristic group">
                <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047 0.138 3.006 0.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span class="link-text">Manic Inc. on GitHub</span>
                <span class="link-description">VCA Application & Core Development</span>
              </a>
              <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer" class="link-item-futuristic group mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047 0.138 3.006 0.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span class="link-text">The Framers on GitHub</span>
                <span class="link-description">AgentOS Framework Development</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <section class="text-center text-sm text-[var(--text-muted)] pt-10 border-t border-[var(--border-color)] dark:border-[var(--border-color-rgb)]/30">
          <p>&copy; {{ currentYear }} Voice Chat Assistant by Manic.Agency & The Framers. All rights reserved.</p>
          <p class="mt-1">
            This platform is evolving. Features and services are subject to change.
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/************************************
 * Tailwind‑friendly scoped styles  *
 ***********************************/

/* ---------- Helpers ---------- */
.text-shadow-soft          { text-shadow: 0 1px 3px hsla(0,0%,0%,.1), 0 0 1px hsla(0,0%,0%,.05); }
.dark .text-shadow-soft    { text-shadow: 0 1px 3px hsla(0,0%,0%,.3), 0 0 1px hsla(0,0%,0%,.2); }
.text-shadow-glow-primary  { text-shadow: 0 0 8px hsla(var(--primary-hue) 92% 60%/.5),0 0 16px hsla(var(--primary-hue) 92% 60%/.3); }
.dark .text-shadow-glow-primary{ text-shadow:0 0 10px hsla(var(--primary-hue) 94% 69%/.6),0 0 20px hsla(var(--primary-hue) 94% 69%/.4); }

/* ---------- Chip ---------- */
.chip {
  @apply px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border border-transparent transition-colors;
  background-color: var(--bg-surface);
  color: var(--text-muted);
}
.dark .chip { background-color: rgba(55,65,81,.6); }
.chip:hover { border-color: hsl(var(--primary-hue) 92% 60%/.3); }

/* ---------- Buttons ---------- */
.btn {
  @apply inline-flex items-center justify-center gap-x-2 px-5 py-2.5 rounded-lg font-semibold text-sm select-none transition-transform duration-200 ease-out active:scale-[0.97] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
}
.btn-primary {
  @apply btn text-white bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400;
  box-shadow: 0 0 12px hsl(var(--primary-hue) 92% 60%/.25);
}
.btn-primary:hover { box-shadow: 0 0 16px hsl(var(--primary-hue) 92% 60%/.35); }

.btn-secondary {
  @apply btn border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] dark:bg-gray-700 dark:border-gray-600;
}
.btn-secondary:hover { background-color: var(--bg-subtle); }
.dark .btn-secondary:hover { background-color: rgba(55,65,81,.8); }

.btn-ghost {
  @apply btn text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-400/10 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400;
}

.btn-danger {
  @apply btn text-white bg-gradient-to-br from-[var(--error-color)] to-red-700 hover:from-red-600 hover:to-red-800 focus-visible:ring-[var(--error-color)];
  box-shadow: 0 0 12px hsl(0 84% 60%/.3);
}
.btn-danger:hover { box-shadow: 0 0 16px hsl(0 84% 60%/.45); }

.btn-holographic {
  @apply btn border border-primary-500/30 bg-primary-50/5 dark:border-primary-400/30 dark:bg-primary-400/5 backdrop-blur-sm text-primary-600 dark:text-primary-400;
}
.btn-holographic:hover {
  border-color: hsl(var(--primary-hue) 92% 60%/.5);
  background-color: hsl(var(--primary-hue) 92% 96%/.1);
  box-shadow: 0 0 12px hsl(var(--primary-hue) 92% 60%/.4);
}

/* ---------- Card / Glass ---------- */
.glass-pane {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: 1rem;
  transition: box-shadow .3s var(--ease-out-quad), border-color .3s var(--ease-out-quad);
}
.glass-pane-interactive:hover { border-color: hsl(var(--primary-hue) 92% 60%/.3); box-shadow: 0 4px 20px hsl(var(--primary-hue) 92% 60%/.15); }

.card-base {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  transition: transform .3s var(--ease-out-quad), box-shadow .3s var(--ease-out-quad);
}
.dark .card-base { background-color: rgb(var(--bg-surface-rgb)); border-color: rgba(55,65,81,.8); }
.card-base-hover:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 6px 24px rgba(0,0,0,.08); }

/* ---------- Feature Grid ---------- */
.feature-item {
  @apply flex items-start gap-4 p-4 rounded-lg transition-transform duration-200 ease-out;
  background-color: hsl(var(--primary-hue) 95% 96%/.3);
}
.dark .feature-item { background-color: hsl(var(--primary-hue) 70% 25%/.2); }
.feature-item:hover { transform: scale(1.03); }

.feature-icon-wrapper {@apply flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-transform;}
.feature-item:hover .feature-icon-wrapper { transform: scale(1.1); }

/* ---------- Chip, tech badge, etc. ---------- */
.tech-item-futuristic {
  @apply p-3 sm:p-4 rounded-lg text-sm font-medium shadow-md transition-transform duration-200 ease-out;
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
}
.tech-item-futuristic:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(0,0,0,.06); }
.dark .tech-item-futuristic { background-color: var(--bg-surface); }

/* ---------- Links ---------- */
.link-item-futuristic {
  @apply flex flex-col p-4 rounded-lg transition-transform duration-200 ease-out;
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
}
.link-item-futuristic:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
.dark .link-item-futuristic { background-color: var(--bg-surface); }

.link-icon { @apply w-6 h-6 mb-2; color: hsl(var(--primary-hue) 92% 60%); }
.link-item-futuristic:hover .link-icon { color: hsl(var(--accent-hue) 80% 45%); }

/* ---------- Prose tweaks ---------- */
.prose a { text-decoration: none; font-weight: 500; color: hsl(var(--primary-hue) 84% 54%); transition: color .2s; }
.prose a:hover { text-decoration: underline; color: hsl(var(--primary-hue) 77% 49%); }
.dark .prose a { color: hsl(var(--primary-hue) 70% 69%); }
.dark .prose a:hover { color: hsl(var(--primary-hue) 70% 79%); }

</style>
