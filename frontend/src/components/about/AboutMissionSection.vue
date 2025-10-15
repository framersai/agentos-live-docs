<script setup lang="ts">
import { ref, type Component as VueComponent } from 'vue';
import { LightBulbIcon, RocketLaunchIcon, UsersIcon, SparklesIcon } from '@heroicons/vue/24/outline';

interface MissionItem {
  title: string;
  description: string;
  icon: VueComponent;
  accentVar: string;
}

const missionItems = ref<MissionItem[]>([
  {
    title: 'Innovate',
    description: 'Push the boundaries of AI interaction with cutting-edge voice technology and adaptive intelligence.',
    icon: RocketLaunchIcon,
    accentVar: '--color-accent-primary',
  },
  {
    title: 'Empower',
    description: 'Enable developers, creators, and users to achieve more through intuitive and personalized AI assistance.',
    icon: UsersIcon,
    accentVar: '--color-accent-secondary',
  },
  {
    title: 'Transform',
    description: 'Reshape how humans and AI collaborate, making technology a natural extension of thought.',
    icon: SparklesIcon,
    accentVar: '--color-info',
  },
]);
</script>

<template>
  <section id="mission" class="mission-section-about content-section-ephemeral">
    <h3 class="section-title-main"><LightBulbIcon class="section-title-icon" />Our Mission</h3>
    <div class="mission-grid-about">
      <div
        v-for="item in missionItems"
        :key="item.title"
        class="mission-item-card-about card-neo-interactive"
        :style="{ '--card-accent-color': `hsl(var(${item.accentVar}-h), var(${item.accentVar}-s), var(${item.accentVar}-l))` }"
      >
        <div class="mission-card-icon-wrapper">
          <component :is="item.icon" class="mission-card-icon" />
        </div>
        <h4 class="mission-card-title">{{ item.title }}</h4>
        <p class="mission-card-description">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>
