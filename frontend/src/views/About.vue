<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center gap-4">
          <button 
            @click="router.push('/')" 
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Coding Assistant Logo" class="w-8 h-8" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">About Voice Coding Assistant</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div class="space-y-8">
        <!-- Hero Section -->
        <section class="text-center">
          <div class="mb-6">
            <img src="/src/assets/logo.svg" alt="Voice Coding Assistant Logo" class="w-24 h-24 mx-auto mb-4" />
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Voice Coding Assistant
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A real-time voice-driven coding assistant that helps you write better code, design scalable systems, and summarize meetings using the power of AI.
            </p>
          </div>
          
          <div class="flex flex-wrap justify-center gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">v1.0.0</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Current Version</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">Vue 3</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Frontend Framework</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">OpenAI</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">AI Provider</div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Voice Recognition</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Advanced voice input using OpenAI Whisper and Web Speech API with multiple audio modes including continuous listening and voice activation.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Code Generation</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Get instant code examples, debugging help, and explanations in multiple programming languages including Python, JavaScript, Java, and more.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">System Design</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Create architectural diagrams and get advice on scalable system design with automatic Mermaid diagram generation.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Meeting Summaries</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Automatically transcribe and summarize meeting notes, extract action items, and identify key decisions.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Works seamlessly on desktop and mobile devices with support for both portrait and landscape orientations.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Dark Mode</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Beautiful dark and light themes with automatic system preference detection for comfortable usage anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Technology Stack -->
        <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technology Stack</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Vue.js 3</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Frontend Framework</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">TypeScript</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Type Safety</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Tailwind CSS</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Styling</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Vite</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Build Tool</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Node.js</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Backend Runtime</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Express</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Server Framework</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">OpenAI API</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">AI Models</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Docker</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Containerization</div>
            </div>
          </div>
        </section>

        <!-- Audio Modes -->
        <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Audio Input Modes</h3>
          
          <div class="space-y-4">
            <div class="border dark:border-gray-700 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2" />
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Push to Talk</h4>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Click and hold the microphone button to record. Perfect for precise control and preventing accidental recordings.</p>
            </div>
            
            <div class="border dark:border-gray-700 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Continuous Listening</h4>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Always listening and automatically processing speech. Ideal for hands-free operation and long conversations.</p>
            </div>
            
            <div class="border dark:border-gray-700 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Voice Activation</h4>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Automatically starts recording when voice is detected. Smart balance between convenience and battery efficiency.</p>
            </div>
          </div>
        </section>

        <!-- Privacy & Security -->
        <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Security</h3>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="text-gray-900 dark:text-white font-medium">No Data Storage</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Voice recordings are processed in real-time and not stored on our servers.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Secure Authentication</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Password-based authentication with optional session persistence.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="text-gray-900 dark:text-white font-medium">API Cost Tracking</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Transparent cost monitoring with configurable spending limits.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Open Source</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Full source code is available for review and self-hosting.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Credits & Links -->
        <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Credits & Links</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Development</h4>
              <div class="space-y-2">
                <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Manic.Agency
                </a>
                <a href="https://github.com/manic-agency/voice-coding-assistant" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Source Code
                </a>
              </div>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Powered By</h4>
              <div class="space-y-2">
                <a href="https://openai.com" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  OpenAI GPT Models
                </a>
                <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Vue.js Framework
                </a>
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Tailwind CSS
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- License -->
        <section class="text-center">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              Voice Coding Assistant is open source software
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Licensed under the MIT License. See the 
              <a href="https://github.com/manic-agency/voice-coding-assistant/blob/main/LICENSE" 
                 target="_blank" rel="noopener noreferrer" 
                 class="text-primary-600 dark:text-primary-400 hover:underline">
                LICENSE
              </a> 
              file for details.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
/* Add any component-specific styles here */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>