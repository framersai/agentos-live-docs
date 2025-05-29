// File: frontend/src/components/header/SiteMenuDropdown.vue
/**
 * @file SiteMenuDropdown.vue
 * @description A dropdown menu component for primary site navigation links (About, App Settings).
 * Features a custom animated "Nexus Orb" SVG icon as its trigger, which is theme-aware
 * and responds to interaction states. Adheres to the "Ephemeral Harmony" design system.
 *
 * @component SiteMenuDropdown
 * @props None
 * @emits None directly. Navigation is handled by Vue Router.
 *
 * @example
 * <SiteMenuDropdown />
 */
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue';
import { RouterLink } from 'vue-router';
// Icons for navigation items within the panel
import {
  InformationCircleIcon, // For "About VCA"
  Cog8ToothIcon,         // For "App Settings"
} from '@heroicons/vue/24/outline';

/**
 * @ref {Ref<boolean>} isOpen - Reactive ref to control the visibility of the dropdown panel.
 * True if the dropdown is open, false otherwise.
 */
const isOpen: Ref<boolean> = ref(false);

/**
 * @ref {Ref<HTMLElement | null>} dropdownContainerRef - Template ref for the root `div` of the dropdown.
 * This is used to detect clicks outside the dropdown area to close it.
 */
const dropdownContainerRef: Ref<HTMLElement | null> = ref(null);

/**
 * @function toggleDropdown
 * @description Toggles the visibility state (`isOpen`) of the dropdown panel.
 * Activates or deactivates icon animations based on the new state.
 * @returns {void}
 */
const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

/**
 * @function closeDropdown
 * @description Closes the dropdown panel by setting `isOpen` to false.
 * @returns {void}
 */
const closeDropdown = (): void => {
  isOpen.value = false;
};

/**
 * @function handleClickOutside
 * @description Event handler for 'mousedown' events on the document. If a click occurs
 * outside the `dropdownContainerRef` element, it closes the dropdown.
 * @param {MouseEvent} event - The mousedown event object.
 * @returns {void}
 */
const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Lifecycle hooks to add/remove the click-outside listener
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, true);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside, true);
});

/**
 * @computed iconStateClass
 * @description Determines the CSS class for the icon based on the dropdown's open state.
 * This class is used to trigger different animations for the "Nexus Orb" icon.
 * @returns {object} An object with a single key 'active' which is true if the dropdown is open.
 */
const iconStateClass = computed(() => ({
  'active': isOpen.value,
}));

</script>

<template>
  <div class="relative header-control-item site-menu-dropdown-wrapper" ref="dropdownContainerRef">
    <button
      @click="toggleDropdown"
      id="site-menu-trigger-button"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button nexus-orb-trigger"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      aria-controls="site-menu-panel"
      title="Site Menu"
      :class="iconStateClass"
    >
      <svg
        class="nexus-orb-svg"
        viewBox="-50 -50 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="nexus-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
           <filter id="nexus-satellite-glow-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="satelliteBlur"/>
            <feMerge>
              <feMergeNode in="satelliteBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle class="nexus-orb-center" cx="0" cy="0" r="7" />

        <g class="nexus-orb-satellites">
          <circle class="nexus-orb-satellite satellite-1" r="4" />
          <circle class="nexus-orb-satellite satellite-2" r="4" />
          <circle class="nexus-orb-satellite satellite-3" r="4" />
        </g>

        <path class="nexus-orb-tendril tendril-1" d="M0,0 Q10,-15 20,-25" />
        <path class="nexus-orb-tendril tendril-2" d="M0,0 Q-5,20 -15,28" />
        <path class="nexus-orb-tendril tendril-3" d="M0,0 Q20,10 28,5" />
      </svg>
      <span class="sr-only">Open Site Menu</span>
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        id="site-menu-panel"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-64 origin-top-right"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="site-menu-trigger-button"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">Site Navigation</h3>
        </div>
        <div class="dropdown-content-ephemeral p-1" role="none">
          <RouterLink
            to="/about"
            class="dropdown-item-ephemeral group"
            role="menuitem"
            @click="closeDropdown"
          >
            <InformationCircleIcon class="dropdown-item-icon" aria-hidden="true" />
            About VCA
          </RouterLink>

          <RouterLink
            to="/settings"
            class="dropdown-item-ephemeral group"
            role="menuitem"
            @click="closeDropdown"
          >
            <Cog8ToothIcon class="dropdown-item-icon" aria-hidden="true" />
            App Settings
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
/**
 * Scoped SCSS for SiteMenuDropdown.vue.
 * Contains styles for the custom "Nexus Orb" SVG trigger icon and its animations.
 * Relies on shared dropdown styles for the panel and items.
 */
@use '@/styles/abstracts/variables' as var;
@use '@/styles/abstracts/mixins' as mixins; // For potential mixin use

.header-control-item {
  position: relative; // Context for the absolute dropdown panel
}

.nexus-orb-trigger {
  // Base styling from .direct-header-button in _header.scss
  // Ensure it has enough space for the SVG icon
  padding: calc(var.$spacing-sm - 2px) !important; // Adjust padding if SVG is larger
  width: calc(var.$header-height-mobile * 0.7); // Example size, adjust as needed
  height: calc(var.$header-height-mobile * 0.7);
  @media (min-width: var.$breakpoint-md) {
    width: calc(var.$header-height-desktop * 0.55);
    height: calc(var.$header-height-desktop * 0.55);
  }

  .nexus-orb-svg {
    width: 100%; // SVG takes full space of button
    height: 100%;
    overflow: visible; // Allow glows to extend slightly
    transition: transform var.$duration-smooth var.$ease-elastic;

    // Base colors from theme using CSS variables
    --orb-center-fill: hsl(var(--color-text-muted-h), var(--color-text-muted-s), calc(var(--color-text-muted-l) + 10%));
    --orb-satellite-fill: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
    --orb-tendril-stroke: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0); // Initially transparent
    --orb-center-glow: hsla(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.3);
    --orb-satellite-glow: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.2);
  }
}

.nexus-orb-center {
  fill: var(--orb-center-fill);
  filter: url(#nexus-glow-filter);
  animation: nexus-center-pulse 4s var.$ease-in-out-sine infinite alternate;
  transition: fill var.$duration-quick, r var.$duration-smooth var.$ease-elastic;
}

.nexus-orb-satellites {
  // Group for collective transformations if needed (e.g., on open state)
  transition: transform var.$duration-smooth var.$ease-elastic;
}

.nexus-orb-satellite {
  fill: var(--orb-satellite-fill);
  filter: url(#nexus-satellite-glow-filter);
  transform-origin: center;
  // Individual satellite animation for orbiting
  &.satellite-1 { animation: nexus-orbit-1 7s linear infinite; }
  &.satellite-2 { animation: nexus-orbit-2 7.5s linear infinite reverse; } // Slightly different timing/direction
  &.satellite-3 { animation: nexus-orbit-3 8s linear infinite; }
  transition: fill var.$duration-quick, r var.$duration-smooth var.$ease-elastic;
}

.nexus-orb-tendril {
  stroke: var(--orb-tendril-stroke);
  stroke-width: 0.75;
  fill: none;
  stroke-linecap: round;
  opacity: 0;
  transition: opacity var.$duration-smooth, stroke var.$duration-quick,
              stroke-dasharray var.$duration-smooth var.$ease-out-quad,
              stroke-dashoffset var.$duration-smooth var.$ease-out-quad;
  // For dashed line animation if desired (e.g., drawing in)
  // stroke-dasharray: 50;
  // stroke-dashoffset: 50;
}

// --- Hover and Focus States for the Trigger Button ---
.nexus-orb-trigger:hover,
.nexus-orb-trigger:focus-visible {
  .nexus-orb-svg {
    // Slightly scale the whole SVG on hover for a "breathing" feel
    // transform: scale(1.05); // This is handled by direct-header-button hover usually

    // Change SVG element colors using updated CSS variable values
    --orb-center-fill: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
    --orb-satellite-fill: hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l));
    --orb-tendril-stroke: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.8);
    --orb-center-glow: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.6);
    --orb-satellite-glow: hsla(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.4);
  }

  .nexus-orb-center {
    // Optional: slightly increase radius on hover
    // r: 7.5;
    animation-play-state: paused; // Pause idle pulse to replace with hover glow
  }
  .nexus-orb-satellite {
    // Optional: slightly increase radius on hover
    // r: 4.5;
    animation-play-state: running; // Ensure orbit continues or speeds up slightly (speed controlled by CSS var if needed)
  }
  .nexus-orb-tendril {
    opacity: 1;
    // stroke-dashoffset: 0; // Animate tendrils drawing in
  }
}

// --- Active/Open State (Dropdown is visible) ---
.nexus-orb-trigger.active { // When isOpen is true
  .nexus-orb-svg {
    // Example: Rotate the entire icon slightly or change its scale
    // transform: rotate(45deg) scale(0.9); // This is handled by direct-header-button active usually
    --orb-center-fill: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    --orb-satellite-fill: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), calc(var(--color-accent-interactive-l) + 10%));
    --orb-tendril-stroke: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.9);
    --orb-center-glow: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.7);
  }
  .nexus-orb-center {
    r: 6; // Slightly smaller or different central focus
    animation: none; // Stop idle pulse
  }
  .nexus-orb-satellites {
    // Transform satellites to a new stable configuration
    // Example: form a wider, more static triangle or align differently
    // This would require more complex animation definitions below for specific transforms on each satellite
    // For simplicity, we might just change their animation or appearance
    transform: scale(1.1); // Example: satellites expand slightly
  }
  .nexus-orb-satellite {
    animation-play-state: paused; // Pause orbiting
    // Example: position them explicitly if not using complex animation for active state
    // &.satellite-1 { transform: translate(0px, -25px) scale(1.1); }
    // &.satellite-2 { transform: translate(21.65px, 12.5px) scale(1.1); }
    // &.satellite-3 { transform: translate(-21.65px, 12.5px) scale(1.1); }
  }
  .nexus-orb-tendril {
    opacity: 1;
    // stroke-dashoffset: 0;
  }
}


// --- Keyframe Animations for the Nexus Orb ---
@keyframes nexus-center-pulse {
  0%, 100% {
    r: 6.5;
    filter: drop-shadow(0 0 2px var(--orb-center-glow));
  }
  50% {
    r: 7.5;
    filter: drop-shadow(0 0 5px var(--orb-center-glow));
  }
}

// Define orbital paths using transforms.
// These are simplified circular orbits; elliptical would require separate x/y radius on a parent <g> or more complex path data.
@keyframes nexus-orbit-1 {
  0% { transform: rotate(0deg) translateX(20px) rotate(0deg) translateY(0px); } /* Start at (20,0) relative to center after rotation */
  100% { transform: rotate(360deg) translateX(20px) rotate(-360deg) translateY(0px); } /* Maintain orientation while orbiting */
}
@keyframes nexus-orbit-2 {
  0% { transform: rotate(120deg) translateX(22px) rotate(-120deg) translateY(0px); }
  100% { transform: rotate(480deg) translateX(22px) rotate(-480deg) translateY(0px); }
}
@keyframes nexus-orbit-3 {
  0% { transform: rotate(240deg) translateX(18px) rotate(-240deg) translateY(0px); }
  100% { transform: rotate(600deg) translateX(18px) rotate(-600deg) translateY(0px); }
}

// Complex state change animation for satellites when dropdown opens (if desired)
// This would involve animating individual cx, cy attributes or more complex transforms
// For example, to make them form a triangle:
// .nexus-orb-trigger.active .satellite-1 { animation: s1-active-pos 0.3s var.$ease-elastic forwards; }
// @keyframes s1-active-pos { to { cx: 0; cy: -22; } }
// (and similar for s2, s3 to form other points of the triangle)
// For simplicity, current active state just pauses orbit and scales group slightly.
</style>