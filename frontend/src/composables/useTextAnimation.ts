// File: frontend/src/composables/useTextAnimation.ts
/**
 * @file useTextAnimation.ts
 * @description Composable for managing and applying text reveal animations.
 * @module composables/useTextAnimation
 * @version 1.0.3 - Refined isAnimating state management.
 */

import { ref, computed, type Ref, type CSSProperties, nextTick } from 'vue';
import { useUiStore } from '@/store/ui.store';
import { readonly } from 'vue';

export interface TextAnimationUnit {
  type: 'char' | 'word' | 'line';
  content: string;
  key: string;
  style: Partial<Pick<CSSProperties, 'animationDelay' | 'animationDuration' | 'opacity'>>;
  classes: string[];
}

export interface TextRevealConfig {
  mode: 'character' | 'word' | 'line';
  durationPerUnit: number; // ms
  staggerDelay: number;    // ms
  animationStyle: 'organic' | 'digital' | 'quantum' | 'terminal' | 'none';
  withTrail?: boolean;
  maxTotalDuration?: number;
  totalDurationEstimateFactor?: number;
}

export interface UseTextAnimationReturn {
  animatedUnits: Ref<TextAnimationUnit[]>;
  isAnimating: Ref<boolean>;
  animateText: (text: string, configOverride?: Partial<TextRevealConfig>) => Promise<void>;
  resetAnimation: () => void;
}

const DEFAULT_TEXT_REVEAL_CONFIG: TextRevealConfig = {
  mode: 'word',
  durationPerUnit: 70,
  staggerDelay: 25,
  animationStyle: 'organic',
  withTrail: false,
  totalDurationEstimateFactor: 1.0,
};

export function useTextAnimation(
  initialConfig?: Partial<TextRevealConfig>
): UseTextAnimationReturn {
  const uiStore = useUiStore();
  const animatedUnits = ref<TextAnimationUnit[]>([]);
  const isAnimating = ref(false);
  let animationIdCounter = 0;
  let currentAnimationTimeoutId: number | null = null;


  const currentConfig = computed<TextRevealConfig>(() => ({
    ...DEFAULT_TEXT_REVEAL_CONFIG,
    ...(initialConfig || {}),
  }));

  const resetAnimation = (): void => {
    if (currentAnimationTimeoutId) {
      clearTimeout(currentAnimationTimeoutId);
      currentAnimationTimeoutId = null;
    }
    animatedUnits.value = [];
    isAnimating.value = false; // Explicitly set isAnimating to false here
    animationIdCounter = 0;
  };

  const prepareUnits = (text: string, config: TextRevealConfig): TextAnimationUnit[] => {
    let rawUnits: string[] = [];
    const unitType: 'char' | 'word' | 'line' =
      config.mode === 'character'
        ? 'char'
        : config.mode === 'word'
        ? 'word'
        : config.mode === 'line'
        ? 'line'
        : 'word';

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
      const animationDuration = reducedMotion || isWhitespaceWord ? '0.01s' : `${config.durationPerUnit}ms`;

      let animationClass = '';
      if (config.animationStyle !== 'none' && !isWhitespaceWord) {
        if (reducedMotion) {
          animationClass = 'animate-text-static-appear-reduced-motion';
        } else {
          switch (config.animationStyle) {
            case 'organic': animationClass = 'animate-text-char-bloom'; break;
            case 'digital': animationClass = 'animate-text-word-materialize'; break;
            case 'quantum': animationClass = 'animate-text-quantum-collapse'; break;
            case 'terminal': animationClass = 'animate-text-terminal-reveal'; break;
          }
        }
      } else if (isWhitespaceWord) {
        // No animation
      } else {
        animationClass = 'animate-text-static-appear';
      }

      return {
        type: unitType,
        content: unitContent,
        key: `anim-unit-${unitType}-${animationIdCounter++}-${index}`, // Ensure key is stable for the same text if re-processed quickly
        style: {
          animationDelay,
          animationDuration,
          opacity: (reducedMotion || config.animationStyle === 'none' || isWhitespaceWord) ? '1' : '0',
        },
        classes: [animationClass, `text-unit-${unitType}`].filter(Boolean),
      };
    });
  };

  const animateText = async (
    text: string,
    configOverride?: Partial<TextRevealConfig>
  ): Promise<void> => {
    // Always reset before starting a new animation sequence for the given text.
    // This ensures that isAnimating is false before we prepare new units.
    resetAnimation();
    
    // Ensure the DOM has a chance to update after animatedUnits becomes empty.
    await nextTick(); 

    isAnimating.value = true; // Set to true now that we are starting to process new units.

    const effectiveConfig = { ...currentConfig.value, ...(configOverride || {}) };
    const unitsToAnimate = prepareUnits(text, effectiveConfig);
    
    // This assignment triggers reactivity. If errors persist, it might be due to how
    // the consuming component's template handles this array when it's empty vs. populated.
    animatedUnits.value = unitsToAnimate;

    const nonEmptyUnitsCount = unitsToAnimate.filter(u => u.content.trim() !== '' || u.type === 'line').length;
    
    let totalAnimationTime = 0;
    if (nonEmptyUnitsCount > 0) {
        totalAnimationTime = ((nonEmptyUnitsCount - 1) * effectiveConfig.staggerDelay) + effectiveConfig.durationPerUnit;
    }
    totalAnimationTime = uiStore.isReducedMotionPreferred ? 10 : totalAnimationTime; // Reduced motion = very fast
    
    const finalDuration = effectiveConfig.maxTotalDuration
      ? Math.min(totalAnimationTime, effectiveConfig.maxTotalDuration)
      : totalAnimationTime;

    if (finalDuration > 0) {
      currentAnimationTimeoutId = window.setTimeout(() => {
        // Only set isAnimating to false if this specific animation sequence is what completed.
        // This check is a heuristic. A more robust way would be to associate an ID with each animateText call.
        if (animatedUnits.value.length === unitsToAnimate.length && 
            animatedUnits.value[0]?.key === unitsToAnimate[0]?.key &&
            animatedUnits.value[animatedUnits.value.length -1]?.key === unitsToAnimate[unitsToAnimate.length-1]?.key
            ) {
            isAnimating.value = false;
        }
        currentAnimationTimeoutId = null;
      }, finalDuration + 50); // Small buffer for visual completion
    } else {
      isAnimating.value = false; // No duration, animation is effectively instant
    }
  };

  return {
    animatedUnits,
    isAnimating: readonly(isAnimating),
    animateText,
    resetAnimation,
  };
}