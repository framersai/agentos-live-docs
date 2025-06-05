// File: frontend/src/components/voice-input/composables/modes/usePttMode.ts
/**
 * @file usePttMode.ts
 * @description Push-to-Talk mode implementation.
 * Handles PTT-specific logic, state, and interactions by extending BaseSttMode.
 *
 * @version 1.1.1
 * @updated 2025-06-05 - Implemented abstract member `requiresHandler`.
 */

import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';
import type { SttHandlerErrorPayload } from '../../types';

/**
 * @class PttMode
 * @extends BaseSttMode
 * @implements SttModePublicState
 * @description Implements Push-to-Talk STT mode logic.
 * This mode activates STT when the user presses and holds a button and stops when released.
 */
export class PttMode extends BaseSttMode implements SttModePublicState {
  /** @property {ref<string>} finalTranscript - Stores the final transcript for the current PTT session. */
  private finalTranscript = ref('');
  /** @property {ref<boolean>} isRecordingInternally - Internal reactive state indicating if recording is active. */
  private isRecordingInternally = ref(false);

  // --- SttModePublicState Implementation ---
  /** @inheritdoc */
  public readonly isActive: ComputedRef<boolean>;
  /** @inheritdoc */
  public readonly canStart: ComputedRef<boolean>;
  /** @inheritdoc */
  public readonly statusText: ComputedRef<string>;
  /** @inheritdoc */
  public readonly placeholderText: ComputedRef<string>;

  /**
   * @inheritdoc
   * @description PTT mode requires an STT handler to function.
   */
  public readonly requiresHandler: boolean = true;

  /**
   * @constructor
   * @param {SttModeContext} context - The context object providing dependencies and shared state.
   */
  constructor(context: SttModeContext) {
    super(context);

    this.isActive = computed(() => this.isRecordingInternally.value);
    // Accessing context.isProcessingLLM.value (Ref) and context.micPermissionGranted.value (ComputedRef) correctly
    this.canStart = computed(() =>
        !this.context.isProcessingLLM.value &&
        this.context.micPermissionGranted.value &&
        (this.requiresHandler ? !!this.context.activeHandlerApi.value : true) && // Check handler if required
        !this.isRecordingInternally.value
    );
    this.statusText = computed(() => {
      if (this.context.isProcessingLLM.value && !this.isRecordingInternally.value) return 'PTT: Assistant busy';
      if (!this.context.micPermissionGranted.value) return 'PTT: Mic needed';
      return this.isRecordingInternally.value ? 'PTT: Recording...' : 'PTT: Hold to talk';
    });
    this.placeholderText = computed(() => {
      if (this.context.isProcessingLLM.value && !this.isRecordingInternally.value) return 'Assistant is processing...';
       if (!this.context.micPermissionGranted.value) return 'Microphone permission required for PTT.';
      return this.isRecordingInternally.value ? 'Release to send transcript' : 'Hold mic button to record audio';
    });
  }

  /** @inheritdoc */
  async start(): Promise<boolean> {
    if (!this.canStart.value) {
      console.warn('[PttMode] Cannot start PTT mode - conditions not met.');
      // Specific toasts are helpful for the user
      if (this.requiresHandler && !this.context.activeHandlerApi.value) {
         this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available for PTT mode.' });
      } else if (this.context.isProcessingLLM.value) {
         this.context.toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot start PTT while assistant is processing.' });
      } else if (!this.context.micPermissionGranted.value) {
         this.context.toast?.add({ type: 'error', title: 'Microphone Access', message: 'PTT mode requires microphone permission.' });
      }
      return false;
    }

    this.finalTranscript.value = '';
    this.isRecordingInternally.value = true;
    this.context.sharedState.isProcessingAudio.value = true;
    this.context.transcriptionDisplay.showListening();

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(false);
      if (handlerStarted) {
        this.context.playSound(this.context.audioFeedback.beepInSound.value);
        console.log('[PttMode] PTT recording started.');
        return true;
      } else {
        console.error('[PttMode] STT handler failed to start for PTT mode.');
        this.isRecordingInternally.value = false;
        this.context.sharedState.isProcessingAudio.value = false;
        this.context.transcriptionDisplay.showError('Failed to start PTT recording.', 2000);
        return false;
      }
    } catch (error: any) {
      this.isRecordingInternally.value = false;
      this.context.sharedState.isProcessingAudio.value = false;
      this.handleError(error);
      return false;
    }
  }

  /** @inheritdoc */
  async stop(): Promise<void> {
    if (!this.isRecordingInternally.value) {
      return;
    }

    console.log('[PttMode] Stopping PTT recording...');
    this.isRecordingInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    try {
      await this.context.activeHandlerApi.value?.stopListening(false);

      if (this.finalTranscript.value.trim()) {
        this.emitTranscription(this.finalTranscript.value); // emitTranscription handles showSent
        this.context.playSound(this.context.audioFeedback.beepOutSound.value);
      } else {
        this.context.playSound(this.context.audioFeedback.beepOutSound.value);
        this.context.transcriptionDisplay.showError('No speech detected in PTT.', 1500);
      }
      this.finalTranscript.value = '';
      this.context.sharedState.pendingTranscript.value = '';

    } catch (error: any) {
      this.handleError(error);
    } finally {
        console.log('[PttMode] PTT recording stopped.');
    }
  }

  /** @inheritdoc */
  handleTranscription(text: string): void {
    console.log(`[PttMode] Received final transcription from handler: "${text}"`);
    this.finalTranscript.value = text;
    this.context.sharedState.pendingTranscript.value = text.trim(); // Update for UI consistency
    this.context.transcriptionDisplay.showInterimTranscript(text.trim()); // Show as interim until stop
  }

  /**
   * @method handleInterimTranscript
   * @description Processes an interim transcription segment for display purposes during PTT recording.
   * @param {string} text - The interim transcribed text.
   */
  public handleInterimTranscript(text: string): void {
    if (this.isRecordingInternally.value) {
      this.context.sharedState.pendingTranscript.value = text.trim();
      this.context.transcriptionDisplay.showInterimTranscript(text.trim());
    }
  }

  /** @inheritdoc */
  handleError(error: Error | SttHandlerErrorPayload): void {
    const errorPayload = ('type' in error && 'message' in error) ? error : {
        type: 'ptt_mode_error',
        message: error.message || 'PTT recording failed.',
        code: (error as any).code || (error as Error).name,
        fatal: false,
    } as SttHandlerErrorPayload;

    console.error('[PttMode] Error:', errorPayload.message, `(Code: ${errorPayload.code || 'N/A'})`);

    this.isRecordingInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    this.context.transcriptionDisplay.showError(errorPayload.message, 3000);
    this.context.emit('voice-input-error', errorPayload); // Use manager's expected event name
  }

  /** @inheritdoc */
  cleanup(): void {
    console.log('[PttMode] Cleanup initiated.');
    if (this.isRecordingInternally.value) {
        this.context.activeHandlerApi.value?.stopAll(true);
    }
    this.finalTranscript.value = '';
    this.isRecordingInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    this.context.sharedState.pendingTranscript.value = '';
    this.context.transcriptionDisplay.clearTranscription();
  }
}

/**
 * @function usePttMode
 * @description Factory function to create a `PttMode` instance.
 * @param {SttModeContext} context - The context for the PTT mode.
 * @returns {PttMode} A new instance of PttMode.
 */
export function usePttMode(context: SttModeContext): PttMode {
  return new PttMode(context);
}