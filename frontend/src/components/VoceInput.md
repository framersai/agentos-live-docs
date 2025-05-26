Voice Input and Speech Detection in the UI 🎤

The VoiceInput.vue component is the heart of the client-side voice interaction. It manages microphone access, audio capture, different recording modes, and interfaces with speech-to-text (STT) services.
1. Initialization and Permissions

    Permission Check: On component mount (onMounted), it checks the current microphone permission status using navigator.permissions.query({ name: 'microphone' }).
        It updates the permissionStatus (e.g., 'granted', 'prompt', 'denied') and permissionMessage accordingly.
        It also sets up an onchange listener to react to permission changes made by the user in browser settings.
    Initial State: If permission is already 'granted' and the mode is 'continuous' or 'voice-activation', it attempts to start audio capture automatically.
    User Prompt: If permission is 'prompt', the user needs to click the microphone button, which then triggers requestMicrophonePermissionsAndGetStream.

2. Requesting Microphone Access

    The requestMicrophonePermissionsAndGetStream function:
        Calls navigator.mediaDevices.getUserMedia(constraints) to request access.
            constraints can specify a deviceId if a particular microphone is selected in settings, and includes options like echoCancellation, noiseSuppression, and autoGainControl.
        If successful:
            It updates permissionStatus to 'granted'.
            Stores the MediaStream in activeStream.
            Initializes an AudioContext and an AnalyserNode (analyser) to process audio for volume levels and VAD.
            The microphoneSourceNode is created from the stream and connected to the analyser.
        If failed (e.g., user denies permission):
            It updates permissionStatus and permissionMessage to reflect the error (e.g., 'denied', 'error').

3. Audio Capture and STT Preference

The system supports two main STT (Speech-to-Text) preferences, managed by voiceSettingsManager.settings.sttPreference:

    browser_webspeech_api: Uses the browser's built-in Web Speech API (SpeechRecognition or webkitSpeechRecognition).
    whisper_api: Uses MediaRecorder to capture audio, which is then sent to the backend /api/stt endpoint for transcription by OpenAI Whisper.

The toggleRecording button is the primary user control to start/stop audio capture, its behavior adapting to the current mode and STT preference.
a. Browser Web Speech API (browser_webspeech_api)

    Initialization: initializeWebSpeech creates and configures a SpeechRecognition instance.
        recognition.lang is set from settings.speechLanguage.
        recognition.continuous and recognition.interimResults are set based on the audio input mode.
    Starting: startWebSpeechRecognition calls recognition.start().
        isWebSpeechListening is set to true.
        Visual cues like isRecording might be set for PTT/VAD.
    Events:
        onresult: Captures interim and final transcription results.
            In Continuous mode, final parts update pendingTranscriptWebSpeech, and interim parts update liveTranscriptWebSpeech.
            In PTT/VAD mode, results update interimTranscriptWebSpeech and finalTranscriptWebSpeech.
        onerror: Handles errors like 'no-speech', 'not-allowed'. It attempts to restart recognition in continuous/VAD modes if the error isn't fatal.
        onend: When recognition stops.
            In PTT mode, if finalTranscriptWebSpeech has content, it's sent.
            In Continuous/VAD modes, it attempts to restart recognition if the main microphone toggle is still active and no processing is ongoing.
        onspeechstart/onspeechend: Log speech detection events.

b. Whisper API (whisper_api)

    MediaRecorder:
        startWhisperMediaRecorder:
            Ensures activeStream is available (requests permission if needed).
            Creates a MediaRecorder instance with the activeStream (preferring 'audio/webm;codecs=opus').
            ondataavailable: Pushes audio chunks into audioChunks.
            onstop:
                Creates a Blob from audioChunks.
                If the blob size is sufficient, calls transcribeWithWhisper to send it to the backend.
                Resets isRecording and the recording timer.
                In Continuous/VAD (hybrid) mode, if the main toggle is still active, it restarts the Web Speech API (startWebSpeechRecognition) which acts as the VAD trigger for Whisper.
            onerror: Handles recording errors.
            mediaRecorder.start() is called. For continuous/VAD, it might record in chunks (e.g., every 10 seconds, though this seems to be primarily handled by VAD speech end for Whisper).
        stopWhisperMediaRecorder: Calls mediaRecorder.stop().
    Transcription:
        transcribeWithWhisper(audioBlob):
            Creates FormData and appends the audioBlob.
            Sends a POST request to /api/stt via speechAPI.transcribe.
            If successful, calls sendTranscription with the received text.
    Hybrid VAD for Whisper: In 'continuous' or 'voice-activation' modes with whisper_api:
        The Web Speech API (recognition) is started to detect speech (onspeechstart, onspeechend) or use rawAudioLevel from the analyser.
        When speech starts (or audio level exceeds VAD threshold), startWhisperMediaRecorder() is called to begin capturing audio for Whisper.
        When speech ends (or silence is detected after voice for a duration), stopWhisperMediaRecorder() is called, which then sends the audio chunk. The Web Speech API VAD then reactivates.

4. Audio Input Modes

Managed by voiceSettingsManager.settings.audioInputMode:

    Push-to-Talk (push-to-talk):
        Action: User presses and holds the microphone button.
        Start: toggleRecording calls startAudioCapture.
            browser_webspeech_api: startWebSpeechRecognition() is called. isRecording becomes true.
            whisper_api: startWhisperMediaRecorder() is called. isRecording becomes true.
        Stop: User releases the microphone button (implicitly handled by UI events not shown in this snippet, but toggleRecording would be called again). stopAudioCapture is invoked.
            browser_webspeech_api: recognition.stop() is called. The result is sent in onend.
            whisper_api: mediaRecorder.stop() is called. The audio is sent in onstop.
    Continuous (continuous):
        Action: User clicks the microphone button once to toggle listening on/off.
        Start: toggleRecording calls startAudioCapture.
            browser_webspeech_api: startWebSpeechRecognition() with recognition.continuous = true. Transcriptions accumulate in pendingTranscriptWebSpeech. Pause detection (resetPauseDetectionWebSpeech) with auto-send (if settings.continuousModeAutoSend is true) sends the pendingTranscriptWebSpeech after settings.continuousModePauseTimeoutMs of silence.
            whisper_api (Hybrid VAD): startWebSpeechRecognition() is called to act as a VAD. onspeechstart triggers startWhisperMediaRecorder, and onspeechend (or VAD silence timer via audio level) triggers stopWhisperMediaRecorder to send chunks.
        Stop: User clicks the microphone button again. toggleRecording calls stopAudioCapture.
            Any pendingTranscriptWebSpeech (for browser STT) is sent before stopping.
    Voice Activation (voice-activation or VAD):
        Action: User clicks the microphone button once to toggle VAD on/off.
        Start: toggleRecording calls startAudioCapture.
            browser_webspeech_api: startWebSpeechRecognition() with recognition.continuous = true (or it restarts on its own after each utterance). Speech end naturally triggers sending.
            whisper_api (Hybrid VAD): Similar to continuous Whisper. startWebSpeechRecognition() for VAD.
                startAudioLevelMonitoring checks rawAudioLevel against settings.vadThreshold.
                If level > threshold: startWhisperMediaRecorder(). vadSilenceTimer is set using settings.vadSilenceTimeoutMs.
                If level < threshold for vadSilenceTimeoutMs: stopWhisperMediaRecorder() is called.
                The Web Speech VAD listener is then typically restarted.
        Stop: User clicks the microphone button again. toggleRecording calls stopAudioCapture.

5. Sound Processing and Visual Feedback (Client-Side)

    Audio Level Monitoring:
        startAudioLevelMonitoring uses the AnalyserNode (analyser) to get audio frequency data (analyser.getByteFrequencyData(dataArray)).
        It calculates an average volume (rawAudioLevel, audioLevelDisplay) periodically (every 50ms).
        This drives the visual audio bars (<div class="audio-bar">) in the UI.
    VAD Visualization:
        If VAD mode is active, drawVADVisualization uses the dataArray from the analyser to draw a frequency spectrum on a <canvas ref="vadCanvasRef">.
        A line representing settings.vadThreshold is also drawn.
    Recording Timer:
        startRecordingTimer updates recordingSeconds every 100ms, displayed in the UI.
        It has a max recording time (e.g., 60s) for PTT/VAD modes, after which it auto-stops.

6. UI State and Feedback

The UI provides rich feedback:

    Mode Indicator: Displays the current mode (PTT, Continuous, VAD) and STT method (Whisper/Browser). The dot color changes based on state (idle, standby, active).
    Button State: The main microphone button changes appearance (icon, color, animation) based on whether it's idle, recording, or processing. It's disabled if permissions are denied or an error occurs.
    Status Bar:
        Shows permission status messages (e.g., "Microphone access denied," "Requesting microphone access...").
        Displays recording status (e.g., "Recording (Whisper)...", "Listening continuously (Browser)...", "Pause detected...").
        Shows a processing message when props.isProcessing is true.
    Live Transcription Preview (Continuous Browser STT):
        liveTranscriptWebSpeech (interim) and pendingTranscriptWebSpeech (finalized parts) are shown.
        Allows editing, clearing, or sending the pendingTranscriptWebSpeech.
        Shows a pause countdown for auto-send.
    Transcription History: Recently transcribed and sent/unsent items can be viewed and resent.
    Error Toasts: Uses an injected toast service to show errors (e.g., "Transcription Error," "Browser Not Supported").

7. Sending Transcriptions

    sendTranscription(text):
        Emits a transcription event with the text.
        Adds the text to transcriptionHistory.
    This function is called:
        After successful Whisper transcription.
        From Web Speech API's onend (for PTT) or after pause detection/manual send (for Continuous).
        When submitting text manually via the textarea.
    Cleanup: cleanUpAfterTranscription resets various transcript states and timers.
    Stop All Audio: stopAllAudioProcessing is a comprehensive cleanup function called on mode changes, unmount, or when explicitly stopping.

This multi-faceted approach allows for flexible voice input, catering to different user preferences and browser capabilities, while providing clear feedback throughout the process.
