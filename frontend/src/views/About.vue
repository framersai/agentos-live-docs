// File: frontend/src/views/About.vue
/**
 * @file Enhanced About Page - Unified Theme & Technical Architecture Deep Dive
 * @description About page refactored to align with global main.css, incorporating DiagramViewer
 * for architectural diagrams and detailed AgentOS technical information.
 * @version 2.4.2 - Corrected Tailwind classes and Mermaid diagram styles.
 */

<template>
  <div class="about-page min-h-screen text-[var(--text-primary)] transition-colors duration-300">
    <header class="sticky top-0 z-30 glass-pane">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Chat Assistant" class="w-10 h-10 sm:w-12 sm:h-12 animate-float" />
            <h1 class="text-xl sm:text-2xl font-bold text-glow-primary">               About Voice Chat Assistant
            </h1>
          </div>
          <button @click="goHome" class="btn btn-ghost btn-sm">
            <ArrowLeftIcon class="icon-sm mr-1 sm:mr-2" />             <span class="hidden sm:inline">Back to App</span>
            <span class="sm:hidden">Back</span>
          </button>
        </div>
      </div>
    </header>

    <main class="relative z-20 max-w-7xl mx-auto px-4 py-10 sm:py-12 space-y-16 sm:space-y-24">
      <section class="text-center pt-8 sm:pt-12">
        <div class="inline-block p-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-8 animate-float animation-delay-500">           <img src="/src/assets/logo.svg" alt="Logo" class="w-24 h-24 sm:w-32 sm:h-32 p-4 bg-neutral-bg-subtle rounded-full" />         </div>
        <h2 class="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500">           The Future is Voice
        </h2>
        <p class="text-xl md:text-2xl text-neutral-text-secondary max-w-3xl mx-auto">           Powered by AgentOS, Voice Chat Assistant revolutionizes how you interact with AI through natural conversation.
        </p>
      </section>

      <section>
        <div class="card-base p-8 md:p-12 rounded-xl">
          <h3 class="text-3xl md:text-4xl font-bold mb-10 text-center text-glow-primary">Our Mission</h3>           <div class="grid md:grid-cols-3 gap-8">
            <div class="mission-item text-center p-4 rounded-lg transition-shadow duration-300 hover:shadow-xl">
              <div class="mission-icon-container bg-gradient-to-br from-purple-500 to-pink-500">
                <RocketLaunchIcon class="w-10 h-10" />
              </div>
              <h4 class="text-xl font-semibold mb-2 mt-4 text-neutral-text">Innovate</h4>               <p class="text-neutral-text-secondary text-sm">Push the boundaries of AI interaction with cutting-edge voice technology.</p>             </div>
            <div class="mission-item text-center p-4 rounded-lg transition-shadow duration-300 hover:shadow-xl">
              <div class="mission-icon-container bg-gradient-to-br from-blue-500 to-cyan-500">
                <UsersIcon class="w-10 h-10" />
              </div>
              <h4 class="text-xl font-semibold mb-2 mt-4 text-neutral-text">Empower</h4>               <p class="text-neutral-text-secondary text-sm">Enable developers and creators to achieve more with AI assistance.</p>             </div>
            <div class="mission-item text-center p-4 rounded-lg transition-shadow duration-300 hover:shadow-xl">
              <div class="mission-icon-container bg-gradient-to-br from-green-500 to-emerald-500">
                <SparklesIcon class="w-10 h-10" />
              </div>
              <h4 class="text-xl font-semibold mb-2 mt-4 text-neutral-text">Transform</h4>               <p class="text-neutral-text-secondary text-sm">Reshape how humans and AI collaborate through natural conversation.</p>             </div>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary">Deep Dive into AgentOS</h3>         <div class="space-y-6 max-w-4xl mx-auto">
          <div class="card-base rounded-xl overflow-hidden">
            <button @click="toggleSection('philosophy')" class="expandable-header">
              <span class="text-neutral-text font-semibold">🧠 Foundation & Philosophy</span>               <ChevronDownIcon class="w-6 h-6 transition-transform duration-300 text-primary-500" :class="{'rotate-180': openSections.philosophy}" />             </button>
            <div v-if="openSections.philosophy" class="expandable-content prose dark:prose-invert max-w-none">
              <h4>Beyond Static AI: The Adaptive Intelligence Paradigm</h4>
              <p>Traditional AI systems follow: Input → Processing → Output. AgentOS introduces: Context → Adaptation → Personalized Intelligence.</p>
              <h5>Core Philosophical Principles:</h5>
              <ul>
                <li><strong>Context is the Foundation:</strong> Understanding the situation, person, and moment.</li>
                <li><strong>Personas Enable Consistent Intelligence:</strong> A cognitive framework for thinking, adapting, and evolving.</li>
                <li><strong>Memory Creates Continuity:</strong> Building on experiences, learning from outcomes.</li>
                <li><strong>Safety Through Understanding:</strong> Constitutional AI for context-aware ethical decisions.</li>
              </ul>
              <p class="italic text-sm">A Generalized Mind Instance (GMI) is an adaptive AI entity, not just a chatbot.</p>
               <p class="text-sm">
                AgentOS is a collaborative effort by
                <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer">The Framers</a>
                and
                <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer">Manic Inc</a>.
              </p>
            </div>
          </div>

          <div class="card-base rounded-xl overflow-hidden">
            <button @click="toggleSection('components')" class="expandable-header">
              <span class="text-neutral-text font-semibold">🛠️ Core System Components</span>               <ChevronDownIcon class="w-6 h-6 transition-transform duration-300 text-primary-500" :class="{'rotate-180': openSections.components}" />             </button>
            <div v-if="openSections.components" class="expandable-content prose dark:prose-invert max-w-none">
              <p>AgentOS is built upon a modular architecture enabling robust and flexible AI systems:</p>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <li v-for="component in agentOsComponents" :key="component" class="flex items-center !my-1">
                  <SparklesIcon class="icon-sm mr-2 text-accent-500 flex-shrink-0" /> {{ component }}                 </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary">AgentOS Technical Architecture</h3>         <div class="space-y-12">
          <div class="card-base p-6 md:p-8 rounded-xl">
            <h4 class="text-2xl font-semibold mb-4 text-neutral-text">System Architecture Overview</h4>             <div class="prose dark:prose-invert max-w-none mb-6 text-sm sm:text-base">
                <p>
                AgentOS comprises a sophisticated ecosystem designed for adaptive AI. Key layers include the User Interface, an Orchestration Layer managing Generalized Mind Instances (GMIs) and context, Core Services for personas and knowledge, and connections to various LLM Providers. This modular design allows for scalability and flexibility.
                </p>
            </div>
            <DiagramViewer :diagramCode="diagrams.systemOverview" diagramType="mermaid" />
          </div>

          <div class="card-base p-6 md:p-8 rounded-xl">
            <h4 class="text-2xl font-semibold mb-4 text-neutral-text">Data Flow Architecture</h4>             <div class="prose dark:prose-invert max-w-none mb-6 text-sm sm:text-base">
                <p>
                Data in AgentOS flows from user input (voice or text) through the Frontend to the Backend Orchestrator. The orchestrator analyzes context, retrieves relevant information from knowledge bases (RAG), constructs an adaptive prompt, and sends it to the LLM. The LLM's response is then processed, formatted, and delivered back to the user, often resulting in dynamic UI updates. This interactive loop enables continuous learning and adaptation based on user interactions and feedback.
                </p>
            </div>
            <DiagramViewer :diagramCode="diagrams.dataFlow" diagramType="mermaid" />
          </div>

          <div class="card-base p-6 md:p-8 rounded-xl">
            <h4 class="text-2xl font-semibold mb-4 text-neutral-text">Prompt Engine Architecture</h4>             <div class="prose dark:prose-invert max-w-none mb-6 text-sm sm:text-base">
                <p>
                The Prompt Engine is central to AgentOS's intelligence. It dynamically constructs prompts by first analyzing the input query and session context via the Context Analyzer. Then, the Element Selector chooses relevant persona definitions, contextual elements, and knowledge base information. Finally, the Prompt Assembler combines these pieces into an optimized, formatted prompt ready for the LLM, enabling truly adaptive and context-aware responses.
                </p>
            </div>
            <DiagramViewer :diagramCode="diagrams.promptEngine" diagramType="mermaid" />
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary">Choose Your Plan</h3>         <div class="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <div class="card-base p-6 flex flex-col text-center relative transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
            <div class="pricing-header mb-6">
              <h4 class="text-2xl font-bold text-neutral-text">Free</h4>               <div class="mt-2">
                <span class="text-4xl font-extrabold text-neutral-text">$0</span>                 <span class="text-neutral-text-muted">/month</span>               </div>
            </div>
            <ul class="pricing-features space-y-3 text-sm text-neutral-text-secondary mb-8 flex-grow">               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> 100 requests/day</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Basic AI models</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Voice input</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> 1 agent profile</li>               <li class="flex items-center justify-center gap-2"><XMarkIcon class="icon-sm text-red-500" /> Advanced features</li>               <li class="flex items-center justify-center gap-2"><XMarkIcon class="icon-sm text-red-500" /> Priority support</li>             </ul>
            <button class="btn btn-secondary w-full mt-auto">Get Started</button>
          </div>

          <div class="card-base p-6 flex flex-col text-center relative transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1 scale-100 md:scale-105 border-2 border-primary-500 shadow-lg shadow-primary-500/20 dark:shadow-primary-400/20">             <div class="chip absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-500 text-white border-none px-3 py-1 text-xs">Most Popular</div>             <div class="pricing-header mb-6 pt-2">
              <h4 class="text-2xl font-bold text-primary-500">Pro</h4>               <div class="mt-2">
                <span class="text-4xl font-extrabold text-primary-500">$29</span>                 <span class="text-neutral-text-muted">/month</span>               </div>
            </div>
            <ul class="pricing-features space-y-3 text-sm text-neutral-text-secondary mb-8 flex-grow">               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Unlimited requests</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Premium AI models</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> All voice features</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> 5 agent profiles</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Advanced tools</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Email support</li>             </ul>
            <button class="btn btn-primary w-full mt-auto">Upgrade to Pro</button>
          </div>

          <div class="card-base p-6 flex flex-col text-center relative transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
            <div class="pricing-header mb-6">
              <h4 class="text-2xl font-bold text-neutral-text">Enterprise</h4>               <div class="mt-2">
                <span class="text-4xl font-extrabold text-neutral-text">$99</span>                 <span class="text-neutral-text-muted">/month</span>               </div>
            </div>
            <ul class="pricing-features space-y-3 text-sm text-neutral-text-secondary mb-8 flex-grow">               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Everything in Pro</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Custom AI models</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> API access</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Unlimited agents</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Team collaboration</li>               <li class="flex items-center justify-center gap-2"><CheckIcon class="icon-sm text-green-500" /> Priority support</li>             </ul>
            <button class="btn btn-secondary w-full mt-auto">Contact Sales</button>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary">AgentOS Roadmap</h3>         <div class="roadmap-container-unified">
          <div class="roadmap-line-unified"></div>
          <div v-for="(item, index) in roadmapItems" :key="item.quarter"
               :class="['roadmap-item-unified', index % 2 === 0 ? 'justify-start text-left' : 'justify-end text-right']">
            <div class="roadmap-content-wrapper-unified" :class="index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'">
              <div class="roadmap-dot-unified" :class="index % 2 === 0 ? 'md:-left-4' : 'md:-right-4'"></div>
              <div class="card-base p-6 rounded-lg">
                <h4 class="text-xl font-bold mb-2 text-neutral-text">{{ item.quarter }}</h4>                 <ul class="space-y-2 text-neutral-text-secondary text-sm">                   <li v-for="feature in item.features" :key="feature" class="flex items-start" :class="index % 2 === 0 ? '' : 'md:flex-row-reverse'">
                     <span class="mr-2 md:mr-0 text-primary-500" :class="index % 2 === 0 ? 'md:mr-2' : 'md:ml-2 '">&bull;</span>                     <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="pt-12 sm:pt-16 text-center">
        <div class="card-base p-8 md:p-10 rounded-xl">
          <p class="text-neutral-text-secondary mb-6">             Voice Chat Assistant is powered by AgentOS.
            <br class="hidden sm:block">
            Proudly developed by
            <a href="https://manic.agency" target="_blank" rel="noopener noreferrer">Manic Inc.</a>
            &amp;
            <a href="https://frame.dev" target="_blank" rel="noopener noreferrer">The Framers</a>.
          </p>
          <div class="flex justify-center items-center gap-5 sm:gap-6 mb-6">
            <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" class="footer-link group" aria-label="Manic Agency Website">
              <GlobeAltIcon class="icon-lg"/>
              <span class="footer-link-tooltip group-hover:opacity-100 group-hover:visible">Manic.Agency</span>
            </a>
            <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" class="footer-link group" aria-label="Frame.dev Website">
               <CubeTransparentIcon class="icon-lg"/>
               <span class="footer-link-tooltip group-hover:opacity-100 group-hover:visible">Frame.dev</span>
            </a>
            <a href="https://github.com/manicinc" target="_blank" rel="noopener noreferrer" class="footer-link group" aria-label="Manic Inc. GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label="GitHub" class="icon-lg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span class="footer-link-tooltip group-hover:opacity-100 group-hover:visible">Manic Inc. GitHub</span>
            </a>
            <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer" class="footer-link group" aria-label="The Framers GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label="GitHub" class="icon-lg">
                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
               <span class="footer-link-tooltip group-hover:opacity-100 group-hover:visible">The Framers GitHub</span>
            </a>
          </div>
           <p class="text-xs text-neutral-text-muted">&copy; {{ new Date().getFullYear() }} Voice Chat Assistant. All rights reserved.</p>         </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
// NOTE: Vue 3 <script setup> does not allow duplicate <script> tags.
// The script content is already defined above. This is a structural placeholder.
// Ensure all imports and logic are in a single <script setup lang="ts"> block.
// The provided file structure already had this correctly in one block.
// So, this comment is just for clarity, the actual component code only has one <script setup>.
</script>

<style lang="postcss" scoped>
/* Scoped styles for About.vue - Aligned with global main.css */

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-float {
  animation: float 3.5s ease-in-out infinite;
}
.animation-delay-500 {
  animation-delay: 0.5s;
}

.mission-icon-container {
  @apply w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white shadow-md;
  transition: transform 0.3s var(--ease-out-quad), box-shadow 0.3s var(--ease-out-quad);
}
.mission-item:hover .mission-icon-container {
  transform: scale(1.1) translateY(-5px);
}

.expandable-header {
  @apply w-full flex justify-between items-center p-5 sm:p-6 text-left text-lg sm:text-xl cursor-pointer;
  transition: background-color 0.2s var(--ease-out-quad);
}
.expandable-header:hover {
  background-color: hsla(var(--primary-hue), 80%, 50%, 0.03); /* Softer hover */
}
.dark .expandable-header:hover {
  background-color: hsla(var(--primary-hue), 50%, 80%, 0.03); /* Softer hover */
}
.expandable-content {
  @apply p-5 sm:p-6 pt-0;
}
/* Prose class handles typography within expandable content */
.expandable-content.prose :deep(h4),
.expandable-content.prose :deep(h5) {
  color: var(--text-primary-hsl); /* Use HSL var from main.css */
  @apply mt-4 mb-2;
}

/* Pricing card specific content styling */
.pricing-header {
  @apply pb-6 border-b border-neutral-border; /* Use Tailwind direct color */
}
.pricing-features {
  @apply text-center;
}
.pricing-features li {
  @apply py-1.5;
}
.pricing-features .icon-sm { /* CORRECTED: Was icon-s */
  @apply mr-2;
}

/* Unified Roadmap Styles */
.roadmap-container-unified {
  @apply relative max-w-4xl mx-auto py-8;
}
.roadmap-line-unified {
  @apply absolute top-0 left-4 md:left-1/2 w-1 h-full bg-primary-300 dark:bg-primary-700 md:-translate-x-1/2; /* Use Tailwind direct colors */
  box-shadow: 0 0 6px hsla(var(--primary-hue), 70%, 50%, 0.2);
}
.dark .roadmap-line-unified {
  box-shadow: 0 0 8px hsla(var(--primary-hue), 70%, 60%, 0.3);
}

.roadmap-item-unified {
  @apply relative mb-10 md:mb-8 flex;
}
.roadmap-item-unified:last-child {
  @apply mb-0;
}

.roadmap-content-wrapper-unified {
  @apply w-full relative;
}
.roadmap-dot-unified {
  @apply absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-neutral-bg dark:border-neutral-bg-surface; /* Use Tailwind direct colors */
  background-color: hsl(var(--primary-color-hsl)); /* Use HSL var from main.css */
  box-shadow: 0 0 0 3px hsla(var(--primary-hue), 92%, 60%, 0.3);
}
.dark .roadmap-dot-unified {
  box-shadow: 0 0 0 3px hsla(var(--primary-hue), 94%, 69%, 0.4);
}

@media (max-width: 767.98px) { /* Mobile: all items on one side */
  .roadmap-line-unified { @apply left-4 -translate-x-0; }
  .roadmap-dot-unified { @apply left-0 -translate-x-1/2 top-1; }
  .roadmap-content-wrapper-unified { @apply w-full pl-10; }
   .roadmap-item-unified { @apply justify-start text-left; }
  .roadmap-item-unified .card-base { @apply text-left; }
  .roadmap-item-unified ul li { @apply justify-start; }
  .roadmap-item-unified ul li span:first-child { @apply mr-2; }
}

@media (min-width: 768px) { /* Desktop: alternating sides */
  .roadmap-content-wrapper-unified { @apply w-[calc(50%-2rem)] pl-0; }
  .roadmap-item-unified:nth-child(odd) .roadmap-content-wrapper-unified { @apply md:ml-[calc(50%+2rem)] text-left; }
  .roadmap-item-unified:nth-child(odd) .roadmap-dot-unified { @apply md:left-1/2 md:-ml-2 top-6; }
  .roadmap-item-unified:nth-child(even) { @apply md:flex-row-reverse; }
  .roadmap-item-unified:nth-child(even) .roadmap-content-wrapper-unified { @apply md:mr-[calc(50%+2rem)] text-right; }
  .roadmap-item-unified:nth-child(even) .roadmap-dot-unified { @apply md:right-1/2 md:-mr-2 top-6; }
  .roadmap-item-unified:nth-child(odd) ul li { @apply md:justify-start; }
  .roadmap-item-unified:nth-child(even) ul li { @apply md:flex-row-reverse md:justify-end text-right; }
  .roadmap-item-unified:nth-child(even) ul li span:first-child { @apply md:mr-0 md:ml-2; }
}

/* Footer Links */
.footer-link {
  @apply relative inline-block text-neutral-text-muted hover:text-primary-500 transition-colors duration-200; /* Use Tailwind direct colors */
}
.dark .footer-link {
  @apply text-neutral-text-muted hover:text-primary-400; /* Use Tailwind direct colors */
}
.footer-link .icon-lg { color: currentColor; }
.footer-link-tooltip {
  @apply absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 dark:bg-slate-800 text-white text-xs rounded-md opacity-0 invisible transition-all duration-200 whitespace-nowrap pointer-events-none;
}
.footer-link-tooltip::after {
  @apply content-[''] absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-700 dark:border-b-slate-800;
}

/* Diagram Viewer specific styling within About page for context */
.about-page :deep(.mermaid-diagram) { /* Targeting the class inside DiagramViewer */
  @apply text-center p-2 rounded-md;
  background-color: var(--bg-surface-hsl); /* Use HSL var from main.css */
  border: 1px solid var(--border-color-hsl); /* Use HSL var from main.css */
}
.about-page :deep(.mermaid-diagram svg) {
  max-width: 100%;
  height: auto;
  /* Mermaid theme should handle internal colors based on DiagramViewer's theme prop */
}
</style>