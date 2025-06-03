// File: frontend/src/components/voice-input/composables/useSttHandlerManager.ts
import { ref, computed, watch, nextTick, type Ref, type Component } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode, STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

export interface SttHandlerInstance {
  startListening: (forVadCommand: boolean) => Promise<void>;
  stopListening: (abort?: boolean) => Promise<void>;
  reinitialize: () => Promise<void>;
  stopAll: (abort?: boolean) => Promise<void>;
  // Status flags
  isActive?: Ref<boolean>;
  isListeningForWakeWord?: Ref<boolean>;
  hasPendingTranscript?: Ref<boolean>;
  pendingTranscript?: Ref<string>;
  clearPendingTranscript?: () => void;
}

export interface UseSttHandlerManagerOptions {
  settings: Ref<VoiceApplicationSettings>;
  toast?: ToastService;
  isProcessingLLM: Ref<boolean>;
  currentMicPermission: Ref<'prompt' | 'granted' | 'denied' | 'error' | ''>;
}

export interface SttHandlerEvents {
  onTranscription: (text: string) => void;
  onProcessingAudio: (isProcessing: boolean) => void;
  onListeningForWakeWord: (isListening: boolean) => void;
  onWakeWordDetected: () => void;
  onError: (error: { type: string; message: string; code?: string }) => void;
  onReady: (handler: SttHandlerInstance) => void;
}

export function useSttHandlerManager(options: UseSttHandlerManagerOptions, events: SttHandlerEvents) {
  const { settings, toast, isProcessingLLM, currentMicPermission } = options;
  
  // Handler refs - will be populated by parent component
  const browserHandlerRef = ref<SttHandlerInstance | null>(null);
  const whisperHandlerRef = ref<SttHandlerInstance | null>(null);
  
  // State
  const isHandlerReady = ref(false);
  const currentHandlerType = ref<'browser' | 'whisper' | null>(null);
  const isProcessingAudio = ref(false);
  const isListeningForWakeWord = ref(false);
  
  // Active handler based on settings
  function isSttHandlerInstance(obj: any): obj is SttHandlerInstance {
    return obj &&
      typeof obj.startListening === 'function' &&
      typeof obj.stopListening === 'function' &&
      typeof obj.reinitialize === 'function' &&
      typeof obj.stopAll === 'function';
  }

  const activeHandler = computed<SttHandlerInstance | null>(() => {
    if (!isHandlerReady.value) return null;
    if (settings.value.sttPreference === 'browser_webspeech_api') {
      return isSttHandlerInstance(browserHandlerRef.value) ? browserHandlerRef.value : null;
    } else {
      return isSttHandlerInstance(whisperHandlerRef.value) ? whisperHandlerRef.value : null;
    }
  });

  const currentAudioMode = computed(() => settings.value.audioInputMode);
  const isPttMode = computed(() => currentAudioMode.value === 'push-to-talk');
  const isContinuousMode = computed(() => currentAudioMode.value === 'continuous');
  const isVoiceActivationMode = computed(() => currentAudioMode.value === 'voice-activation');

  // Handler registration (called by parent when child components mount)
  const registerHandler = (type: 'browser' | 'whisper', handler: SttHandlerInstance) => {
    console.log(`[SttHandlerManager] Registering ${type} handler`);
    
    if (type === 'browser') {
      browserHandlerRef.value = handler;
    } else {
      whisperHandlerRef.value = handler;
    }
    
    // Check if this is the currently needed handler
    const neededType = settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
    if (type === neededType) {
      currentHandlerType.value = type;
      isHandlerReady.value = true;
      events.onReady(handler);
      
      // Auto-start if appropriate
      nextTick(() => {
        if (shouldAutoStart()) {
          startListening();
        }
      });
    }
  };

  const unregisterHandler = (type: 'browser' | 'whisper') => {
    console.log(`[SttHandlerManager] Unregistering ${type} handler`);
    if (type === 'browser') {
      browserHandlerRef.value = null;
    } else {
      whisperHandlerRef.value = null;
    }
    
    if (currentHandlerType.value === type) {
      isHandlerReady.value = false;
      currentHandlerType.value = null;
    }
  };

  // Check if we should auto-start based on mode and conditions
  const shouldAutoStart = (): boolean => {
    if (!isHandlerReady.value || isProcessingLLM.value || currentMicPermission.value !== 'granted') {
      return false;
    }
    
    return isContinuousMode.value || isVoiceActivationMode.value;
  };

  // Public methods
  const startListening = async (forVadCommand: boolean = false) => {
    if (!activeHandler.value) {
      console.warn('[SttHandlerManager] No active handler available');
      return;
    }
    
    if (isProcessingLLM.value && !isContinuousMode.value) {
      toast?.add({ 
        type: 'info', 
        title: 'Assistant Busy', 
        message: 'Please wait for the response to complete.' 
      });
      return;
    }
    
    try {
      await activeHandler.value.startListening(forVadCommand);
    } catch (error) {
      console.error('[SttHandlerManager] Error starting listening:', error);
      events.onError({
        type: 'handler',
        message: 'Failed to start listening',
        code: 'start_failed'
      });
    }
  };

  const stopListening = async (abort: boolean = false) => {
    if (!activeHandler.value) return;
    
    try {
      await activeHandler.value.stopListening(abort);
    } catch (error) {
      console.error('[SttHandlerManager] Error stopping listening:', error);
    }
  };

  const stopAll = async () => {
    if (!activeHandler.value) return;
    
    try {
      await activeHandler.value.stopAll(true);
    } catch (error) {
      console.error('[SttHandlerManager] Error stopping all:', error);
    }
  };

  const reinitialize = async () => {
    if (!activeHandler.value) return;
    
    try {
      await activeHandler.value.reinitialize();
    } catch (error) {
      console.error('[SttHandlerManager] Error reinitializing:', error);
    }
  };

  // Handle PTT click
  const handlePttClick = async () => {
    if (!isPttMode.value || !activeHandler.value) return;
    
    const isActive = activeHandler.value.isActive?.value ?? false;
    
    if (isActive) {
      await stopListening(false);
    } else {
      await startListening(false);
    }
  };

  // Watch for audio input mode changes
  watch([currentAudioMode, () => settings.value.sttPreference], async ([newMode, newStt], [oldMode, oldStt]) => {
    if (!isHandlerReady.value) return;
    
    const modeChanged = newMode !== oldMode;
    const sttChanged = newStt !== oldStt;
    
    if (modeChanged || sttChanged) {
      console.log(`[SttHandlerManager] Settings changed. Mode: ${oldMode}->${newMode}, STT: ${oldStt}->${newStt}`);
      
      // Stop current activity
      await stopAll();
      
      // Reinitialize if needed
      if (activeHandler.value) {
        await reinitialize();
        
        // Auto-start if appropriate
        if (shouldAutoStart()) {
          await nextTick();
          startListening();
        }
      }
    }
  });

  // Watch for LLM processing changes (for continuous mode restart)
  watch(isProcessingLLM, async (isProcessing, wasProcessing) => {
    if (!isHandlerReady.value || isProcessing || !wasProcessing) return;
    
    // LLM just finished processing
    if (isContinuousMode.value && currentMicPermission.value === 'granted' && activeHandler.value) {
      const isActive = activeHandler.value.isActive?.value ?? false;
      if (!isActive) {
        console.log('[SttHandlerManager] LLM finished, restarting continuous mode');
        await nextTick();
        startListening();
      }
    }
  });

  // Update internal state based on handler events
  const updateProcessingAudio = (isProcessing: boolean) => {
    isProcessingAudio.value = isProcessing;
    events.onProcessingAudio(isProcessing);
  };

  const updateListeningForWakeWord = (isListening: boolean) => {
    isListeningForWakeWord.value = isListening;
    events.onListeningForWakeWord(isListening);
  };

  return {
    // State
    isHandlerReady,
    isProcessingAudio,
    isListeningForWakeWord,
    activeHandler,
    
    // Methods
    registerHandler,
    unregisterHandler,
    startListening,
    stopListening,
    stopAll,
    reinitialize,
    handlePttClick,
    
    // Event handlers for child components
    updateProcessingAudio,
    updateListeningForWakeWord,
  };
}