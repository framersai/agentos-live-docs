<template>
  <div
    class="animated-logo-container flex items-center select-none"
    aria-label="Voice Chat Assistant Logo"
  >
    <img
      src="/src/assets/logo.svg"
      alt=""
      class="logo-img w-10 h-10 mr-2"
    />

    <h1
      class="title-text text-xl font-bold text-gray-800 dark:text-gray-100 leading-none"
    >
      <span
        v-for="(char, idx) in letters"
        :key="idx"
        :class="[ 'title-letter', char === ' ' && 'space-letter' ]"
        :style="{ animationDelay: `${idx * 0.07}s` }"
      >
        {{ char === ' ' ? '\u00A0' : char }}
      </span>
    </h1>
  </div>
</template>

<script lang="ts" setup>
/**
 * AnimatedLogo.vue — small flair component animating the app logo and title.
 * Pure CSS animations (no JS frameworks required).
 */

const title = 'Voice Chat Assistant';
const letters = title.split('');
</script>

<style lang="postcss" scoped>
/* ──────────────────────────────────────────────────────────────────────────
   Logo icon animations
   ──────────────────────────────────────────────────────────────────────────*/
.logo-img {
  /* slow rotation + gentle glow */
  animation: subtle-spin 15s linear infinite,
    subtle-pulse 3s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(var(--color-primary-500-rgb), 0.5));
}
.dark .logo-img {
  /* swap to dark‑mode colour and pulse animation */
  animation: subtle-spin 15s linear infinite,
    subtle-pulse-dark 3s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(var(--color-primary-400-rgb), 0.6));
}

@keyframes subtle-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes subtle-pulse {
  0%,
  100% {
    filter: drop-shadow(0 0 5px rgba(var(--color-primary-500-rgb), 0.5)) saturate(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(var(--color-primary-500-rgb), 0.7)) saturate(1.2)
      brightness(1.05);
  }
}

@keyframes subtle-pulse-dark {
  0%,
  100% {
    filter: drop-shadow(0 0 5px rgba(var(--color-primary-400-rgb), 0.6)) saturate(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(var(--color-primary-400-rgb), 0.8)) saturate(1.3)
      brightness(1.1);
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Title lettering animation
   ──────────────────────────────────────────────────────────────────────────*/
.title-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(10px);
  animation:
    letter-entrance 0.45s forwards ease-out,
    letter-wave 2.5s ease-in-out infinite;
}

/* non‑animating space spans */
.space-letter {
  width: 0.35em;
  animation: none !important;
  opacity: 1 !important;
  transform: translateY(0) !important;
}

@keyframes letter-entrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes letter-wave {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.05);
  }
}
</style>
