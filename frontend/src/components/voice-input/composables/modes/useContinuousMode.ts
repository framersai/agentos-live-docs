// File: frontend/src/components/voice-input/composables/modes/useContinuousMode.ts
/**
 * @file useContinuousMode.ts
 * @description Continuous listening mode implementation.
 * This mode starts listening upon activation and automatically sends transcripts
 * based on speech pauses or segment limits.
 *
 * @version 1.1.1
 * @updated 2025-06-05 - Implemented abstract member `requiresHandler`.
 */

import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';
import type { SttHandlerErrorPayload } from '../../types';

/**
 * @class ContinuousMode
 * @extends BaseSttMode
 * @implements SttModePublicState
 * @description Implements the continuous speech-to-text listening mode.
 */
export class ContinuousMode extends BaseSttMode implements SttModePublicState {
  private continuousTranscriptBuffer = ref('');
  private isListeningInternally = ref(false);
  private autoSendTimer: number | null = null;
  private countdownTimer: number | null = null;
  private countdownValue = ref(0);

  public readonly isActive: ComputedRef<boolean>;
  public readonly canStart: ComputedRef<boolean>;
  public readonly statusText: ComputedRef<string>;
  public readonly placeholderText: ComputedRef<string>;

  /**
   * @inheritdoc
   * @description Continuous mode requires an STT handler.
   */
  public readonly requiresHandler: boolean = true;

  constructor(context: SttModeContext) {
    super(context);

    this.isActive = computed(() => this.isListeningInternally.value || this.countdownValue.value > 0);
    this.canStart = computed(() =>
        !this.context.isProcessingLLM.value &&
        this.context.micPermissionGranted.value &&
        (this.requiresHandler ? !!this.context.activeHandlerApi.value : true) &&
        !this.isListeningInternally.value && this.countdownValue.value === 0
    );
    this.statusText = computed(() => {
      if (this.context.isProcessingLLM.value && !this.isListeningInternally.value) return 'Continuous: Assistant busy';
      if (!this.context.micPermissionGranted.value) return 'Continuous: Mic needed';
      if (this.countdownValue.value > 0) {
        return `Continuous: Sending in ${Math.ceil(this.countdownValue.value / 1000)}s...`;
      }
      return this.isListeningInternally.value ? 'Continuous: Listening...' : 'Continuous: Ready';
    });
    this.placeholderText = computed(() => {
      if (this.context.isProcessingLLM.value && !this.isListeningInternally.value) return 'Assistant is processing...';
      if (!this.context.micPermissionGranted.value) return 'Microphone permission required for Continuous mode.';
      return this.isListeningInternally.value
        ? 'Listening continuously... (text input disabled)'
        : 'Continuous mode ready. Click mic to start.';
    });
  }

  private get autoSendEnabled(): boolean {
    return this.context.settings.value.continuousModeAutoSend ?? true;
  }

  private get pauseTimeoutMs(): number {
    return this.context.settings.value.continuousModePauseTimeoutMs ?? 2500;
  }

  private get sendDelayMs(): number {
    return this.context.settings.value.continuousModeSilenceSendDelayMs ?? 1000;
  }

  async start(): Promise<boolean> {
    if (!this.canStart.value) {
      console.warn('[ContinuousMode] Cannot start - conditions not met.');
      if (this.requiresHandler && !this.context.activeHandlerApi.value) {
         this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available.' });
      }
      return false;
    }

    this.clearTimers();
    this.continuousTranscriptBuffer.value = '';
    this.isListeningInternally.value = true;
    this.context.sharedState.isProcessingAudio.value = true;

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(false);
      if (handlerStarted) {
        console.log('[ContinuousMode] STT handler started successfully.');
        this.context.transcriptionDisplay.showListening();
        return true;
      } else {
        console.error('[ContinuousMode] Failed to start STT handler.');
        this.isListeningInternally.value = false;
        this.context.sharedState.isProcessingAudio.value = false;
        this.context.transcriptionDisplay.showError('Failed to start continuous STT.', 2000);
        return false;
      }
    } catch (error: any) {
      this.handleError(error);
      return false;
    }
  }

  async stop(): Promise<void> {
    if (!this.isListeningInternally.value && !this.autoSendTimer && !this.countdownTimer) {
      return;
    }
    console.log('[ContinuousMode] Stopping continuous listening...');
    this.clearTimers();
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    try {
      await this.context.activeHandlerApi.value?.stopListening(false);
      if (this.autoSendEnabled && this.continuousTranscriptBuffer.value.trim()) {
        this.sendBufferedTranscript();
      } else {
        this.continuousTranscriptBuffer.value = '';
        this.context.sharedState.pendingTranscript.value = '';
      }
      this.context.transcriptionDisplay.clearTranscription();
    } catch (error: any) {
      this.handleError(error);
    } finally {
        console.log('[ContinuousMode] Continuous listening stopped.');
    }
  }

  handleTranscription(text: string): void {
    if (!this.isListeningInternally.value && !(this.autoSendEnabled && this.countdownValue.value > 0)) {
        console.log('[ContinuousMode] Received final transcript while not actively listening and no pending send, ignoring:', text);
        return;
    }
    const trimmedText = text.trim();
    if (trimmedText) {
      this.continuousTranscriptBuffer.value += (this.continuousTranscriptBuffer.value ? ' ' : '') + trimmedText;
      this.context.sharedState.pendingTranscript.value = this.continuousTranscriptBuffer.value;
      this.context.transcriptionDisplay.showInterimTranscript(this.continuousTranscriptBuffer.value);

      if (this.isListeningInternally.value) {
        this.resetAutoSendTimer();
      } else if (this.autoSendEnabled && this.continuousTranscriptBuffer.value.trim() && this.countdownValue.value <=0) {
        this.startCountdown();
      }
    }
  }

  public handleInterimTranscript(text: string): void {
    if (!this.isListeningInternally.value) return;
    const currentBufferEndsWithSpace = this.continuousTranscriptBuffer.value.endsWith(' ');
    const interimStartsWithSpace = text.startsWith(' ');
    let separator = '';
    if (this.continuousTranscriptBuffer.value && text && !currentBufferEndsWithSpace && !interimStartsWithSpace) {
        separator = ' ';
    }
    const fullInterim = this.continuousTranscriptBuffer.value + separator + text;

    if (fullInterim.trim()) {
      this.context.sharedState.pendingTranscript.value = fullInterim;
      this.context.transcriptionDisplay.showInterimTranscript(fullInterim);
    }
  }

  private resetAutoSendTimer(): void {
    this.clearTimers();
    if (!this.autoSendEnabled || !this.continuousTranscriptBuffer.value.trim() || !this.isListeningInternally.value) {
      return;
    }
    this.autoSendTimer = window.setTimeout(() => {
      this.startCountdown();
    }, this.pauseTimeoutMs);
  }

  private startCountdown(): void {
    this.clearTimers();
    if (!this.continuousTranscriptBuffer.value.trim() || !this.autoSendEnabled) return;
    this.countdownValue.value = this.sendDelayMs;
    const countdownInterval = 100;
    this.countdownTimer = window.setInterval(() => {
      this.countdownValue.value -= countdownInterval;
      if (this.countdownValue.value <= 0) {
        this.clearTimers();
        this.sendBufferedTranscript();
      }
    }, countdownInterval);
  }

  private sendBufferedTranscript(): void {
    const transcriptToSend = this.continuousTranscriptBuffer.value.trim();
    if (!transcriptToSend) return;
    this.emitTranscription(transcriptToSend);
    this.continuousTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.countdownValue.value = 0;
  }

  private clearTimers(): void {
    if (this.autoSendTimer) clearTimeout(this.autoSendTimer);
    this.autoSendTimer = null;
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = null;
    this.countdownValue.value = 0;
  }

  handleError(error: Error | SttHandlerErrorPayload): void {
    const errorPayload = ('type' in error && 'message' in error) ? error : {
        type: 'continuous_mode_error',
        message: error.message || 'An error in continuous mode.',
        code: (error as any).code || (error as Error).name,
        fatal: false,
    } as SttHandlerErrorPayload;

    console.error('[ContinuousMode] Error:', errorPayload.message, `(Code: ${errorPayload.code || 'N/A'})`);
    this.clearTimers();
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    if (errorPayload.code !== 'no-speech' && errorPayload.code !== 'aborted' && !errorPayload.message.includes('aborted by the user')) {
        this.context.transcriptionDisplay.showError(errorPayload.message, 3000);
    }
    this.context.emit('voice-input-error', errorPayload);
  }

  cleanup(): void {
    console.log('[ContinuousMode] Cleanup initiated.');
    this.stop();
    this.clearTimers();
    this.continuousTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    this.context.transcriptionDisplay.clearTranscription();
  }
}

export function useContinuousMode(context: SttModeContext): ContinuousMode {
  return new ContinuousMode(context);
}