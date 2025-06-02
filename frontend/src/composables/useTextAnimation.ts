// File: frontend/src/composables/useTextAnimation.ts
/**
 * @file useTextAnimation.ts
 * @description Composable for managing and applying text reveal animations.
 * This version focuses on different animation modes (character, word, line)
 * and integration with CSS animations, addressing previous TypeScript errors.
 *
 * @module composables/useTextAnimation
 * @version 1.0.1 - Corrected type for style, removed unused nextTick, explicitly typed return.
 */

import { ref, computed, type Ref, type CSSProperties } from 'vue'; // Removed nextTick
import { useUiStore } from '@/store/ui.store';
import { readonly } from 'vue'; // Import readonly for exposing state

export interface TextAnimationUnit {
  type: 'char' | 'word' | 'line';
  content: string;
  key: string;
  /** Specific style properties for animation, e.g., animationDelay, animationDuration */
  style: Partial<Pick<CSSProperties, 'animationDelay' | 'animationDuration' | 'opacity'>>;
  classes: string[];
}

export interface TextRevealConfig {
  mode: 'character' | 'word' | 'line';
  durationPerUnit: number; // ms
  staggerDelay: number;    // ms
  animationStyle: 'organic' | 'digital' | 'quantum' | 'terminal' | 'none';
  withTrail?: boolean; // Placeholder for future enhancement
  maxTotalDuration?: number; // ms
}

export interface UseTextAnimationReturn {
  animatedUnits: Ref<TextAnimationUnit[]>;
  isAnimating: Ref<boolean>;
  animateText: (text: string, configOverride?: Partial<TextRevealConfig>) => Promise<void>;
  resetAnimation: () => void;
}

const DEFAULT_TEXT_REVEAL_CONFIG: TextRevealConfig = {
  mode: 'word',
  durationPerUnit: 70, // Adjusted for slightly faster word reveal
  staggerDelay: 25,
  animationStyle: 'organic',
  withTrail: false,
};

export function useTextAnimation(
  initialConfig?: Partial<TextRevealConfig>
): UseTextAnimationReturn { // Explicitly type the return
  const uiStore = useUiStore();
  const animatedUnits = ref<TextAnimationUnit[]>([]);
  const isAnimating = ref(false);
  let animationIdCounter = 0;

  const currentConfig = computed<TextRevealConfig>(() => ({
    ...DEFAULT_TEXT_REVEAL_CONFIG,
    ...(initialConfig || {}), // Ensure initialConfig is applied
  }));

  const resetAnimation = (): void => {
    animatedUnits.value = [];
    isAnimating.value = false;
    animationIdCounter = 0;
  };

  const prepareUnits = (text: string, config: TextRevealConfig): TextAnimationUnit[] => {
    let rawUnits: string[] = [];
    // Map config.mode to the correct TextAnimationUnit type
    const unitType: 'char' | 'word' | 'line' =
      config.mode === 'character'
        ? 'char'
        : config.mode === 'word'
        ? 'word'
        : config.mode === 'line'
        ? 'line'
        : 'word'; // fallback

    switch (config.mode) {
      case 'character':
        rawUnits = text.split('');
        break;
      case 'word':
        rawUnits = text.split(/(\s+)/).filter(unit => unit.length > 0);
        break;
      case 'line':
        rawUnits = text.split('\n');
        break;
      default:
        rawUnits = [text];
    }

    return rawUnits.map((unitContent, index) => {
      const isWhitespaceWord = unitType === 'word' && unitContent.trim() === '';
      const reducedMotion = uiStore.isReducedMotionPreferred;

      const animationDelay = reducedMotion || isWhitespaceWord ? '0s' : `${index * config.staggerDelay}ms`;
      // For instant appearance on reduced motion, make duration very short but not zero to allow transition/animation to fire once
      const animationDuration = reducedMotion || isWhitespaceWord ? '0.01s' : `${config.durationPerUnit}ms`;

      let animationClass = '';
      if (config.animationStyle !== 'none' && !isWhitespaceWord) {
        if (reducedMotion) {
          animationClass = 'animate-text-static-appear-reduced-motion'; // Fast fade-in
        } else {
          switch (config.animationStyle) {
            case 'organic':
              animationClass = 'animate-text-char-bloom';
              break;
            case 'digital':
              animationClass = 'animate-text-word-materialize';
              break;
            case 'quantum':
              animationClass = 'animate-text-quantum-collapse';
              break;
            case 'terminal':
              animationClass = 'animate-text-terminal-reveal';
              break;
          }
        }
      } else if (isWhitespaceWord) {
        // No animation for whitespace, but keep it for layout
      } else { // 'none' style or fallback
        animationClass = 'animate-text-static-appear';
      }

      return {
        type: unitType,
        content: unitContent,
        key: `anim-unit-${unitType}-${animationIdCounter++}-${Math.random()}`, // Ensure more unique key
        style: {
          animationDelay,
          animationDuration,
          opacity: (reducedMotion || config.animationStyle === 'none' || isWhitespaceWord) ? '1' : '0', // Start transparent if animating
        },
        classes: [animationClass, `text-unit-${unitType}`].filter(Boolean),
      };
    });
  };

  const animateText = async (
    text: string,
    configOverride?: Partial<TextRevealConfig>
  ): Promise<void> => {
    if (isAnimating.value && !uiStore.isReducedMotionPreferred) { // Allow quick updates if reduced motion
      // console.warn('[useTextAnimation] Animation already in progress. Reset or wait.');
      // For streaming, we might want to append. For now, let new animation override.
      // For simplicity, let's allow re-triggering to reset.
    }

    resetAnimation();
    isAnimating.value = true;

    const effectiveConfig = { ...currentConfig.value, ...(configOverride || {}) };
    const unitsToAnimate = prepareUnits(text, effectiveConfig);
    animatedUnits.value = unitsToAnimate;

    const totalUnits = unitsToAnimate.filter(u => u.content.trim() !== '').length; // Count non-whitespace units for duration
    const totalAnimationTime = uiStore.isReducedMotionPreferred
      ? 50
      : (totalUnits > 0 ? ((totalUnits - 1) * effectiveConfig.staggerDelay) + effectiveConfig.durationPerUnit : 0);
    
    const finalDuration = effectiveConfig.maxTotalDuration
      ? Math.min(totalAnimationTime, effectiveConfig.maxTotalDuration)
      : totalAnimationTime;

    if (finalDuration > 0) {
      setTimeout(() => {
        if (animatedUnits.value.length === unitsToAnimate.length) { // Check if it's still the same animation
          isAnimating.value = false;
        }
      }, finalDuration + 50); // Add a small buffer
    } else {
      isAnimating.value = false;
    }
  };

  return {
    animatedUnits,
    isAnimating: readonly(isAnimating), // Expose as readonly
    animateText,
    resetAnimation,
  };
}


/**
 * Corresponding CSS classes and keyframes should be in your SCSS:
 *
 * // In _animations.scss or a dedicated _text-animations.scss
 * .animate-text-char-bloom { animation-name: charBloom; animation-fill-mode: forwards; opacity: 0; }
 * .animate-text-word-materialize { animation-name: wordMaterialize; animation-fill-mode: forwards; opacity: 0; }
 * .animate-text-quantum-collapse { animation-name: quantumCollapse; animation-fill-mode: forwards; opacity: 0; }
 * .animate-text-terminal-reveal { animation-name: terminalCharReveal; animation-fill-mode: forwards; opacity: 0; }
 * .animate-text-static-appear { opacity: 1; } // Appears instantly or with a very quick fade if desired by CSS
 * .animate-text-static-appear-reduced-motion { animation: fadeIn 0.1s ease-out forwards; opacity: 0; }
 *
 * // Example keyframes (ensure these are defined in your _keyframes.scss)
 * // @keyframes charBloom { ... }
 * // @keyframes wordMaterialize { ... }
 * // @keyframes quantumCollapse { ... }
 * // @keyframes terminalCharReveal { ... } // e.g., a typewriter or scan-in effect
 * // @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 */