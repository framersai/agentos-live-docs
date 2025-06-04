// File: frontend/src/components/voice-input/composables/modes/useContinuousMode.ts
/**
 * @file useContinuousMode.ts
 * @description Continuous listening mode implementation.
 *
 * Revision:
 * - Ensured public readonly computed properties (isActive, canStart, etc.) are correctly defined.
 * - Removed unused 'watch' import (if previously missed).
 * - Verified context property access (e.g., this.context.settings.value).
 */

import { ref, computed } from 'vue'; // Removed 'watch' as it's unused
import type { ComputedRef } from 'vue';
// SttModeState is not exported or used by BaseSttMode anymore.
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';

export class ContinuousMode extends BaseSttMode implements SttModePublicState {
  private continuousTranscriptBuffer = ref('');
  private isListeningInternally = ref(false);
  private autoSendTimer: number | null = null;
  private countdownTimer: number | null = null;
  private countdownValue = ref(0);

  // Public reactive state implementation
  public readonly isActive: ComputedRef<boolean>;
  public readonly canStart: ComputedRef<boolean>;
  public readonly statusText: ComputedRef<string>;
  public readonly placeholderText: ComputedRef<string>;

  constructor(context: SttModeContext) {
    super(context);

    this.isActive = computed(() => this.isListeningInternally.value);
    this.canStart = computed(() => !this.isBlocked() && !this.isListeningInternally.value);
    this.statusText = computed(() => {
      if (this.countdownValue.value > 0) {
        return `Continuous: Sending in ${Math.ceil(this.countdownValue.value / 1000)}s...`;
      }
      return this.isListeningInternally.value ? 'Continuous: Listening' : 'Continuous: Ready';
    });
    this.placeholderText = computed(() =>
      this.isListeningInternally.value
        ? 'Listening continuously... (text input disabled)'
        : 'Continuous mode ready. Click mic to start.'
    );
  }
  // Example of corrected context access within a method:
  private get autoSendEnabled(): boolean {
    // Access .value for Ref properties from context.settings
    return this.context.settings.value.continuousModeAutoSend ?? true;
  }

  private get pauseTimeoutMs(): number {
    return this.context.settings.value.continuousModePauseTimeoutMs ?? 2500;
  }

  private get sendDelayMs(): number {
    return this.context.settings.value.continuousModeSilenceSendDelayMs ?? 1000;
  }

  async start(): Promise<boolean> {
    if (!this.canStart.value) { // Using the public computed
      console.warn('[ContinuousMode] Cannot start - blocked, already active, or no handler.');
      if (!this.context.activeHandlerApi.value) { // Check context for active handler
          this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available.' });
      }
      return false;
    }

    this.clearTimers();
    this.continuousTranscriptBuffer.value = '';
    this.isListeningInternally.value = true;
    this.context.sharedState.isProcessingAudio.value = true; // Access sharedState from context

    try {
      // Access activeHandlerApi from context
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(false);
      if (handlerStarted) {
        console.log('[ContinuousMode] STT handler started successfully.');
        // Access transcriptionDisplay from context
        this.context.transcriptionDisplay.showListening();
        return true;
      } else {
        console.error('[ContinuousMode] Failed to start STT handler.');
        this.isListeningInternally.value = false;
        this.context.sharedState.isProcessingAudio.value = false;
        this.context.transcriptionDisplay.showError('Failed to start STT.', 2000);
        return false;
      }
    } catch (error: any) {
      this.handleError(error); // handleError will use this.context
      return false;
    }
  }

  async stop(): Promise<void> {
    if (!this.isListeningInternally.value && !this.autoSendTimer && !this.countdownTimer) {
      return;
    }
    console.log('[ContinuousMode] Stopping...');
    this.clearTimers();
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;

    try {
      await this.context.activeHandlerApi.value?.stopListening(false);
      if (this.autoSendEnabled && this.continuousTranscriptBuffer.value.trim()) {
        this.sendBufferedTranscript();
      } else {
         this.continuousTranscriptBuffer.value = '';
      }
      this.context.transcriptionDisplay.clearTranscription();
    } catch (error: any) {
      this.handleError(error);
    }
  }

  handleTranscription(text: string): void {
    if (!this.isListeningInternally.value && !this.autoSendEnabled) {
        console.log('[ContinuousMode] Received final transcript while not actively listening and auto-send disabled, ignoring:', text);
        return;
    }
    const trimmedText = text.trim();
    if (trimmedText) {
      this.continuousTranscriptBuffer.value += (this.continuousTranscriptBuffer.value ? ' ' : '') + trimmedText;
      this.context.sharedState.pendingTranscript.value = this.continuousTranscriptBuffer.value;
      this.context.transcriptionDisplay.showInterimTranscript(this.continuousTranscriptBuffer.value);

      if (this.isListeningInternally.value) {
        this.resetAutoSendTimer();
      } else if (this.autoSendEnabled && this.continuousTranscriptBuffer.value.trim()) {
        this.startCountdown();
      }
    }
  }

  public handleInterimTranscript(text: string): void {
    if (!this.isListeningInternally.value) return;
    const fullInterim = this.continuousTranscriptBuffer.value + (this.continuousTranscriptBuffer.value && text.trim() ? ' ' : '') + text.trim();
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
    this.context.transcriptionDisplay.showSent(transcriptToSend);
    this.continuousTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.countdownValue.value = 0;
  }

  private clearTimers(): void {
    if (this.autoSendTimer) clearTimeout(this.autoSendTimer); this.autoSendTimer = null;
    if (this.countdownTimer) clearInterval(this.countdownTimer); this.countdownTimer = null;
    this.countdownValue.value = 0;
  }

  handleError(error: any): void {
    console.error('[ContinuousMode] Error:', error);
    this.clearTimers();
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    if (error.message && !error.message.includes('no-speech') && !error.message.includes('aborted')) {
        this.context.transcriptionDisplay.showError(error.message || 'Continuous STT error', 3000);
    }
    this.context.emit('error', { type: 'continuous_mode_error', message: error.message || 'An error in continuous mode.', code: error.code });
  }

  cleanup(): void {
    console.log('[ContinuousMode] Cleanup');
    this.stop();
    this.clearTimers();
    this.continuousTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.isListeningInternally.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
  }
}

export function useContinuousMode(context: SttModeContext): ContinuousMode {
  return new ContinuousMode(context);
}