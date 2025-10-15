<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnimatedGlyph from '@/components/about/AnimatedGlyph.vue';

const props = defineProps<{
  logoSrc: string;
  showGuestBadge?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <section class="hero-section-about card-glass-interactive card-glass-interactive--hero">
    <div v-if="props.showGuestBadge" class="guest-pill-ephemeral hero-guest-pill">
      <AnimatedGlyph name="spark" class="guest-pill-icon" :size="18" aria-hidden="true" />
      <span class="guest-pill-text">{{ t('common.guestDemoMode') }}</span>
    </div>
    <div class="hero-logo-wrapper">
      <img :src="props.logoSrc" alt="AgentOS Logo" class="hero-logo-main spinning-glow-logo" />
    </div>
    <h2 class="hero-main-title">Conversations that build with you.</h2>
    <p class="hero-sub-title">
      <strong>
        Harmonise speech, context, and memory across every session.
      </strong>
    </p>
    <p class="hero-sub-title">
      Voice Chat Assistant, built on the open-source
      <strong class="highlight-text">
        <a href="https://github.com/wearetheframers/agentos" target="_blank" rel="noopener noreferrer">AgentOS</a>
      </strong>
      platform, delivers an adaptive companion that listens, reasons, and evolves alongside your workflow.
      <br>
      <strong class="highlight-text">
        Questions? Reach us at
        <a href="mailto:team@manic.agency" class="footer-link">team@manic.agency</a>.
      </strong>
    </p>
    <a href="#pricing" class="btn btn-primary-ephemeral btn-lg hero-cta-button hover:text-white">Explore Memberships</a>
  </section>
</template>
