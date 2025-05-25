// File: frontend/src/services/tts.service.ts
/**
 * @file Text-to-Speech (TTS) Service
 * @description Manages TTS operations using the browser's Web Speech API.
 * Provides functionalities to speak text, manage a queue, and handle interruptions.
 * If a new speak request comes while another is playing or queued, the existing
 * speech is cancelled, the queue is cleared, and the new request is spoken immediately.
 * @version 1.1.1 - Corrected SpeechSynthesisErrorEvent handling and potential null access.
 */

/**
 * Options for configuring a speech synthesis utterance.
 */
interface SpeakOptions {
  /** Language code (e.g., 'en-US'). Defaults to browser's default or document lang. */
  lang?: string;
  /** Speech rate (0.1 to 10). Defaults to 1. */
  rate?: number;
  /** Speech pitch (0 to 2). Defaults to 1. */
  pitch?: number;
  /** Volume (0 to 1). Defaults to 1. */
  volume?: number;
  /** Specific voice URI to use. If provided, this will be prioritized. */
  voiceURI?: string;
  /** Callback function invoked when speech synthesis starts for this utterance. */
  onStart?: () => void;
  /** Callback function invoked when speech synthesis finishes for this utterance. */
  onEnd?: () => void;
  /** Callback function invoked if an error occurs during speech synthesis for this utterance. */
  onError?: (event: SpeechSynthesisErrorEvent) => void;
}

/**
 * Represents an utterance that is waiting in the queue to be spoken.
 */
interface QueuedUtterance {
  /** The text content to be synthesized. */
  text: string;
  /** Optional configuration for this specific utterance. */
  options?: SpeakOptions;
  /** Promise resolve function, called when the utterance is successfully spoken. */
  resolve: () => void;
  /** Promise reject function, called if an error occurs or if the utterance is cancelled. */
  reject: (reason?: any) => void;
}

class TtsService {
  private synthesis: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private utteranceQueue: QueuedUtterance[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isProcessingQueue = false;
  private voicesLoadedPromise: Promise<void>;
  private resolveVoicesLoaded!: () => void;

  /**
   * Initializes the TTS Service.
   * Attempts to load voices and checks for browser support for SpeechSynthesis.
   */
  constructor() {
    this.voicesLoadedPromise = new Promise((resolve) => {
      this.resolveVoicesLoaded = resolve;
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices(); // Initial attempt to load voices
      // Some browsers load voices asynchronously.
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => {
          this.loadVoices();
          this.resolveVoicesLoaded(); // Resolve promise once voices are confirmed loaded
        };
      } else {
        // For browsers that don't support onvoiceschanged, assume voices are available after a short delay
        // or are loaded synchronously.
        setTimeout(() => {
          this.loadVoices();
          this.resolveVoicesLoaded();
        }, 250);
      }
    } else {
      console.warn(
        'Text-to-Speech (SpeechSynthesis) not supported by this browser.'
      );
      this.resolveVoicesLoaded(); // Resolve immediately if not supported
    }
  }

  /**
   * Loads available voices from the SpeechSynthesis API.
   * This method is called internally and by the voiceschanged event.
   * It updates the availableVoices array.
   */
  private loadVoices(): void {
    if (!this.synthesis) return;
    this.availableVoices = this.synthesis.getVoices();
    if (this.availableVoices.length > 0) {
      console.log(
        'TTS Service: Voices loaded.',
        this.availableVoices.map((v) => ({
          name: v.name,
          lang: v.lang,
          uri: v.voiceURI,
          default: v.default,
        }))
      );
    } else {
      console.log('TTS Service: No voices available yet or failed to load.');
    }
  }

  /**
   * Checks if TTS is supported by the browser.
   * @returns {boolean} True if SpeechSynthesis is supported, false otherwise.
   */
  public isSupported(): boolean {
    return !!this.synthesis;
  }

  /**
   * Gets a list of available voices. Waits for voices to be loaded.
   * @param {string} [lang] - Optional BCP 47 language code to filter voices (e.g., "en-US", "es").
   * If provided, returns voices matching that language or language family.
   * @returns {Promise<SpeechSynthesisVoice[]>} A promise that resolves with an array of available voices.
   */
  public async getVoices(lang?: string): Promise<SpeechSynthesisVoice[]> {
    await this.voicesLoadedPromise; // Ensure voices are loaded
    if (lang) {
      const langLower = lang.toLowerCase();
      const langShort = langLower.split('-')[0];
      return this.availableVoices.filter(
        (voice) =>
          voice.lang.toLowerCase() === langLower ||
          voice.lang.toLowerCase().startsWith(langShort + '-')
      );
    }
    return [...this.availableVoices]; // Return a copy
  }

  /**
   * Speaks the given text immediately.
   * If speech is already in progress or items are queued, it cancels all current
   * and pending speech operations and then speaks the new text.
   * @param {string} text - The text to speak. Must not be empty.
   * @param {SpeakOptions} [options] - Optional configuration for speech synthesis.
   * @returns {Promise<void>} A promise that resolves when speech finishes or rejects on error/cancellation.
   * @throws {Error} if SpeechSynthesis is not supported or text is empty.
   * @example
   * try {
   * await ttsService.speak("Hello world", { lang: "en-US", rate: 1.2 });
   * console.log("Speech finished!");
   * } catch (error) {
   * console.error("Speech failed:", error);
   * }
   */
  public async speak(text: string, options?: SpeakOptions): Promise<void> {
    if (!this.synthesis) {
      const not_supported_msg = 'Speech synthesis not supported by this browser.';
      console.warn(`TTS Service: ${not_supported_msg}`);
      return Promise.reject(new Error(not_supported_msg));
    }

    if (!text || text.trim() === "") {
      console.log('TTS Service: Attempted to speak empty text. Resolving immediately.');
      return Promise.resolve();
    }

    // Cancel any ongoing or queued speech
    this.cancel();
    // Wait a tick to ensure cancellation has propagated through the SpeechSynthesis API events
    await new Promise(r => setTimeout(r, 0));

    return new Promise<void>(async (resolve, reject) => {
      await this.voicesLoadedPromise; // Ensure voices are loaded before creating utterance

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Apply options
      utterance.lang = options?.lang || document.documentElement.lang || 'en-US';
      utterance.rate = options?.rate ?? 1;
      utterance.pitch = options?.pitch ?? 1;
      utterance.volume = options?.volume ?? 1;

      let voiceFound = false;
      if (options?.voiceURI) {
        const selectedVoice = this.availableVoices.find(
          (v) => v.voiceURI === options.voiceURI
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          voiceFound = true;
        } else {
          console.warn(
            `TTS Service: Voice URI "${options.voiceURI}" not found. Using default for lang ${utterance.lang}.`
          );
        }
      }

      if (!voiceFound && utterance.lang) {
        // Attempt to find a voice matching the language
        const langVoices = await this.getVoices(utterance.lang);
        const defaultVoiceForLang = langVoices.find(v => v.default);
        utterance.voice = defaultVoiceForLang || langVoices[0] || null;
        if (!utterance.voice && this.availableVoices.length > 0) {
            console.warn(`TTS Service: No specific voice found for lang ${utterance.lang}. Using browser default.`);
        } else if (utterance.voice) {
            console.log(`TTS Service: Selected voice "${utterance.voice.name}" for lang ${utterance.lang}.`);
        }
      }

      if (!utterance.voice && this.availableVoices.length > 0) {
        console.warn(`TTS Service: No voice could be selected. Speech may use a generic default.`);
      }

      utterance.onstart = () => {
        console.log(`TTS Service: Speech started for "${text.substring(0, 30)}..."`);
        options?.onStart?.();
      };

      utterance.onend = () => {
        console.log('TTS Service: Speech ended.');
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
        options?.onEnd?.();
        resolve();
        // After a direct speak call ends, check if anything was queued *during* this speak.
        // This is unlikely given `cancel()` is called first, but good for safety.
        this.processQueue();
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error('TTS Service: Speech error.', event.error, event);
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
        options?.onError?.(event);
        // Corrected line: Use event.error for the error message
        reject(new Error(`SpeechSynthesis error: ${event.error || 'Unknown error'}`));
        this.processQueue(); // Check queue even on error
      };

      // Corrected line: Added non-null assertion as this.synthesis is guarded
      this.synthesis!.speak(utterance);
    });
  }

  /**
   * Adds text to a queue to be spoken sequentially.
   * If TTS is idle and no direct speak call is active, it starts processing the queue.
   * @param {string} text - The text to queue for speech.
   * @param {SpeakOptions} [options] - Optional configuration for this specific utterance.
   * @returns {Promise<void>} A promise that resolves when this specific utterance finishes,
   * or rejects if an error occurs or it's cancelled.
   */
  public async speakQueued(text: string, options?: SpeakOptions): Promise<void> {
    if (!this.synthesis) {
      const not_supported_msg = 'Speech synthesis not supported.';
      console.warn(`TTS Service: ${not_supported_msg}`);
      return Promise.reject(new Error(not_supported_msg));
    }
    if (!text || text.trim() === "") {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.utteranceQueue.push({ text, options, resolve, reject });
      console.log(
        `TTS Service: Queued "${text.substring(0, 30)}...". Queue size: ${
          this.utteranceQueue.length
        }`
      );
      // Only start processing queue if not already speaking (either direct or from queue)
      // Corrected line: Added non-null assertion as this.synthesis is guarded
      if (this.synthesis && !this.synthesis!.speaking && !this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Processes the next utterance in the queue if TTS is not currently busy.
   * This is called internally when speech ends or the queue is initiated.
   */
  private async processQueue(): Promise<void> {
    if (!this.synthesis || this.synthesis.speaking || this.utteranceQueue.length === 0 || this.isProcessingQueue) {
      if (this.utteranceQueue.length === 0) {
        this.isProcessingQueue = false;
      }
      return;
    }

    this.isProcessingQueue = true;
    const nextUtteranceData = this.utteranceQueue.shift();
    if (!nextUtteranceData) {
      this.isProcessingQueue = false;
      return;
    }

    const { text, options, resolve, reject } = nextUtteranceData;

    await this.voicesLoadedPromise; // Ensure voices are loaded

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance; // Mark this as the current utterance

    utterance.lang = options?.lang || document.documentElement.lang || 'en-US';
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 1;

    let voiceFound = false;
    if (options?.voiceURI) {
        const selectedVoice = this.availableVoices.find(v => v.voiceURI === options.voiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            voiceFound = true;
        } else {
            console.warn(`TTS Service (Queue): Voice URI "${options.voiceURI}" not found for "${text.substring(0,30)}...". Using default for lang ${utterance.lang}.`);
        }
    }
    if (!voiceFound && utterance.lang) {
        const langVoices = await this.getVoices(utterance.lang);
        const defaultVoiceForLang = langVoices.find(v => v.default);
        utterance.voice = defaultVoiceForLang || langVoices[0] || null;
        if (!utterance.voice && this.availableVoices.length > 0) {
            console.warn(`TTS Service (Queue): No specific voice found for lang ${utterance.lang} for "${text.substring(0,30)}...". Using browser default.`);
        }
    }

    utterance.onstart = () => {
      console.log(
        `TTS Service (Queue): Speech started for "${text.substring(0, 30)}..."`
      );
      options?.onStart?.();
    };

    utterance.onend = () => {
      console.log('TTS Service (Queue): Speech ended.');
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
      }
      this.isProcessingQueue = false; // Allow next item to be processed
      options?.onEnd?.();
      resolve();
      this.processQueue(); // Process next in queue
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error('TTS Service (Queue): Speech error.', event.error);
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
      }
      this.isProcessingQueue = false; // Allow next item to be processed
      options?.onError?.(event);
      // Corrected line: Use event.error for the error message
      reject(new Error(`SpeechSynthesis error (queued): ${event.error || 'Unknown error'}`));
      this.processQueue(); // Process next in queue even on error
    };

    console.log(
      `TTS Service: Dequeuing and speaking "${text.substring(0, 30)}...". Remaining: ${
        this.utteranceQueue.length
      }`
    );
    // this.synthesis is guaranteed to be non-null here due to the check at the start of processQueue
    this.synthesis!.speak(utterance);
  }

  /**
   * Cancels the currently speaking utterance and clears the entire queue.
   * Any promises associated with queued items will be rejected.
   */
  public cancel(): void {
    if (!this.synthesis) return;

    // Reject all promises in the queue
    this.utteranceQueue.forEach((item) =>
      item.reject(new Error('TTS Canceled: Speech was canceled by a new request or explicit call.'))
    );
    this.utteranceQueue = [];

    if (this.currentUtterance && this.synthesis.speaking) {
      console.log('TTS Service: Cancelling current speech.');
      // Note: `synthesis.cancel()` will trigger the `onend` or `onerror` of the currentUtterance.
      // The promise for that utterance will be resolved/rejected by its own handlers.
      this.synthesis.cancel();
    }
    // `currentUtterance` will be set to null by its onend/onerror.
    // `isProcessingQueue` will be reset by onend/onerror of the queued item, or if queue becomes empty.
    this.isProcessingQueue = false; // Ensure this is reset if cancel is called while queue is idle but populated
  }

  /**
   * Pauses the currently speaking utterance, if any.
   */
  public pause(): void {
    if (this.synthesis && this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
      console.log('TTS Service: Speech paused.');
    }
  }

  /**
   * Resumes a paused utterance, if any.
   */
  public resume(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
      console.log('TTS Service: Speech resumed.');
    }
  }

  /**
   * Checks if speech synthesis is currently active (either speaking or paused).
   * @returns {boolean} True if speaking or paused, false otherwise.
   */
  public isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking || this.synthesis.paused : false;
  }

  /**
   * Checks if speech synthesis is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  public isPaused(): boolean {
    return this.synthesis ? this.synthesis.paused : false;
  }
}

/**
 * Singleton instance of the TtsService.
 * Use this instance throughout the application to interact with TTS functionalities.
 * @example
 * import { ttsService } from './tts.service';
 * ttsService.speak("Hello");
 */
export const ttsService = new TtsService();