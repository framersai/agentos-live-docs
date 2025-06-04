// File: frontend/src/components/voice-input/composables/modes/useVadMode.ts
/**
 * @file useVadMode.ts
 * @description Voice Activation Detection (VAD) mode implementation.
 *
 * Revision:
 * - Implemented public readonly computed properties (isActive, canStart, etc.).
 * - Removed SttModeState import and initializeState method.
 * - Corrected context property access and method calls (e.g., this.context.settings.value, playSound with .value).
 * - Fixed typo `const_trimmedText` to `const trimmedText`.
 * - Changed `get wakeWords` return type to `readonly string[]`.
 * - Removed unused 'watch' and 'commandPauseMs'.
 */

import { ref, computed } from 'vue'; // Removed 'watch'
import type { ComputedRef } from 'vue';
// SttModeState is not exported or used by BaseSttMode anymore.
import { BaseSttMode, type SttModeContext, type SttModePublicState } from './BaseSttMode';

type VadPhase = 'idle' | 'listening-wake' | 'capturing-command';

export class VadMode extends BaseSttMode implements SttModePublicState {
  private phase = ref<VadPhase>('idle');
  private commandTimeoutTimer: number | null = null;
  private commandTranscriptBuffer = ref('');

  // Public reactive state implementation
  public readonly isActive: ComputedRef<boolean>;
  public readonly canStart: ComputedRef<boolean>;
  public readonly statusText: ComputedRef<string>;
  public readonly placeholderText: ComputedRef<string>;

  constructor(context: SttModeContext) {
    super(context);

    // Note: Ensure vadWakeWordsBrowserSTT exists on settings or provide a fallback.
    const primaryWakeWord = computed(() => (this.context.settings.value.vadWakeWordsBrowserSTT?.[0] || 'Hey V').toUpperCase());

    this.isActive = computed(() => this.phase.value !== 'idle');
    this.canStart = computed(() => !this.isBlocked() && this.phase.value === 'idle');
    this.statusText = computed(() => {
      switch (this.phase.value) {
        case 'listening-wake': return `VAD: Listening for "${primaryWakeWord.value}"`;
        case 'capturing-command': return 'VAD: Listening for command...';
        default: return 'VAD: Ready';
      }
    });
    this.placeholderText = computed(() => {
      switch (this.phase.value) {
        case 'listening-wake': return `Say "${primaryWakeWord.value}" to activate`;
        case 'capturing-command': return 'Listening for your command...';
        default: return `Say "${primaryWakeWord.value}" or type...`;
      }
    });
  }

  private get wakeWords(): readonly string[] { // Return type changed
    return this.context.settings.value.vadWakeWordsBrowserSTT || ['hey v', 'victoria'];
  }

  private get commandTimeoutMs(): number {
    return this.context.settings.value.vadSilenceTimeoutMs ?? 5000;
  }

  async start(): Promise<boolean> {
    if (!this.canStart.value) { // Using public computed
      console.warn('[VadMode] Cannot start - blocked, already active, or no handler.');
       if (!this.context.activeHandlerApi.value) {
          this.context.toast?.add({ type: 'error', title: 'STT Error', message: 'Speech handler not available.' });
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
        this.context.transcriptionDisplay.showListening(); // Or specific wake word message
        return true;
      } else {
        await this.resetToIdleState('Failed to start STT for wake word.');
        return false;
      }
    } catch (error: any) {
      this.handleError(error);
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.phase.value === 'idle') return;
    console.log(`[VadMode] Stopping from phase: ${this.phase.value}`);
    await this.resetToIdleState();
  }

  public async handleWakeWordDetected(): Promise<void> {
    if (this.phase.value !== 'listening-wake') return;
    this.clearCommandTimeout();
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.phase.value = 'capturing-command';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    // Pass .value for Ref<AudioBuffer|null>
    this.context.playSound(this.context.audioFeedback.beepInSound.value);
    this.context.transcriptionDisplay.showWakeWordDetected();
    this.context.toast?.add({ type: 'info', title: 'Listening for Command', message: `Wake word "${this.wakeWords[0]}" detected.`, duration: 2000 });

    try {
      const handlerStarted = await this.context.activeHandlerApi.value?.startListening(true);
      if (handlerStarted) {
        this.startCommandTimeout();
      } else {
        this.context.transcriptionDisplay.showError('Could not start command listening.', 2500);
        await this.returnToWakeListening('STT failed for command capture.');
      }
    } catch (error: any) {
      this.context.transcriptionDisplay.showError('Error starting command listening.', 2500);
      await this.returnToWakeListening(error.message || 'Error in command capture transition.');
    }
  }

  handleTranscription(text: string): void {
    const trimmedText = text.trim(); // Corrected typo: const_trimmedText -> const trimmedText
    if (!trimmedText) return;

    if (this.phase.value === 'capturing-command') {
      this.commandTranscriptBuffer.value = trimmedText;
      this.context.sharedState.pendingTranscript.value = this.commandTranscriptBuffer.value;
      this.context.transcriptionDisplay.showInterimTranscript(this.commandTranscriptBuffer.value);
      this.sendCommand();
      this.returnToWakeListeningAfterDelay();
    } else if (this.phase.value === 'listening-wake') {
      const lowerText = trimmedText.toLowerCase();
      const detectedWakeWord = this.wakeWords.some(word => lowerText.includes(word.toLowerCase()));
      if (detectedWakeWord) {
         this.context.emit('wake-word-detected-internal');
      }
    }
  }

  public handleInterimTranscript(text: string): void {
    if (this.phase.value === 'capturing-command') {
      this.context.sharedState.pendingTranscript.value = text.trim();
      this.context.transcriptionDisplay.showInterimTranscript(text.trim());
    }
  }

  private async returnToWakeListeningAfterDelay(delayMs: number = 300) {
    setTimeout(async () => { await this.returnToWakeListening(); }, delayMs);
  }

  private sendCommand(): void {
    this.clearCommandTimeout();
    const commandText = this.commandTranscriptBuffer.value.trim();
    if (!commandText) return;
    this.emitTranscription(commandText);
    this.context.playSound(this.context.audioFeedback.beepOutSound.value); // Pass .value
    this.context.transcriptionDisplay.showSent(commandText);
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
  }

  private startCommandTimeout(): void {
    this.clearCommandTimeout();
    this.commandTimeoutTimer = window.setTimeout(async () => {
      this.context.transcriptionDisplay.showVadTimeout();
      this.context.playSound(this.context.audioFeedback.beepOutSound.value); // Pass .value
      this.commandTranscriptBuffer.value = '';
      this.context.sharedState.pendingTranscript.value = '';
      await this.returnToWakeListening('Command capture timed out.');
    }, this.commandTimeoutMs);
  }

  private clearCommandTimeout(): void {
    if (this.commandTimeoutTimer) clearTimeout(this.commandTimeoutTimer); this.commandTimeoutTimer = null;
  }

  private async returnToWakeListening(reason: string = "Returning to wake listening"): Promise<void> {
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
      return;
    }
    await this.start();
  }

  private async resetToIdleState(errorMessage?: string): Promise<void> {
    this.clearCommandTimeout();
    if (this.context.activeHandlerApi.value && this.phase.value !== 'idle') {
      await this.context.activeHandlerApi.value.stopListening(true);
    }
    this.phase.value = 'idle';
    this.commandTranscriptBuffer.value = '';
    this.context.sharedState.pendingTranscript.value = '';
    this.context.sharedState.isListeningForWakeWord.value = false;
    this.context.sharedState.isProcessingAudio.value = false;
    if (errorMessage) this.context.transcriptionDisplay.showError(errorMessage, 2500);
    else this.context.transcriptionDisplay.clearTranscription();
  }

  handleError(error: any): void {
    console.error(`[VadMode] Error in phase ${this.phase.value}:`, error);
    const message = error.message || 'An error in VAD mode.';
    if (error.code !== 'no-speech' && error.code !== 'aborted' && !message.includes('aborted by the user')) {
        this.context.transcriptionDisplay.showError(message, 3000);
    }
    this.context.emit('error', { type: 'vad_mode_error', message, code: error.code, phase: this.phase.value });
    if (this.phase.value === 'capturing-command' && !this.isBlocked()) this.returnToWakeListening(`Error: ${message}`);
    else this.resetToIdleState();
  }

  cleanup(): void {
    this.resetToIdleState();
  }

  public getCurrentPhase(): VadPhase { return this.phase.value; }
}

export function useVadMode(context: SttModeContext): VadMode {
  return new VadMode(context);
}