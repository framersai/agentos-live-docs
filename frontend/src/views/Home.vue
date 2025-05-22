<template>
  <div class="home-container" :class="{ 'fullscreen-mode': isFullscreen }">
    <Header
      v-if="!isFullscreen || showHeaderInFullscreen"
      :session-cost="sessionCost"
      :mode="mode"
      :language="language"
      :generate-diagram="generateDiagram"
      :audio-mode="audioMode"
      :is-fullscreen="isFullscreen"
      @update:mode="handleModeUpdate"
      @update:language="newVal => language = newVal"
      @update:generate-diagram="newVal => generateDiagram = newVal"
      @update:audio-mode="newVal => audioMode = newVal"
      @update:auto-clear="newVal => autoClear = newVal"
      @toggle-theme="toggleTheme"
      @toggle-fullscreen="toggleFullscreen"
      @clear-chat="clearChat"
      @logout="handleLogout"
    />

    <main id="main-content" class="main-content">
      <div class="content-wrapper">
        <div v-if="messages.length === 0" class="welcome-section">
          <div class="welcome-container">
            <div class="welcome-header">
              <div class="logo-container">
                <img src="/src/assets/logo.svg" alt="Voice Coding Assistant" class="logo" />
              </div>
              <h1 class="main-title">Voice Coding Assistant</h1>
              <p class="main-subtitle">AI-powered coding help with intelligent problem detection</p>
            </div>

            <div class="examples-section">
              <h3 class="section-title">Try asking:</h3>
              <div class="examples-grid">
                <button
                  v-for="example in getSmartExamplesForMode()"
                  :key="example.text"
                  @click="handleExampleClick(example.text)"
                  class="example-card"
                  :class="example.className"
                >
                  <div class="example-icon-container">
                    <component :is="example.icon" class="example-icon" />
                  </div>
                  <div class="example-content">
                    <span class="example-text">{{ example.text }}</span>
                    <span class="example-hint">{{ example.hint }}</span>
                  </div>
                </button>
              </div>
            </div>

            <div class="features-section">
              <div class="feature-card">
                <div class="feature-icon">🧠</div>
                <div class="feature-content">
                  <h4 class="feature-title">Smart Problem Detection</h4>
                  <p class="feature-description">Automatically detects LeetCode problems and provides structured solutions</p>
                </div>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <div class="feature-content">
                  <h4 class="feature-title">Dynamic Diagrams</h4>
                  <p class="feature-description">Generates visual diagrams for algorithms and system architectures</p>
                </div>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <div class="feature-content">
                  <h4 class="feature-title">Adaptive Slides</h4>
                  <p class="feature-description">Creates interactive slides based on content complexity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="messages-section">
          <div v-if="autoClear && currentMessage" class="single-message-container">
            <div v-if="currentMessageAnalysis" class="analysis-header">
              <div class="analysis-chip" :class="getAnalysisChipClass()">
                <span class="analysis-type">{{ currentMessageAnalysis.displayTitle }}</span>
                <span v-if="currentMessageAnalysis.confidence && currentMessageAnalysis.confidence > 0.7" class="confidence-badge">
                  {{ Math.round(currentMessageAnalysis.confidence * 100) }}% confident
                </span>
              </div>
            </div>
            
            <div class="message-content">
              <CompactMessageRenderer
                :content="currentMessage.content"
                :mode="mode"
                :language="language"
                :analysis="currentMessageAnalysis"
                @toggle-fullscreen="toggleFullscreen"
              />
            </div>
          </div>
          
          <div v-else class="chat-history">
            <div class="messages-container" ref="chatHistoryContainerRef">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="message-item"
                :class="{
                  'user-message': message.role === 'user',
                  'assistant-message': message.role === 'assistant',
                  'smart-detected': message.analysis?.type === 'leetcode'
                }"
              >
                <div v-if="message.role === 'user'" class="user-bubble">
                  <div class="message-header">
                    <div class="user-avatar"> <UserIcon class="avatar-icon" /> </div>
                    <div class="message-meta">
                      <span class="sender-name">You</span>
                      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                    </div>
                  </div>
                  <div class="user-content">{{ message.content }}</div>
                  <div v-if="message.detectedIntent" class="intent-display">
                    <span class="intent-label">Detected:</span> <span class="intent-value">{{ message.detectedIntent }}</span>
                  </div>
                </div>
                
                <div v-else class="assistant-bubble">
                  <div v-if="message.analysis" class="response-analysis">
                    <div class="analysis-tags">
                      <span class="analysis-tag" :class="`tag-${message.analysis.type?.toLowerCase().replace(/\s+/g, '-')}`">
                        {{ message.analysis.displayTitle || message.analysis.type }}
                      </span>
                      <span v-if="message.analysis.problemMetadata?.difficulty" class="difficulty-tag" :class="`diff-${message.analysis.problemMetadata.difficulty.toLowerCase()}`">
                        {{ message.analysis.problemMetadata.difficulty }}
                      </span>
                       <span v-if="message.analysis.estimatedReadTime" class="reading-time-tag">
                         ~{{ Math.ceil(message.analysis.estimatedReadTime / 60) }} min read
                       </span>
                    </div>
                  </div>
                  <div class="assistant-content">
                    <CompactMessageRenderer
                      :content="message.content"
                      :mode="mode"
                      :language="language"
                      :analysis="message.analysis"
                      @toggle-fullscreen="toggleFullscreen"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="loading-section">
          <div class="loading-container">
            <div class="loading-spinner"> <div class="spinner-ring"></div> </div>
            <p class="loading-text">{{ getSmartLoadingText() }}</p>
            <div class="loading-details">
              <span class="loading-step">{{ loadingStep }} <span v-if="loadingProgress > 0 && loadingProgress < 100">• {{ loadingProgress }}%</span></span>
              <div v-if="predictedContentType" class="content-prediction">
                <span class="prediction-label">Type:</span> <span class="prediction-type">{{ predictedContentType }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="voice-input-section" v-show="!isFullscreen">
      <div class="input-wrapper">
        <div v-if="showInputSuggestions && inputSuggestions.length > 0" class="suggestions-container">
          <div class="suggestions-header"> <span class="suggestions-title">Smart Suggestions:</span> </div>
          <div class="suggestions-list">
            <button v-for="suggestion in inputSuggestions" :key="suggestion.text" @click="handleSuggestionClick(suggestion)" class="suggestion-chip" :class="suggestion.type">
              <component :is="suggestion.icon" class="suggestion-icon" />
              <span class="suggestion-text">{{ suggestion.text }}</span>
            </button>
          </div>
        </div>
        <VoiceInput
          :is-processing="isLoading"
          :audio-mode="audioMode"
          @transcription="handleSmartTranscription"
          @update:audio-mode="newVal => audioMode = newVal"
          @intent-detected="handleIntentDetection"
        />
      </div>
    </div>

    <div v-if="isFullscreen && (!autoClear || (autoClear && currentMessage?.role === 'user'))" class="fullscreen-voice-overlay">
      <VoiceInput
        :is-processing="isLoading"
        :audio-mode="audioMode"
        @transcription="handleSmartTranscription"
        @update:audio-mode="newVal => audioMode = newVal"
      />
    </div>

    <div v-if="isFullscreen" class="fullscreen-controls">
      <button @click="showHeaderInFullscreen = !showHeaderInFullscreen" class="fullscreen-btn" title="Toggle Menu">
        <Bars3Icon v-if="!showHeaderInFullscreen" class="control-icon" /> <XMarkIcon v-else class="control-icon" />
      </button>
      <button @click="toggleFullscreen" class="fullscreen-btn" title="Exit Fullscreen"> <ArrowsPointingInIcon class="control-icon" /> </button>
    </div>

    <div v-if="showContextPanel && contextData" class="context-panel">
      <div class="panel-header">
        <h3 class="panel-title">Problem Context</h3>
        <button @click="showContextPanel = false" class="panel-close"> <XMarkIcon class="close-icon" /> </button>
      </div>
      <div class="panel-content">
        <div v-if="contextData.problemType" class="context-item">
          <span class="context-label">Type:</span> <span class="context-value">{{ contextData.problemType }}</span>
        </div>
        <div v-if="contextData.dataStructures?.length" class="context-item">
          <span class="context-label">Data Structures:</span>
          <div class="context-tags"> <span v-for="ds in contextData.dataStructures" :key="ds" class="context-tag">{{ ds }}</span> </div>
        </div>
        <div v-if="contextData.suggestedApproach" class="context-item">
          <span class="context-label">Suggested Approach:</span> <span class="context-value">{{ contextData.suggestedApproach }}</span>
        </div>
        <div v-if="contextData.components?.length" class="context-item">
          <span class="context-label">Key Components:</span>
          <div class="context-tags"> <span v-for="comp in contextData.components" :key="comp" class="context-tag system-design-tag">{{ comp }}</span> </div>
        </div>
        <div v-if="contextData.concepts?.length" class="context-item">
          <span class="context-label">Key Concepts:</span>
          <div class="context-tags"> <span v-for="concept in contextData.concepts" :key="concept" class="context-tag system-design-tag">{{ concept }}</span> </div>
        </div>
      </div>
    </div>

    <div v-if="showPerformanceInsights" class="insights-panel">
      <div class="panel-header">
        <span class="panel-title">Session Insights</span>
        <button @click="showPerformanceInsights = false" class="panel-close"> <XMarkIcon class="close-icon" /> </button>
      </div>
      <div class="panel-content">
        <div class="insight-grid">
          <div class="insight-item"> <span class="insight-label">Interactions:</span> <span class="insight-value">{{ sessionStats.totalInteractions }}</span> </div>
          <div class="insight-item"> <span class="insight-label">Problems Solved:</span> <span class="insight-value">{{ sessionStats.problemsSolved }}</span> </div>
          <div class="insight-item"> <span class="insight-label">Avg Response:</span> <span class="insight-value">{{ sessionStats.avgResponseTime.toFixed(1) }}s</span> </div>
          <div class="insight-item"> <span class="insight-label">Top Language:</span> <span class="insight-value">{{ sessionStats.topLanguage }}</span> </div>
        </div>
      </div>
    </div>

    <div v-if="showCostWarning" class="cost-warning">
      <div class="warning-content">
        <ExclamationTriangleIcon class="warning-icon" />
        <div class="warning-text">
          <div class="warning-title">Cost Alert</div>
          <div class="warning-subtitle">Session: ${{ sessionCost.toFixed(2) }}</div>
        </div>
        <button @click="showCostWarning = false" class="warning-close"> <XMarkIcon class="close-icon" /> </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { api, chatAPI, costAPI, getAuthHeaders } from '../utils/api';
import Header from '../components/Header.vue';
import VoiceInput from '../components/VoiceInput.vue';
import CompactMessageRenderer from '../components/CompactMessageRenderer.vue';
// ContentAnalyzer and ContentAnalysis are central to understanding and displaying messages.
import { ContentAnalyzer, type ContentAnalysis } from '../utils/ContentAnalyzer';
import {
  UserIcon, CodeBracketIcon, CpuChipIcon, DocumentTextIcon, ExclamationTriangleIcon,
  XMarkIcon, LightBulbIcon, BugAntIcon, CogIcon, Bars3Icon, ArrowsPointingInIcon,
  SparklesIcon, RocketLaunchIcon, AcademicCapIcon
} from '@heroicons/vue/24/outline';

/** Interface for chat messages. */
interface Message {
  /** Role of the message sender ('user' or 'assistant'). */
  role: 'user' | 'assistant';
  /** Text content of the message. */
  content: string;
  /** Timestamp of when the message was created. */
  timestamp: number;
  /** Optional content analysis object for the message. */
  analysis?: ContentAnalysis | null;
  /** Optional detected intent from user input. */
  detectedIntent?: string;
}

/** Interface for input suggestions. */
interface Suggestion {
  /** Text to display for the suggestion. */
  text: string;
  /** Type category of the suggestion (e.g., 'approach', 'complexity'). */
  type: string;
  /** Vue component to use as an icon. */
  icon: any;
  /** Optional action string or prompt to execute when clicked. */
  action?: string;
}

/** Interface for contextual data, typically for LeetCode or System Design problems. */
interface ContextData {
  /** Type of the problem (e.g., 'Array', 'System Design Query'). */
  problemType?: string;
  /** Relevant data structures. */
  dataStructures?: string[];
  /** Suggested approach to solve the problem. */
  suggestedApproach?: string;
  /** Key components in a system design. */
  components?: string[];
  /** Key concepts in a system design. */
  concepts?: string[];
}

const router = useRouter();
const toast = inject('toast') as any; // Injected toast notification service
const contentAnalyzer = new ContentAnalyzer();
const chatHistoryContainerRef = ref<HTMLElement | null>(null); // Ref for scrolling chat history

// --- Reactive State ---
/** Array of all messages in the current chat session. */
const messages = ref<Array<Message>>([]);
/** The current message being displayed, especially in auto-clear mode. */
const currentMessage = ref<Message | null>(null);
/** Analysis object for the `currentMessage`. */
const currentMessageAnalysis = ref<ContentAnalysis | null>(null);
/** Indicates if the application is currently processing a request. */
const isLoading = ref(false);
/** Describes the current step of an ongoing loading process. */
const loadingStep = ref('');
/** Numeric progress (0-100) of the current loading process. */
const loadingProgress = ref(0);
/** Tracks the estimated cost of the current session. */
const sessionCost = ref(0);
/** Controls the visibility of the cost warning toast. */
const showCostWarning = ref(false);
/** Indicates if the application is in fullscreen mode. */
const isFullscreen = ref(false);
/** Controls whether the header is visible when in fullscreen mode. */
const showHeaderInFullscreen = ref(false);

/** Predicted content type for the current user input or AI response. */
const predictedContentType = ref('');
/** Controls the visibility of smart input suggestions. */
const showInputSuggestions = ref(false);
/** Array of currently available input suggestions. */
const inputSuggestions = ref<Array<Suggestion>>([]);
/** Controls the visibility of the problem context side panel. */
const showContextPanel = ref(false);
/** Data displayed in the problem context panel. */
const contextData = ref<ContextData | null>(null);
/** Controls the visibility of the session performance insights panel. */
const showPerformanceInsights = ref(false);
/** Statistics for the current user session. */
const sessionStats = ref({
  problemsSolved: 0,
  avgResponseTime: 0,
  topLanguage: 'N/A',
  totalInteractions: 0
});

// --- Persistent State (using useStorage for localStorage) ---
/** Current assistant mode (e.g., 'coding', 'system_design'). Persisted in localStorage. */
const mode = useStorage('mode', 'coding');
/** Preferred programming language for code examples. Persisted in localStorage. */
const language = useStorage('language', 'python');
/** Setting to automatically generate diagrams if applicable. Persisted in localStorage. */
const generateDiagram = useStorage('generateDiagram', true);
/** Voice input mode ('push-to-talk' or 'continuous'). Persisted in localStorage. */
const audioMode = useStorage('audioMode', 'push-to-talk');
/**
 * If true, chat clears to show only the latest user-assistant exchange.
 * Persisted in localStorage.
 */
const autoClear = useStorage('autoClear', true);
/** Dark mode preference. Persisted in localStorage. */
const isDarkModeFromStorage = useStorage('darkMode', false);

// --- Authentication & Environment Variables ---
// Vite handles .env files and exposes variables via import.meta.env.
// vite-env.d.ts provides TypeScript definitions for these.
// @ts-ignore
const SHARED_PASSWORD_TOKEN = import.meta.env.VITE_SHARED_PASSWORD || "password";
// @ts-ignore
const COST_THRESHOLD_STRING = import.meta.env.VITE_COST_THRESHOLD || "20.00";

// --- Static Data & Configuration ---
/**
 * Defines example prompts displayed on the welcome screen, categorized by assistant mode.
 * Each example includes text, an icon component, a hint, and a CSS class for styling.
 */
const smartModeExamples: Record<string, Array<{text: string; icon: any; hint: string; className: string}>> = {
  coding: [
    { text: "Solve Two Sum problem step by step", icon: CodeBracketIcon, hint: "Classic array problem with O(n) solution", className: "example-leetcode" },
    { text: "Implement binary search with analysis", icon: CpuChipIcon, hint: "O(log n) search with complexity breakdown", className: "example-algorithm" },
    { text: "Debug recursive function issues", icon: BugAntIcon, hint: "Common recursion problems and fixes", className: "example-debug" },
    { text: "Optimize dynamic programming solution", icon: LightBulbIcon, hint: "Space-time tradeoffs in DP", className: "example-optimization" }
  ],
  system_design: [
    { text: "Design Instagram-like photo sharing", icon: CogIcon, hint: "Scale to millions with proper architecture", className: "example-system" },
    { text: "Scale chat app to 100M users", icon: CpuChipIcon, hint: "WebSocket, queues, data partitioning", className: "example-scale" },
    { text: "Design distributed caching strategy", icon: DocumentTextIcon, hint: "Redis, CDN, cache invalidation", className: "example-architecture" }
  ],
  meeting: [
    { text: "Summarize sprint planning meeting", icon: DocumentTextIcon, hint: "Extract decisions and action items", className: "example-summary" }
  ],
  general: [
    { text: "Explain machine learning simply", icon: AcademicCapIcon, hint: "Clear concepts with examples", className: "example-concept" }
  ]
};

/**
 * Gets smart example prompts relevant to the currently selected assistant mode.
 * Falls back to general examples if the current mode has no specific examples.
 * @returns An array of example objects.
 */
const getSmartExamplesForMode = () => smartModeExamples[mode.value] || smartModeExamples.general;

/**
 * Determines the CSS classes for an analysis chip based on content type and confidence.
 * @returns A string of CSS classes for styling the chip.
 */
const getAnalysisChipClass = () => {
  if (!currentMessageAnalysis.value?.type) return 'analysis-chip low-confidence type-general'; // Default style
  const confidence = currentMessageAnalysis.value.confidence || 0;
  const type = currentMessageAnalysis.value.type || 'general';
  let classes = 'analysis-chip-content ';
  if (confidence > 0.8) classes += 'high-confidence ';
  else if (confidence > 0.6) classes += 'medium-confidence ';
  else classes += 'low-confidence ';
  classes += `type-${type.toLowerCase().replace(/\s+/g, '-')}`; // e.g., type-system-design
  return classes;
};

/**
 * Provides context-aware loading text during AI processing.
 * Uses predicted content type or current mode to generate relevant messages.
 * @returns A string representing the current loading status.
 */
const getSmartLoadingText = () => {
  if (predictedContentType.value) {
    const loadingTexts: Record<string, string> = {
      leetcode: 'Analyzing coding problem...',
      systemdesign: 'Designing system architecture...', // Note: ensure key matches `toLowerCase().replace`
      concept: 'Preparing explanation...',
      tutorial: 'Crafting tutorial...',
      documentation: 'Fetching documentation...'
    };
    return loadingTexts[predictedContentType.value.toLowerCase().replace(/\s+/g, '')] || 'Processing advanced request...';
  }
  const modeTexts: Record<string, string> = {
    coding: 'Analyzing coding question...',
    system_design: 'Designing system...',
    meeting: 'Processing meeting...',
    general: 'Thinking...'
  };
  return modeTexts[mode.value] || 'Processing...';
};

/**
 * Scrolls the chat history container to the bottom.
 * Ensures new messages are visible. Uses `nextTick` to wait for DOM updates.
 */
const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryContainerRef.value) {
    chatHistoryContainerRef.value.scrollTop = chatHistoryContainerRef.value.scrollHeight;
  }
};

/**
 * Detects user intent from the transcribed text using ContentAnalyzer.
 * Updates UI elements like predicted content type and context panel based on analysis.
 * @param transcription - The user's transcribed speech or text input.
 * @returns The content analysis object.
 */
const detectUserIntent = (transcription: string): ContentAnalysis => {
  const analysis = contentAnalyzer.analyzeContent(transcription, mode.value);
  predictedContentType.value = analysis.type;

  if (analysis.confidence > 0.65) { // Only act on reasonably confident detections
    if (analysis.type === 'leetcode' && mode.value !== 'coding') {
      toast?.add({ type: 'info', title: 'Smart Detection', message: 'Switched to Coding mode.', duration: 3500 });
      mode.value = 'coding';
    } else if (analysis.type === 'systemDesign' && mode.value !== 'system_design') {
      toast?.add({ type: 'info', title: 'Smart Detection', message: 'Switched to System Design mode.', duration: 3500 });
      mode.value = 'system_design';
    }

    const problemData = analysis.problemMetadata;
    if (analysis.type === 'leetcode' && problemData) {
      showContextPanel.value = true;
      contextData.value = {
        problemType: analysis.subtype || problemData.category || 'Coding Problem',
        dataStructures: problemData.dataStructures || [],
        suggestedApproach: problemData.approach || problemData.algorithms?.[0] || 'N/A'
      };
    } else if (analysis.type === 'systemDesign') {
      showContextPanel.value = true;
      contextData.value = {
        problemType: 'System Design Query',
        // Accessing private 'patterns' like this is not ideal, consider exposing relevant keywords/patterns via a method in ContentAnalyzer
        components: analysis.keywords?.filter(kw => contentAnalyzer['patterns'].systemDesign.keywords.includes(kw)) || [],
        concepts: analysis.keywords?.filter(kw => contentAnalyzer['patterns'].systemDesign.keywords.includes(kw)) || []
      };
    } else {
      showContextPanel.value = false;
    }
  } else {
    showContextPanel.value = false; // Hide context panel if confidence is low
  }
  return analysis;
};

/**
 * Generates smart suggestions based on content analysis.
 * Populates `inputSuggestions` to be displayed to the user.
 * @param analysis - The content analysis object.
 */
const generateSmartSuggestions = (analysis: ContentAnalysis) => {
  const newSuggestions: Array<Suggestion> = [];
  if (analysis.suggestions && analysis.suggestions.length > 0) {
      analysis.suggestions.slice(0, 2).forEach(s => { // Limit to 2 suggestions
        let icon: any = SparklesIcon; // Default icon
        if (s.type === 'complexity') icon = CpuChipIcon;
        if (s.type === 'diagram') icon = CodeBracketIcon; // Or a diagram-specific icon
        if (s.type === 'explanation') icon = DocumentTextIcon;
        if (s.type === 'example') icon = LightBulbIcon;
        newSuggestions.push({ text: s.message, type: s.type, icon: icon, action: s.implementation });
      });
  } else if (analysis.type === 'leetcode') {
    newSuggestions.push({ text: "Show step-by-step", type: "approach", icon: RocketLaunchIcon });
    newSuggestions.push({ text: "Complexity analysis?", type: "complexity", icon: CpuChipIcon });
  }
  inputSuggestions.value = newSuggestions;
  showInputSuggestions.value = newSuggestions.length > 0;
};

/** Clears local chat state (messages, current message, analysis, context, etc.). */
const clearChatLocalState = () => {
  messages.value = [];
  currentMessage.value = null;
  currentMessageAnalysis.value = null;
  showContextPanel.value = false;
  contextData.value = null;
  predictedContentType.value = '';
  inputSuggestions.value = [];
  showInputSuggestions.value = false;
};

/**
 * Handles updates to the assistant mode.
 * Clears chat if autoClear is enabled and messages exist.
 * @param newModeValue - The new mode string.
 */
const handleModeUpdate = (newModeValue: string) => {
  mode.value = newModeValue;
  // Clear chat only if autoClear is on and there's more than just a single user prompt (to avoid clearing an in-progress query)
  if (autoClear.value && messages.value.length > 0 && !(messages.value.length === 1 && messages.value[0].role === 'user')) {
    clearChatLocalState();
  }
  toast?.add({ type: 'info', title: 'Mode Changed', message: `Switched to ${getModeDisplayName(newModeValue)}`, duration: 2000 });
};

/**
 * Handles intent detection from the VoiceInput component.
 * Updates predicted content type and generates suggestions.
 * @param intentAnalysis - The content analysis object representing the detected intent.
 */
const handleIntentDetection = (intentAnalysis: ContentAnalysis) => {
  predictedContentType.value = intentAnalysis.type;
  generateSmartSuggestions(intentAnalysis);
};

/**
 * Handles new transcriptions from voice input or example clicks.
 * Processes the input, sends it to the backend API, and updates the UI with the response.
 * @param transcription - The text input from the user.
 */
const handleSmartTranscription = async (transcription: string) => {
  if (!transcription.trim() || isLoading.value) return;

  const userInputAnalysis = detectUserIntent(transcription);
  const userMessage: Message = {
    role: 'user',
    content: transcription,
    timestamp: Date.now(),
    detectedIntent: userInputAnalysis.type !== 'general' ? userInputAnalysis.type : undefined,
    analysis: userInputAnalysis
  };

  if (autoClear.value) {
    messages.value = [userMessage];
    currentMessage.value = userMessage;
    currentMessageAnalysis.value = null;
  } else {
    messages.value.push(userMessage);
    await scrollToBottom();
  }

  isLoading.value = true;
  loadingStep.value = 'Analyzing input...';
  loadingProgress.value = 10;
  showInputSuggestions.value = false;

  try {
    const basePrompt = buildBaseSystemPrompt();
    const enhancedPrompt = contentAnalyzer.generateEnhancedPrompt(userInputAnalysis, basePrompt, language.value);
    loadingStep.value = 'Generating response from AI...';
    loadingProgress.value = 40;

    const apiRequestMessages = [
      { role: 'system', content: enhancedPrompt }, 
      { role: 'user', content: transcription }
    ];

    // Use the new API function
    const response = await chatAPI.sendMessage({
      messages: apiRequestMessages,
      mode: mode.value,
      language: language.value,
      generateDiagram: generateDiagram.value && userInputAnalysis.shouldGenerateDiagram,
      userId: 'default_user'
    });

    loadingStep.value = 'Finalizing response...';
    loadingProgress.value = 80;

    const assistantResponseContent = response.data.message || response.data.content || "";
    const assistantInternalAnalysis = contentAnalyzer.analyzeContent(assistantResponseContent, mode.value);
    const assistantMessage: Message = {
      role: 'assistant',
      content: assistantResponseContent,
      timestamp: Date.now(),
      analysis: assistantInternalAnalysis
    };

    await fetchSessionCost();
    updateSessionStats(userInputAnalysis, assistantInternalAnalysis);
    loadingProgress.value = 100;

    if (autoClear.value) {
      currentMessage.value = assistantMessage;
      currentMessageAnalysis.value = assistantInternalAnalysis;
      messages.value = [userMessage, assistantMessage];
    } else {
      messages.value.push(assistantMessage);
      await scrollToBottom();
    }
    generateSmartSuggestions(assistantInternalAnalysis);

    if (userInputAnalysis.type === 'leetcode' && sessionStats.value.problemsSolved > 0 && !showPerformanceInsights.value) {
      setTimeout(() => { showPerformanceInsights.value = true; }, 1500);
    }

  } catch (error: any) {
    console.error('Error sending message to /api/chat:', error);
    let errorMessage = 'Failed to process your request. Please try again.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check credentials.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Session cost limit has been reached.';
      showCostWarning.value = true;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    toast?.add({ type: 'error', title: 'API Error', message: errorMessage, duration: 7000 });

    const errorAnalysis: ContentAnalysis = {
      type: 'error',
      confidence: 1,
      displayTitle: 'Error Occurred',
      shouldVisualize: false,
      shouldGenerateDiagram: false,
      shouldCreateSlides: false,
      interactiveElements: false,
      complexity: null,
      codeBlocks: [],
      estimatedReadTime: 0,
      wordCount: 0,
      language: null,
      keywords: ['error'],
      entities: [],
      suggestions: [],
      diagramHints: [],
      slideCount: 0,
      slideDuration: 0,
      slideTopics: [],
    };
    
    const errorResponseMessage: Message = {
      role: 'assistant',
      content: `Sorry, I encountered an error: ${errorMessage}`,
      timestamp: Date.now(),
      analysis: errorAnalysis
    };

    if (autoClear.value) {
      currentMessage.value = errorResponseMessage;
      currentMessageAnalysis.value = errorAnalysis;
      if(messages.value.length > 0 && messages.value[messages.value.length-1].role === 'user') {
        messages.value.push(errorResponseMessage);
      } else {
        messages.value = [errorResponseMessage];
      }
    } else {
      messages.value.push(errorResponseMessage);
      await scrollToBottom();
    }
  } finally {
    isLoading.value = false;
    loadingStep.value = '';
    loadingProgress.value = 0;
  }
};


/**
 * Handles clicks on example prompts.
 * If auto-clear is on and no messages exist, adds a placeholder user message
 * before sending the example text for processing.
 * @param exampleText - The text of the clicked example.
 */
const handleExampleClick = (exampleText: string) => {
  // If auto-clear is on and chat is empty, push a dummy user message so the UI doesn't look blank
  // before the actual processing starts. This is a UX tweak.
  if (autoClear.value && messages.value.length === 0) {
    messages.value.push({
      role: 'user',
      content: '...', // Placeholder content
      timestamp: Date.now(),
      analysis: {type: 'general', confidence: 0} as any // Basic analysis
    });
  }
  handleSmartTranscription(exampleText);
};

/**
 * Handles clicks on smart suggestions.
 * Formulates a prompt based on the suggestion and the last user message (if applicable)
 * and sends it for processing.
 * @param suggestion - The clicked suggestion object.
 */
const handleSuggestionClick = (suggestion: Suggestion) => {
  let promptText = suggestion.action || suggestion.text;
  const lastUserMessage = messages.value.filter(m => m.role === 'user').pop();

  // If it's a follow-up suggestion (not a direct action or standalone approach), contextualize it.
  if (lastUserMessage && suggestion.type !== "approach" && !suggestion.action) {
    promptText = `Regarding my previous question ("${lastUserMessage.content.substring(0,30)}..."), please ${suggestion.text.toLowerCase()}`;
  }
  handleSmartTranscription(promptText);
  showInputSuggestions.value = false; // Hide suggestions after click
};

/**
 * Builds the base system prompt for the AI based on the current mode and language.
 * @returns The system prompt string.
 */
const buildBaseSystemPrompt = () => {
  const langVal = language.value;
  const currentModeVal = mode.value;
  const basePrompts: Record<string,string> = {
    coding: `You are an expert coding interview coach specializing in algorithm problems and data structures. Provide clear, step-by-step solutions with code examples in ${langVal} (default language) unless specified otherwise. Always include time and space complexity analysis.`,
    system_design: `You are a senior software architect with expertise in scalable system design. Provide comprehensive architectural solutions with component diagrams, data flow explanations, and trade-off analysis.`,
    meeting: `You are an expert meeting summarizer. Extract key decisions, action items, and important discussion points from meeting transcripts.`,
    general: `You are a knowledgeable AI assistant helping with programming and technical questions. If asked for code, provide it in ${langVal} unless specified otherwise. Be clear, concise, and helpful.`
  };
  return basePrompts[currentModeVal] || basePrompts.general;
};

/**
 * Updates session statistics based on user input and assistant response analysis.
 * @param userInputAnalysis - Analysis of the user's input.
 * @param assistantResponseAnalysis - Analysis of the assistant's response.
 */
const updateSessionStats = (userInputAnalysis: ContentAnalysis, assistantResponseAnalysis: ContentAnalysis) => {
  sessionStats.value.totalInteractions++;
  if (userInputAnalysis.type === 'leetcode') sessionStats.value.problemsSolved++;
  if (assistantResponseAnalysis.language) sessionStats.value.topLanguage = assistantResponseAnalysis.language;
  // Note: avgResponseTime would typically be calculated based on actual API response times.
};


/**
 * Fetches the current session cost from the backend and updates UI elements.
 */
const fetchSessionCost = async () => {
  try {
    const response = await costAPI.getCost();
    if (response.data && typeof response.data.sessionCost === 'number') {
      sessionCost.value = response.data.sessionCost;
      // @ts-ignore
      const costHardThreshold = parseFloat(import.meta.env.VITE_COST_THRESHOLD || '20.00');
      const warningThreshold = costHardThreshold * 0.9;

      if (sessionCost.value >= warningThreshold && sessionCost.value < costHardThreshold) {
        if (!showCostWarning.value) {
          toast?.add({ 
            type: 'warning', 
            title: 'Cost Alert', 
            message: `Approaching session cost limit ($${costHardThreshold.toFixed(2)}). Current: $${sessionCost.value.toFixed(2)}`
          });
        }
      } else if (sessionCost.value >= costHardThreshold) {
        showCostWarning.value = true;
        toast?.add({ 
          type: 'error', 
          title: 'Cost Limit Reached!', 
          message: `Session cost limit of $${costHardThreshold.toFixed(2)} met.`
        });
      } else {
        showCostWarning.value = false;
      }
    }
  } catch (error: any) {
    console.error("Error fetching session cost:", error);
    if (error.response?.status === 401) {
      toast?.add({ type: 'error', title: 'Auth Error', message: 'Could not update session cost (unauthorized).' });
    }
  }
};

/**
 * Gets a display-friendly name for the given mode value.
 * @param modeValue - Optional mode string (e.g., 'coding'). Defaults to current mode.
 * @returns A human-readable string for the mode.
 */
const getModeDisplayName = (modeValue?: string) => {
  const currentMode = modeValue || mode.value;
  const modeNames: Record<string,string> = {
    coding: 'Coding Assistant',
    system_design: 'System Design',
    meeting: 'Meeting Analyzer',
    general: 'General Assistant'
  };
  return modeNames[currentMode] || 'Assistant';
};

/**
 * Formats a timestamp into a human-readable time string (e.g., "03:30 PM").
 * @param timestamp - The Unix timestamp in milliseconds.
 * @returns A formatted time string.
 */
const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

/**
 * Clears the chat, resets session cost on the backend, and updates local state.
 */
const clearChat = async () => {
  clearChatLocalState();
  try {
    const response = await costAPI.resetCost({ userId: 'default_user', action: 'reset' });
    if (response.data && typeof response.data.sessionCost === 'number') {
      sessionCost.value = response.data.sessionCost;
    }
    showCostWarning.value = false;
    toast?.add({ type: 'success', title: 'Chat Cleared', message: 'Session has been reset.', duration: 2500 });
  } catch (error: any) {
    console.error("Error resetting session cost on backend:", error);
    let errorMsg = "Could not reset session on the server.";
    if (error.response?.status === 401) {
      errorMsg = 'Authentication failed while trying to clear chat.';
    }
    toast?.add({ type: 'error', title: 'Clear Error', message: errorMsg, duration: 4000 });
  }
  sessionStats.value = { problemsSolved: 0, avgResponseTime: 0, topLanguage: 'N/A', totalInteractions: 0 };
  showPerformanceInsights.value = false;
};

/** Toggles the application's theme (dark/light mode). */
const toggleTheme = () => {
  isDarkModeFromStorage.value = !isDarkModeFromStorage.value;
  // The actual class toggle on `document.documentElement` is expected to be handled
  // by a watcher in App.vue or a similar global setup listening to `isDarkModeFromStorage`.
};

/** Toggles the application's fullscreen mode. */
const toggleFullscreen = () => { isFullscreen.value = !isFullscreen.value; };

/** Handles user logout, clearing local storage and redirecting to the login page. */
const handleLogout = () => {
  localStorage.removeItem('authToken'); // Example auth token removal
  sessionStorage.removeItem('authToken'); // Also check session storage
  mode.value = 'coding'; // Reset mode to default
  clearChat(); // Clear chat and session data
  toast?.add({ type: 'info', title: 'Logged Out', message: 'You have been logged out.' });
  router.push('/login');
};

// --- Lifecycle Hooks & Watchers ---
onMounted(async () => {
  // Listen for native browser fullscreen changes to keep `isFullscreen` ref in sync.
  document.addEventListener('fullscreenchange', () => {
    const currentlyFullscreen = !!document.fullscreenElement;
    if (isFullscreen.value !== currentlyFullscreen) isFullscreen.value = currentlyFullscreen;
    if (!currentlyFullscreen) showHeaderInFullscreen.value = false; // Hide header options if exiting FS
  });

  await fetchSessionCost(); // Fetch initial session cost

  // Welcome toast if chat is empty
  if (messages.value.length === 0) {
    setTimeout(() => {
      toast?.add({
        type: 'info',
        title: `Welcome to ${getModeDisplayName()}!`,
        message: 'Ready for your questions.',
        duration: 4000
      });
    }, 700);
  }
});

/** Watcher for `isFullscreen` to request/exit browser fullscreen. */
watch(isFullscreen, async (newVal, oldVal) => {
    if (newVal === oldVal) return; // Avoid redundant calls

    if (newVal) { // Entering fullscreen
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err: any) {
          console.error("Fullscreen request failed:", err.message);
          toast?.add({
            type: 'warning',
            title: 'Fullscreen Error',
            message: `Could not enter fullscreen. Browser might not support it or permission denied.`
          });
          if(isFullscreen.value) isFullscreen.value = false; // Revert state if failed
        }
      }
    } else { // Exiting fullscreen
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (err: any) {
          console.error("Exit fullscreen failed:", err.message);
          // User likely used ESC key, no toast needed typically
        }
      }
      showHeaderInFullscreen.value = false; // Ensure header options are hidden
    }
});

/** Watcher for `autoClear` to manage message display. */
watch(autoClear, (newVal) => {
    if (newVal && messages.value.length > 1) {
      // When autoClear is enabled, find the last user-assistant exchange
      const lastUserMsgIndex = messages.value.map(m => m.role).lastIndexOf('user');
      if (lastUserMsgIndex !== -1) {
        const relevantMessages = messages.value.slice(lastUserMsgIndex); // Get messages from last user input
        if (relevantMessages.length > 0 && relevantMessages[relevantMessages.length-1].role === 'assistant') {
          // If the last message is from assistant, this is a complete exchange
          currentMessage.value = relevantMessages[relevantMessages.length-1];
          currentMessageAnalysis.value = currentMessage.value.analysis || null;
          messages.value = relevantMessages; // Keep only this exchange for display
        } else if (relevantMessages.length > 0 && relevantMessages[relevantMessages.length-1].role === 'user'){
          // If last message is user's (e.g., assistant response pending or error)
          currentMessage.value = relevantMessages[relevantMessages.length-1];
          currentMessageAnalysis.value = null; // No assistant analysis yet
          messages.value = [currentMessage.value];
        }
      } else {
        // No user messages found, or only assistant messages (unlikely scenario)
        clearChatLocalState();
      }
      toast?.add({
        type: 'info',
        title: 'Auto-Clear Enabled',
        message: 'Showing latest exchange.',
        duration: 2500
      });
    } else if (!newVal && currentMessage.value) {
      // When disabling autoClear, ensure full history is shown (currentMessage is for single view)
      currentMessage.value = null;
      currentMessageAnalysis.value = null;
      scrollToBottom(); // Scroll to see full history
    }
});

</script>

<style scoped>
/*
  Styles for Home.vue.
  The `@apply` directives are for Tailwind CSS and are processed during the build.
  If your editor shows warnings for `@apply`, it's a linting/editor configuration issue
  and typically doesn't affect the final build if Tailwind is set up correctly.
*/

/* Main Layout */
.home-container {
  @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800;
  display: grid;
  grid-template-rows: auto 1fr auto; /* Header, Main, VoiceInput */
}

.home-container.fullscreen-mode {
  @apply fixed inset-0 z-50 bg-white dark:bg-gray-900;
  grid-template-rows: auto 1fr auto;
}

.main-content { @apply flex-1 overflow-hidden; }
.content-wrapper { @apply h-full flex flex-col; }

/* Welcome Section */
.welcome-section { @apply flex-1 flex items-center justify-center p-6; }
.welcome-container { @apply w-full max-w-6xl mx-auto; }
.welcome-header { @apply text-center mb-12; }
.logo-container { @apply mb-6; }
.logo { @apply w-16 h-16 sm:w-20 sm:h-20 mx-auto; }
.main-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.main-subtitle { @apply text-lg sm:text-xl text-gray-600 dark:text-gray-300; }

/* Examples Section */
.examples-section { @apply mb-12; }
.section-title { @apply text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center; }
.examples-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6; }
.example-card {
  @apply p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 text-left relative overflow-hidden;
}
.example-card:hover { transform: translateY(-3px) scale(1.02); }
.example-card::before { /* Top border accent on hover */
  content: ''; @apply absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-75 group-hover:opacity-100 transition-opacity;
}
.example-leetcode::before { @apply from-blue-500 to-blue-700; }
.example-algorithm::before { @apply from-green-500 to-green-700; }
.example-debug::before { @apply from-red-500 to-red-700; }
.example-optimization::before { @apply from-yellow-500 to-yellow-700; }
.example-system::before { @apply from-purple-500 to-purple-700; }
.example-scale::before { @apply from-indigo-500 to-indigo-700; }
.example-architecture::before { @apply from-pink-500 to-pink-700; }
.example-summary::before { @apply from-teal-500 to-teal-700; }
.example-concept::before { @apply from-orange-500 to-orange-700; }
.example-icon-container { @apply mb-3; }
.example-icon { @apply w-7 h-7 sm:w-8 sm:h-8 text-blue-500; } /* Icon color can be more dynamic if needed */
.example-content { @apply flex flex-col; }
.example-text { @apply text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1; }
.example-hint { @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400; }

/* Features Section */
.features-section { @apply grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700; }
.feature-card { @apply p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center; }
.feature-icon { @apply text-3xl sm:text-4xl mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-block; }
.feature-content { @apply space-y-2; }
.feature-title { @apply font-semibold text-lg text-gray-900 dark:text-white; }
.feature-description { @apply text-sm text-gray-600 dark:text-gray-400; }

/* Messages Section */
.messages-section { @apply flex-1 overflow-y-auto; } /* Allows scrolling for message content */
.single-message-container { @apply h-full flex flex-col max-w-5xl mx-auto p-4 sm:p-6; }
.analysis-header { @apply mb-4 flex justify-center; }
.analysis-chip { @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border shadow-sm; }
.analysis-chip-content { @apply flex items-center gap-2; } /* Ensure consistent style for chip content */
.high-confidence { @apply bg-green-50 dark:bg-green-800/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700; }
.medium-confidence { @apply bg-yellow-50 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700; }
.low-confidence { @apply bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600; }
.type-leetcode { @apply border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300; }
.type-systemdesign { @apply border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300; }
.type-concept { @apply border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300; }
.type-error { @apply border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-800/30 text-red-700 dark:text-red-300; }
/* Add other types as needed: .type-tutorial, .type-documentation, .type-general */
.analysis-type { @apply font-semibold capitalize; }
.confidence-badge { @apply text-xs px-2 py-0.5 bg-white/60 dark:bg-black/30 rounded-md; }
.message-content { @apply flex-1; } /* Ensures CompactMessageRenderer takes available space */

/* Chat History */
.chat-history { @apply flex-1 overflow-y-auto; } /* Allows scrolling for chat history */
.messages-container { @apply max-w-3xl mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6; }
.message-item { @apply flex flex-col; }

/* User Messages */
.user-bubble { @apply ml-auto max-w-[85%] sm:max-w-[75%] bg-blue-500 text-white rounded-xl rounded-br-md p-3 sm:p-4 shadow-md; }
.message-header { @apply flex items-center gap-2 sm:gap-3 mb-2; }
.user-avatar { @apply w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-400 flex items-center justify-center ring-2 ring-white/50; }
.avatar-icon { @apply w-4 h-4 sm:w-5 sm:h-5 text-white; }
.message-meta { @apply flex flex-col text-left; }
.sender-name { @apply font-medium text-white text-xs sm:text-sm; }
.message-time { @apply text-xs text-blue-100; }
.user-content { @apply text-sm sm:text-base whitespace-pre-wrap break-words; }
.intent-display { @apply mt-2 text-xs text-blue-200 opacity-80; }
.intent-label { @apply font-medium; }
.intent-value { @apply ml-1 capitalize; }

/* Assistant Messages */
.assistant-bubble { @apply mr-auto max-w-[90%] sm:max-w-[80%]; } /* Slightly wider than user */
.response-analysis { @apply mb-2 sm:mb-3 flex justify-start; }
.analysis-tags { @apply flex flex-wrap gap-1.5 sm:gap-2; }
.analysis-tag { @apply px-2.5 py-1 text-xs font-medium rounded-full shadow-sm; }
/* Ensure all relevant type tags are defined */
.tag-leetcode { @apply bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300; }
.tag-systemdesign { @apply bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300; }
.tag-concept { @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300; }
.tag-tutorial { @apply bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300; }
.tag-documentation { @apply bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300; }
.tag-general, .tag-error { @apply bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300; }

.difficulty-tag { @apply px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm; }
.diff-easy { @apply bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300; }
.diff-medium { @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300; }
.diff-hard { @apply bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300; }
.reading-time-tag { @apply px-2.5 py-1 text-xs bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400 rounded-full shadow-sm; }
.assistant-content { @apply w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700; }

/* Loading Section */
.loading-section { @apply flex-1 flex items-center justify-center p-6 sm:p-12; }
.loading-container { @apply text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg; }
.loading-spinner { @apply relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6; }
.spinner-ring { @apply absolute inset-0 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin; }
.loading-text { @apply text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base mb-2; }
.loading-details { @apply text-center space-y-1; }
.loading-step { @apply text-xs text-gray-500 dark:text-gray-400; }
.content-prediction { @apply flex items-center justify-center gap-1.5 sm:gap-2; }
.prediction-label { @apply text-xs text-blue-600 dark:text-blue-400; }
.prediction-type { @apply text-xs font-medium text-blue-700 dark:text-blue-300 capitalize px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded-md; }

/* Voice Input Section */
.voice-input-section { @apply border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky bottom-0 z-30; }
.input-wrapper { @apply max-w-3xl mx-auto p-3 sm:p-4; }
.suggestions-container { @apply mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50; }
.suggestions-header { @apply mb-2; }
.suggestions-title { @apply text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300; }
.suggestions-list { @apply flex flex-wrap gap-2; }
.suggestion-chip { @apply flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors cursor-pointer shadow-sm; }
.suggestion-icon { @apply w-3 h-3 sm:w-4 sm:h-4; } /* Icon color can be inherited or set explicitly */
.suggestion-text { @apply font-medium text-blue-800 dark:text-blue-200; }

/* Fullscreen Elements */
.fullscreen-voice-overlay { @apply fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4; }
.fullscreen-controls { @apply fixed top-3 sm:top-4 right-3 sm:right-4 z-[70] flex items-center gap-2 sm:gap-3; }
.fullscreen-btn { @apply p-2 sm:p-3 bg-black/30 dark:bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 dark:hover:bg-white/30 transition-colors shadow-lg; }
.control-icon { @apply w-5 h-5 sm:w-6 sm:h-6; }

/* Side Panels (Context & Insights) */
.context-panel, .insights-panel { @apply fixed w-72 sm:w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-40 max-h-[calc(100vh-10rem)] overflow-y-auto p-1; }
.context-panel { @apply right-3 sm:right-4 top-20; } /* Position may vary based on Header height */
.insights-panel { @apply left-3 sm:left-4 top-20; }
.panel-header { @apply flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit z-10; } /* bg-inherit for blur to work through */
.panel-title { @apply font-semibold text-sm sm:text-base text-gray-800 dark:text-white; }
.panel-close { @apply p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700; }
.close-icon { @apply w-4 h-4 sm:w-5 sm:h-5; }
.panel-content { @apply p-3 sm:p-4 space-y-3 sm:space-y-4; }
.context-item { @apply p-2 bg-slate-50 dark:bg-slate-700/30 rounded-md; }
.context-label { @apply block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1; }
.context-value { @apply text-sm text-gray-800 dark:text-gray-200; }
.context-tags { @apply flex flex-wrap gap-1.5 mt-1; }
.context-tag { @apply px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full; }
.system-design-tag { @apply bg-purple-100 dark:bg-purple-700/50 text-purple-700 dark:text-purple-200; }
.insight-grid { @apply space-y-2 sm:space-y-3; }
.insight-item { @apply flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/30 rounded-md text-xs sm:text-sm; }
.insight-label { @apply text-gray-600 dark:text-gray-400; }
.insight-value { @apply font-semibold text-gray-800 dark:text-gray-200; }

/* Cost Warning Toast */
.cost-warning { @apply fixed bottom-20 sm:bottom-4 right-4 z-[60]; }
.home-container.fullscreen-mode .cost-warning { @apply bottom-24; } /* Adjust if voice overlay is present */
.warning-content { @apply flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-orange-500 text-white rounded-lg shadow-xl backdrop-blur-sm border border-orange-600; }
.warning-icon { @apply w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0; }
.warning-text { @apply flex-1; }
.warning-title { @apply font-semibold text-sm sm:text-base; }
.warning-subtitle { @apply text-xs sm:text-sm opacity-90; }
.warning-close { @apply p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors; }

/* Responsive Overrides */
@media (max-width: 768px) { /* md breakpoint */
  .main-title { @apply text-3xl; }
  .examples-grid { @apply grid-cols-1 sm:grid-cols-2; }
  .features-section { @apply grid-cols-1; }
  .context-panel, .insights-panel { @apply fixed inset-x-2 sm:inset-x-4 top-16 sm:top-20 w-auto max-h-[50vh]; }
  .fullscreen-voice-overlay { @apply bottom-3 left-3 right-3 transform-none w-auto; }
  .input-wrapper { @apply p-2 sm:p-3; }
  .suggestions-container { @apply mx-1 sm:mx-2; }
}
@media (max-width: 640px) { /* sm breakpoint */
  .examples-grid { @apply grid-cols-1; }
}

/* Specific overrides for very constrained landscape views (e.g., mobile landscape) */
@media (max-height: 600px) and (orientation: landscape) {
  .welcome-container { @apply max-w-full px-2; } /* Allow full width */
  .examples-grid { @apply grid-cols-2 gap-2; } /* Keep 2 columns if possible */
  .example-card { @apply p-3; } .example-text { @apply text-xs; } .example-hint { @apply text-xs; }
  .logo { @apply w-10 h-10 sm:w-12 sm:h-12; } .welcome-header { @apply mb-4; }
  .main-title { @apply text-2xl md:text-3xl; } .main-subtitle { @apply text-sm; }
  .voice-input-section { @apply p-2; } /* Compact voice input area */
}
</style>