// File: frontend/src/components/voice-input/handlers/browser/BrowserSpeechCore.ts
/**
 * @file BrowserSpeechCore.ts
 * @description Provides a robust, framework-agnostic core class for interacting with the browser's
 * Web Speech API (SpeechRecognition).
 *
 * @version 1.2.1
 * @updated 2025-06-04 - Made Web Speech API detection more robust by checking `window` properties.
 */

// --- Web Speech API Type Declarations ---
// (These ensure TypeScript understands the API structure if global types are not perfectly available)
interface SpeechRecognitionErrorEventInit extends EventInit {
  error: string;
  message?: string;
}
declare class SpeechRecognitionErrorEvent extends Event {
  constructor(type: string, eventInitDict: SpeechRecognitionErrorEventInit);
  readonly error: string;
  readonly message?: string;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult extends ReadonlyArray<SpeechRecognitionAlternative> {
  readonly isFinal: boolean;
}
interface SpeechRecognitionResultList extends ReadonlyArray<SpeechRecognitionResult> {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}
interface SpeechRecognitionEventInit extends EventInit {
  resultIndex?: number;
  results: SpeechRecognitionResultList;
}
declare class SpeechRecognitionEvent extends Event {
  constructor(type: string, eventInitDict: SpeechRecognitionEventInit);
  readonly resultIndex?: number;
  readonly results: SpeechRecognitionResultList;
  readonly emma?: Document | null;
  readonly interpretation?: any;
}
interface SpeechGrammar {
  src: string;
  weight?: number;
}
interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(grammarString: string, weight?: number): void;
}
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}
interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}
// --- End of Web Speech API Type Declarations ---

export type RecognitionState =
  | 'idle' | 'starting' | 'listening' | 'processing' | 'stopping' | 'error';

export type RecognitionMode = 'single' | 'continuous' | 'vad-wake' | 'vad-command';

export interface BrowserSpeechEvents {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string, code: string, isFatal?: boolean) => void;
  onEnd?: (reason: string) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onNoMatch?: () => void;
}

export interface BrowserSpeechConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export class BrowserSpeechCore {
  private recognition: SpeechRecognition | null = null;
  private currentState: RecognitionState = 'idle';
  private currentMode: RecognitionMode = 'single';
  private config: Required<BrowserSpeechConfig>;
  private readonly events: BrowserSpeechEvents;

  private startTime: number = 0;
  private lastResultTime: number = 0;
  private restartAttempts: number = 0;
  private readonly MAX_RESTART_ATTEMPTS: number = 3;
  private readonly WARM_UP_TIME_MS: number = 150;
  private readonly RESULT_TIMEOUT_MS: number = 10000;
  private resultTimeoutTimer: number | null = null;

  private readonly browserInfo: {
    name: string;
    version: string;
    isFirefox: boolean;
    isChrome: boolean;
    isSafari: boolean;
    hasWebSpeech: boolean;
    SpeechRecognitionAPI: SpeechRecognitionStatic | null;
  };

  constructor(initialConfig: BrowserSpeechConfig = {}, eventHandlers: BrowserSpeechEvents = {}) {
    this.config = {
      language: typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
      ...initialConfig,
    };
    this.events = eventHandlers;
    // CRITICAL: This call must not throw if SpeechRecognition is undefined
    this.browserInfo = this.detectBrowserAndAPI();

    if (!this.browserInfo.hasWebSpeech) {
      console.warn('[BrowserSpeechCore] Web Speech API is not supported by this browser or in the current context (e.g., HTTP page).');
    }
  }

  /**
   * @private
   * @method detectBrowserAndAPI
   * @description Detects browser information and the available SpeechRecognition API constructor.
   * **This is the corrected method.**
   * @returns {object} An object containing browser details and API availability.
   */
  private detectBrowserAndAPI(): typeof BrowserSpeechCore.prototype.browserInfo {
    const info: typeof BrowserSpeechCore.prototype.browserInfo = {
      name: 'unknown', version: '', isFirefox: false, isChrome: false, isSafari: false,
      hasWebSpeech: false, SpeechRecognitionAPI: null,
    };

    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.warn('[BrowserSpeechCore] Non-browser environment detected. Web Speech API disabled.');
      info.hasWebSpeech = false;
      return info;
    }

    const ua = navigator.userAgent.toLowerCase();
    info.isFirefox = ua.includes('firefox');
    info.isChrome = ua.includes('chrome') && !ua.includes('edg');
    info.isSafari = ua.includes('safari') && !ua.includes('chrome');

    if (info.isFirefox) info.name = 'Firefox';
    else if (info.isChrome) info.name = 'Chrome';
    else if (info.isSafari) info.name = 'Safari';
    else if (ua.includes('edg')) info.name = 'Edge';
    else if (ua.includes('msie') || ua.includes('trident')) info.name = 'Internet Explorer';

    // Corrected: Safely check for API on the window object
    const Api = (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition ||
                (window as any).mozSpeechRecognition ||
                (window as any).msSpeechRecognition;

    if (typeof Api !== 'undefined' && Api !== null) {
      info.SpeechRecognitionAPI = Api as SpeechRecognitionStatic;
      info.hasWebSpeech = true;
    } else {
      info.hasWebSpeech = false;
    }

    console.log(`[BrowserSpeechCore] Browser: ${info.name}, Web Speech API available: ${info.hasWebSpeech}`);
    if (!info.hasWebSpeech) {
        console.warn(`[BrowserSpeechCore] Specific check: window.SpeechRecognition is ${typeof (window as any).SpeechRecognition}, window.webkitSpeechRecognition is ${typeof (window as any).webkitSpeechRecognition}`);
    }
    return info;
  }

  private createRecognitionInstance(): boolean {
    if (!this.browserInfo.hasWebSpeech || !this.browserInfo.SpeechRecognitionAPI) {
      this.handleErrorInternal('api-not-available', 'Web Speech API not supported in this browser or context.', true);
      return false;
    }
    try {
      this.recognition = new this.browserInfo.SpeechRecognitionAPI();
      this.recognition.lang = this.config.language;
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
      this.attachEventHandlers();
      console.log('[BrowserSpeechCore] SpeechRecognition instance created with config:',
        { lang: this.config.language, continuous: this.config.continuous, interim: this.config.interimResults });
      return true;
    } catch (e: any) {
      this.handleErrorInternal('init-failed', `Failed to create SpeechRecognition instance: ${e.message || e}`, true);
      return false;
    }
  }

  private attachEventHandlers(): void {
    if (!this.recognition) return;
    this.recognition.onstart = this.handleRecognitionStart.bind(this);
    this.recognition.onresult = this.handleRecognitionResult.bind(this);
    this.recognition.onerror = this.handleRecognitionErrorEvent.bind(this);
    this.recognition.onend = this.handleRecognitionEnd.bind(this);
    this.recognition.onaudiostart = () => { console.debug('[BrowserSpeechCore] Event: onaudiostart'); this.events.onAudioStart?.(); };
    this.recognition.onaudioend = () => { console.debug('[BrowserSpeechCore] Event: onaudioend'); this.events.onAudioEnd?.(); };
    this.recognition.onspeechstart = () => { console.debug('[BrowserSpeechCore] Event: onspeechstart'); this.events.onSpeechStart?.(); };
    this.recognition.onspeechend = () => { console.debug('[BrowserSpeechCore] Event: onspeechend'); this.events.onSpeechEnd?.(); };
    this.recognition.onnomatch = () => { console.debug('[BrowserSpeechCore] Event: onnomatch'); this.events.onNoMatch?.(); };
  }

  private handleRecognitionStart(): void {
    console.log('[BrowserSpeechCore] Event: onstart. Recognition has started.');
    this.currentState = 'listening';
    this.startTime = Date.now();
    this.lastResultTime = Date.now();
    this.clearResultTimeoutTimer();
    if (this.config.continuous) {
      this.startResultTimeoutMonitor();
    }
    this.events.onStart?.();
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent): void {
    this.lastResultTime = Date.now();
    if (this.config.continuous) {
      this.resetResultTimeoutMonitor();
    }
    let finalTranscript = '';
    let interimTranscript = '';
    const resultIndex = event.resultIndex || 0;
    for (let i = resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }
    if (Date.now() - this.startTime < this.WARM_UP_TIME_MS && !finalTranscript.trim()) {
      if (interimTranscript.trim() && this.config.interimResults) {
        this.events.onResult?.(interimTranscript.trim(), false);
      }
      return;
    }
    if (interimTranscript.trim() && this.config.interimResults) {
      this.events.onResult?.(interimTranscript.trim(), false);
    }
    if (finalTranscript.trim()) {
      this.events.onResult?.(finalTranscript.trim(), true);
    }
  }

  private handleRecognitionErrorEvent(event: SpeechRecognitionErrorEvent): void {
    const errorType = event.error;
    const errorMessage = event.message || this.getErrorMessageFriendly(errorType);
    console.error(`[BrowserSpeechCore] Event: onerror - Type: '${errorType}', Message: "${errorMessage}"`);
    const previousState = this.currentState;
    this.currentState = 'error';
    this.clearResultTimeoutTimer();
    let isFatal = false;
    switch (errorType) {
      case 'no-speech':
        isFatal = (this.currentMode === 'single' || this.currentMode === 'vad-command');
        this.events.onError?.(errorMessage, errorType, isFatal);
        break;
      case 'aborted':
        if (previousState !== 'stopping') {
          this.events.onError?.(errorMessage, errorType, false);
        } else {
           console.log('[BrowserSpeechCore] Recognition aborted by explicit stop/abort call.');
        }
        break;
      case 'audio-capture': isFatal = true; this.events.onError?.('Microphone not available or disconnected.', errorType, isFatal); break;
      case 'not-allowed': case 'service-not-allowed': isFatal = true; this.events.onError?.('Microphone permission denied or speech service blocked.', errorType, isFatal); break;
      case 'network': isFatal = true; this.events.onError?.('Network error during speech recognition.', errorType, isFatal); break;
      default: this.events.onError?.(errorMessage, errorType, false);
    }
  }

  private handleRecognitionEnd(): void {
    console.log(`[BrowserSpeechCore] Event: onend. State before 'onend': ${this.currentState}.`);
    this.clearResultTimeoutTimer();
    let reason = 'normal_end';
    if (this.currentState === 'stopping') reason = 'stopped_by_user';
    else if (this.currentState === 'error') reason = 'error_occurred';
    else if (this.currentState === 'listening' && this.config.continuous) {
      reason = 'unexpected_continuous_end';
      console.warn('[BrowserSpeechCore] Continuous mode ended unexpectedly.');
    }
    const previousStateBeforeEnd = this.currentState;
    this.currentState = 'idle';
    this.events.onEnd?.(reason);
    if (this.config.continuous && previousStateBeforeEnd !== 'stopping') {
      if (reason === 'unexpected_continuous_end' || (reason === 'error_occurred' && this.shouldAttemptRestartAfterError(previousStateBeforeEnd))) {
        if (this.restartAttempts < this.MAX_RESTART_ATTEMPTS) {
          this.restartAttempts++;
          console.log(`[BrowserSpeechCore] Attempting auto-restart #${this.restartAttempts} for mode '${this.currentMode}' (reason: ${reason}).`);
          setTimeout(() => this.start(this.currentMode), 500 + Math.random() * 500);
        } else {
          console.error(`[BrowserSpeechCore] Max restart attempts (${this.MAX_RESTART_ATTEMPTS}) reached for mode '${this.currentMode}'.`);
          this.events.onError?.('Continuous recognition failed after multiple restarts.', 'max_restarts', true);
        }
      } else if (reason !== 'error_occurred') {
        this.restartAttempts = 0;
      }
    } else {
      this.restartAttempts = 0;
    }
  }

  private shouldAttemptRestartAfterError(stateBeforeError: RecognitionState): boolean {
    // Only restart if it was actively listening or starting, not if it was already in error or idle.
    return stateBeforeError === 'listening' || stateBeforeError === 'starting';
  }

  private getErrorMessageFriendly(error: string): string {
    const messages: Record<string, string> = {
      'no-speech': 'No speech was detected. Please try speaking again.',
      'aborted': 'Speech recognition was aborted by the system or user.',
      'audio-capture': 'Audio capture failed. Please check your microphone connection and permissions.',
      'not-allowed': 'Permission for speech recognition was denied. Please enable microphone access in your browser settings.',
      'service-not-allowed': 'The speech recognition service is not allowed, possibly due to browser security settings or private mode (e.g. Firefox requires enabling).',
      'network': 'A network error occurred while contacting the speech recognition service.',
      'bad-grammar': 'There was an error in the speech recognition grammar specified.',
      'language-not-supported': 'The specified language is not supported by the speech recognition service.',
    };
    return messages[error] || `An unknown speech error occurred: ${error}`;
  }

  private handleErrorInternal(code: string, message: string, isFatal: boolean = true): void {
    console.error(`[BrowserSpeechCore] Internal Error - Code: ${code}, Message: "${message}", Fatal: ${isFatal}`);
    this.currentState = 'error';
    this.clearResultTimeoutTimer();
    this.events.onError?.(message, code, isFatal);
  }

  public async start(mode: RecognitionMode = 'single'): Promise<boolean> {
    if (this.currentState !== 'idle' && this.currentState !== 'error') {
      console.warn(`[BrowserSpeechCore] Start called but current state is ${this.currentState}. Aborting start.`);
      return false;
    }
    if (!this.browserInfo.hasWebSpeech) {
      this.handleErrorInternal('api-not-available', 'Web Speech API is not available in this browser or context.', true);
      return false;
    }
    console.log(`[BrowserSpeechCore] Attempting to start recognition in mode: '${mode}'. Current state: ${this.currentState}`);
    this.currentMode = mode;
    this.config.continuous = (mode === 'continuous' || mode === 'vad-wake');
    this.config.interimResults = (mode !== 'vad-wake');
    if (!this.recognition || this.currentState === 'error') {
      if (!this.createRecognitionInstance()) return false;
    } else {
      // Apply config to existing instance IF POSSIBLE (some props might not be changeable once set)
       try {
        this.recognition.lang = this.config.language;
        this.recognition.continuous = this.config.continuous;
        this.recognition.interimResults = this.config.interimResults;
        this.recognition.maxAlternatives = this.config.maxAlternatives;
      } catch (e) {
        console.warn('[BrowserSpeechCore] Could not reconfigure existing recognition instance, a new instance might be needed for some changes.', e);
        // For critical changes like language, a full re-init (destroy then create) is better.
        // This simple update here is for less critical runtime adjustments if supported by the browser.
      }
    }
    this.currentState = 'starting';
    try {
      this.recognition!.start();
      return true;
    } catch (e: any) {
      if (e.name === 'InvalidStateError' && this.recognition) {
        console.warn('[BrowserSpeechCore] InvalidStateError on start. Aborting current recognition attempt.');
        try { this.recognition.abort(); } catch (abortErr) { /* ignore */ }
        this.handleErrorInternal('start-failed-invalid-state', `Failed to start (InvalidStateError). Error: ${e.message}`, false);
        return false;
      }
      this.handleErrorInternal('start-failed', `Failed to start recognition: ${e.message || e}`, true);
      return false;
    }
  }

  public stop(abort: boolean = false): void {
    if (this.currentState === 'idle' || this.currentState === 'stopping' || !this.recognition) {
      return;
    }
    this.currentState = 'stopping';
    this.clearResultTimeoutTimer();
    try {
      if (abort) this.recognition.abort(); else this.recognition.stop();
    } catch (e: any) {
      console.error('[BrowserSpeechCore] Error during stop/abort command:', e);
      this.currentState = 'idle';
      this.events.onEnd?.('forced_stop_error');
    }
  }

  private startResultTimeoutMonitor(): void {
    this.clearResultTimeoutTimer();
    if (!this.config.continuous) return;
    this.resultTimeoutTimer = window.setTimeout(() => {
      if (this.currentState === 'listening') {
        console.warn(`[BrowserSpeechCore] Continuous mode result timeout (${this.RESULT_TIMEOUT_MS}ms). Forcing stop.`);
        this.handleErrorInternal('continuous_timeout', 'Continuous recognition timed out.', false); // Let onEnd try to restart
        if (this.recognition) { try { this.recognition.abort(); } catch(e){ /*ignore*/ } }
      }
    }, this.RESULT_TIMEOUT_MS);
  }

  private resetResultTimeoutMonitor(): void {
    this.clearResultTimeoutTimer();
    if (this.config.continuous && this.currentState === 'listening') {
      this.startResultTimeoutMonitor();
    }
  }

  private clearResultTimeoutTimer(): void {
    if (this.resultTimeoutTimer) { clearTimeout(this.resultTimeoutTimer); this.resultTimeoutTimer = null; }
  }

  public updateConfig(newConfig: Partial<BrowserSpeechConfig>): void {
    const oldLang = this.config.language;
    this.config = { ...this.config, ...newConfig };
    if (this.recognition) {
      if (newConfig.language && newConfig.language !== oldLang && (this.currentState === 'idle' || this.currentState === 'error')) {
        this.destroyRecognitionInstance(); // Force recreate on next start if lang changed and idle
      } else if (this.recognition && (this.currentState === 'idle' || this.currentState === 'error')) { // Apply if idle and no lang change
        this.recognition.lang = this.config.language;
        this.recognition.continuous = this.config.continuous;
        this.recognition.interimResults = this.config.interimResults;
        this.recognition.maxAlternatives = this.config.maxAlternatives;
      } else if (this.currentState === 'listening' || this.currentState === 'starting'){
         console.warn('[BrowserSpeechCore] Config update while active. Some changes may need restart.');
      }
    }
  }

  public getState(): RecognitionState { return this.currentState; }
  public getBrowserInfo(): Readonly<typeof BrowserSpeechCore.prototype.browserInfo> { return this.browserInfo; }
  public isSupported(): boolean { return this.browserInfo.hasWebSpeech; }

  private destroyRecognitionInstance(): void {
    if (this.recognition) {
      this.recognition.onstart = null; this.recognition.onresult = null;
      this.recognition.onerror = null; this.recognition.onend = null;
      this.recognition.onaudiostart = null; this.recognition.onaudioend = null;
      this.recognition.onspeechstart = null; this.recognition.onspeechend = null;
      this.recognition.onnomatch = null;
      try { if (this.currentState !== 'idle' && this.currentState !== 'stopping') this.recognition.abort(); }
      catch(e) { /* ignore */ }
      this.recognition = null;
    }
  }

  public destroy(): void {
    this.clearResultTimeoutTimer();
    this.destroyRecognitionInstance();
    this.currentState = 'idle';
    this.restartAttempts = 0;
    console.log('[BrowserSpeechCore] Instance destroyed.');
  }
}