<template>
  <div
    class="about-view themeable-view default-view-padding"
    :class="uiStore.currentTheme"
    :data-voice-target-region="'about-page-main-content'"
    aria-labelledby="about-page-title"
  >
    <AppPageHeader
      :title="t('aboutPage.mainHeading', { appName: appConfig.appName })"
      :subtitle="t('aboutPage.mainSubheading')"
      :voice-target-id-prefix="voiceTargetIdPrefix + 'page-header-'"
      show-back-button
      :back-route="{ name: 'Home' }"
    >
      <template #actions>
        <AppButton
            variant="tertiary" size="sm" :pill="true"
            :icon="uiStore.currentTheme === AppTheme.DARK || uiStore.currentTheme === AppTheme.HOLOGRAPHIC ? SunIcon : MoonIcon"
            :aria-label="t('header.toggleTheme')" :title="t('header.toggleTheme')"
            :data-voice-target="voiceTargetIdPrefix + 'theme-toggle-button'"
            @click="handleToggleTheme"
        />
      </template>
    </AppPageHeader>

    <div class="content-grid">
      <AppCard
        variant="elevated"
        padding="lg"
        class="intro-card"
        :voice-target="voiceTargetIdPrefix + 'intro-card'"
        :voice-target-id-prefix="voiceTargetIdPrefix + 'intro-card-'"
      >
          <div class="flex flex-col items-center text-center">
            <img src="@/assets/logo.svg" :alt="t('app.name') + ' Logo'" class="w-20 h-20 sm:w-24 sm:h-24 mb-4" :data-voice-target="voiceTargetIdPrefix + 'logo-main'" />
            <p class="text-lg text-subtitle-color max-w-2xl mx-auto" :data-voice-target="voiceTargetIdPrefix + 'app-description'">
                {{ t('aboutPage.appDescription') }}
            </p>
          </div>
           <div class="stats-grid">
            <div class="stat-item" :data-voice-target="voiceTargetIdPrefix + 'stat-version'">
              <div class="stat-value">{{ appConfig.version }}</div>
              <div class="stat-label">{{ t('aboutPage.stats.version') }}</div>
            </div>
            <div class="stat-item" :data-voice-target="voiceTargetIdPrefix + 'stat-framework'">
              <div class="stat-value">Vue 3 + Node.js</div>
              <div class="stat-label">{{ t('aboutPage.stats.frameworks') }}</div>
            </div>
            <div class="stat-item" :data-voice-target="voiceTargetIdPrefix + 'stat-ai'">
              <div class="stat-value">AgentOS & LLMs</div>
              <div class="stat-label">{{ t('aboutPage.stats.aiEngine') }}</div>
            </div>
          </div>
      </AppCard>

      <AppCard :title="t('aboutPage.featuresSection.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'features-card-'">
        <ul class="list-disc list-inside space-y-2 text-color" :data-voice-target-list="'about-features-list'">
          <li v-for="(feature, index) in features" :key="index" :data-voice-target="`${voiceTargetIdPrefix}feature-item-${index+1}`">
            <strong>{{ feature.name }}:</strong> {{ feature.description }}
          </li>
        </ul>
      </AppCard>

      <AppCard :title="t('aboutPage.techStackSection.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'tech-stack-card-'">
         <p class="text-base leading-relaxed mb-3 text-color" :data-voice-target="voiceTargetIdPrefix + 'tech-stack-intro'">
          {{ t('aboutPage.techStackSection.intro') }}
        </p>
         <div class="tech-stack-grid" :data-voice-target-list="'about-tech-list'">
            <div v-for="(tech, index) in techStack" :key="tech.name" class="tech-item" :data-voice-target="`${voiceTargetIdPrefix}tech-item-${index + 1}`">
              <component v-if="tech.icon" :is="tech.icon" class="tech-icon" aria-hidden="true"/>
              <span class="tech-name">{{ tech.name }}</span>
            </div>
         </div>
      </AppCard>

      <AppCard :title="t('aboutPage.privacySecuritySection.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'privacy-card-'">
          <div class="space-y-3">
              <div v-for="(item, index) in privacyPoints" :key="index" class="flex items-start gap-3 text-color" :data-voice-target="`${voiceTargetIdPrefix}privacy-point-${index+1}`">
                  <CheckBadgeIcon class="w-5 h-5 text-success-color flex-shrink-0 mt-0.5" />
                  <div>
                      <p class="font-medium">{{ item.title }}</p>
                      <p class="text-sm text-muted-color">{{ item.description }}</p>
                  </div>
              </div>
          </div>
      </AppCard>

      <AppCard :title="t('aboutPage.creditsLinksSection.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'credits-card-'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <h4 class="font-semibold text-color mb-2">{{ t('aboutPage.creditsLinksSection.developmentTitle') }}</h4>
            <div class="space-y-1.5">
              <a :href="appConfig.companyWebsiteUrl" target="_blank" rel="noopener noreferrer" class="about-link" :data-voice-target="voiceTargetIdPrefix + 'company-link'">
                <LinkIcon class="w-4 h-4" /> {{ t('app.companyName') }}
              </a>
              <a :href="appConfig.githubRepoUrl" target="_blank" rel="noopener noreferrer" class="about-link" :data-voice-target="voiceTargetIdPrefix + 'github-repo-link'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                {{ t('aboutPage.creditsLinksSection.sourceCodeLink') }}
              </a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">{{ t('aboutPage.creditsLinksSection.poweredByTitle') }}</h4>
            <div class="space-y-1.5">
               <a v-for="item in poweredByLinks" :key="item.name" :href="item.url" target="_blank" rel="noopener noreferrer" class="about-link" :data-voice-target="`${voiceTargetIdPrefix}poweredby-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`">
                  <LinkIcon class="w-4 h-4" /> {{ item.name }}
               </a>
            </div>
          </div>
        </div>
         <p class="mt-6 text-center text-sm text-muted-color" :data-voice-target="voiceTargetIdPrefix + 'license-info'">
          {{ t('aboutPage.licenseInfo.text') }}
          <a :href="appConfig.licenseUrl" target="_blank" rel="noopener noreferrer" class="text-primary-color hover:underline" :data-voice-target="voiceTargetIdPrefix + 'license-link'">
            {{ t('aboutPage.licenseInfo.linkText') }}
          </a>.
        </p>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AboutView.vue
 * @description Static informational page about the Voice Chat Assistant.
 */
import { computed } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import { useUiStore, AppTheme } from '../../../store/ui.store';
import { appConfig } from '../../../config/appConfig';
import AppPageHeader from '../../../components/common/AppPageHeader.vue'; // Assuming this exists
import AppCard from '../../../components/common/AppCard.vue';
import AppButton from '../../../components/common/AppButton.vue';
import { LinkIcon, CheckBadgeIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/solid'; // Using solid for visual consistency
import { CodeBracketSquareIcon, BoltIcon, CircleStackIcon, CloudIcon, AcademicCapIcon, CpuChipIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';


const { t } = useI18n();
const uiStore = useUiStore();
const voiceTargetIdPrefix = 'about-view-';

const features = computed(() => [
  { name: t('aboutPage.featuresSection.feature1.name'), description: t('aboutPage.featuresSection.feature1.desc') },
  { name: t('aboutPage.featuresSection.feature2.name'), description: t('aboutPage.featuresSection.feature2.desc') },
  { name: t('aboutPage.featuresSection.feature3.name'), description: t('aboutPage.featuresSection.feature3.desc') },
  { name: t('aboutPage.featuresSection.feature4.name'), description: t('aboutPage.featuresSection.feature4.desc') },
  { name: t('aboutPage.featuresSection.feature5.name'), description: t('aboutPage.featuresSection.feature5.desc') },
  { name: t('aboutPage.featuresSection.feature6.name'), description: t('aboutPage.featuresSection.feature6.desc') },
]);

const techStack = computed(() => [
    { name: 'Vue.js 3', icon: CodeBracketSquareIcon, category: 'Frontend' },
    { name: 'TypeScript', icon: CodeBracketSquareIcon, category: 'Language' },
    { name: 'Pinia', icon: CircleStackIcon, category: 'State Management' },
    { name: 'Tailwind CSS', icon: BoltIcon, category: 'Styling' },
    { name: 'Node.js / Express', icon: CloudIcon, category: 'Backend' },
    { name: 'AgentOS', icon: CpuChipIcon, category: 'AI Framework' },
    { name: 'LLM APIs', icon: AcademicCapIcon, category: 'AI/ML' },
    { name: 'PostgreSQL & Prisma', icon: CircleStackIcon, category: 'Database' },
    { name: 'Docker', icon: DocumentTextIcon, category: 'Containerization' },
]);

const privacyPoints = computed(() => [
  { title: t('aboutPage.privacySecuritySection.point1.title'), description: t('aboutPage.privacySecuritySection.point1.description') },
  { title: t('aboutPage.privacySecuritySection.point2.title'), description: t('aboutPage.privacySecuritySection.point2.description') },
  { title: t('aboutPage.privacySecuritySection.point3.title'), description: t('aboutPage.privacySecuritySection.point3.description') },
  { title: t('aboutPage.privacySecuritySection.point4.title'), description: t('aboutPage.privacySecuritySection.point4.description') },
]);

const poweredByLinks = computed(() => [
    { name: 'OpenAI', url: 'https://openai.com' },
    { name: 'Vue.js', url: 'https://vuejs.org' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
    { name: 'Node.js', url: 'https://nodejs.org' },
    { name: 'AgentOS Framework', url: appConfig.agentOsRepoUrl || '#' }, // Link to AgentOS if available
]);

const handleToggleTheme = () => {
  let nextTheme: AppTheme;
  if (uiStore.currentTheme === AppTheme.LIGHT) nextTheme = AppTheme.DARK;
  else if (uiStore.currentTheme === AppTheme.DARK) nextTheme = AppTheme.HOLOGRAPHIC;
  else nextTheme = AppTheme.LIGHT;
  uiStore.setTheme(nextTheme);
};

// Add i18n keys for all text content. Example:
// 'aboutPage.viewTitle', 'aboutPage.viewSubtitle'
// 'aboutPage.mainHeading', 'aboutPage.mainSubheading', 'aboutPage.appDescription'
// 'aboutPage.stats.version', 'aboutPage.stats.frameworks', 'aboutPage.stats.aiEngine'
// ... and for all feature names/descriptions, tech stack roles, privacy points, etc.
</script>

<style lang="postcss" scoped>
/* General view styles using theme variables */
.about-view {
  color: var(--app-text-color);
  background-color: var(--app-bg-alt-color);
}
.content-grid {
    @apply grid grid-cols-1 lg:grid-cols-1 gap-6 lg:gap-8; /* Stack cards on smaller, then allow wider */
}
.content-card {
  /* AppCard styles will apply. Specific overrides if needed. */
  /* E.g., for holographic, the card background is handled by AppCard theme styles */
}
.intro-card {
    /* Special styling for the main intro card */
}
.stats-grid {
    @apply grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6;
}
.stat-item {
  background-color: var(--app-surface-raised-color);
  padding: var(--space-4);
  border-radius: var(--app-border-radius-md);
  text-align: center;
  border: 1px solid var(--app-border-color-light);
}
.stat-value {
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary-color);
}
.stat-label {
  font-size: var(--app-font-size-xs);
  color: var(--app-text-muted-color);
  margin-top: var(--space-1);
}

.text-color { color: var(--app-text-color); }
.text-muted-color { color: var(--app-text-muted-color); }
.text-primary-color { color: var(--app-primary-color); }
.text-success-color { color: var(--app-success-color); }
.text-subtitle-color { color: var(--app-text-secondary-color); }


.tech-stack-grid {
    @apply grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4;
}
.tech-item {
    @apply flex items-center gap-2 p-2 sm:p-3 rounded-md;
    background-color: var(--app-surface-inset-color);
    border: 1px solid var(--app-border-color-light);
}
.tech-icon {
    @apply w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0;
    color: var(--app-primary-color);
}
.tech-name {
    @apply text-sm font-medium;
    color: var(--app-text-secondary-color);
}

.about-link {
  @apply inline-flex items-center gap-2 text-sm;
  color: var(--app-link-color);
  transition: color 0.2s ease;
}
.about-link:hover {
  color: var(--app-link-hover-color);
  text-decoration: underline;
}
.about-link svg {
    @apply flex-shrink-0 w-4 h-4;
}

/* Default view padding defined in main.css or App.vue */
.default-view-padding {
  padding-top: var(--space-6, 1.5rem);
  padding-bottom: var(--space-6, 1.5rem);
}

/* Holographic theme adjustments */
.theme-holographic .about-view {
    background-image: var(--holographic-bg-gradient-subtle);
}
.theme-holographic .page-title,
.theme-holographic .card-title-main,
.theme-holographic .app-card :deep(.card-title) { /* Target title inside AppCard */
    color: var(--holographic-text-accent);
    text-shadow: var(--holographic-text-glow-xs);
}
.theme-holographic .text-subtitle-color,
.theme-holographic .text-muted-color,
.theme-holographic .stat-label {
    color: var(--holographic-text-muted);
}
.theme-holographic .text-color,
.theme-holographic .list-disc li,
.theme-holographic .privacy-point p {
    color: var(--holographic-text-primary);
}
.theme-holographic .stat-item,
.theme-holographic .tech-item {
    background-color: var(--holographic-surface-raised-translucent);
    border-color: var(--holographic-border-very-subtle);
}
.theme-holographic .stat-value,
.theme-holographic .tech-icon {
    color: var(--holographic-accent);
}
.theme-holographic .tech-name { color: var(--holographic-text-secondary); }
.theme-holographic .about-link { color: var(--holographic-link-color); }
.theme-holographic .about-link:hover { color: var(--holographic-link-hover-color); }
.theme-holographic .text-success-color { color: var(--holographic-success-color); }
</style>