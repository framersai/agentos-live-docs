<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  logoSrc: string;
  showGuestBadge?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <section class="hero-section-about card-glass-interactive">
    <div v-if="props.showGuestBadge" class="guest-pill-ephemeral hero-guest-pill">
      <SparklesIcon class="guest-pill-icon" aria-hidden="true" />
      <span class="guest-pill-text">{{ t('common.guestDemoMode') }}</span>
    </div>
    <div class="hero-logo-wrapper">
      <img :src="props.logoSrc" alt="AgentOS Logo" class="hero-logo-main spinning-glow-logo" />
    </div>
    <h2 class="hero-main-title">The Future is a Conversation.</h2>
    <p class="hero-sub-title">
      <strong>
        Seamlessly intelligent experiences through natural language
      </strong>
    </p>
    <p class="hero-sub-title">
      Voice Chat Assistant, powered by the open-source
      <strong class="highlight-text">
        <a href="https://github.com/wearetheframers/agentos" target="_blank">AgentOS</a>
      </strong>
      framework, redefines human-AI interaction. Experience truly adaptive intelligence that understands, remembers, and evolves with you.
      <br>
      <strong class="highlight-text">
        For support, contact us at
        <a href="mailto:team@manic.agency" class="footer-link">team@manic.agency</a>.
      </strong>
    </p>
    <a href="#pricing" class="btn btn-primary-ephemeral btn-lg hero-cta-button hover:text-white">Sign Up</a>
  </section>
</template>
