<template>
  <div class="about-page-container min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-sky-50 dark:from-gray-900 dark:via-gray-850 dark:to-sky-900/30 text-gray-800 dark:text-gray-200">
    <header class="sticky top-0 z-20 bg-white/90 dark:bg-gray-850/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Coding Assistant Logo" class="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              About Voice Chat Assistant
            </h1>
          </div>
          <button
            @click="goHome"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
            title="Back to Home"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back to App
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="space-y-12 sm:space-y-16">

        <section class="text-center py-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <div class="mb-6">
            <img src="/src/assets/logo.svg" alt="Voice Coding Assistant Logo" class="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-5 p-2 bg-slate-100 dark:bg-slate-700 rounded-full shadow-md" />
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              <span class="block">Welcome to the</span>
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-sky-500 to-teal-500">
                Voice Chat Assistant
              </span>
            </h2>
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your development workflow. Speak your code, design complex systems,
              and get instant AI-powered assistance for coding challenges, system architecture, and meeting analysis.
            </p>
          </div>
          <div class="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span class="chip">Version: 1.2.0 (Frontend Focus)</span>
            <span class="chip">AI: OpenAI Models</span>
            <span class="chip">Framework: Vue 3 + TypeScript</span>
          </div>
        </section>

        <section class="content-section" aria-labelledby="how-to-use-title">
          <div class="section-icon-bg"><QuestionMarkCircleIcon class="section-icon-svg"/></div>
          <h3 id="how-to-use-title" class="section-title-text">How to Use Voice Coding Assistant</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="instruction-card">
              <div class="mb-3 text-primary-500"><UserIcon class="w-8 h-8 mx-auto"/></div>
              <h4 class="font-semibold mb-2 text-gray-800 dark:text-white">1. Select Your Mode</h4>
              <p class="text-sm">Choose an assistant mode from the header (e.g., Coding Q&A, System Design, Meeting Summary) to tailor the AI's expertise.</p>
            </div>
            <div class="instruction-card">
              <div class="mb-3 text-green-500"><MicrophoneIcon class="w-8 h-8 mx-auto"/></div>
              <h4 class="font-semibold mb-2 text-gray-800 dark:text-white">2. Activate Voice Input</h4>
              <p class="text-sm">Click the microphone button. Use Push-to-Talk, Continuous Listening, or Voice Activation based on your preference (configurable in Settings).</p>
            </div>
            <div class="instruction-card">
              <div class="mb-3 text-purple-500"><SparklesIcon class="w-8 h-8 mx-auto"/></div>
              <h4 class="font-semibold mb-2 text-gray-800 dark:text-white">3. Get AI Assistance</h4>
              <p class="text-sm">Speak your query. The AI will process your request, providing code, diagrams, explanations, or summaries directly in the chat interface.</p>
            </div>
          </div>
        </section>

        <section class="content-section" aria-labelledby="features-title">
          <div class="section-icon-bg"><BoltIcon class="section-icon-svg"/></div>
          <h3 id="features-title" class="section-title-text">Powerful Features at Your Fingertips</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="feature-item"> <div class="feature-icon-wrapper bg-blue-100 dark:bg-blue-900/30"><MicrophoneIcon class="feature-icon text-blue-500"/></div> <div> <h4 class="feature-name">Advanced Voice Recognition</h4> <p class="feature-desc">Utilizes OpenAI Whisper and robust Web Speech API with multiple audio modes (Push-to-Talk, Continuous, Voice Activation) for flexible input.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-green-100 dark:bg-green-900/30"><CodeBracketSquareIcon class="feature-icon text-green-500"/></div> <div> <h4 class="feature-name">Intelligent Code Assistance</h4> <p class="feature-desc">Receive code examples, debugging help, and algorithm explanations across various programming languages.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-purple-100 dark:bg-purple-900/30"><CpuChipIcon class="feature-icon text-purple-500"/></div> <div> <h4 class="feature-name">System Design & Diagrams</h4> <p class="feature-desc">Brainstorm and visualize system architectures with AI-generated advice and automatic Mermaid diagram rendering.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-yellow-100 dark:bg-yellow-900/30"><DocumentTextIcon class="feature-icon text-yellow-500"/></div> <div> <h4 class="feature-name">Meeting Summaries</h4> <p class="feature-desc">Efficiently transcribe and summarize discussions, extracting key decisions and action items.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-sky-100 dark:bg-sky-900/30"><TvIcon class="feature-icon text-sky-500"/></div> <div> <h4 class="feature-name">Interview Mode</h4> <p class="feature-desc">Practice FAANG-style coding interviews with structured, timed responses and detailed explanations.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-pink-100 dark:bg-pink-900/30"><PresentationChartLineIcon class="feature-icon text-pink-500"/></div> <div> <h4 class="feature-name">Adaptive Content Display</h4> <p class="feature-desc">Complex information is broken down into digestible slides with timed progression for focused learning.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-indigo-100 dark:bg-indigo-900/30"><AdjustmentsHorizontalIcon class="feature-icon text-indigo-500"/></div> <div> <h4 class="feature-name">Customizable Experience</h4> <p class="feature-desc">Personalize modes, audio settings, themes, and more via the comprehensive Settings page.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-rose-100 dark:bg-rose-900/30"><CurrencyDollarIcon class="feature-icon text-rose-500"/></div> <div> <h4 class="feature-name">Cost Tracking</h4> <p class="feature-desc">Monitor your API usage costs in real-time with configurable session limits.</p> </div> </div>
            <div class="feature-item"> <div class="feature-icon-wrapper bg-lime-100 dark:bg-lime-900/30"><SunIcon class="feature-icon text-lime-500"/></div> <div> <h4 class="feature-name">Light & Dark Modes</h4> <p class="feature-desc">Comfortable viewing with beautiful, responsive themes that adapt to your system preference.</p> </div> </div>
          </div>
        </section>

        <section class="content-section" aria-labelledby="tech-stack-title">
          <div class="section-icon-bg"><CubeTransparentIcon class="section-icon-svg"/></div>
          <h3 id="tech-stack-title" class="section-title-text">Built With Modern Technologies</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
            <div class="tech-item">Vue.js 3</div> <div class="tech-item">TypeScript</div>
            <div class="tech-item">Tailwind CSS</div> <div class="tech-item">Vite</div>
            <div class="tech-item">Node.js</div> <div class="tech-item">Express.js</div>
            <div class="tech-item">OpenAI API</div> <div class="tech-item">Docker</div>
          </div>
        </section>

        <section class="content-section" aria-labelledby="privacy-title">
          <div class="section-icon-bg"><ShieldCheckIcon class="section-icon-svg"/></div>
          <h3 id="privacy-title" class="section-title-text">Your Privacy & Security Matters</h3>
           <ul class="space-y-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            <li class="flex items-start gap-2.5"><CheckBadgeIcon class="privacy-icon"/><span><strong>Client-Side Processing Emphasis:</strong> Many operations, including some audio processing (WebSpeech), are handled directly in your browser.</span></li>
            <li class="flex items-start gap-2.5"><CheckBadgeIcon class="privacy-icon"/><span><strong>Secure API Communication:</strong> All communication with backend services and AI APIs is over HTTPS.</span></li>
            <li class="flex items-start gap-2.5"><CheckBadgeIcon class="privacy-icon"/><span><strong>No Long-Term Voice Storage:</strong> Voice recordings sent for transcription (e.g., to Whisper) are processed and typically not stored long-term by the API providers beyond what's necessary for service provision.</span></li>
            <li class="flex items-start gap-2.5"><CheckBadgeIcon class="privacy-icon"/><span><strong>User-Controlled Settings:</strong> You control your preferences for audio input, data display, and session limits.</span></li>
            <li class="flex items-start gap-2.5"><CheckBadgeIcon class="privacy-icon"/><span><strong>Open Source:</strong> The application's frontend and backend code is open for review (link below).</span></li>
          </ul>
        </section>

        <section class="content-section" aria-labelledby="credits-title">
          <div class="section-icon-bg"><LinkIcon class="section-icon-svg"/></div>
          <h3 id="credits-title" class="section-title-text">Credits & Useful Links</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Developed By:</h4>
              <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" class="link-item">
                <GlobeAltIcon class="link-icon"/> Manic.Agency
              </a>
            </div>
            <div>
              <!-- <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Source Code:</h4> -->
              <!-- <a href="https://github.com/manic-agency/voice-coding-assistant" target="_blank" rel="noopener noreferrer" class="link-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repository
              </a> -->
            </div>
          </div>
        </section>

        <!-- <section class="text-center text-xs text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p>&copy; {{ new Date().getFullYear() }} Voice Coding Assistant. All rights reserved.</p>
          <p>
            Licensed under the MIT License. See the
            <a href="https://github.com/manic-agency/voice-coding-assistant/blob/main/LICENSE"
               target="_blank" rel="noopener noreferrer"
               class="text-primary-600 dark:text-primary-400 hover:underline">
              LICENSE
            </a>
            file for details.
          </p>
        </section> -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * @file About.vue
 * @description Provides comprehensive information about the Voice Coding Assistant,
 * including its features, usage instructions, technology stack, and credits.
 * @version 1.1.0 - Enhanced design, more detailed content, and improved structure.
 */
import { useRouter } from 'vue-router';
import {
  ArrowLeftIcon, QuestionMarkCircleIcon, BoltIcon, CubeTransparentIcon, ShieldCheckIcon, LinkIcon,
  UserIcon, MicrophoneIcon, SparklesIcon, CodeBracketSquareIcon, CpuChipIcon, DocumentTextIcon,
  TvIcon, PresentationChartLineIcon, AdjustmentsHorizontalIcon, CurrencyDollarIcon, SunIcon, CheckBadgeIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.about-page-container {
  /* Gradient can be adjusted here */
}
.chip {
  @apply px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full;
}
.content-section {
  @apply bg-white dark:bg-gray-800/50 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700/60 relative overflow-hidden;
}
.section-icon-bg {
    @apply absolute -top-8 -right-8 sm:-top-10 sm:-right-10 text-slate-100 dark:text-gray-700/50 opacity-60 dark:opacity-30;
    z-index: 0;
}
.section-icon-svg {
    @apply w-28 h-28 sm:w-36 sm:h-36 transform rotate-[-15deg];
}
.section-title-text {
  @apply text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 relative z-10;
}
.instruction-card {
  @apply text-center p-5 bg-slate-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600/30 transition-shadow hover:shadow-md;
}
.feature-item {
  @apply flex items-start gap-4 p-4 bg-slate-50 dark:bg-gray-700/30 rounded-lg transition-all hover:shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700/50;
}
.feature-icon-wrapper {
    @apply flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center;
}
.feature-icon {
    @apply w-5 h-5 sm:w-6 sm:h-6;
}
.feature-name {
  @apply font-semibold text-gray-800 dark:text-white mb-1 text-base sm:text-lg;
}
.feature-desc {
  @apply text-gray-600 dark:text-gray-400 text-sm;
}
.tech-item {
  @apply p-3 sm:p-4 bg-slate-100 dark:bg-gray-700/60 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-shadow;
}
.privacy-icon {
    @apply w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5;
}
.link-item {
    @apply inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors;
}
.link-icon {
    @apply w-4 h-4 sm:w-5 sm:h-5;
}
</style>