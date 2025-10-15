<script setup lang="ts">
import { ref } from 'vue';
import AnimatedGlyph from '@/components/about/AnimatedGlyph.vue';

interface MissionItem {
  title: string;
  description: string;
  iconName: 'rocket' | 'people' | 'prism';
  accentVar: string;
}

const missionItems = ref<MissionItem[]>([
  {
    title: 'Innovate',
    description: 'Push the boundaries of multi-modal AI with realtime speech, diagrams, and adaptive prompts.',
    iconName: 'rocket',
    accentVar: '--color-accent-primary',
  },
  {
    title: 'Empower',
    description: 'Give builders, teams, and creators an assistant that understands their context and keeps pace with ambition.',
    iconName: 'people',
    accentVar: '--color-accent-secondary',
  },
  {
    title: 'Transform',
    description: 'Blend memory, tooling, and tone into a single canvas so human intent becomes executable output.',
    iconName: 'prism',
    accentVar: '--color-info',
  },
]);
</script>

<template>
  <section id="mission" class="mission-section-about content-section-ephemeral">
    <h3 class="section-title-main">
      <AnimatedGlyph name="lightbulb" class="section-title-icon" :size="40" />
      Our Mission
    </h3>
    <div class="mission-grid-about">
      <div
        v-for="item in missionItems"
        :key="item.title"
        class="mission-item-card-about card-neo-interactive"
        :style="{ '--card-accent-color': `hsl(var(${item.accentVar}-h), var(${item.accentVar}-s), var(${item.accentVar}-l))` }"
      >
        <div class="mission-card-icon-wrapper">
          <AnimatedGlyph :name="item.iconName" class="mission-card-icon" :size="44" />
        </div>
        <h4 class="mission-card-title">{{ item.title }}</h4>
        <p class="mission-card-description">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>
