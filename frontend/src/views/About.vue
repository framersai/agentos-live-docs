// File: frontend/src/views/About.vue
/**
 * @file About.vue - Ephemeral Harmony Theme
 * @description Composes the About page using dedicated section components.
 */
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logoSvg from '@/assets/logo.svg';
import { useAuth } from '@/composables/useAuth';

import AboutPageHeader from '@/components/about/AboutPageHeader.vue';
import AboutHeroSection from '@/components/about/AboutHeroSection.vue';
import AboutPermissionsSection from '@/components/about/AboutPermissionsSection.vue';
import AboutMissionSection from '@/components/about/AboutMissionSection.vue';
import AboutAgentosSection from '@/components/about/AboutAgentosSection.vue';
import AboutPricingSection from '@/components/about/AboutPricingSection.vue';
import AboutArchitectureSection from '@/components/about/AboutArchitectureSection.vue';
import AboutRoadmapSection from '@/components/about/AboutRoadmapSection.vue';
import AboutFooterSection from '@/components/about/AboutFooterSection.vue';

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const isGuestSession = computed(() => !auth.isAuthenticated.value);

const goHome = (): void => {
  const locale = (route.params.locale as string) || 'en-US';
  router.push({ name: 'PublicHome', params: { locale } });
};
</script>

<template>
  <div class="about-page-ephemeral">
    <AboutPageHeader @back="goHome">
      <template #title>
        <h1 class="main-page-title">
          About <strong>Voice Chat Assistant</strong> and <strong>AgentOS</strong>
        </h1>
      </template>
    </AboutPageHeader>

    <main class="about-main-content-area">
      <AboutHeroSection :logo-src="logoSvg" :show-guest-badge="isGuestSession" />
      <AboutPermissionsSection />
      <AboutMissionSection />
      <AboutAgentosSection />
      <AboutPricingSection />
      <AboutArchitectureSection />
      <AboutRoadmapSection />
      <AboutFooterSection />
    </main>
  </div>
</template>

<style lang="scss">
// Styles remain defined in frontend/src/styles/views/_about-page.scss
</style>

