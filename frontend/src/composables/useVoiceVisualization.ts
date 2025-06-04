// File: frontend/src/components/voice-input/composables/useVoiceVisualization.ts
/**
 * @file useVoiceVisualization.ts
 * @description Composable for managing and rendering dynamic audio visualizations on an HTML5 Canvas.
 * Supports frequency bars, waveform, and a "Her-inspired" organic circular visualizer.
 * Designed to be themeable and responsive to audio input and application states.
 *
 * @module composables/useVoiceVisualization
 * @version 1.1.0 - Enhanced circular visualizer for organic feel, improved theming,
 * JSDoc updates, and alignment with "Ephemeral Harmony" design system.
 */
import { ref, onUnmounted, readonly, watch, type Ref, shallowRef } from 'vue';
import { useUiStore } from '@/store/ui.store'; // For reduced motion preference

/**
 * Configuration options for the voice visualizer.
 */
export interface VoiceVisualizationConfig {
  /** FFT size for the AnalyserNode. Higher values mean more detail but more processing. Must be a power of 2. */
  fftSize?: number;
  /** Smoothing time constant for the AnalyserNode (0 to 1). Higher values mean smoother changes. */
  smoothingTimeConstant?: number;
  /** Type of visualization to render. */
  visualizationType?: 'frequencyBars' | 'waveform' | 'circular';
  /** Primary color for the visualization elements (e.g., bars, lines, shapes). Expects a valid CSS color string (e.g., HSL(A)). */
  shapeColor?: string; // Renamed from barColor for generality
  /** For 'frequencyBars': Number of bars to display. */
  barCount?: number;
  /** For 'circular': Base radius factor, relative to min(canvasWidth, canvasHeight) / 2. */
  circularBaseRadiusFactor?: number;
  /** For 'circular': How much audio amplitude affects the radius extension. */
  circularAmplitudeFactor?: number;
  /** For 'circular': Maximum pixel extension for points on the circle due to amplitude. */
  circularMaxExtensionRadius?: number;
  /** For 'circular': Number of points used to draw the circle/blob. More points = smoother. */
  circularPointCount?: number;
  /** For 'circular': Speed of subtle rotation (radians per frame). 0 for no rotation. */
  circularRotationSpeed?: number;
  /** For 'circular': Speed of the base radius pulsing effect. */
  circularPulseSpeed?: number;
  /** For 'circular': Sharpness of points. 0 for smooth curve, 1 for sharp points. (New) */
  circularPointSharpness?: number;
  /** For 'circular': Whether to connect points with lines or curves (New: 'line' | 'curve') */
  circularConnectionType?: 'line' | 'curve';
  /** Line width for 'waveform' and 'circular' visualizations. */
  lineWidth?: number;
  /** Global alpha multiplier for the visualization (0 to 1). (New) */
  globalVizAlpha?: number;
}

/** Default configuration values for the voice visualizer. */
const DEFAULT_VIZ_CONFIG: Readonly<VoiceVisualizationConfig> = Object.freeze({
  fftSize: 512, // Increased for more detail in circular/waveform
  smoothingTimeConstant: 0.75, // Smoother for organic feel
  visualizationType: 'circular',
  shapeColor: 'hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))',
  barCount: 32,
  circularBaseRadiusFactor: 0.25, // Slightly larger base
  circularAmplitudeFactor: 0.5,
  circularMaxExtensionRadius: 40, // More potential extension
  circularPointCount: 90,      // More points for smoother organic shape
  circularRotationSpeed: 0.002, // Slower, gentler rotation
  circularPulseSpeed: 0.015,   // Slower, gentler pulse
  circularPointSharpness: 0.3, // Default to slightly smooth
  circularConnectionType: 'curve', // Default to curves for organic feel
  lineWidth: 2,
  globalVizAlpha: 0.7, // Default global alpha
});

/**
 * Composable for managing and rendering audio visualizations on a canvas.
 *
 * @param {Ref<MediaStream | null>} mediaStreamRef - Reactive reference to the audio MediaStream.
 * @param {Ref<HTMLCanvasElement | null>} canvasRef - Reactive reference to the HTML canvas element.
 * @param {Partial<VoiceVisualizationConfig>} [initialConfigOverride] - Optional initial configuration overrides.
 * @returns Object with methods to control visualization and its status.
 */
export function useVoiceVisualization(
  mediaStreamRef: Ref<MediaStream | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  initialConfigOverride?: Partial<VoiceVisualizationConfig>
) {
  const uiStore = useUiStore();
  const audioContext = shallowRef<AudioContext | null>(null);
  const analyserNode = shallowRef<AnalyserNode | null>(null);
  const sourceNode = shallowRef<MediaStreamAudioSourceNode | null>(null);

  const frequencyData = shallowRef<Uint8Array | null>(null);
  const timeDomainData = shallowRef<Uint8Array | null>(null);
  const _isVisualizing = ref(false);
  let animationFrameId: number | null = null;

  // For circular visualizer animation state
  let currentAngle = 0;
  let pulseOffset = Math.random() * Math.PI * 2; // Random initial phase for pulse

  const currentConfig = ref<VoiceVisualizationConfig>({
    ...DEFAULT_VIZ_CONFIG,
    ...(initialConfigOverride || {}),
  });

  /**
   * Updates the visualization configuration with new partial settings.
   * Critical changes like `fftSize` will reinitialize the AnalyserNode.
   * @public
   * @param {Partial<VoiceVisualizationConfig>} newConfigOverride - New configuration values to apply.
   */
  const updateConfig = (newConfigOverride: Partial<VoiceVisualizationConfig>): void => {
    const oldFftSize = currentConfig.value.fftSize;
    currentConfig.value = { ...currentConfig.value, ...newConfigOverride };

    if (analyserNode.value) {
      if (newConfigOverride.fftSize && newConfigOverride.fftSize !== oldFftSize) {
        analyserNode.value.fftSize = currentConfig.value.fftSize!;
        const bufferLength = analyserNode.value.frequencyBinCount;
        frequencyData.value = new Uint8Array(bufferLength);
        timeDomainData.value = new Uint8Array(analyserNode.value.fftSize); // Time domain uses fftSize
      }
      if (newConfigOverride.smoothingTimeConstant !== undefined) {
        analyserNode.value.smoothingTimeConstant = currentConfig.value.smoothingTimeConstant!;
      }
    }
    console.log('[VoiceViz] Config updated:', currentConfig.value);
  };

  /**
   * Sets up the AudioContext, AnalyserNode, and connects the MediaStream.
   * @private
   * @returns {boolean} True if setup was successful, false otherwise.
   */
  const _setupAudioProcessing = (): boolean => {
    if (!mediaStreamRef.value || !mediaStreamRef.value.active) {
      console.warn('[VoiceViz] Setup failed: MediaStream is null or inactive.');
      _stopVisualizationInternal(); // Ensure visualization stops if stream is bad
      return false;
    }

    try {
      if (!audioContext.value || audioContext.value.state === 'closed') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            console.error("[VoiceViz] AudioContext not supported.");
            return false;
        }
        audioContext.value = new AudioCtx();
      }

      // Recreate AnalyserNode if fftSize changed or not yet created
      if (!analyserNode.value || analyserNode.value.context !== audioContext.value ||
          (currentConfig.value.fftSize && analyserNode.value.fftSize !== currentConfig.value.fftSize)) {
        if(analyserNode.value) try { analyserNode.value.disconnect(); } catch(e) {/*ignore*/}
        analyserNode.value = audioContext.value.createAnalyser();
        analyserNode.value.fftSize = currentConfig.value.fftSize!;
      }
      analyserNode.value.smoothingTimeConstant = currentConfig.value.smoothingTimeConstant!;
      
      // Recreate source node if stream changed or context changed
      if (sourceNode.value && (sourceNode.value.context !== audioContext.value || sourceNode.value.mediaStream !== mediaStreamRef.value)) {
        try { sourceNode.value.disconnect(); } catch(e) {/*ignore*/}
        sourceNode.value = null;
      }
      if (!sourceNode.value) {
        sourceNode.value = audioContext.value.createMediaStreamSource(mediaStreamRef.value);
      }

      // Ensure connection: source -> analyser (do NOT connect analyser to destination for visualization)
      try { sourceNode.value.disconnect(); } catch(e) {/*ignore, might not be connected*/}
      sourceNode.value.connect(analyserNode.value);

      // Initialize data arrays
      const bufferLength = analyserNode.value.frequencyBinCount;
      if (!frequencyData.value || frequencyData.value.length !== bufferLength) {
        frequencyData.value = new Uint8Array(bufferLength);
      }
      if (!timeDomainData.value || timeDomainData.value.length !== analyserNode.value.fftSize) {
        timeDomainData.value = new Uint8Array(analyserNode.value.fftSize);
      }
      return true;
    } catch (error) {
        console.error("[VoiceViz] Error setting up audio processing:", error);
        _stopVisualizationInternal(); // Stop if setup fails
        return false;
    }
  };
  
  /**
   * Main drawing loop for canvas animations.
   * Fetches audio data and calls the appropriate drawing function based on `visualizationType`.
   * @private
   */
  const _drawLoop = (): void => {
    if (!_isVisualizing.value) return; // Stop loop if not visualizing

    animationFrameId = requestAnimationFrame(_drawLoop); // Request next frame

    if (!analyserNode.value || !canvasRef.value || !frequencyData.value || !timeDomainData.value) {
      // console.warn('[VoiceViz] Draw loop dependencies not ready.');
      return;
    }
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get audio data
    analyserNode.value.getByteFrequencyData(frequencyData.value);
    analyserNode.value.getByteTimeDomainData(timeDomainData.value);

    // Calculate global amplitude (0-1) from time domain data
    let sum = 0;
    for (let i = 0; i < timeDomainData.value.length; i++) {
      sum += Math.abs(timeDomainData.value[i] - 128); // Values are 0-255, 128 is silence
    }
    const averageAmplitude = timeDomainData.value.length > 0 ? sum / timeDomainData.value.length / 128 : 0;
    
    // Update global CSS variables if still desired (can be removed if not used)
    _updateCssVariables(averageAmplitude);


    // Clear canvas for redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = currentConfig.value.globalVizAlpha ?? DEFAULT_VIZ_CONFIG.globalVizAlpha!;


    if (uiStore.isReducedMotionPreferred) {
      // Simple static or minimal animation for reduced motion
      ctx.fillStyle = currentConfig.value.shapeColor || DEFAULT_VIZ_CONFIG.shapeColor!;
      const indicatorSize = Math.min(canvas.width, canvas.height) / 10 + averageAmplitude * (Math.min(canvas.width, canvas.height) / 10);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.max(2, indicatorSize), 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Full animation based on type
      switch (currentConfig.value.visualizationType) {
        case 'waveform':
          _drawWaveform(ctx, timeDomainData.value, canvas.width, canvas.height, averageAmplitude);
          break;
        case 'circular':
          _drawCircular(ctx, frequencyData.value, canvas.width, canvas.height, averageAmplitude);
          break;
        case 'frequencyBars':
        default:
          _drawFrequencyBars(ctx, frequencyData.value, canvas.width, canvas.height, averageAmplitude);
          break;
      }
    }
    ctx.globalAlpha = 1.0; // Reset global alpha
  };

  /**
   * Updates global CSS custom properties with current audio analysis values.
   * This can be used for ambient effects on other UI elements.
   * @param {number} averageAmplitude - Current overall audio amplitude (0-1).
   * @private
   */
  const _updateCssVariables = (averageAmplitude: number): void => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--voice-amplitude', averageAmplitude.toFixed(3));
    // You can add more specific frequency band variables here if needed,
    // similar to previous versions, by analyzing frequencyData.value.
    // Example: Low/Mid/High band energy for more nuanced ambient effects.
  };

  /** Draws frequency bars. @private */
  const _drawFrequencyBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number, globalAmplitude: number): void => {
    const barCount = Math.min(data.length, currentConfig.value.barCount!);
    if (barCount <= 0) return;
    
    const barWidthPercentage = 0.7; // 70% of available space for the bar itself
    const spacingPercentage = 1 - barWidthPercentage; // 30% for spacing

    const totalBarPlusSpacingWidth = W / barCount;
    const barWidth = totalBarPlusSpacingWidth * barWidthPercentage;
    const barSpacing = totalBarPlusSpacingWidth * spacingPercentage;
    
    let x = barSpacing / 2; // Initial offset to center first bar
    ctx.fillStyle = currentConfig.value.shapeColor || DEFAULT_VIZ_CONFIG.shapeColor!;
    const maxBarHeight = H * 0.95; // Use most of the canvas height

    for (let i = 0; i < barCount; i++) {
      // Ensure we don't read out of bounds if barCount is very high relative to data.length
      const dataIndex = Math.min(data.length - 1, Math.floor(i * (data.length / barCount)));
      let barHeight = (data[dataIndex] / 255) * maxBarHeight;
      // Subtle pulse with global amplitude for a "living" feel
      barHeight = barHeight * (0.6 + globalAmplitude * 0.7); // Apply global amplitude factor, ensure it doesn't go to 0 easily
      barHeight = Math.min(Math.max(2, barHeight), maxBarHeight); // Min height 2px, max height
      
      const barOpacity = 0.4 + (data[dataIndex] / 255) * 0.6; // Vary alpha
      ctx.globalAlpha = (currentConfig.value.globalVizAlpha ?? 1) * barOpacity;

      ctx.fillRect(x, H - barHeight, barWidth, barHeight);
      x += totalBarPlusSpacingWidth;
    }
    // ctx.globalAlpha = currentConfig.value.globalVizAlpha ?? 1; // Reset after loop if changed inside
  };

  /** Draws a time-domain waveform. @private */
  const _drawWaveform = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number, globalAmplitude: number): void => {
    // (Implementation similar to v1.0.3, ensure themeable color and pulsing line width)
    ctx.lineWidth = (currentConfig.value.lineWidth ?? 2) * (0.8 + globalAmplitude * 0.7); // Line width pulses
    ctx.strokeStyle = currentConfig.value.shapeColor || DEFAULT_VIZ_CONFIG.shapeColor!;
    ctx.beginPath();
    if (data.length === 0) return;
    const sliceWidth = W * 1.0 / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0; // data[i] is 0-255, 128 is silence. v is 0-2.
      const y = (v * H / 2) ; // Scale to canvas height, centered at H/2
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(W, H / 2); // Ensure line finishes at the edge
    ctx.stroke();
  };

  /** Draws an organic circular/blob visualization. @private */
  const _drawCircular = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number, globalAmplitude: number): void => {
    const centerX = W / 2;
    const centerY = H / 2;
    const baseRadiusReference = Math.min(W, H) / 2; // Max possible radius related to canvas size

    // Update animation state
    pulseOffset += (currentConfig.value.circularPulseSpeed ?? 0.015) * (0.5 + globalAmplitude * 1.5); // Pulse faster with amplitude
    currentAngle += (currentConfig.value.circularRotationSpeed ?? 0.002) * (0.3 + globalAmplitude * 1.0); // Rotate slightly faster with amplitude

    // Base radius with pulsing effect, influenced by global amplitude
    const dynamicBaseRadius = baseRadiusReference *
                              (currentConfig.value.circularBaseRadiusFactor ?? 0.25) *
                              (0.8 + Math.sin(pulseOffset) * 0.2) * // Pulse factor
                              (0.6 + globalAmplitude * 0.8); // Global amplitude influence on base size

    ctx.strokeStyle = currentConfig.value.shapeColor || DEFAULT_VIZ_CONFIG.shapeColor!;
    ctx.lineWidth = (currentConfig.value.lineWidth ?? 2) * (0.7 + globalAmplitude * 0.8); // Line width also pulses
    ctx.fillStyle = currentConfig.value.shapeColor || DEFAULT_VIZ_CONFIG.shapeColor!; // For potential fill

    const numPoints = currentConfig.value.circularPointCount ?? 90;
    if (numPoints <= 0 || data.length === 0) return;

    ctx.beginPath();
    const angleStep = (2 * Math.PI) / numPoints;

    for (let i = 0; i <= numPoints; i++) { // Iterate one extra point to close the shape smoothly
      const pointAngle = (i % numPoints) * angleStep + currentAngle; // Apply rotation
      // Map data index: distribute available frequency bins across the circle points
      const dataIndex = Math.min(data.length -1, Math.floor((i % numPoints) * (data.length / numPoints)));
      const amplitudeAtPoint = data[dataIndex] / 255.0; // Normalized amplitude (0-1)

      const extension = amplitudeAtPoint *
                        baseRadiusReference *
                        (currentConfig.value.circularAmplitudeFactor ?? 0.5);
      const currentRadius = dynamicBaseRadius + Math.min(extension, currentConfig.value.circularMaxExtensionRadius ?? 40);

      const x = centerX + Math.cos(pointAngle) * currentRadius;
      const y = centerY + Math.sin(pointAngle) * currentRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        if (currentConfig.value.circularConnectionType === 'curve') {
          // For curves, need control points. This is a simplified quadratic or bezier approximation.
          // For a true organic blob, a more complex path generation is needed,
          // possibly averaging previous/next points for control points.
          // Simplified: just use lineTo for now, or use a Catmull-Rom spline if complexity allows.
          // A simple approach for "curvier":
          const prevI = (i - 1 + numPoints) % numPoints; // Ensure positive modulo
          const prevPointAngle = prevI * angleStep + currentAngle;
          const prevAmp = data[Math.min(data.length - 1, Math.floor(prevI * (data.length / numPoints)))] / 255.0;
          const prevExt = prevAmp * baseRadiusReference * (currentConfig.value.circularAmplitudeFactor ?? 0.5);
          const prevR = dynamicBaseRadius + Math.min(prevExt, currentConfig.value.circularMaxExtensionRadius ?? 40);
          const prevX = centerX + Math.cos(prevPointAngle) * prevR;
          const prevY = centerY + Math.sin(prevPointAngle) * prevR;
          
          const cp1x = (prevX + x) / 2 + (y - prevY) * (currentConfig.value.circularPointSharpness ?? 0.3);
          const cp1y = (prevY + y) / 2 - (x - prevX) * (currentConfig.value.circularPointSharpness ?? 0.3);
          ctx.quadraticCurveTo(cp1x, cp1y, x, y);

        } else { // 'line'
          ctx.lineTo(x, y);
        }
      }
    }
    ctx.closePath(); // Close the path
    // ctx.stroke(); // Stroke the path

    // Optional: Fill the shape with a more translucent version of the color
    const fillAlpha = (currentConfig.value.globalVizAlpha ?? 0.7) * 0.2 * (0.5 + globalAmplitude);
    ctx.globalAlpha = fillAlpha;
    ctx.fill();
    ctx.globalAlpha = currentConfig.value.globalVizAlpha ?? 0.7; // Reset for stroke if needed
    ctx.stroke(); // Stroke on top of fill


  };

  /** Stops the visualization loop and clears the canvas. @private */
  const _stopVisualizationInternal = (): void => {
    _isVisualizing.value = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (canvasRef.value) {
      const ctx = canvasRef.value.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      }
    }
  };

  /**
   * Starts the audio visualization.
   * Sets up audio processing if not already done and begins the drawing loop.
   * @public
   */
  const startVisualization = (): void => {
    if (_isVisualizing.value) return;
    if (!mediaStreamRef.value || !mediaStreamRef.value.active) {
      console.warn('[VoiceViz] Cannot start visualization: MediaStream is not active.');
      return;
    }
    if (!canvasRef.value) {
      console.warn('[VoiceViz] Cannot start visualization: Canvas element not available.');
      return;
    }

    if (!_setupAudioProcessing()) { // Setup (or re-setup if context/stream changed)
        console.error("[VoiceViz] Audio processing setup failed. Cannot start visualization.");
        return;
    }
    _isVisualizing.value = true;
    _drawLoop(); // Start the animation loop
    console.log('[VoiceViz] Visualization started.');
  };

  /**
   * Stops the audio visualization and clears the canvas.
   * @public
   */
  const stopVisualization = (): void => {
    if (!_isVisualizing.value) return;
    _stopVisualizationInternal();
    console.log('[VoiceViz] Visualization drawing stopped.');
  };

  // Watch for changes in the media stream to re-initialize processing if necessary
  watch(mediaStreamRef, (newStream, oldStream) => {
    if (newStream === oldStream && newStream?.active === oldStream?.active) return;

    console.log('[VoiceViz] MediaStream changed or its active state changed.');
    _stopVisualizationInternal(); // Stop current visualization and clear canvas

    if (sourceNode.value) { // Disconnect old source if it exists
        try { sourceNode.value.disconnect(); } catch(e) {/* ignore */}
        sourceNode.value = null;
    }

    if (newStream && newStream.active) {
      // If already visualizing, setup and restart. Otherwise, wait for explicit start.
      // This handles cases where the mic might change mid-visualization.
      if (_isVisualizing.value) { // This check might be redundant if _stopVisualizationInternal sets it false
          console.warn("[VoiceViz] Stream changed while visualizing. Attempting to restart. This should ideally be handled by VoiceInput re-triggering start.");
          // Ideally, VoiceInput would call stopVisualization then startVisualization.
          // For now, let's try to re-setup and continue if it was already running.
           if (_setupAudioProcessing()) {
            //   _drawLoop(); // _isVisualizing is false, so this won't run.
           } else {
               _isVisualizing.value = false; // Ensure it's marked as stopped if setup fails
           }
      }
    } else {
        // Stream became null or inactive, ensure everything is stopped.
        _isVisualizing.value = false;
    }
  }, { immediate: false, deep: false }); // `deep: false` because we only care about stream identity/active state

  // Cleanup on unmount
  onUnmounted(() => {
    console.log('[VoiceViz] Unmounting. Cleaning up audio resources.');
    _stopVisualizationInternal();
    if (sourceNode.value) { try { sourceNode.value.disconnect(); } catch(e) {/*ignore*/} sourceNode.value = null; }
    if (analyserNode.value) { try { analyserNode.value.disconnect(); } catch(e) {/*ignore*/} analyserNode.value = null; }
    if (audioContext.value && audioContext.value.state !== 'closed') {
      audioContext.value.close().catch(e => console.warn("[VoiceViz] Error closing AudioContext on unmount:", e));
    }
    audioContext.value = null;
  });

  return {
    /** Reactive boolean indicating if visualization is currently active. */
    isVisualizing: readonly(_isVisualizing),
    startVisualization,
    stopVisualization,
    updateConfig,
    /** Readonly ref to the current configuration. */
    currentConfig: readonly(currentConfig),
  };
}