Design Document: "Ephemeral Harmony" - Living UI Dynamics

Core Philosophy: The UI/UX will transcend static interfaces, embodying an "evolutionary organism" that is subtly aware, directly responsive, and visually hints at the underlying intelligence. It aims for a neo-holographic aesthetic with a minimalist core, drawing inspiration from seminal sci-fi (Snow Crash, Neuromancer, Blade Runner, Ex Machina), natural phenomena (fluid dynamics, bioluminescence), and computational concepts (cellular automata, neural pathways). All interactions will be mobile-first, performant, and accessible.

I. Color & Theme System (Foundation)

🌸 Sakura Sunset (Her-Inspired Pink Theme - Default Dark)

    Concept: Digital empathy, warmth, subtle futurism, intimacy. Inspired by the film "Her." Focus on softer, warmer, and more prominent pinks, creating a calm, readable, and inviting atmosphere.
    Palette:
        Backgrounds:
            Primary (Main UI background): hsl(340, 25%, 16%) (Very dark, muted warm rose – a deep, soft pinkish base rather than plum)
            Secondary (Cards, panels, distinct sections): hsl(340, 22%, 22%) (Slightly lighter dark muted warm rose)
            Tertiary (Subtle hovers, UI element backgrounds): hsl(340, 20%, 28%) (A step lighter for depth)
        Text:
            Primary (Main content text): hsl(25, 60%, 92%) (Soft, creamy peach/warm off-white – for excellent readability and warmth)
            Secondary (Less prominent text, captions): hsl(345, 25%, 75%) (Muted, soft pinkish-grey)
            Muted (Placeholders, disabled text): hsl(340, 15%, 60%) (Darker, desaturated pinkish-grey)
        Accents:
            Primary (Key interactive elements, highlights, "bright pink"): hsl(335, 80%, 72%) (A clear, vibrant warm pink – distinct but not jarring)
            Primary Variants (for hover, active states):
                Light: hsl(335, 85%, 78%)
                Dark: hsl(335, 75%, 65%)
            Secondary (Supporting accents, icons, "light pink"): hsl(345, 75%, 80%) (A soft, lighter, warm pink – harmonious and gentle)
        Borders:
            Primary (Standard UI element borders): hsl(340, 15%, 35%) (Subtle, harmonizing with backgrounds)
            Interactive/Focus (Borders for focused or active accented items): hsl(335, 70%, 60%) (A darker shade of the primary accent pink)
        Glows: Primarily derived from the Primary Accent Pink (hsl(335, 80%, 72%) with varying alpha values like 0.3-0.5), creating a soft, diffused, and warm emission.
    Feeling: Intimate, warm, calming, subtly futuristic, with a distinct soft pink ambiance. Designed to be highly readable and visually soothing, avoiding chaotic brightness.

🌌 Twilight Neo (Overhauled Midnight Dark - Alternative Dark)

    Concept: Sleek, futuristic, neo-holographic, computational.
    Palette:
        Backgrounds: Deep, dark indigo-blue (hsl(220, 30%, 8%) as primary).
        Text: Bright, clean light blue/cyan (hsl(200, 70%, 94%) as primary) for high contrast.
        Accents (Primary): Vivid Cyan/Teal (hsl(180, 95%, 60%)).
        Accents (Secondary): Electric Violet/Purple (hsl(270, 85%, 65%)).
        Glows: Primarily Cyan/Teal and Violet, sharp and energetic.
    Feeling: High-tech, precise, energetic, intelligent.

☀️ Aurora Daybreak (Default Light)

    Concept: Clean, refreshing, optimistic, airy.
    Palette:
        Backgrounds: Very light, cool blues/grays (hsl(210, 60%, 98%) as primary).
        Text: Dark blue-gray (hsl(220, 30%, 25%) as primary).
        Accents (Primary): Soft Pink (hsl(330, 85%, 72%)).
        Accents (Secondary): Soft Lavender (hsl(260, 75%, 78%)).
        Glows: Soft, diffused, pastel-toned.
    Feeling: Crisp, clear, calm, approachable.

🤗 Warm Embrace (Alternative Light)

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

IV. Streaming Text Output (AI Responses):

    Natural Pacing: Instead of a fixed character-per-second, the streaming speed will be influenced by:
        TTS Speed Setting (if available): If the user has a TTS speed preference, the visual text streaming can try to mimic that general pace.
        Response Length:
            Short Responses (e.g., < 10-15 words): Can stream slightly slower, word-by-word or small phrase by small phrase, with a gentle "reveal" animation for each word. This gives a more deliberate, thoughtful feel.
            Medium Responses: Stream at a comfortable reading pace, word-by-word or character-by-character with chunking.
            Long Responses: Start at a comfortable pace, then can slightly accelerate for paragraphs of plain text, slowing down again for code blocks or complex formatting to ensure readability. The "streaming cursor" (▋) will always be present.
        Content Type: Code blocks might stream slightly differently (e.g., line by line, or with syntax highlighting appearing as it streams).
    Visual Effect: As text streams, a very subtle, theme-colored "energy trail" or "highlight" could follow the last few characters, fading quickly, giving a sense of active generation.