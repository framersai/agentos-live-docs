// File: frontend/src/components/voice-input/composables/modes/useVadMode.ts
/**
 * @file useVadMode.ts
 * @description Voice Activation Detection (VAD) mode implementation.
 * This mode listens for a wake word, then captures a command.
 *
 * @version 1.1.1
 * @updated 2025-06-05 - Implemented abstract member `requiresHandler`.
 * - Ensured VAD command timeout triggers audio feedback via error emission.
 */

import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';
import type { SttHandlerErrorPayload } from '../../types';

type VadPhase = 'idle' | 'listening-wake' | 'capturing-command';

export class VadMode extends BaseSttMode implements SttModePublicState {
  private phase = ref<VadPhase>('idle');
  private commandTimeoutTimer: number | null = null;
  private commandTranscriptBuffer = ref('');

  public readonly isActive: ComputedRef<boolean>;
  public readonly canStart: ComputedRef<boolean>;
  public readonly statusText: ComputedRef<string>;
  public readonly placeholderText: ComputedRef<string>;

  /**
   * @inheritdoc
   * @description VAD mode requires an STT handler.
   */
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
      if (this.context.isProcessingLLM.value && this.phase.value === 'idle') return 'VAD: Assistant busy';
      if (!this.context.micPermissionGranted.value && this.phase.value === 'idle') return 'VAD: Mic needed';
      switch (this.phase.value) {
        case 'listening-wake': return `VAD: Listening for "${primaryWakeWord.value}"`;
        case 'capturing-command': return 'VAD: Listening for command...';
        default: return `VAD: Say "${primaryWakeWord.value}"`;
      }
    });
    this.placeholderText = computed(() => {
      if (this.context.isProcessingLLM.value && this.phase.value === 'idle') return 'Assistant is processing...';
      if (!this.context.micPermissionGranted.value && this.phase.value === 'idle') return 'Microphone permission required for VAD.';
      switch (this.phase.value) {
        case 'listening-wake': return `Say "${primaryWakeWord.value}" to activate`;
        case 'capturing-command': return 'Listening for your command...';
        default: return `Say "${primaryWakeWord.value}" or type a message...`;
      }
    });
  }

  private get wakeWords(): readonly string[] {
    return this.context.settings.value.vadWakeWordsBrowserSTT || ['hey v', 'victoria'];
  }

  private get commandTimeoutMs(): number {
    return this.context.settings.value.vadSilenceTimeoutMs ?? 5000;
  }

  async start(): Promise<boolean> {
    if (!this.canStart.value) {
      console.warn('[VadMode] Cannot start VAD mode - conditions not met.');
      if (this.requiresHandler && !this.context.activeHandlerApi.value) {
         this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available for VAD mode.' });
      }
      return false;
    }
    this.phase.value = 'listening-wake';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.isListeningForWakeWord.value = true;
    this.context.sharedState.isProcessingAudio.value = true;

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(false);
      if (handlerStarted) {
        this.context.transcriptionDisplay.showInterimTranscript(`Listening for "${this.wakeWords[0]}"...`);
        console.log('[VadMode] Started listening for wake word.');
        return true;
      } else {
        console.error('[VadMode] STT handler failed to start for wake word listening.');
        await this.resetToIdleState('Failed to start VAD listener.');
        return false;
      }
    } catch (error: any) {
      this.handleError(error);
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.phase.value === 'idle') return;
    console.log(`[VadMode] Stopping VAD mode from phase: ${this.phase.value}`);
    await this.resetToIdleState();
  }

  public async handleWakeWordDetected(): Promise<void> {
    if (this.phase.value !== 'listening-wake') {
      console.warn(`[VadMode] Wake word detected but not in 'listening-wake' phase. Current phase: ${this.phase.value}`);
      return;
    }
    this.context.clearVadCommandTimeout(); // Clear manager's timeout if any
    this.clearCommandTimeout(); // Clear mode's own timeout
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.phase.value = 'capturing-command';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';

    this.context.playSound(this.context.audioFeedback.beepInSound.value);
    this.context.transcriptionDisplay.showWakeWordDetected();
    this.context.toast?.add({ type: 'info', title: 'Wake Word Detected!', message: `Listening for your command...`, duration: 2000 });

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(true);
      if (handlerStarted) {
        this.startCommandTimeout();
      } else {
        this.context.transcriptionDisplay.showError('Could not start command listener.', 2500);
        await this.returnToWakeListening('STT handler failed for command capture phase.');
      }
    } catch (error: any) {
      this.context.transcriptionDisplay.showError('Error starting command listener.', 2500);
      await this.returnToWakeListening(error.message || 'Error during command capture transition.');
    }
  }

  handleTranscription(text: string): void {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (this.phase.value === 'capturing-command') {
      this.commandTranscriptBuffer.value = trimmedText;
      this.context.sharedState.pendingTranscript.value = this.commandTranscriptBuffer.value;
      this.context.transcriptionDisplay.showInterimTranscript(this.commandTranscriptBuffer.value);
      this.sendCommandAndReturnToWake();
    } else if (this.phase.value === 'listening-wake') {
      const lowerText = trimmedText.toLowerCase();
      const detectedWakeWord = this.wakeWords.find(word => lowerText.includes(word.toLowerCase()));
      if (detectedWakeWord) {
        console.log(`[VadMode] Wake word "${detectedWakeWord}" detected in final transcript during wake listening phase.`);
        this.context.emit('wake-word-detected'); // Signal to SttManager
      }
    }
  }

  public handleInterimTranscript(text: string): void {
    if (this.phase.value === 'capturing-command') {
      this.context.sharedState.pendingTranscript.value = text.trim();
      this.context.transcriptionDisplay.showInterimTranscript(text.trim());
    }
  }

  private sendCommandAndReturnToWake(): void {
    this.clearCommandTimeout();
    const commandText = this.commandTranscriptBuffer.value.trim();
    if (!commandText) {
      this.returnToWakeListening('No command captured after wake word.');
      return;
    }

    this.emitTranscription(commandText);
    this.context.playSound(this.context.audioFeedback.beepOutSound.value);

    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';

    setTimeout(async () => {
      await this.returnToWakeListening();
    }, 300);
  }

  private startCommandTimeout(): void {
    this.clearCommandTimeout();
    this.commandTimeoutTimer = window.setTimeout(async () => {
      console.log('[VadMode] VAD Command capture timed out.');
       // Emit specific error that SttManager can use to trigger beepOut via handleError
      this.handleError({
            type: 'recognition',
            code: 'vad-command-timeout', // This code should be recognized by manager/error handler
            message: 'No command speech detected after wake word (VAD timeout).',
            fatal: false
      });
      // No need to call returnToWakeListening here, handleError will manage state transition.
    }, this.commandTimeoutMs);
  }

  private clearCommandTimeout(): void {
    if (this.commandTimeoutTimer) clearTimeout(this.commandTimeoutTimer);
    this.commandTimeoutTimer = null;
    this.context.clearVadCommandTimeout();
  }

  private async returnToWakeListening(reason: string = "Returning to wake listening"): Promise<void> {
    console.log(`[VadMode] ${reason}`);
    this.clearCommandTimeout();
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';

    if (this.context.activeHandlerApi.value && (this.phase.value === 'capturing-command' || this.phase.value === 'listening-wake')) {
        await this.context.activeHandlerApi.value.stopListening(true);
    }

    this.phase.value = 'idle';
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    if (this.isBlocked()) {
      if (reason && reason !== "Returning to wake listening") this.context.transcriptionDisplay.showError(reason, 2000);
      else this.context.transcriptionDisplay.clearTranscription();
      console.warn('[VadMode] Cannot return to wake listening: mode is blocked.');
      return;
    }
    await this.start();
  }

  private async resetToIdleState(errorMessage?: string): Promise<void> {
    this.clearCommandTimeout();
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

    console.error(`[VadMode] Error in phase ${this.phase.value}:`, errorPayload.message, `(Code: ${errorPayload.code || 'N/A'})`);

    if (errorPayload.code === 'vad-command-timeout') {
        this.context.playSound(this.context.audioFeedback.beepOutSound.value); // Play specific timeout sound
        this.context.transcriptionDisplay.showVadTimeout();
    } else if (errorPayload.code !== 'no-speech' && errorPayload.code !== 'aborted' && !errorPayload.message.includes('aborted by the user')) {
        this.context.transcriptionDisplay.showError(errorPayload.message, 3000);
    }

    this.context.emit('voice-input-error', errorPayload);

    if (this.phase.value === 'capturing-command' && !this.isBlocked() && !errorPayload.fatal) {
      this.returnToWakeListening(`Error during command: ${errorPayload.message}`);
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