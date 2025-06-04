// File: frontend/src/components/voice-input/composables/modes/usePttMode.ts
/**
 * @file usePttMode.ts
 * @description Push-to-Talk mode implementation.
 * Handles PTT-specific logic, state, and interactions by extending BaseSttMode.
 *
 * Revision:
 * - Implemented isActive, canStart, statusText, placeholderText as public readonly ComputedRefs.
 * - Removed SttModeState import and initializeState method.
 * - Changed internal access from `this.state.prop.value` to `this.prop.value` (referring to the new public computeds).
 * - Removed unused 'watch' import.
 */

import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';

/**
 * @class PttMode
 * @extends BaseSttMode
 * @implements SttModePublicState
 * @description Implements Push-to-Talk STT mode logic.
 */
export class PttMode extends BaseSttMode implements SttModePublicState {
  private finalTranscript = ref('');
  private isRecordingInternally = ref(false); // Internal reactive state for recording

  // Public reactive state implementation
  /** @inheritdoc */
  public readonly isActive: ComputedRef<boolean>;
  /** @inheritdoc */
  public readonly canStart: ComputedRef<boolean>;
  /** @inheritdoc */
  public readonly statusText: ComputedRef<string>;
  /** @inheritdoc */
  public readonly placeholderText: ComputedRef<string>;

  /**
   * @constructor
   * @param {SttModeContext} context - The context object providing dependencies.
   */
  constructor(context: SttModeContext) {
    super(context);

    // Initialize public state properties as computeds
    this.isActive = computed(() => this.isRecordingInternally.value);
    this.canStart = computed(() => !this.isBlocked() && !this.isRecordingInternally.value);
    this.statusText = computed(() =>
      this.isRecordingInternally.value ? 'PTT: Recording...' : 'PTT: Ready'
    );
    this.placeholderText = computed(() =>
      this.isRecordingInternally.value ? 'Release to send transcript' : 'Hold mic button to record audio'
    );
  }

  /** @inheritdoc */
  async start(): Promise<boolean> {
    // Use the public computed 'canStart' directly
    if (!this.canStart.value) {
      console.warn('[PttMode] Cannot start - blocked or already active.');
      if (!this.context.activeHandlerApi.value) {
          this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available.' });
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
        this.context.playSound(this.context.audioFeedback.beepInSound.value); // Play start beep
        return true;
      } else {
        console.error('[PttMode] Failed to start STT handler.');
        this.isRecordingInternally.value = false; // Revert state
        this.context.sharedState.isProcessingAudio.value = false;
        this.context.transcriptionDisplay.showError('Failed to start PTT.', 2000);
        return false;
      }
    } catch (error: any) {
      this.isRecordingInternally.value = false; // Revert state on error
      this.context.sharedState.isProcessingAudio.value = false;
      this.handleError(error);
      return false;
    }
  }

  /** @inheritdoc */
  async stop(): Promise<void> {
    if (!this.isRecordingInternally.value) return;

    this.isRecordingInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    try {
      await this.context.activeHandlerApi.value?.stopListening(false);

      if (this.finalTranscript.value.trim()) {
        this.emitTranscription(this.finalTranscript.value);
        this.context.playSound(this.context.audioFeedback.beepOutSound.value); // Play success beep
        this.context.transcriptionDisplay.showSent(this.finalTranscript.value.trim());
      } else {
        // Play a different sound or show different feedback if no speech was captured
        this.context.playSound(this.context.audioFeedback.beepOutSound.value); // Or a "no-speech" specific sound
        this.context.transcriptionDisplay.showError('No speech detected.', 1500);
      }
      this.finalTranscript.value = ''; // Clear transcript after processing
      this.context.sharedState.pendingTranscript.value = '';

    } catch (error: any) {
      this.handleError(error);
    }
  }

  /** @inheritdoc */
  handleTranscription(text: string): void {
    // PTT mode typically accumulates a single final transcript during one recording session.
    // The STT handler should ideally provide one consolidated final result upon stop.
    // If it sends multiple final chunks, this will append them.
    if (this.isRecordingInternally.value) {
      this.finalTranscript.value = text; // Assuming STT handler sends full final transcript for PTT
      this.context.sharedState.pendingTranscript.value = this.finalTranscript.value;
      this.context.transcriptionDisplay.showInterimTranscript(this.finalTranscript.value);
    }
  }

  /**
   * @method handleInterimTranscript
   * @description Processes an interim transcription segment for display purposes.
   * @param {string} text - The interim transcribed text.
   */
  public handleInterimTranscript(text: string): void {
    if (this.isRecordingInternally.value) {
      this.context.sharedState.pendingTranscript.value = text.trim();
      this.context.transcriptionDisplay.showInterimTranscript(text.trim());
    }
  }


  /** @inheritdoc */
  handleError(error: any): void {
    console.error('[PttMode] Error:', error);
    this.isRecordingInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    this.context.transcriptionDisplay.showError(error.message || 'PTT recording failed.', 3000);
    this.context.emit('error', {
      type: 'ptt_mode_error',
      message: error.message || 'PTT recording failed.',
      code: error.code,
    });
  }

  /** @inheritdoc */
  cleanup(): void {
    console.log('[PttMode] Cleanup');
    // Ensure STT is stopped if it was active.
    if (this.isRecordingInternally.value) {
       this.context.activeHandlerApi.value?.stopListening(true); // Force abort
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