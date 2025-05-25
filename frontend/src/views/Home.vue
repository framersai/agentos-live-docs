<template>
  <div class="home-container" :class="{ 'fullscreen-mode': isFullscreenActive }">
    <Header
      v-if="!isFullscreenActive || showHeaderInFullscreen"
      :session-cost="sessionCost"
      :mode="mode"
      :language="language"
      :generate-diagram="generateDiagram"
      :audio-mode="audioMode"
      :is-fullscreen="isFullscreenActive"
      @update:mode="handleModeUpdate"
      @update:language="val => language = val"
      @update:generate-diagram="val => generateDiagram = val"
      @update:audio-mode="val => audioMode = val"
      @update:auto-clear="val => autoClearChat = val"
      @toggle-theme="toggleTheme"
      @toggle-fullscreen="toggleFullscreen"
      @clear-chat="handleClearChat"
      @logout="handleLogout"
    />

    <main id="main-content" class="main-content">
      <div class="content-wrapper">
        <div v-if="messages.length === 0 && !isLoading" class="welcome-section">
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
                <div class="feature-card"> <div class="feature-icon">🧠</div> <div class="feature-content"> <h4 class="feature-title">Smart Problem Detection</h4> <p class="feature-description">Automatically detects LeetCode problems and provides structured solutions</p> </div> </div>
                <div class="feature-card"> <div class="feature-icon">📊</div> <div class="feature-content"> <h4 class="feature-title">Dynamic Diagrams</h4> <p class="feature-description">Generates visual diagrams for algorithms and system architectures</p> </div> </div>
                <div class="feature-card"> <div class="feature-icon">🎯</div> <div class="feature-content"> <h4 class="feature-title">Adaptive Slides</h4> <p class="feature-description">Creates interactive slides based on content complexity</p> </div> </div>
             </div>
           </div>
        </div>

        <div v-else class="messages-section">
           <div v-if="shouldShowSingleMessageFocus" class="single-message-container">
            <div v-if="focusedMessageAnalysis" class="analysis-header">
              <div class="analysis-chip" :class="getAnalysisChipClass(focusedMessageAnalysis)">
                <span class="analysis-type">{{ focusedMessageAnalysis.displayTitle }}</span>
                <span v-if="focusedMessageAnalysis.confidence && focusedMessageAnalysis.confidence > 0.7" class="confidence-badge">
                  {{ Math.round(focusedMessageAnalysis.confidence * 100) }}%
                </span>
              </div>
            </div>
            <div class="message-content">
              <CompactMessageRenderer
                v-if="focusedMessage"
                :key="focusedMessage.timestamp"
                :content="focusedMessage.content"
                :mode="mode"
                :language="language"
                :analysis="focusedMessageAnalysis"
                :is-interview-mode="isCurrentModeInterview()"
                @toggle-fullscreen="toggleFullscreen"
              />
            </div>
          </div>

          <div v-else class="chat-history">
            <div class="messages-container" ref="chatHistoryContainerRef">
              <div
                v-for="(message, index) in messages"
                :key="message.timestamp + '-' + index" 
                class="message-item"
                :class="{
                  'user-message': message.role === 'user',
                  'assistant-message': message.role === 'assistant',
                  'smart-detected': message.analysis?.type === 'leetcode' || message.analysis?.type === 'systemDesign'
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
                    <span class="intent-label">Intent:</span> <span class="intent-value">{{ message.detectedIntent }}</span>
                  </div>
                </div>
                <div v-else class="assistant-bubble">
                  <div v-if="message.analysis" class="response-analysis">
                    <div class="analysis-tags">
                       <span class="analysis-tag" :class="`tag-${message.analysis.type?.toLowerCase().replace(/\s+/g, '-') || 'general'}`">
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
                      :key="message.timestamp"
                      :content="message.content"
                      :mode="mode"
                      :language="language"
                      :analysis="message.analysis"
                      :is-interview-mode="isCurrentModeInterview(message.analysis)"
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
               <div v-if="predictedContentTypeWhileLoading" class="content-prediction">
                 <span class="prediction-label">Preparing for:</span> <span class="prediction-type">{{ predictedContentTypeWhileLoading }}</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </main>

    <div class="voice-input-section" v-show="!isFullscreenActive">
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
          @update:audio-mode="val => audioMode = val"
          @permission-update="handleMicPermissionUpdate"
        />
      </div>
    </div>

    <div v-if="isFullscreenActive && (!autoClearChat || (autoClearChat && focusedMessage?.role === 'user'))" class="fullscreen-voice-overlay">
      <VoiceInput
        :is-processing="isLoading"
        :audio-mode="audioMode"
        @transcription="handleSmartTranscription"
        @update:audio-mode="val => audioMode = val"
        @permission-update="handleMicPermissionUpdate"
      />
    </div>

    <div v-if="isFullscreenActive" class="fullscreen-controls">
      <button @click="showHeaderInFullscreen = !showHeaderInFullscreen" class="fullscreen-btn" title="Toggle Menu">
        <Bars3Icon v-if="!showHeaderInFullscreen" class="control-icon" /> <XMarkIcon v-else class="control-icon" />
      </button>
      <button @click="toggleFullscreen" class="fullscreen-btn" title="Exit Fullscreen"> <ArrowsPointingInIcon class="control-icon" /> </button>
    </div>

    <div v-if="showContextPanel && currentContextData" class="context-panel">
       <div class="panel-header"> <h3 class="panel-title">Problem Context</h3> <button @click="showContextPanel = false" class="panel-close"> <XMarkIcon class="close-icon" /> </button> </div>
       <div class="panel-content">
         <div v-if="currentContextData.problemType" class="context-item"> <span class="context-label">Type:</span> <span class="context-value">{{ currentContextData.problemType }}</span> </div>
         <div v-if="currentContextData.dataStructures?.length" class="context-item"> <span class="context-label">Data Structures:</span> <div class="context-tags"> <span v-for="ds in currentContextData.dataStructures" :key="ds" class="context-tag">{{ ds }}</span> </div> </div>
         <div v-if="currentContextData.suggestedApproach" class="context-item"> <span class="context-label">Suggested Approach:</span> <span class="context-value">{{ currentContextData.suggestedApproach }}</span> </div>
         <div v-if="currentContextData.components?.length" class="context-item"> <span class="context-label">Key Components:</span> <div class="context-tags"> <span v-for="comp in currentContextData.components" :key="comp" class="context-tag system-design-tag">{{ comp }}</span> </div> </div>
         <div v-if="currentContextData.concepts?.length" class="context-item"> <span class="context-label">Key Concepts:</span> <div class="context-tags"> <span v-for="concept in currentContextData.concepts" :key="concept" class="context-tag system-design-tag">{{ concept }}</span> </div> </div>
       </div>
    </div>

    <div v-if="showPerformanceInsights" class="insights-panel">
       <div class="panel-header"> <span class="panel-title">Session Insights</span> <button @click="showPerformanceInsights = false" class="panel-close"> <XMarkIcon class="close-icon" /> </button> </div>
       <div class="panel-content">
         <div class="insight-grid">
           <div class="insight-item"> <span class="insight-label">Interactions:</span> <span class="insight-value">{{ sessionStats.totalInteractions }}</span> </div>
           <div class="insight-item"> <span class="insight-label">Problems Solved:</span> <span class="insight-value">{{ sessionStats.problemsSolved }}</span> </div>
           <div class="insight-item"> <span class="insight-label">Avg API Time:</span> <span class="insight-value">{{ (sessionStats.totalApiTimeMs / (sessionStats.totalInteractions || 1) / 1000).toFixed(1) }}s</span> </div>
           <div class="insight-item"> <span class="insight-label">Top Language:</span> <span class="insight-value">{{ sessionStats.topLanguage }}</span> </div>
         </div>
       </div>
     </div>

    <div v-if="showCostWarning" class="cost-warning">
       <div class="warning-content">
         <ExclamationTriangleIcon class="warning-icon" />
         <div class="warning-text"> <div class="warning-title">Cost Alert</div> <div class="warning-subtitle">Session: ${{ sessionCost.toFixed(2) }}</div> </div>
         <button @click="showCostWarning = false" class="warning-close"> <XMarkIcon class="close-icon" /> </button>
       </div>
     </div>

  </div>
</template>

<script setup lang="ts">
/**
 * @file Home.vue
 * @description Main view for the Voice Coding Assistant, handling chat interactions,
 * settings, content display, and integration of various child components.
 * @version 1.1.0 - Integrated TTS, LLM response caching, enhanced fullscreen and interview mode logic.
 */
import { ref, onMounted, watch, inject, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage, useTimestamp } from '@vueuse/core';
import { chatAPI, costAPI } from '../utils/api';
import Header from '../components/Header.vue';
import VoiceInput from '../components/VoiceInput.vue';
import CompactMessageRenderer from '../components/CompactMessageRenderer.vue';
import { ContentAnalyzer, type ContentAnalysis, type ProblemMetadata } from '../utils/ContentAnalyzer';
import { conversationManager, type ConversationMessage as AppMessage } from '../services/conversation.manager';
import { ttsService } from '../services/tts.service';
import {
  UserIcon, CodeBracketIcon, CpuChipIcon, DocumentTextIcon, ExclamationTriangleIcon,
  XMarkIcon, LightBulbIcon, BugAntIcon, CogIcon, Bars3Icon, ArrowsPointingInIcon,
  SparklesIcon, RocketLaunchIcon, AcademicCapIcon
} from '@heroicons/vue/24/outline';

// --- Type Definitions ---
interface Message extends AppMessage { // Extend ConversationMessage if needed
  // Frontend specific properties can be added here
}

interface Suggestion {
  text: string;
  type: string;
  icon: any;
  action?: string;
}

interface ContextData {
  problemType?: string;
  dataStructures?: string[];
  suggestedApproach?: string;
  components?: string[];
  concepts?: string[];
}

interface CachedLlmResponse {
  userPrompt: string; // Normalized user prompt
  assistantResponseContent: string;
  assistantAnalysis: ContentAnalysis | null;
  timestamp: number;
}

// --- Injections and Instances ---
const router = useRouter();
const toast = inject('toast') as any;
const loadingIndicator = inject('loading') as any; // Assuming App.vue provides this
const contentAnalyzer = new ContentAnalyzer();
const chatHistoryContainerRef = ref<HTMLElement | null>(null);

// --- Reactive State ---
const messages = ref<Array<Message>>([]);
const isLoading = ref(false);
const loadingStep = ref(''); // e.g., "Analyzing input...", "Generating response..."
const loadingProgress = ref(0); // 0-100
const sessionCost = ref(0);
const showCostWarning = ref(false);
const isFullscreenActive = ref(false); // Renamed from isFullscreen to avoid conflict with window.isFullscreen
const showHeaderInFullscreen = ref(false);

// States for focused message display (auto-clear or specific focus)
const focusedMessage = ref<Message | null>(null);
const focusedMessageAnalysis = ref<ContentAnalysis | null>(null);

// Content analysis and context panel
const predictedContentTypeWhileLoading = ref(''); // For loading text
const showInputSuggestions = ref(false);
const inputSuggestions = ref<Array<Suggestion>>([]);
const showContextPanel = ref(false);
const currentContextData = ref<ContextData | null>(null);

// Session statistics
const showPerformanceInsights = ref(false);
const sessionStats = ref({
  problemsSolved: 0,
  totalApiTimeMs: 0,
  topLanguage: 'N/A',
  totalInteractions: 0,
});
let lastApiCallStartTime = 0;

// --- Persistent State (Settings) ---
const mode = useStorage('vca-mode', 'coding');
const language = useStorage('vca-language', 'python');
const generateDiagram = useStorage('vca-generateDiagram', true);
const audioMode = useStorage('vca-audioMode', 'push-to-talk');
const autoClearChat = useStorage('vca-autoClearChat', true);
const enableAutoTTS = useStorage('vca-enableAutoTTS', true); // New setting for TTS
const isDarkMode = useStorage('darkMode', false); // From App.vue context

// --- LLM Response Cache ---
const llmResponseCache = ref<CachedLlmResponse[]>([]);
const MAX_CACHE_SIZE = 5; // Store last 5 significant interactions
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// --- Environment Flags (simulated from .env, should be set via build process or config) ---
const INTERVIEW_MODE_ENABLED = (import.meta.env.VITE_FEATURE_FLAG_ENABLE_INTERVIEW_MODE === 'true') || (import.meta.env.DEV && true);
const CODING_TUTOR_MODE_ENABLED = (import.meta.env.VITE_FEATURE_FLAG_ENABLE_CODING_TUTOR_MODE === 'true') || (import.meta.env.DEV && true);

// --- Computed Properties ---
const shouldShowSingleMessageFocus = computed(() => {
  return autoClearChat.value && focusedMessage.value && messages.value.length <= 2; // Show focused if auto-clear and we have a pair
});

// --- Methods ---
const getSmartExamplesForMode = () => smartModeExamples[mode.value] || smartModeExamples.general; // (Assumes smartModeExamples is defined as before)

const getAnalysisChipClass = (analysis: ContentAnalysis | null) => {
  if (!analysis?.type) return 'analysis-chip low-confidence type-general';
  const confidence = analysis.confidence || 0;
  let classes = 'analysis-chip-content ';
  if (confidence > 0.8) classes += 'high-confidence ';
  else if (confidence > 0.6) classes += 'medium-confidence ';
  else classes += 'low-confidence ';
  classes += `type-${analysis.type.toLowerCase().replace(/\s+/g, '-')}`;
  return classes;
};

const getSmartLoadingText = () => {
  // (Same as before)
  if (predictedContentTypeWhileLoading.value) {
    const texts: Record<string, string> = { leetcode: 'Analyzing coding problem...', systemdesign: 'Designing system architecture...', concept: 'Preparing explanation...' };
    return texts[predictedContentTypeWhileLoading.value.toLowerCase().replace(/\s+/g, '')] || 'Processing...';
  }
  return 'Thinking...';
};

const scrollToBottom = async () => { /* ... (same as before) ... */ };

const detectUserIntentAndUpdateContext = (transcription: string): ContentAnalysis => {
  const analysis = contentAnalyzer.analyzeContent(transcription, mode.value);
  predictedContentTypeWhileLoading.value = analysis.displayTitle || analysis.type;

  if (analysis.confidence > 0.6) {
    // (Logic to switch mode or update context panel based on analysis - same as before)
    const problemData = analysis.problemMetadata;
    if (analysis.type === 'leetcode' && problemData) {
        currentContextData.value = { problemType: analysis.subtype || problemData.category, dataStructures: problemData.dataStructures, suggestedApproach: problemData.approach };
        if (mode.value !== 'coding') {
            toast?.add({ type: 'info', title: 'Mode Switched', message: 'LeetCode problem detected, switching to Coding mode.' });
            mode.value = 'coding';
        }
        showContextPanel.value = true;
    } else if (analysis.type === 'systemDesign') {
        currentContextData.value = { problemType: 'System Design', components: analysis.keywords, concepts: [] /* derive concepts */ };
         if (mode.value !== 'system_design') {
            toast?.add({ type: 'info', title: 'Mode Switched', message: 'System design topic detected, switching to System Design mode.' });
            mode.value = 'system_design';
        }
        showContextPanel.value = true;
    } else {
        showContextPanel.value = false;
    }
  } else {
    showContextPanel.value = false;
  }
  return analysis;
};

const generateSmartSuggestions = (analysis: ContentAnalysis) => { /* ... (same as before) ... */ };

const clearChatLocalState = () => {
  messages.value = [];
  focusedMessage.value = null;
  focusedMessageAnalysis.value = null;
  showContextPanel.value = false;
  currentContextData.value = null;
  predictedContentTypeWhileLoading.value = '';
  inputSuggestions.value = [];
  showInputSuggestions.value = false;
  llmResponseCache.value = []; // Clear cache on chat clear
  ttsService.cancel(); // Stop any ongoing TTS
};

const handleModeUpdate = (newModeValue: string) => {
  mode.value = newModeValue;
  if (autoClearChat.value && messages.value.length > 0) {
    clearChatLocalState();
  }
  toast?.add({ type: 'info', title: 'Mode Changed', message: `Switched to ${getModeDisplayName(newModeValue)}`, duration: 2000 });
};

const isCurrentModeInterview = (messageAnalysis?: ContentAnalysis | null): boolean => {
    // An interview problem is typically a coding problem.
    // Check the mode, a feature flag, and optionally the content analysis.
    const analysisToCheck = messageAnalysis || focusedMessageAnalysis.value;
    return INTERVIEW_MODE_ENABLED &&
           mode.value === 'coding' &&
           (analysisToCheck?.type === 'leetcode' || !analysisToCheck); // Assume interview for any coding prompt if no specific analysis yet
};

const normalizePromptForCache = (prompt: string): string => {
    return prompt.trim().toLowerCase().replace(/\s+/g, ' ');
};

const getCachedResponse = (userPrompt: string): CachedLlmResponse | null => {
    const normalizedPrompt = normalizePromptForCache(userPrompt);
    const now = Date.now();
    // Clean expired cache entries
    llmResponseCache.value = llmResponseCache.value.filter(entry => (now - entry.timestamp) < CACHE_EXPIRY_MS);

    const cachedEntry = llmResponseCache.value.find(entry => entry.userPrompt === normalizedPrompt);
    return cachedEntry || null;
};

const addResponseToCache = (userPrompt: string, assistantResponseContent: string, assistantAnalysis: ContentAnalysis | null) => {
    const normalizedPrompt = normalizePromptForCache(userPrompt);
    // Remove oldest if cache is full
    if (llmResponseCache.value.length >= MAX_CACHE_SIZE) {
        llmResponseCache.value.shift();
    }
    llmResponseCache.value.push({
        userPrompt: normalizedPrompt,
        assistantResponseContent,
        assistantAnalysis,
        timestamp: Date.now(),
    });
};

const handleSmartTranscription = async (transcription: string) => {
  if (!transcription.trim() || isLoading.value) return;

  // --- 1. Create User Message & Analyze Intent ---
  const userInputAnalysis = detectUserIntentAndUpdateContext(transcription);
  const userMessage: Message = {
    role: 'user',
    content: transcription,
    timestamp: Date.now(),
    detectedIntent: userInputAnalysis.type !== 'general' ? userInputAnalysis.type : undefined,
    analysis: userInputAnalysis
  };

  // --- 2. Update Message Display List ---
  if (autoClearChat.value) {
    messages.value = [userMessage]; // Replace previous messages
    focusedMessage.value = userMessage; // User message is focused until AI replies
    focusedMessageAnalysis.value = userInputAnalysis;
  } else {
    messages.value.push(userMessage);
    focusedMessage.value = null; // No single focused message in history view
    focusedMessageAnalysis.value = null;
    await scrollToBottom();
  }
  ttsService.cancel(); // Cancel any ongoing TTS from previous assistant message

  // --- 3. Check Cache ---
  const cachedResponse = getCachedResponse(transcription);
  if (cachedResponse) {
    toast?.add({type: 'info', title: 'Cached Response', message: 'Showing a recent similar response.', duration: 2500});
    const assistantMessage: Message = {
        role: 'assistant',
        content: cachedResponse.assistantResponseContent,
        timestamp: Date.now(), // Use new timestamp for display
        analysis: cachedResponse.assistantAnalysis,
    };
    if (autoClearChat.value) {
        focusedMessage.value = assistantMessage;
        focusedMessageAnalysis.value = cachedResponse.assistantAnalysis;
        messages.value = [userMessage, assistantMessage]; // Update to show this pair
    } else {
        messages.value.push(assistantMessage);
        await scrollToBottom();
    }
    if (enableAutoTTS.value) ttsService.speak(assistantMessage.content);
    return; // Skip API call
  }

  // --- 4. Prepare for API Call ---
  isLoading.value = true;
  loadingIndicator?.show();
  loadingStep.value = 'Understanding your query...';
  loadingProgress.value = 10;
  showInputSuggestions.value = false; // Hide suggestions during processing
  lastApiCallStartTime = Date.now();


  try {
    // --- 5. Build Prompt & Call API ---
    const baseSystemPrompt = buildBaseSystemPrompt(); // (Define this function based on mode)
    const systemPromptForLlm = contentAnalyzer.generateEnhancedPrompt(userInputAnalysis, baseSystemPrompt, language.value);
    loadingStep.value = 'Contacting AI assistant...';
    loadingProgress.value = 30;

    const historyForApi = conversationManager.prepareHistoryForApi(
      messages.value.slice(0, -1), // Send all messages except the current user input
      undefined, // Use configured history size
      8000 - (systemPromptForLlm.length / 3.5) - (userMessage.content.length / 3.5) // Estimate remaining tokens
    );
    
    const apiRequestMessages: AppMessage[] = [
      { role: 'system', content: systemPromptForLlm },
      ...historyForApi,
      { role: 'user', content: userMessage.content } // Current user message is last
    ];
    
    const isInterviewTask = INTERVIEW_MODE_ENABLED && mode.value === 'coding';

    const response = await chatAPI.sendMessage({
      messages: apiRequestMessages,
      mode: mode.value,
      language: language.value,
      generateDiagram: generateDiagram.value && userInputAnalysis.shouldGenerateDiagram,
      userId: 'default_user_id', // Replace with actual user ID if available
      conversationId: 'current_session', // Replace with actual conversation ID
      maxHistoryMessages: conversationManager.getHistoryMessageCount() / 2, // Send pairs count
      interviewMode: isInterviewTask, // Pass interview mode flag to backend
    });

    // --- 6. Process Response ---
    loadingStep.value = 'Formatting response...';
    loadingProgress.value = 75;
    sessionStats.value.totalApiTimeMs += Date.now() - lastApiCallStartTime;

    const assistantResponseContent = response.data.content || response.data.message || "Sorry, I couldn't generate a response.";
    const assistantAnalysis = contentAnalyzer.analyzeContent(assistantResponseContent, mode.value);
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: assistantResponseContent,
      timestamp: Date.now(),
      analysis: assistantAnalysis
    };

    addResponseToCache(transcription, assistantMessage.content, assistantMessage.analysis);

    // --- 7. Update UI & Stats ---
    if (autoClearChat.value) {
      focusedMessage.value = assistantMessage;
      focusedMessageAnalysis.value = assistantAnalysis;
      messages.value = [userMessage, assistantMessage]; // Update to show new pair
    } else {
      messages.value.push(assistantMessage);
      await scrollToBottom();
    }
    
    if (enableAutoTTS.value && assistantMessage.content) {
      ttsService.speak(assistantMessage.content, { lang: language.value }); // TODO: Detect language from response if possible
    }

    await fetchSessionCost();
    updateSessionStats(userInputAnalysis, assistantAnalysis); // (Define this function)
    generateSmartSuggestions(assistantAnalysis); // Generate suggestions based on AI response

  } catch (error: any) {
    // ... (Error handling same as before, ensuring focusedMessage/Analysis are updated if autoClear is on)
    console.error("API Error in handleSmartTranscription:", error);
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    toast?.add({ type: 'error', title: 'API Request Failed', message: errorMessage });
    const errorMsgObj: Message = { role: 'assistant', content: `Error: ${errorMessage}`, timestamp: Date.now(), analysis: contentAnalyzer.analyzeContent(`Error: ${errorMessage}`, 'general')};
    if (autoClearChat.value) {
        focusedMessage.value = errorMsgObj;
        focusedMessageAnalysis.value = errorMsgObj.analysis;
        messages.value = [userMessage, errorMsgObj];
    } else {
        messages.value.push(errorMsgObj);
    }
  } finally {
    isLoading.value = false;
    loadingIndicator?.hide();
    loadingStep.value = '';
    loadingProgress.value = 0;
    predictedContentTypeWhileLoading.value = ''; // Clear after loading
  }
};


const handleExampleClick = (exampleText: string) => { /* ... (same as before) ... */ };
const handleSuggestionClick = (suggestion: Suggestion) => { /* ... (same as before) ... */ };
const buildBaseSystemPrompt = () => { /* ... (same as before) ... */ return `You are a helpful AI. Current mode: ${mode.value}. Preferred language: ${language.value}.`; };
const updateSessionStats = (userAnalysis: ContentAnalysis, assistantAnalysis: ContentAnalysis) => { /* ... (same as before) ... */ };
const fetchSessionCost = async () => { /* ... (same as before) ... */ };
const getModeDisplayName = (modeVal?: string) => { /* ... (same as before) ... */ return modeVal || mode.value; };
const formatTime = (timestamp: number) => { /* ... (same as before) ... */ return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}); };

const handleClearChat = async () => {
  clearChatLocalState();
  try {
    await costAPI.resetCost(); // Assuming default reset action
    sessionCost.value = 0; // Reset local cost display
    toast?.add({ type: 'info', title: 'Chat Cleared', message: 'New session started.' });
  } catch (error) {
    console.error("Error resetting cost:", error);
    toast?.add({ type: 'error', title: 'Error', message: 'Could not reset session cost on server.' });
  }
  sessionStats.value = { problemsSolved: 0, totalApiTimeMs: 0, topLanguage: 'N/A', totalInteractions: 0 };
};

const toggleTheme = () => isDarkMode.value = !isDarkMode.value;

const toggleFullscreen = () => {
  isFullscreenActive.value = !isFullscreenActive.value;
  if (!isFullscreenActive.value) {
      showHeaderInFullscreen.value = false; // Always hide header options when exiting FS
  }
  // Handle actual browser fullscreen API
  if (isFullscreenActive.value) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(err => {
          console.error("Error attempting to enable full-screen mode:", err);
          toast?.add({type: 'warning', title: 'Fullscreen Error', message: `Could not enter fullscreen: ${err.message}`});
          isFullscreenActive.value = false; // Revert state
      });
  } else {
      if (document.fullscreenElement) document.exitFullscreen();
  }
};

const handleLogout = () => { /* ... (same as before) ... */ };

const handleMicPermissionUpdate = (status: 'granted' | 'denied' | 'prompt') => {
    // This can be used to update UI or show specific messages if VoiceInput handles all permission logic.
    // For now, VoiceInput's internal permissionStatus is the primary display.
    console.log("Mic permission status update from VoiceInput:", status);
};

// --- Lifecycle Hooks & Watchers ---
onMounted(async () => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreenActive.value = !!document.fullscreenElement;
    if (!isFullscreenActive.value) showHeaderInFullscreen.value = false;
  });
  await fetchSessionCost();
  if (messages.value.length === 0) {
    // Welcome toast
  }
});

watch(autoClearChat, (newVal) => {
  if (newVal && messages.value.length > 0) {
    const lastUserMsg = messages.value.filter(m => m.role === 'user').pop();
    const lastAsstMsg = messages.value.filter(m => m.role === 'assistant').pop();
    if (lastAsstMsg) {
        focusedMessage.value = lastAsstMsg;
        focusedMessageAnalysis.value = lastAsstMsg.analysis || null;
        if (lastUserMsg && lastUserMsg.timestamp < lastAsstMsg.timestamp) {
            messages.value = [lastUserMsg, lastAsstMsg];
        } else {
            messages.value = [lastAsstMsg];
        }
    } else if (lastUserMsg) {
        focusedMessage.value = lastUserMsg;
        focusedMessageAnalysis.value = lastUserMsg.analysis || null;
        messages.value = [lastUserMsg];
    } else {
        focusedMessage.value = null;
        focusedMessageAnalysis.value = null;
    }
  } else {
    focusedMessage.value = null;
    focusedMessageAnalysis.value = null;
    // If autoClear is turned off, messages.value already holds the history.
  }
   nextTick(scrollToBottom);
});

// Smart example prompts data (as provided in your original Home.vue)
const smartModeExamples: Record<string, Array<{text: string; icon: any; hint: string; className: string}>> = {
  coding: [ { text: "Solve Two Sum problem step by step", icon: CodeBracketIcon, hint: "Classic array problem with O(n) solution", className: "example-leetcode" }, /* ... more ... */ ],
  system_design: [ { text: "Design Instagram-like photo sharing", icon: CogIcon, hint: "Scale to millions with proper architecture", className: "example-system" }, /* ... more ... */ ],
  meeting: [ { text: "Summarize sprint planning meeting", icon: DocumentTextIcon, hint: "Extract decisions and action items", className: "example-summary" } ],
  general: [ { text: "Explain machine learning simply", icon: AcademicCapIcon, hint: "Clear concepts with examples", className: "example-concept" } ]
};
// Ensure full smartModeExamples data is present here from your original file.

</script>

<style scoped>
/* Styles from your provided Home.vue */
.home-container { @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800; display: grid; grid-template-rows: auto 1fr auto; }
.home-container.fullscreen-mode { @apply fixed inset-0 z-50 bg-white dark:bg-gray-900; grid-template-rows: auto 1fr auto; }
.main-content { @apply flex-1 overflow-hidden; }
.content-wrapper { @apply h-full flex flex-col; }
.welcome-section { @apply flex-1 flex items-center justify-center p-6; }
.welcome-container { @apply w-full max-w-6xl mx-auto; }
.welcome-header { @apply text-center mb-12; }
.logo-container { @apply mb-6; }
.logo { @apply w-16 h-16 sm:w-20 sm:h-20 mx-auto; }
.main-title { @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.main-subtitle { @apply text-lg sm:text-xl text-gray-600 dark:text-gray-300; }
.examples-section { @apply mb-12; }
.section-title { @apply text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center; }
.examples-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6; }
.example-card { @apply p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 text-left relative overflow-hidden; }
.example-card:hover { transform: translateY(-3px) scale(1.02); }
.example-card::before { content: ''; @apply absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-75 group-hover:opacity-100 transition-opacity; }
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
.example-icon { @apply w-7 h-7 sm:w-8 sm:h-8 text-blue-500; }
.example-content { @apply flex flex-col; }
.example-text { @apply text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1; }
.example-hint { @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400; }
.features-section { @apply grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700; }
.feature-card { @apply p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center; }
.feature-icon { @apply text-3xl sm:text-4xl mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-block; }
.feature-content { @apply space-y-2; }
.feature-title { @apply font-semibold text-lg text-gray-900 dark:text-white; }
.feature-description { @apply text-sm text-gray-600 dark:text-gray-400; }
.messages-section { @apply flex-1 overflow-y-auto; }
.single-message-container { @apply h-full flex flex-col max-w-5xl mx-auto p-4 sm:p-6; }
.analysis-header { @apply mb-4 flex justify-center; }
.analysis-chip { @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border shadow-sm; }
.analysis-chip-content { @apply flex items-center gap-2; }
.high-confidence { @apply bg-green-50 dark:bg-green-800/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700; }
.medium-confidence { @apply bg-yellow-50 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700; }
.low-confidence { @apply bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600; }
.type-leetcode { @apply border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300; }
.type-systemdesign { @apply border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300; }
.type-concept { @apply border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300; }
.type-error { @apply border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-800/30 text-red-700 dark:text-red-300; }
.analysis-type { @apply font-semibold capitalize; }
.confidence-badge { @apply text-xs px-2 py-0.5 bg-white/60 dark:bg-black/30 rounded-md; }
.message-content { @apply flex-1; }
.chat-history { @apply flex-1 overflow-y-auto; }
.messages-container { @apply max-w-3xl mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6; }
.message-item { @apply flex flex-col; }
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
.assistant-bubble { @apply mr-auto max-w-[90%] sm:max-w-[80%]; }
.response-analysis { @apply mb-2 sm:mb-3 flex justify-start; }
.analysis-tags { @apply flex flex-wrap gap-1.5 sm:gap-2; }
.analysis-tag { @apply px-2.5 py-1 text-xs font-medium rounded-full shadow-sm; }
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
.voice-input-section { @apply border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md sticky bottom-0 z-30; }
.input-wrapper { @apply max-w-3xl mx-auto p-3 sm:p-4; }
.suggestions-container { @apply mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50; }
.suggestions-header { @apply mb-2; }
.suggestions-title { @apply text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300; }
.suggestions-list { @apply flex flex-wrap gap-2; }
.suggestion-chip { @apply flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors cursor-pointer shadow-sm; }
.suggestion-icon { @apply w-3 h-3 sm:w-4 sm:h-4; }
.suggestion-text { @apply font-medium text-blue-800 dark:text-blue-200; }
.fullscreen-voice-overlay { @apply fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4; }
.fullscreen-controls { @apply fixed top-3 sm:top-4 right-3 sm:right-4 z-[70] flex items-center gap-2 sm:gap-3; }
.fullscreen-btn { @apply p-2 sm:p-3 bg-black/30 dark:bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 dark:hover:bg-white/30 transition-colors shadow-lg; }
.control-icon { @apply w-5 h-5 sm:w-6 sm:h-6; }
.context-panel, .insights-panel { @apply fixed w-72 sm:w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-40 max-h-[calc(100vh-10rem)] overflow-y-auto p-1; }
.context-panel { @apply right-3 sm:right-4 top-20; }
.insights-panel { @apply left-3 sm:left-4 top-20; }
.panel-header { @apply flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit z-10; }
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
.cost-warning { @apply fixed bottom-20 sm:bottom-4 right-4 z-[60]; }
.home-container.fullscreen-mode .cost-warning { @apply bottom-24; }
.warning-content { @apply flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-orange-500 text-white rounded-lg shadow-xl backdrop-blur-sm border border-orange-600; }
.warning-icon { @apply w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0; }
.warning-text { @apply flex-1; }
.warning-title { @apply font-semibold text-sm sm:text-base; }
.warning-subtitle { @apply text-xs sm:text-sm opacity-90; }
.warning-close { @apply p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors; }
@media (max-width: 768px) { .main-title { @apply text-3xl; } .examples-grid { @apply grid-cols-1 sm:grid-cols-2; } .features-section { @apply grid-cols-1; } .context-panel, .insights-panel { @apply fixed inset-x-2 sm:inset-x-4 top-16 sm:top-20 w-auto max-h-[50vh]; } .fullscreen-voice-overlay { @apply bottom-3 left-3 right-3 transform-none w-auto; } .input-wrapper { @apply p-2 sm:p-3; } .suggestions-container { @apply mx-1 sm:mx-2; } }
@media (max-width: 640px) { .examples-grid { @apply grid-cols-1; } }
@media (max-height: 600px) and (orientation: landscape) { .welcome-container { @apply max-w-full px-2; } .examples-grid { @apply grid-cols-2 gap-2; } .example-card { @apply p-3; } .example-text { @apply text-xs; } .example-hint { @apply text-xs; } .logo { @apply w-10 h-10 sm:w-12 sm:h-12; } .welcome-header { @apply mb-4; } .main-title { @apply text-2xl md:text-3xl; } .main-subtitle { @apply text-sm; } .voice-input-section { @apply p-2; } }
</style>