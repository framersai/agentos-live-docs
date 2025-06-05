// File: frontend/src/components/voice-input/composables/modes/useVadMode.ts
/**
 * @file useVadMode.ts
 * @description Voice Activation Detection (VAD) mode implementation.
 * This mode listens for a wake word, then captures a command.
 *
 * @version 1.2.0
 * @updated 2025-06-05 - Adapted to BrowserSpeechHandler's refined command capture.
 * - Relies more on handler for command finalization (pause/max duration).
 * - Ensured manual stop correctly resets state.
 */

import { ref, computed, readonly } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';
import type { SttHandlerErrorPayload } from '../../types';

type VadPhase = 'idle' | 'listening-wake' | 'capturing-command';

export class VadMode extends BaseSttMode implements SttModePublicState {
  private phase = ref<VadPhase>('idle');
  // commandTimeoutTimer is now primarily managed within BrowserSpeechHandler for command capture phase (pause detection, max duration)
  // VadMode's own timeout (via SttManager context) can act as a failsafe or for manager-level logic if needed.
  private commandTranscriptBuffer = ref(''); // Still useful for accumulating if handler sends final chunks

  public readonly isActive: ComputedRef<boolean>;
  public readonly canStart: ComputedRef<boolean>;
  public readonly statusText: ComputedRef<string>;
  public readonly placeholderText: ComputedRef<string>;
  public readonly requiresHandler: boolean = true;

  constructor(context: SttModeContext) {
    super(context);

    const primaryWakeWord = computed(() => (this.context.settings.value.vadWakeWordsBrowserSTT?.[0] || 'Hey V').toUpperCase());

    this.isActive = computed(() => this.phase.value !== 'idle');
    this.canStart = computed(() =>
        !this.context.isProcessingLLM.value &&
        this.context.micPermissionGranted.value &&
        (this.requiresHandler ? !!this.context.activeHandlerApi.value : true) &&
        this.phase.value === 'idle'
    );
    this.statusText = computed(() => {
      if (this.context.isProcessingLLM.value && this.phase.value === 'idle' && !this.context.isAwaitingVadCommandResult.value) return 'VAD: Assistant busy';
      if (!this.context.micPermissionGranted.value && this.phase.value === 'idle') return 'VAD: Mic needed';
      switch (this.phase.value) {
        case 'listening-wake': return `VAD: Listening for "${primaryWakeWord.value}"`;
        case 'capturing-command': return 'VAD: Listening for command...';
        default: return `VAD: Say "${primaryWakeWord.value}"`;
      }
    });
    this.placeholderText = computed(() => { // This will be overridden by VoiceInput.vue's logic for VAD/PTT
      if (this.context.isProcessingLLM.value && this.phase.value === 'idle' && !this.context.isAwaitingVadCommandResult.value) return 'Assistant is processing...';
      if (!this.context.micPermissionGranted.value && this.phase.value === 'idle') return 'Microphone permission required for VAD.';
      switch (this.phase.value) {
        case 'listening-wake': return `Say "${primaryWakeWord.value}" to activate`;
        case 'capturing-command': return 'Listening for your command...';
        default: return `Say "${primaryWakeWord.value}" or type a message...`;
      }
    });
  }

  private get wakeWords(): readonly string[] { // Ensure this uses the actual settings object
    return this.context.settings.value.vadWakeWordsBrowserSTT || ['hey v', 'victoria'];
  }

  async start(): Promise<boolean> {
    if (!this.canStart.value) {
      console.warn('[VadMode] Cannot start VAD mode - conditions not met.');
      // Toast messages for specific block reasons
      if (this.requiresHandler && !this.context.activeHandlerApi.value) {
         this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available for VAD.' });
      } else if (this.context.isProcessingLLM.value && !this.context.isAwaitingVadCommandResult.value) {
          this.context.toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot start VAD now.' });
      } else if (!this.context.micPermissionGranted.value) {
          this.context.toast?.add({ type: 'error', title: 'Microphone Access', message: 'VAD mode requires microphone permission.' });
      }
      return false;
    }
    this.phase.value = 'listening-wake';
    this.commandTranscriptBuffer.value = ''; // Clear any old command
    this.context.sharedState.isListeningForWakeWord.value = true;
    this.context.sharedState.isProcessingAudio.value = true; // General audio processing active

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(false); // Start listening for wake word
      if (handlerStarted) {
        this.context.transcriptionDisplay.showInterimTranscript(`Listening for "${this.wakeWords[0]}"...`);
        console.log('[VadMode] Started. Phase: listening-wake.');
        return true;
      } else {
        await this.resetToIdleState('STT handler failed to start for wake word.');
        return false;
      }
    } catch (error: any) {
      this.handleError(error);
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.phase.value === 'idle') return;
    console.log(`[VadMode] Stop requested. Current phase: ${this.phase.value}`);
    await this.resetToIdleState('VAD mode stopped by user or system.');
  }

  public async handleWakeWordDetected(): Promise<void> {
    if (this.phase.value !== 'listening-wake') {
      console.warn(`[VadMode] Wake word detected but not in 'listening-wake' phase. Phase: ${this.phase.value}`);
      return;
    }
    this.context.clearVadCommandTimeout(); // Clear manager's overall VAD command timeout
    // No internal VadMode timer to clear here, handler manages its own timeouts for command capture now

    this.context.sharedState.isListeningForWakeWord.value = false;
    this.phase.value = 'capturing-command';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';

    this.context.playSound(this.context.audioFeedback.beepInSound.value);
    this.context.transcriptionDisplay.showWakeWordDetected();
    // Toast is optional, status bar usually indicates this
    // this.context.toast?.add({ type: 'info', title: 'Wake Word Detected!', message: `Listening for command...`, duration: 2000 });

    try {
      // Tell handler to start listening for command (forVadCommandCapture = true)
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(true);
      if (!handlerStarted) {
        this.context.transcriptionDisplay.showError('Could not start command listener.', 2500);
        await this.returnToWakeListening('STT handler failed for command capture.');
      } else {
        console.log('[VadMode] Transitioned to command capture. Handler is managing capture timing.');
      }
    } catch (error: any) {
      this.context.transcriptionDisplay.showError('Error starting command listener.', 2500);
      await this.returnToWakeListening(error.message || 'Error in command capture transition.');
    }
  }

  handleTranscription(text: string): void {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (this.phase.value === 'capturing-command') {
      // BrowserSpeechHandler (with continuous=true for command) should manage accumulation
      // and send the full final command.
      console.log(`[VadMode] Final command transcript received: "${trimmedText}"`);
      this.commandTranscriptBuffer.value = trimmedText; // Store it
      this.emitTranscription(this.commandTranscriptBuffer.value); // Emit immediately
      this.context.playSound(this.context.audioFeedback.beepOutSound.value);
      // UI state (pending transcript) should be cleared by the handler or after emission.
      this.context.sharedState.pendingTranscript.value = '';
      this.commandTranscriptBuffer.value = ''; // Clear buffer

      // After sending command, return to listening for wake word
      this.returnToWakeListeningAfterDelay();
    } else if (this.phase.value === 'listening-wake') {
      // This path is less likely if BrowserSpeechHandler's wake word detection is robust.
      // It's a fallback.
      const lowerText = trimmedText.toLowerCase();
      const detectedWakeWord = this.wakeWords.find(word => lowerText.includes(word.toLowerCase()));
      if (detectedWakeWord) {
        this.context.emit('wake-word-detected'); // Let SttManager trigger handleWakeWordDetected
      }
    }
  }

  public handleInterimTranscript(text: string): void {
    if (this.phase.value === 'capturing-command') {
      // BrowserSpeechHandler should be providing the full accumulated interim as `pendingTranscript`
      this.context.sharedState.pendingTranscript.value = text.trim(); // Update shared state for UI
      this.context.transcriptionDisplay.showInterimTranscript(text.trim());
    }
  }

  private async returnToWakeListeningAfterDelay(delayMs: number = 300) {
    setTimeout(async () => { await this.returnToWakeListening(); }, delayMs);
  }

  private async returnToWakeListening(reason: string = "VAD: Returning to wake listening"): Promise<void> {
    console.log(`[VadMode] ${reason}`);
    this.context.clearVadCommandTimeout(); // Clear manager's overall VAD command timeout
    // No internal VadMode timer to clear here related to command capture phase duration

    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';

    // Stop current handler activity (e.g., command capture) before restarting for wake word
    if (this.context.activeHandlerApi.value && this.phase.value !== 'idle') {
        // Ensure handler is stopped if it was in command capture or wake listening
        await this.context.activeHandlerApi.value.stopListening(true); // Abort current
    }

    this.phase.value = 'idle'; // Temporarily to allow 'start' conditions
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    if (this.isBlocked()) {
      if (reason && reason !== "VAD: Returning to wake listening") this.context.transcriptionDisplay.showError(reason, 2000);
      else this.context.transcriptionDisplay.clearTranscription();
      console.warn('[VadMode] Blocked from returning to wake listening.');
      return;
    }
    // Re-start VAD mode, which will set phase to 'listening-wake'
    await this.start();
  }

  private async resetToIdleState(errorMessage?: string): Promise<void> {
    this.context.clearVadCommandTimeout();
    // No internal VadMode command timer to clear here.
    if (this.context.activeHandlerApi.value && this.phase.value !== 'idle') {
      await this.context.activeHandlerApi.value.stopAll(true);
    }
    this.phase.value = 'idle';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    if (errorMessage) this.context.transcriptionDisplay.showError(errorMessage, 2500);
    else this.context.transcriptionDisplay.clearTranscription();
  }

  handleError(error: Error | SttHandlerErrorPayload): void {
    const errorPayload = ('type' in error && 'message' in error) ? error : {
        type: 'vad_mode_error',
        message: error.message || 'An unknown error occurred in VAD mode.',
        code: (error as any).code || (error as Error).name,
        fatal: false,
    } as SttHandlerErrorPayload;

    console.error(`[VadMode] Error received. Phase: ${this.phase.value}. Code: ${errorPayload.code}. Message: ${errorPayload.message}`);

    // Play beep-out sound if it's a VAD command timeout signaled by the handler
    if (errorPayload.code === 'vad-command-timeout') {
        this.context.playSound(this.context.audioFeedback.beepOutSound.value);
        this.context.transcriptionDisplay.showVadTimeout();
    } else if (errorPayload.code !== 'no-speech' && errorPayload.code !== 'aborted' && !errorPayload.message.includes('aborted by the user')) {
        this.context.transcriptionDisplay.showError(errorPayload.message, 3000);
    }

    this.context.emit('voice-input-error', errorPayload);

    // If error occurred during command capture, try to return to wake listening.
    // Otherwise, or if fatal, reset to idle.
    if (this.phase.value === 'capturing-command' && !this.isBlocked() && !errorPayload.fatal) {
      this.returnToWakeListening(`Error during command capture: ${errorPayload.message.substring(0,50)}`);
    } else {
      this.resetToIdleState();
    }
  }

  cleanup(): void {
    console.log('[VadMode] Cleanup initiated.');
    this.resetToIdleState();
  }

  public getCurrentPhase(): VadPhase { return this.phase.value; }
}

export function useVadMode(context: SttModeContext): VadMode {
  return new VadMode(context);
}