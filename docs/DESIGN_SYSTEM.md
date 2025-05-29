Design Document: "Ephemeral Harmony" - Living UI Dynamics

Core Philosophy: The UI/UX will transcend static interfaces, embodying an "evolutionary organism" that is subtly aware, directly responsive, and visually hints at the underlying intelligence. It aims for a neo-holographic aesthetic with a minimalist core, drawing inspiration from seminal sci-fi (Snow Crash, Neuromancer, Blade Runner, Ex Machina), natural phenomena (fluid dynamics, bioluminescence), and computational concepts (cellular automata, neural pathways). All interactions will be mobile-first, performant, and accessible.

I. Color & Theme System (Foundation)

    Sakura Sunset (Her-Inspired Pink Theme - Default Dark):
        Concept: Digital empathy, warmth, subtle futurism, intimacy.
        Palette:
            Backgrounds: Deep, warm, desaturated rosewood/plum (hsl(335, 30%, 12%) as primary).
            Text: Soft, warm off-white / creamy peach (hsl(20, 70%, 90%) as primary).
            Accents (Primary): Warm, desaturated Coral/Salmon (hsl(0, 85%, 70%)).
            Accents (Secondary): Soft, dusty Rose pink (hsl(340, 70%, 75%)).
            Glows: Primarily from the Coral/Salmon accent, soft and warm.
        Feeling: Inviting, organic, calm yet sophisticated.

    Twilight Neo (Overhauled Midnight Dark - Alternative Dark):
        Concept: Sleek, futuristic, neo-holographic, computational.
        Palette:
            Backgrounds: Deep, dark indigo-blue (hsl(220, 30%, 8%) as primary).
            Text: Bright, clean light blue/cyan (hsl(200, 70%, 94%) as primary) for high contrast.
            Accents (Primary): Vivid Cyan/Teal (hsl(180, 95%, 60%)).
            Accents (Secondary): Electric Violet/Purple (hsl(270, 85%, 65%)).
            Glows: Primarily Cyan/Teal and Violet, sharp and energetic.
        Feeling: High-tech, precise, energetic, intelligent.

    Aurora Daybreak (Default Light):
        Concept: Clean, refreshing, optimistic, airy.
        Palette:
            Backgrounds: Very light, cool blues/grays (hsl(210, 60%, 98%) as primary).
            Text: Dark blue-gray (hsl(220, 30%, 25%) as primary).
            Accents (Primary): Soft Pink (hsl(330, 85%, 72%)).
            Accents (Secondary): Soft Lavender (hsl(260, 75%, 78%)).
            Glows: Soft, diffused, pastel-toned.
        Feeling: Crisp, clear, calm, approachable.

    Warm Embrace (Alternative Light):
        Concept: Cozy, inviting, slightly retro-futuristic, tangible.
        Palette:
            Backgrounds: Creamy off-whites (hsl(35, 70%, 96%) as primary).
            Text: Dark warm brown (hsl(30, 20%, 25%) as primary).
            Accents (Primary): Rich Amber/Orange (hsl(25, 75%, 65%)).
            Accents (Secondary): Softer Gold/Yellow (hsl(45, 70%, 60%)).
            Glows: Warm, amber, and golden hues.
        Feeling: Comfortable, friendly, reliable.

II. Motion & Microinteraction Language

    Primary Goal: Direct responsiveness and adaptation to user input.

    Secondary Goal: Making underlying intelligence/computation visible.

    Tertiary Goal: Subtle, constant ambient awareness.

    Core Principles:
        Physics-Inspired Easing: Default to spring physics (cubic-bezier(0.64, -0.58, 0.34, 1.56)) for UI elements appearing/disappearing or reacting to clicks (dropdowns, modals, button presses). Use standard ease-out-quad for simpler state changes like color fades.
        Purposeful Motion: Animations should guide attention, provide feedback, or enhance the perceived responsiveness, not distract. Durations typically 150-350ms for microinteractions.
        Subtlety: Ambient effects should be barely noticeable consciously but contribute to an overall feeling of a "living" interface.
        Performance: Prioritize transform and opacity. Use will-change judiciously. Minimize complex SVG filter animations on multiple elements simultaneously.
        Respect User Preferences: Adhere to prefers-reduced-motion.

    Visual Motifs:
        Fluid Dynamics:
            Ripples: On button clicks, input submissions – subtle, quick outward ripple.
            Flowing Gradients/Textures: For backgrounds or active states, slowly animating gradients or noise textures.
        Bioluminescence/Auras:
            Glows: Key interactive elements (focused inputs, active buttons, speaking AI indicators) will have soft, theme-based glows. Intensity can vary with state.
            Pulsing: Rhythmic pulsing for listening states, "thinking" states, or to draw attention to new information. Based on sine waves for calm, or more complex organic patterns for active processing.
        Particle Effects (Sparingly for Key Moments):
            Data Transmission: Quick burst of particles on sending a message.
            Hover/Activation: Very subtle, localized particle shimmer on key interactive elements.
        Neural Pathways/Network Effects:
            Light Streaks: For loading indicators or visualizing data flow (e.g., in the header when AI is processing).
            Branching/Connection Animations: When revealing related information or transitioning between connected states.

III. Specific UI Element Dynamics

    VoiceInput.vue (Chat Input Area):
        Base State: Rounded corners, neo-holographic shadows giving subtle depth.
        Focus: Soft, theme-colored animated glow around the textarea border (pulsing gently).
        User Typing: Subtle inward "press" effect on keydown, immediate elastic rebound.
        Listening (Active Mic):
            Panel Glow: Entire panel border pulses rhythmically with a soft, theme-based bioluminescent glow.
            Textarea Placeholder: Placeholder text could have a subtle "breathing" opacity animation.
            hearing.svg (in Header): See Header section.
        STT Processing (After user speaks, before transcription appears):
            A quick, inward "energy gathering" animation on the panel border (e.g., border dashes converging), followed by a subtle outward "processing" pulse.
            Live transcript display area might show a subtle "neural net" or "data flow" animated background pattern.
        Transcription Appears: Text animates in word by word or smoothly, not just instantly.
        Message Sent (to backend):
            Send button has a clear, satisfying "launch" animation (e.g., icon animates, button briefly changes shape/glows intensely).
            A very quick, subtle "data streak" animation could originate from the input panel and fade upwards.
        AI Typing/Response Streaming:
            The ChatWindow.vue or Message.vue where AI response appears will show the "typing" indicator.
            The message bubble itself can have a subtle "construction" animation as text streams in – e.g., border glows or a shimmering effect travels along the text.
            Text streaming speed will be tied to the selected TTS voice's natural pace and response length. Short responses might appear with a slight "reveal" per word. Longer responses will stream character by character or word by word at a comfortable reading pace, then accelerate for very long blocks if needed, before settling.

    ChatWindow.vue / Message.vue (Chat Bubbles):
        Shape: More rounded, organic shapes (using border-radius with varying values if appropriate, or clip-path for more complex organic forms if performance allows – likely stick to complex border-radius).
        Shadows & Depth: Neo-holographic style. Drop shadows with subtle, theme-based color tints and inner glows to give a sense of light passing through or emanating from the bubble. These could subtly animate on hover or when new.
        Message Arrival: Animate in with a gentle "unfurling" or "inflation" effect (scale + opacity with spring easing), rather than a harsh slide.
        Hover on Message: Subtle lift, shadow deepens, perhaps a faint holographic shimmer on the border or a very light particle effect clinging to the edges.

    Header.vue & Sub-components:
        Overall: Fix layout shifts. Smooth transitions for any state changes (e.g., dropdown opening).
        AnimatedLogo.vue / hearing.svg:
            Idle: Existing slow breath/gradient animation.
            User Listening: hearing.svg pulses rhythmically with color-voice-user. Lines in AnimatedLogo.vue (if applicable to the main logo too) might subtly "thrum" (oscillate stroke width or glow intensity).
            AI Speaking: hearing.svg pulses with color-voice-ai-speaking. AnimatedLogo.vue might have a faster color cycle or a "wave" of light passing through its SVG.
            AI Processing/Generating: hearing.svg could show a more "computational" pattern (e.g., faster, more complex pulse or a swirling particle effect if we add one around it). AnimatedLogo.vue could have brighter, faster color shifts or a more intense glow.
        Dropdowns (VoiceControlsDropdown.vue, UserSettingsDropdown.vue, Agent Selector):
            Open/Close Animation: Spring physics easing ($ease-elastic).
            Panel Appearance: Neo-holographic (soft extrusion, subtle border glow). Dropdowns should not be overly translucent if they obscure content, but can have a glassmorphic base if the theme supports it, with opaque content.
            Item Hover: Slight "lift" or "indent" effect, theme-colored accent glow on the item's edge.
            Positioning: Ensure they always open within viewport bounds.
            Click Away: Implement for all.
        VoiceControlsDropdown.vue - Voice List: Categorized list (e.g., "Browser Standard," "OpenAI Natural," "OpenAI Expressive"). Each item shows voice name, perhaps a small icon indicating quality/type.
        Iconography: SVGs with animated hover states (e.g., lines glow, parts subtly rotate or scale) using theme colors.

    AgentHub.vue (Agent Catalog):
        Modal Appearance: Full-screen or large modal with a neo-holographic backdrop (subtle animated grid or particle field).
        Agent Cards (AgentCard.vue):
            Appearance: Neo-holographic: rounded, soft extrusion, subtle shifting gradient shadows.
            Hover: Card lifts, shadow intensifies, a faint theme-colored "energy aura" or border shimmer appears. Perhaps very subtle parallax effect on card content if performant.
            Selection: Clear visual indication with an animated checkmark and a more pronounced, persistent aura/glow.
            Grid Animation: When filtering/searching, cards animate in/out smoothly using <TransitionGroup> with physics-based staggers.

    Settings.vue:
        Sections (SettingsSection.vue): Styled as neo-holographic cards.
        Interactive Elements (Toggles, Sliders, Selects):
            Toggles: "Knob" animates with spring physics. Track changes color smoothly. Subtle glow when active.
            Sliders: Thumb has a tactile feel on drag. Track fill animates smoothly.
            Selects: Custom dropdown arrow. Menu appears with spring physics.

IV. Streaming Text Output (AI Responses):

    Natural Pacing: Instead of a fixed character-per-second, the streaming speed will be influenced by:
        TTS Speed Setting (if available): If the user has a TTS speed preference, the visual text streaming can try to mimic that general pace.
        Response Length:
            Short Responses (e.g., < 10-15 words): Can stream slightly slower, word-by-word or small phrase by small phrase, with a gentle "reveal" animation for each word. This gives a more deliberate, thoughtful feel.
            Medium Responses: Stream at a comfortable reading pace, word-by-word or character-by-character with chunking.
            Long Responses: Start at a comfortable pace, then can slightly accelerate for paragraphs of plain text, slowing down again for code blocks or complex formatting to ensure readability. The "streaming cursor" (▋) will always be present.
        Content Type: Code blocks might stream slightly differently (e.g., line by line, or with syntax highlighting appearing as it streams).
    Visual Effect: As text streams, a very subtle, theme-colored "energy trail" or "highlight" could follow the last few characters, fading quickly, giving a sense of active generation.