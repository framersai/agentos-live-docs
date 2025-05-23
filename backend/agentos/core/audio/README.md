# AgentOS Audio Processing Subsystem

<p align="center">
  <img src="./path/to/your/audio_diagram_conceptual.png" alt="Audio Processing Pipeline Diagram" width="600">
  <em>Conceptual Diagram of the Audio Processing Pipeline. (Actual diagram to be created)</em>
</p>

## Overview

The AgentOS Audio Processing Subsystem is a sophisticated client-side pipeline designed to capture, analyze, and prepare voice input for interaction with AI agents. It intelligently handles environmental noise, detects voice activity with adaptive sensitivity, and identifies meaningful pauses and utterance boundaries to ensure natural and efficient voice-driven interactions.

This subsystem operates entirely within the user's web browser, leveraging Web Audio APIs for real-time performance and privacy.

## Key Components

The pipeline consists of four primary modules that work in concert:

1.  **`EnvironmentalCalibrator.ts` (Web-based)**
    * **Purpose:** Understands and adapts to the user's acoustic environment.
    * **Functionality:**
        * Performs an initial calibration using the `MediaStream` to create a baseline `NoiseProfile` (including RMS, peak RMS, noise standard deviation, and optionally frequency analysis via `AnalyserNode`).
        * Continuously adapts the `NoiseProfile` by processing incoming audio frames (`Float32Array`) provided by the `AudioProcessor`.
        * Classifies the environment (`quiet`, `normal`, `noisy`, `very_noisy`).
        * Suggests adaptive speech and silence thresholds based on the current environment.
        * Detects audio anomalies (e.g., sudden loud noises, mutes).
    * **Key Events Emitted:** `calibration:started`, `calibration:progress`, `calibration:complete`, `calibration:error`, `profile:updated`, `environment:changed`, `anomaly:detected`.

2.  **`AdaptiveVAD.ts` (Logic-based)**
    * **Purpose:** Detects human speech in real-time with sensitivity that adapts to the current noise profile.
    * **Functionality:**
        * Receives `NoiseProfile` updates from the `EnvironmentalCalibrator`.
        * Processes `Float32Array` audio frames and their duration (`frameDurationMs`).
        * Dynamically adjusts its internal speech and silence detection thresholds based on the noise profile and its own sensitivity configuration.
        * Calculates frame energy (RMS) and uses smoothed energy for detection.
        * Implements hysteresis to prevent rapid toggling of speech state.
        * Manages state for minimum speech duration and maximum silence duration within speech.
    * **Key Events Emitted:** `speech_start`, `speech_end`, `voice_activity`, `no_voice_activity`, `thresholds_updated`.

3.  **`AudioProcessor.ts` (Web-based Orchestrator)**
    * **Purpose:** Manages the overall client-side audio pipeline, from `MediaStream` input to VAD event generation and speech chunk creation.
    * **Functionality:**
        * Initializes with a `MediaStream` from the user's microphone.
        * Sets up the Web Audio API graph (`AudioContext`, `MediaStreamAudioSourceNode`, `ScriptProcessorNode`).
        * Orchestrates `EnvironmentalCalibrator` for initial calibration using the `MediaStream`.
        * In its `onaudioprocess` loop (from `ScriptProcessorNode`):
            * Provides raw audio frames (`Float32Array`) to `EnvironmentalCalibrator` for continuous adaptation.
            * Provides raw audio frames and calculated `frameDurationMs` to `AdaptiveVAD` for voice activity detection.
        * Buffers audio frames identified by `AdaptiveVAD` as speech.
        * Constructs complete `SpeechAudioChunk` objects when `AdaptiveVAD` signals `speech_end`.
    * **Key Events Emitted:** Forwards events from `Calibrator` and `VAD`, plus `processor:initialized`, `processor:started`, `processor:stopped`, `processor:error`, `speech_chunk_ready`, `raw_audio_frame`.

4.  **`SilenceDetector.ts` (Logic-based)**
    * **Purpose:** Interprets events and states from `AdaptiveVAD` (via `AudioProcessor`) to detect higher-level conversational silences, such as significant pauses or the end of a user's complete utterance.
    * **Functionality:**
        * Receives notifications of VAD state changes (`speech_start`, `speech_end`, `voice_activity`, `no_voice_activity`) from the `AudioProcessor`.
        * Tracks the duration of silence occurring *after* a speech segment.
        * Uses configurable thresholds (`significantPauseThresholdMs`, `utteranceEndThresholdMs`, `minSilenceTimeToConsiderAfterSpeech`) to make decisions.
        * Manages an internal timer (`silenceCheckIntervalMs`) to accurately measure long silences even if VAD state isn't changing frequently.
    * **Key Events Emitted:** `significant_pause_detected`, `utterance_end_detected`, `post_speech_silence_started`.

## Data Flow & Interaction

```mermaid
graph LR
    A[User Microphone MediaStream] --> B(AudioProcessor);
    B -- Manages & Provides Stream --> C(EnvironmentalCalibrator for Initial Calibration);
    C -- NoiseProfile Updates --> D(AdaptiveVAD);
    C -- NoiseProfile Updates Also Inform --> B;
    B -- Provides AudioFrames & frameDurationMs --> D;
    B -- Provides AudioFrames --> C(EnvironmentalCalibrator for Continuous Adaptation);
    D -- VAD Events (speech_start, speech_end, etc.) --> B;
    B -- Forwards VAD Events & Controls --> E(SilenceDetector);
    E -- Conversational Silence Events (significant_pause, utterance_end) --> F((To AgentOS Core / Transcription Service));
    B -- speech_chunk_ready (Buffered Audio) --> F;

    subgraph Client-Side Audio Pipeline
        direction LR
        B
        C
        D
        E
    end

(This Mermaid diagram shows the conceptual flow. You'll need a Mermaid renderer to see it, or I can describe it textually if preferred.)

Textual Description of Diagram:

    User's Microphone MediaStream is input to the AudioProcessor.
    AudioProcessor manages and provides this stream to EnvironmentalCalibrator for its initial calibration.
    EnvironmentalCalibrator provides NoiseProfile updates to both AdaptiveVAD and back to AudioProcessor (for state/logging).
    AudioProcessor provides continuous audio frames and frameDurationMs to AdaptiveVAD.
    AudioProcessor also provides audio frames to EnvironmentalCalibrator for its continuous adaptation post-initial calibration.
    AdaptiveVAD emits VAD events (like speech_start, speech_end) back to AudioProcessor.
    AudioProcessor forwards these VAD events to and controls the SilenceDetector.
    SilenceDetector emits conversational silence events (like significant_pause_detected, utterance_end_detected). These, along with speech_chunk_ready (buffered audio) from AudioProcessor, are then ready for the main AgentOS Core or a Transcription Service.

Configuration

Each module (EnvironmentalCalibrator, AdaptiveVAD, AudioProcessor, SilenceDetector) has its own configuration interface (e.g., CalibrationConfig, AdaptiveVADConfig, etc.) allowing fine-tuning of parameters such as:

    Calibration duration and buffer sizes.
    VAD sensitivity and timing thresholds (min speech, max pause).
    Silence detection thresholds for pauses and utterance ends.
    Sample rates and frame sizes.

Refer to the JSDoc comments within each module's source code for detailed configuration options.
Usage

    Obtain a MediaStream from the user's microphone (typically via navigator.mediaDevices.getUserMedia).
    Instantiate EnvironmentalCalibrator, AdaptiveVAD, and SilenceDetector with desired configurations.
    Instantiate AudioProcessor with its configuration and the instances of the other modules.
    Call audioProcessor.initialize(mediaStream).
    Once initialized, call audioProcessor.start() to begin processing. User interaction might be required for the AudioContext to resume.
    Listen to events from AudioProcessor (e.g., speech_chunk_ready) and SilenceDetector (e.g., utterance_end_detected) to trigger further actions like sending audio for transcription or signaling to an AI agent.
    Call audioProcessor.stop() to halt processing and audioProcessor.dispose() to clean up all resources.

This subsystem provides the foundational voice input intelligence for a responsive and adaptive voice-driven application.