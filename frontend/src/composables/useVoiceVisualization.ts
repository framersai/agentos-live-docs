// File: frontend/src/composables/useVoiceVisualization.ts
/**
 * @file useVoiceVisualization.ts
 * @description Composable for managing and rendering voice/audio visualizations.
 * Connects to an AnalyserNode, provides data for canvas drawing, and updates
 * CSS custom properties for reactive styling based on voice input.
 *
 * @module composables/useVoiceVisualization
 * @version 1.0.0
 */
import { ref, onUnmounted, type Ref, watch } from 'vue';
import { useUiStore, type VoiceAppState } from '@/store/ui.store'; // Assuming VoiceAppState is exported or re-exported by ui.store

export interface VoiceVisualizationConfig {
  fftSize?: number; // Powers of 2, e.g., 256, 512, 1024, 2048
  smoothingTimeConstant?: number; // 0 to 1, default 0.8
  visualizationType?: 'frequencyBars' | 'waveform' | 'circular'; // More can be added
  barColor?: string; // CSS color string
  barCount?: number; // For frequencyBars
  circleRadius?: number; // For circular
  lineWidth?: number;
}

const DEFAULT_VIZ_CONFIG: VoiceVisualizationConfig = {
  fftSize: 512,
  smoothingTimeConstant: 0.75,
  visualizationType: 'circular', // Default to circular as per 'Her' inspiration
  barColor: 'hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l))',
  barCount: 64,
  circleRadius: 70,
  lineWidth: 2,
};

export function useVoiceVisualization(
  mediaStream: Ref<MediaStream | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  appState?: Ref<VoiceAppState | undefined>, // Optional, for state-based effects
  configOverride?: Partial<VoiceVisualizationConfig>
) {
  const uiStore = useUiStore();
  const audioContext = ref<AudioContext | null>(null);
  const analyserNode = ref<AnalyserNode | null>(null);
  const sourceNode = ref<MediaStreamAudioSourceNode | null>(null);
  const dataArray = ref<Uint8Array | null>(null);
  const isVisualizing = ref(false);
  let animationFrameId: number | null = null;

  const currentConfig = ref<VoiceVisualizationConfig>({
    ...DEFAULT_VIZ_CONFIG,
    ...(configOverride || {}),
  });

  const frequencyData = ref<Uint8Array | null>(null);
  const timeDomainData = ref<Uint8Array | null>(null);

  const setupAudioProcessing = () => {
    if (!mediaStream.value) {
      console.warn('[VoiceViz] MediaStream is null. Cannot setup audio processing.');
      stopVisualization(); // Ensure cleanup if stream becomes null
      return false;
    }

    if (!audioContext.value) {
      audioContext.value = new AudioContext();
    }
    if (!analyserNode.value) {
      analyserNode.value = audioContext.value.createAnalyser();
      analyserNode.value.fftSize = currentConfig.value.fftSize!;
      analyserNode.value.smoothingTimeConstant = currentConfig.value.smoothingTimeConstant!;
    }
    if (sourceNode.value) {
        // Disconnect previous source if mediaStream changes identity
        sourceNode.value.disconnect();
    }

    sourceNode.value = audioContext.value.createMediaStreamSource(mediaStream.value);
    sourceNode.value.connect(analyserNode.value);

    // Do not connect analyserNode to destination if we only want to analyze, not play through
    // analyserNode.value.connect(audioContext.value.destination);

    const bufferLength = analyserNode.value.frequencyBinCount;
    dataArray.value = new Uint8Array(bufferLength); // For frequency data
    frequencyData.value = new Uint8Array(bufferLength);
    timeDomainData.value = new Uint8Array(analyserNode.value.fftSize); // For waveform data

    return true;
  };

  const updateCssVariables = (amplitude: number, presence: number) => {
    const root = document.documentElement;
    root.style.setProperty('--voice-amplitude', amplitude.toFixed(3));
    root.style.setProperty('--voice-presence', presence.toFixed(3)); // 0 if no voice, 1 if voice

    if (frequencyData.value) {
      const bufferLength = frequencyData.value.length;
      const lowEnd = Math.floor(bufferLength * 0.1);
      const midEnd = Math.floor(bufferLength * 0.4);

      let lowSum = 0;
      for (let i = 0; i < lowEnd; i++) lowSum += frequencyData.value[i];
      root.style.setProperty('--voice-frequency-low', (lowSum / lowEnd / 255).toFixed(3));

      let midSum = 0;
      for (let i = lowEnd; i < midEnd; i++) midSum += frequencyData.value[i];
      root.style.setProperty('--voice-frequency-mid', (midSum / (midEnd - lowEnd) / 255).toFixed(3));

      let highSum = 0;
      for (let i = midEnd; i < bufferLength; i++) highSum += frequencyData.value[i];
      root.style.setProperty('--voice-frequency-high', (highSum / (bufferLength - midEnd) / 255).toFixed(3));
    }
  };


  const draw = () => {
    if (!analyserNode.value || !canvasRef.value || !dataArray.value || !frequencyData.value || !timeDomainData.value) {
      if (isVisualizing.value) animationFrameId = requestAnimationFrame(draw);
      return;
    }

    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyserNode.value.getByteFrequencyData(frequencyData.value);
    analyserNode.value.getByteTimeDomainData(timeDomainData.value); // For waveform

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Calculate overall amplitude / presence
    let sum = 0;
    for (let i = 0; i < timeDomainData.value.length; i++) {
        sum += Math.abs(timeDomainData.value[i] - 128); // 128 is the zero point for waveform data
    }
    const averageAmplitude = sum / timeDomainData.value.length / 128; // Normalized 0-1
    const voicePresence = averageAmplitude > 0.02 ? 1 : 0; // Simple presence detection threshold

    updateCssVariables(averageAmplitude, voicePresence);


    if (uiStore.isReducedMotionPreferred) {
      // Minimal animation for reduced motion, e.g., a static or very subtle indicator
      ctx.fillStyle = currentConfig.value.barColor!;
      const circleRadius = Math.min(width, height) / 4 * averageAmplitude;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.max(5, circleRadius), 0, 2 * Math.PI);
      ctx.fill();
      if (isVisualizing.value) animationFrameId = requestAnimationFrame(draw);
      return;
    }

    // --- Visualization type drawing ---
    switch (currentConfig.value.visualizationType) {
      case 'waveform':
        drawWaveform(ctx, timeDomainData.value, width, height);
        break;
      case 'circular':
        drawCircularWaveform(ctx, frequencyData.value, width, height);
        break;
      case 'frequencyBars':
      default:
        drawFrequencyBars(ctx, frequencyData.value, width, height);
        break;
    }

    if (isVisualizing.value) {
      animationFrameId = requestAnimationFrame(draw);
    }
  };

  const drawFrequencyBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number) => {
    const barCount = currentConfig.value.barCount!;
    const barWidth = (W / barCount) * 0.8;
    const barSpacing = (W / barCount) * 0.2;
    let x = 0;
    ctx.fillStyle = currentConfig.value.barColor!;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (data[Math.floor(i * (data.length / barCount))] / 255) * H * 0.8;
      ctx.fillRect(x, H - barHeight, barWidth, barHeight);
      x += barWidth + barSpacing;
    }
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number) => {
    ctx.lineWidth = currentConfig.value.lineWidth!;
    ctx.strokeStyle = currentConfig.value.barColor!;
    ctx.beginPath();
    const sliceWidth = W * 1.0 / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0; // Normalize to 0-2 range
      const y = v * H / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(W, H / 2);
    ctx.stroke();
  };

  const drawCircularWaveform = (ctx: CanvasRenderingContext2D, data: Uint8Array, W: number, H: number) => {
    const centerX = W / 2;
    const centerY = H / 2;
    const baseRadius = currentConfig.value.circleRadius! * 0.5; // Base inner radius
    const maxRadiusExtension = currentConfig.value.circleRadius! * 0.8; // Max extension from base

    ctx.strokeStyle = currentConfig.value.barColor!;
    ctx.lineWidth = currentConfig.value.lineWidth!;
    ctx.beginPath();

    const numPoints = data.length / 2; // Use half of frequency data for symmetry or to reduce complexity
    for (let i = 0; i < numPoints; i++) {
        const amplitude = data[i] / 255; // Normalized 0-1
        const radius = baseRadius + amplitude * maxRadiusExtension;
        const angle = (i / numPoints) * 2 * Math.PI - Math.PI / 2; // Start from top

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();

    // Optional: Add a central pulsing orb based on overall amplitude
    const overallAmplitude = data.reduce((sum, val) => sum + val, 0) / (data.length * 255);
    ctx.fillStyle = hsla(
        `var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), ${0.2 + overallAmplitude * 0.5}`
    );
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 0.5 + overallAmplitude * baseRadius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
  };


  const startVisualization = () => {
    if (isVisualizing.value || !mediaStream.value) return;
    if (!setupAudioProcessing()) return; // Setup failed

    isVisualizing.value = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId); // Clear any old one
    animationFrameId = requestAnimationFrame(draw);
    // console.log('[VoiceViz] Visualization started.');
  };

  const stopVisualization = () => {
    if (!isVisualizing.value && !animationFrameId && !audioContext.value) return;

    isVisualizing.value = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Clear canvas
    if (canvasRef.value) {
        const ctx = canvasRef.value.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    }
    // Disconnect nodes and close context if it's not shared
    if (sourceNode.value) {
      sourceNode.value.disconnect();
      sourceNode.value = null;
    }
    if (analyserNode.value) {
      // No need to disconnect if it wasn't connected to destination
      analyserNode.value = null; // Release reference
    }
    if (audioContext.value && audioContext.value.state !== 'closed') {
      // Only close if we created it and it's not potentially shared.
      // For a composable, it's safer to assume it owns the context it creates.
      // audioContext.value.close(); // This might be too aggressive if context is used elsewhere
      // audioContext.value = null;
    }
    // console.log('[VoiceViz] Visualization stopped.');
  };

  watch(mediaStream, (newStream, oldStream) => {
    if (newStream && !oldStream) { // Stream added
        if(isVisualizing.value) { // If was already visualizing, restart with new stream
            stopVisualization(); // Stop with old stream
            setupAudioProcessing(); // Setup with new stream
            startVisualization(); // Start again
        }
    } else if (!newStream && oldStream) { // Stream removed
        stopVisualization();
    } else if (newStream && oldStream && newStream !== oldStream) { // Stream changed
        if(isVisualizing.value) {
            stopVisualization();
            setupAudioProcessing();
            startVisualization();
        }
    }
  });

  onUnmounted(() => {
    stopVisualization();
    if (audioContext.value && audioContext.value.state !== 'closed') {
      // Ensure context is closed on component unmount if we created it
      audioContext.value.close().catch(e => console.warn("[VoiceViz] Error closing AudioContext on unmount:", e));
      audioContext.value = null;
    }
  });

  return {
    isVisualizing: readonly(isVisualizing),
    startVisualization,
    stopVisualization,
    // Expose config if it needs to be changed dynamically after init
    // currentConfig: readonly(currentConfig),
    // updateConfig: (newConfig: Partial<VoiceVisualizationConfig>) => {
    //   currentConfig.value = { ...currentConfig.value, ...newConfig };
    //   // Re-initialize or update analyserNode if fftSize/smoothingTimeConstant change
    //   if (analyserNode.value && audioContext.value) {
    //      analyserNode.value.fftSize = currentConfig.value.fftSize!;
    //      analyserNode.value.smoothingTimeConstant = currentConfig.value.smoothingTimeConstant!;
    //      // Update buffer lengths if fftSize changes
    //      const bufferLength = analyserNode.value.frequencyBinCount;
    //      dataArray.value = new Uint8Array(bufferLength);
    //      frequencyData.value = new Uint8Array(bufferLength);
    //      timeDomainData.value = new Uint8Array(analyserNode.value.fftSize);
    //   }
    // }
  };
}