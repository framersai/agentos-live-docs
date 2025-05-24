// File: frontend/src/services/voiceCommandService.ts
/**
 * @fileoverview VoiceCommandService - SOTA implementation for managing the entire voice command lifecycle:
 * STT (adaptable: Web Speech API or advanced client-side processing for backend Whisper),
 * NLU via backend LLM, and action dispatch.
 * @module services/voiceCommandService
 * @implements {IVoiceCommandService}
 */
import { ref, watch, nextTick } from 'vue';
import { useRouter, Router } from 'vue-router';
import { apiService, IApiService } from './apiService';
import { uiInteractionService, IUiInteractionService } from './uiInteractionService';
import { useVoiceStore } from '../store/voice.store';
import { useDynamicUiStore } from '../store/dynamicUI.store';
import { useUiStore, AppTheme } from '../store/ui.store';
import { useChatStore } from '../features/chat/store/chat.store';
import { useAgentStore } from '../features/agents/store/agent.store';
import { useChatSettingsStore, AudioInputMode, TranscriptionMethod } from '../features/chat/store/chatSettings.store';
import { useDynamicUIAgent, DynamicUIAgentService } from './dynamicUIAgent.service';
import type { UiCommand, InteractableElement } from '../types/ui.types';
import type { ParsedLLMIntent, VoiceIntentParseRequest, SpeechRecognitionStatus } from '../types/voice.types';
import { storageService, StorageType } from './storageService';

// Attempt to import your client-side AudioProcessor if it's made available
// This path needs to be resolvable by the frontend build system.
// It might be a symlinked package, a copied library, or part of a monorepo structure.
let AudioProcessorModule: typeof import('../../../backend/agentos/core/audio/AudioProcessor') | null = null;
try {
  // Conditional import if the path/module might not exist in all build environments
  if (import.meta.env.VITE_USE_ADVANCED_CLIENT_AUDIO_PROCESSING === 'true') {
    AudioProcessorModule = await import('../../../backend/agentos/core/audio/AudioProcessor');
  }
} catch (e) {
  console.warn('[VoiceCommandService] Advanced Client AudioProcessor module not found or disabled. Falling back for Whisper STT.', e);
}


const VOICE_COMMANDS_ENABLED_KEY = 'voiceCommandsEnabledPreference';
const NLU_ENDPOINT_URL = '/utility/voice-intent-parser'; // Example: part of UtilityLLMRoutes
const WHISPER_STT_ENDPOINT_URL = '/speech'; // Your existing backend STT endpoint from routes/speech.ts

/**
 * @interface IVoiceCommandService
 * @description Defines the contract for the Voice Command Service.
 */
export interface IVoiceCommandService {
  initialize(): Promise<void>;
  startListening(): Promise<void>;
  stopListening(): void;
  toggleListening(): Promise<void>;
  processTranscriptAsCommand(transcript: string): Promise<void>;
  setUserVoiceActivationPreference(enable: boolean): void;
  confirmPendingAction(): Promise<void>;
  cancelPendingAction(): void;
  setTranscriptionMethod(method: TranscriptionMethod): void;
  setAudioInputMode(mode: AudioInputMode): void;
  isEngineAvailable(method: TranscriptionMethod): boolean;
}

/**
 * @class VoiceCommandService
 * @implements {IVoiceCommandService}
 */
class VoiceCommandService implements IVoiceCommandService {
  private browserRecognition: SpeechRecognition | null = null;
  private advancedAudioProcessor: InstanceType<typeof AudioProcessorModule.AudioProcessor> | null = null;
  private mediaStreamForProcessor: MediaStream | null = null;
  private isSTTInitialized: boolean = false;
  private activeSttMethod: TranscriptionMethod | null = null;

  private voiceStore!: ReturnType<typeof useVoiceStore>;
  private dynamicUiStore!: ReturnType<typeof useDynamicUiStore>;
  private uiStore!: ReturnType<typeof useUiStore>;
  private chatStore!: ReturnType<typeof useChatStore>;
  private agentStore!: ReturnType<typeof useAgentStore>;
  private chatSettingsStore!: ReturnType<typeof useChatSettingsStore>;
  private router!: Router;
  private dynamicUIAgent!: DynamicUIAgentService;

  constructor(
    private apiSvc: IApiService,
    private uiInteractionSvc: IUiInteractionService
  ) {
    // Stores and router initialized in `initialize`
  }

  async initialize(): Promise<void> {
    if (this.isSTTInitialized) return;

    this.voiceStore = useVoiceStore();
    this.dynamicUiStore = useDynamicUiStore();
    this.uiStore = useUiStore();
    this.chatStore = useChatStore();
    this.agentStore = useAgentStore();
    this.chatSettingsStore = useChatSettingsStore();
    this.router = useRouter();
    this.dynamicUIAgent = useDynamicUIAgent();

    const storedPref = storageService.get<boolean>(StorageType.Local, VOICE_COMMANDS_ENABLED_KEY);
    this.voiceStore.setUserVoicePreference(storedPref ?? false);

    this.activeSttMethod = this.chatSettingsStore.currentTranscriptionMethod;

    if (this.activeSttMethod === TranscriptionMethod.WEB_SPEECH) {
      await this._initializeBrowserRecognition();
    }
    // AdvancedAudioProcessor for WHISPER_API will be initialized on demand in startListening

    this.isSTTInitialized = true;
    console.info(`[VoiceCommandService] Initialized. Preferred STT: ${this.activeSttMethod}`);

    watch(() => this.voiceStore.isEnabledByUser, (isEnabled) => {
      if (!isEnabled && this.voiceStore.isListening) this.stopListening();
    });

    watch(() => this.chatSettingsStore.currentTranscriptionMethod, async (newMethod) => {
      if (this.activeSttMethod !== newMethod) {
        this.stopListening(); // Stop current before switching
        this.activeSttMethod = newMethod;
        if (newMethod === TranscriptionMethod.WEB_SPEECH) {
          await this._initializeBrowserRecognition();
        } else {
          this._cleanupBrowserRecognition();
        }
        console.info(`[VoiceCommandService] Transcription method switched to: ${newMethod}`);
      }
    });

     watch(() => this.chatSettingsStore.currentAudioInputMode, (newMode) => {
        if (this.browserRecognition) {
            this.browserRecognition.continuous = newMode === AudioInputMode.CONTINUOUS_LISTENING;
        }
        if (this.advancedAudioProcessor) {
            // Your AudioProcessor might have a way to configure its VAD for continuous mode
            // For now, we handle restart logic in start/stop
        }
        if(this.voiceStore.isListening && newMode !== AudioInputMode.CONTINUOUS_LISTENING && this.activeSttMethod === TranscriptionMethod.WEB_SPEECH){
            this.stopListening();
        }
    });
  }

  private _cleanupBrowserRecognition(): void {
    if (this.browserRecognition) {
      this.browserRecognition.onstart = null;
      this.browserRecognition.onresult = null;
      this.browserRecognition.onerror = null;
      this.browserRecognition.onend = null;
      if (this.voiceStore.isListening) this.browserRecognition.abort(); // Abort if listening
      this.browserRecognition = null;
    }
  }
  private _cleanupAdvancedAudioProcessor(): async void {
    if (this.advancedAudioProcessor) {
        this.advancedAudioProcessor.removeAllListeners(); // Assuming EventEmitter style
        if(this.advancedAudioProcessor.isProcessing) this.advancedAudioProcessor.stop();
        await this.advancedAudioProcessor.dispose();
        this.advancedAudioProcessor = null;
    }
    if (this.mediaStreamForProcessor) {
        this.mediaStreamForProcessor.getTracks().forEach(track => track.stop());
        this.mediaStreamForProcessor = null;
    }
  }

  public isEngineAvailable(method: TranscriptionMethod): boolean {
      if (method === TranscriptionMethod.WEB_SPEECH) {
          return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
      }
      if (method === TranscriptionMethod.WHISPER_API) {
          return !!AudioProcessorModule; // Is our advanced client-side processor available?
      }
      return false;
  }


  private async _initializeBrowserRecognition(): Promise<void> {
    this._cleanupBrowserRecognition(); // Ensure any old instance is gone
    if (!this.isEngineAvailable(TranscriptionMethod.WEB_SPEECH)) {
        this.voiceStore.setError('Web Speech API not supported by this browser.');
        if (this.chatSettingsStore.currentTranscriptionMethod === TranscriptionMethod.WEB_SPEECH) {
            this.voiceStore.setUserVoicePreference(false);
        }
        return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.browserRecognition = new SpeechRecognitionAPI();
    this.browserRecognition.continuous = this.chatSettingsStore.currentAudioInputMode === AudioInputMode.CONTINUOUS_LISTENING;
    this.browserRecognition.interimResults = true;
    this.browserRecognition.lang = this.chatSettingsStore.currentLanguage || navigator.language || 'en-US';
    this._setupRecognitionEventListeners(); // This method was defined in previous SOTA version
  }

  private async _initializeAdvancedAudioProcessor(): Promise<boolean> {
    this._cleanupAdvancedAudioProcessor(); // Ensure any old instance is gone
    if (!AudioProcessorModule || !this.isEngineAvailable(TranscriptionMethod.WHISPER_API)) {
        this.voiceStore.setError('Advanced audio processing module unavailable for Whisper.');
        return false;
    }

    if (!this.mediaStreamForProcessor || this.mediaStreamForProcessor.getAudioTracks().every(t => t.readyState === 'ended')) {
        try {
            this.mediaStreamForProcessor = await navigator.mediaDevices.getUserMedia({ audio: {
                sampleRate: 16000, // Request specific sample rate if backend Whisper prefers it
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            } });
        } catch (err) {
            this.voiceStore.setError('Microphone access denied for advanced audio processing.');
            console.error('[VoiceCommandService] Mic access denied for AudioProcessor:', err);
            return false;
        }
    }

    try {
      const { AudioProcessor: AdvAudioProcessor } = AudioProcessorModule;
      const audioProcessorConfig: import('../../../backend/agentos/core/audio/AudioProcessor').WebAudioProcessorConfig = {
        sampleRate: 16000, // Whisper prefers 16kHz
        bufferSize: 4096, // Common buffer size
      };
      this.advancedAudioProcessor = new AdvAudioProcessor(
        audioProcessorConfig,
        { calibrationDurationMs: 3000, adaptationUpdateIntervalMs: 5000 }, // Example CalibrationConfig
        { sensitivity: 0.5, minSpeechDurationMs: 250, maxSilenceDurationMsInSpeech: 700 } // Example AdaptiveVADConfig
      );

      this.advancedAudioProcessor.on('speech_chunk_ready', this._handleSpeechChunkForWhisper.bind(this));
      this.advancedAudioProcessor.on('vad_error', (err: Error) => this.voiceStore.setError(`VAD Error: ${err.message}`));
      this.advancedAudioProcessor.on('processor:error', (err: Error) => this.voiceStore.setError(`Audio Processor Error: ${err.message}`));
      this.advancedAudioProcessor.on('speech_start', () => this.voiceStore.setStatus(SpeechRecognitionStatus.LISTENING)); // Update main status
      this.advancedAudioProcessor.on('speech_end', () => {
          // If not continuous, transition to processing or idle.
          // For continuous, VAD might keep emitting chunks.
          if(this.chatSettingsStore.currentAudioInputMode !== AudioInputMode.CONTINUOUS_LISTENING) {
              //this.voiceStore.setStatus(SpeechRecognitionStatus.PROCESSING); // Handled by _handleSpeechChunkForWhisper
          }
      });

      await this.advancedAudioProcessor.initialize(this.mediaStreamForProcessor);
      console.info('[VoiceCommandService] Advanced Audio Processor initialized for Whisper.');
      return true;
    } catch (error: any) {
      console.error('[VoiceCommandService] Failed to initialize AdvancedAudioProcessor:', error);
      this.voiceStore.setError(`Failed to setup advanced audio: ${error.message}`);
      await this._cleanupAdvancedAudioProcessor();
      return false;
    }
  }

  private async _handleSpeechChunkForWhisper(chunk: import('../../../backend/agentos/core/audio/AudioProcessor').SpeechAudioChunk): Promise<void> {
    if (!this.voiceStore.isEnabledByUser) return; // If user disabled while chunk was processing
    
    this.voiceStore.setStatus(SpeechRecognitionStatus.PROCESSING);
    this.voiceStore.setFeedbackMessage(this.uiStore.t('chat.transcribingWithWhisper'));

    try {
      // Convert Float32Array to WAV Blob for /api/speech endpoint
      const wavBlob = this._float32ToWavBlob(chunk.audioData, chunk.sampleRate);
      const formData = new FormData();
      formData.append('audio', wavBlob, `vad-chunk-${chunk.id}.wav`);
      // Your /api/speech might require language or other parameters
      // formData.append('language', this.chatSettingsStore.currentLanguage);

      const response = await this.apiSvc.post<{ transcription: string, duration?: number, cost?: number }>(
        WHISPER_STT_ENDPOINT_URL,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } } // Axios usually sets this with FormData
      );

      if (response.transcription && response.transcription.trim()) {
        const finalTranscript = this.voiceStore.appendToPendingTranscription(response.transcription.trim());
        this.voiceStore.setFinalTranscript(finalTranscript); // Update final transcript display
        
        // For continuous mode with advanced VAD, decide when to process the full pending transcript
        if (this.chatSettingsStore.currentAudioInputMode === AudioInputMode.CONTINUOUS_LISTENING) {
            // A silence detector (your backend/agentos/core/audio/SilenceDetector.ts logic adapted for client)
            // integrated with AudioProcessor would signal 'utterance_end'.
            // For now, let's assume an 'utterance_end' event from AudioProcessor or VAD.
            // Or, if VAD emits speech_end and it's truly the end of an utterance:
            if (chunk.vadResultAtEnd.isFinalUtterance) { // Assuming VADResult has this
                await this.processTranscriptAsCommand(finalTranscript);
                this.voiceStore.clearPendingTranscription();
            }
        } else { // For PTT-like behavior with advanced VAD
            await this.processTranscriptAsCommand(finalTranscript);
            this.voiceStore.clearPendingTranscription();
        }
      } else if (response.transcription === '' && this.voiceStore.pendingTranscription) {
        // Whisper might return empty if only silence was in the chunk, but we have pending text
        // This indicates end of utterance for continuous mode.
        if(this.chatSettingsStore.currentAudioInputMode === AudioInputMode.CONTINUOUS_LISTENING) {
             await this.processTranscriptAsCommand(this.voiceStore.pendingTranscription);
             this.voiceStore.clearPendingTranscription();
        }
      }
       // Keep listening if continuous mode
      if(this.chatSettingsStore.currentAudioInputMode === AudioInputMode.CONTINUOUS_LISTENING && this.voiceStore.isEnabledByUser) {
        this.voiceStore.setStatus(SpeechRecognitionStatus.LISTENING);
      } else {
        this.voiceStore.setStatus(SpeechRecognitionStatus.IDLE);
      }

    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('WHISPER_STT_FAILED', (err as Error).message || 'Whisper transcription failed.', err);
      this.voiceStore.setError(appError.message);
      console.error('[VoiceCommandService] Whisper STT failed:', appError);
      this.voiceStore.setStatus(SpeechRecognitionStatus.IDLE);
    }
  }

  public async startListening(): Promise<void> {
    if (!this.voiceStore.isEnabledByUser || this.voiceStore.isListening) {
        if (!this.voiceStore.isEnabledByUser) this.voiceStore.setError("Voice commands are disabled.");
        return;
    }
    if (!this.isSTTInitialized) await this.initialize();

    this.voiceStore.clearError(); // Clear previous errors

    if (this.activeSttMethod === TranscriptionMethod.WEB_SPEECH) {
      if (!this.browserRecognition) await this._initializeBrowserRecognition();
      if (this.browserRecognition && !this.voiceStore.isListening) {
        try {
          this.browserRecognition.lang = this.chatSettingsStore.currentLanguage || navigator.language || 'en-US';
          this.browserRecognition.start();
        } catch (e: any) {
          this.voiceStore.setError(`WebSpeech API Error: ${e.message}`);
          console.error('[VoiceCommandService] Error starting WebSpeech:', e);
        }
      }
    } else if (this.activeSttMethod === TranscriptionMethod.WHISPER_API) {
      if (!this.advancedAudioProcessor?.isInitialized) {
          const initialized = await this._initializeAdvancedAudioProcessor();
          if (!initialized) return;
      }
      if (this.advancedAudioProcessor && !this.advancedAudioProcessor.isProcessing) {
        await this.advancedAudioProcessor.start();
        // AudioProcessor itself should emit events that update voiceStore.status to LISTENING
      }
    }
  }

  public stopListening(): void {
    if (this.activeSttMethod === TranscriptionMethod.WEB_SPEECH && this.browserRecognition) {
      if(this.voiceStore.isListening) this.browserRecognition.stop();
    } else if (this.activeSttMethod === TranscriptionMethod.WHISPER_API && this.advancedAudioProcessor) {
      if(this.advancedAudioProcessor.isProcessing) this.advancedAudioProcessor.stop();
    }
    // Event handlers (onend) should set status to IDLE
    // Explicitly set if not relying on onend for some reason:
    // if (this.voiceStore.isListening) this.voiceStore.setStatus(SpeechRecognitionStatus.IDLE);
  }

  // ... (toggleListening, processTranscriptAsCommand, _executeIntent, confirm/cancel methods remain largely the same as SOTA version from 2 responses ago)
  // Ensure processTranscriptAsCommand calls the NLU_ENDPOINT_URL for intent parsing.

  public async processTranscriptAsCommand(transcript: string): Promise<void> {
    if (!transcript.trim()) return;
    this.voiceStore.setProcessingIntent(true);
    this.voiceStore.clearTranscripts();

    if (this.voiceStore.activeConfirmation) { /* ... handle confirmation ... */ }

    try {
      const currentRoute = this.router.currentRoute.value;
      const mainContentEl = document.getElementById('main-content') || document.body;
      const interactableElements = this.uiInteractionSvc.discoverInteractableElements(mainContentEl);

      const requestPayload: VoiceIntentParseRequest = {
        transcript,
        language: this.chatSettingsStore.currentLanguage || this.browserRecognition?.lang || navigator.language || 'en-US',
        currentView: currentRoute.name?.toString() || currentRoute.path,
        availableElements: interactableElements.map(el => ({
          id: el.id, label: el.label, role: el.role, type: el.type, actions: el.actions, currentValue: el.currentValue
        })),
        activePersonaId: this.agentStore.activePersonaId,
        currentTheme: this.uiStore.currentTheme,
      };

      const parsedIntent = await this.apiSvc.post<ParsedLLMIntent, VoiceIntentParseRequest>(
        NLU_ENDPOINT_URL,
        requestPayload
      );
      this.voiceStore.setLastParsedIntent(parsedIntent);
      await this._executeIntent(parsedIntent);
    } catch (err) { /* ... error handling ... */ }
    finally { this.voiceStore.setProcessingIntent(false); }
  }

  private async _executeIntent(parsedIntent: ParsedLLMIntent | null): Promise<void> {
    // ... (Implementation from SOTA version in response dated Friday, May 23, 2025 at 6:17:47 PM PDT) ...
    // This method uses uiInteractionService, router, stores, dynamicUIAgent.
    // Key addition: Call uiInteractionService.zoomElement for zoom intents.
    if (!parsedIntent) {
        this.voiceStore.setFeedbackMessage('No clear action identified.', 3000);
        return;
    }
    this.voiceStore.setFeedbackMessage(`Action: ${parsedIntent.intent}`, 1500);

    if (this.dynamicUIAgent.canExecute(parsedIntent.intent)) { // Check registered commands first
        this.dynamicUIAgent.executeCommand(parsedIntent.intent, parsedIntent.payload);
        return;
    }

    switch (parsedIntent.intent) {
        // ... (all cases from previous SOTA version) ...
        case 'ZOOM_ADJUST': // New case for zoom
            const { targetId, direction, amount } = parsedIntent.payload;
            // Default to main chat area if no specific targetId from LLM
            const zoomTarget = targetId || (this.mainChatAreaRef?.value ? 'mainChatArea' : undefined);
            if (zoomTarget) {
                // The UIInteractionService zoomElement needs the actual element or a discoverable ID.
                // If targetId is semantic like 'mainChatArea', map it to the ref or a data-voice-target.
                let elementToZoom: HTMLElement | string = zoomTarget;
                if (zoomTarget === 'mainChatArea' && this.mainChatAreaRef?.value) {
                    elementToZoom = this.mainChatAreaRef.value;
                    if (!elementToZoom.hasAttribute('data-voice-target')) { // Ensure it has one if using refs
                        elementToZoom.setAttribute('data-voice-target', 'main-chat-area-zoomable');
                    }
                }
                await this.uiInteractionSvc.zoomElement(elementToZoom, direction, amount);
            } else {
                 this.voiceStore.setFeedbackMessage('Could not determine what to zoom.', 3000);
            }
            break;
        // ... (other cases) ...
        default:
            console.warn('[VoiceCommandService] Unhandled LLM intent:', parsedIntent);
            this.voiceStore.setFeedbackMessage("I'm not sure how to perform that action yet.", 3000);
    }
  }


  public async confirmPendingAction(): Promise<void> { /* ... SOTA implementation ... */ }
  public cancelPendingAction(): void { /* ... SOTA implementation ... */ }
  public setTranscriptionMethod(method: TranscriptionMethod): void { this.chatSettingsStore.setTranscriptionMethod(method); }
  public setAudioInputMode(mode: AudioInputMode): void { this.chatSettingsStore.setAudioMode(mode); }


  // Helper to convert Float32Array to WAV Blob
  private _float32ToWavBlob(float32Array: Float32Array, sampleRate: number): Blob {
    // Based on standard WAV conversion logic
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    };

    writeString(0, 'RIFF');                                 // ChunkID
    view.setUint32(4, 36 + float32Array.length * 2, true);  // ChunkSize
    writeString(8, 'WAVE');                                 // Format
    writeString(12, 'fmt ');                                // Subchunk1ID
    view.setUint32(16, 16, true);                           // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);                            // AudioFormat (1 for PCM)
    view.setUint16(22, 1, true);                            // NumChannels (1 for mono)
    view.setUint32(24, sampleRate, true);                   // SampleRate
    view.setUint32(28, sampleRate * 2, true);               // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, 2, true);                            // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true);                           // BitsPerSample (16 bits)
    writeString(36, 'data');                                // Subchunk2ID
    view.setUint32(40, float32Array.length * 2, true);      // Subchunk2Size
    floatTo16BitPCM(view, 44, float32Array);

    return new Blob([view], { type: 'audio/wav' });
  }
   // Reference to mainChatAreaRef from HomeView (to be set if needed by specific commands)
    // This is a bit of a hack; ideally, interactions go through UIInteractionService based on IDs.
    // But for a global zoom controlled by HomeView itself, VoiceCommandService might need to call HomeView's method.
    // A better way is for HomeView to register its zoom methods with DynamicUIAgentService.
    private mainChatAreaRef: globalThis.Ref<HTMLElement | null> | null = null;
    public setMainChatAreaRef(ref: globalThis.Ref<HTMLElement | null>): void {
        this.mainChatAreaRef = ref;
    }
}

// Singleton instance
export const voiceCommandService: IVoiceCommandService = new VoiceCommandService(
  apiService,
  uiInteractionService
);