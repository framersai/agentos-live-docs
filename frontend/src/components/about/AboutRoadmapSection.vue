<script setup lang="ts">
import { ref } from 'vue';
import { MapIcon } from '@heroicons/vue/24/outline';

type RoadmapStatus = 'Idea' | 'Planned' | 'In Progress' | 'Beta' | 'Completed';

interface RoadmapFeature {
  name: string;
  status: RoadmapStatus;
  description?: string;
}

interface RoadmapQuarter {
  id: string;
  quarter: string;
  year: number;
  themeTitle: string;
  features: RoadmapFeature[];
}

const roadmapItems = ref<RoadmapQuarter[]>([
  {
    id: 'q3-2025',
    quarter: 'Q3',
    year: 2025,
    themeTitle: 'Enhanced Context & Personalization',
    features: [
      { name: 'Proactive Suggestion Engine (v1)', status: 'In Progress', description: 'AI anticipates user needs.' },
      { name: 'User Document Integration', status: 'Planned', description: 'Connect personal knowledge repositories.' },
    ],
  },
  {
    id: 'q4-2025',
    quarter: 'Q4',
    year: 2025,
    themeTitle: 'Richer Interactions & Outputs',
    features: [
      { name: 'Basic Image Comprehension', status: 'Planned', description: 'Allow image inputs for context.' },
      { name: 'Structured Data Generation', status: 'Idea', description: 'AI formats responses like tables/lists.' },
    ],
  },
]);
</script>

<template>
  <section id="roadmap" class="roadmap-section-about content-section-ephemeral">
    <h3 class="section-title-main"><MapIcon class="section-title-icon" />Product Roadmap</h3>
    <div class="roadmap-timeline-container-about">
      <div
        v-for="(item, index) in roadmapItems"
        :key="item.id"
        class="roadmap-item-container-about"
        :class="{ 'align-right': index % 2 !== 0 }"
      >
        <div class="roadmap-item-dot"></div>
        <div class="roadmap-item-line"></div>
        <div class="roadmap-item-content-card card-neo-subtle">
          <h4 class="roadmap-quarter-title">{{ item.quarter }} {{ item.year }}</h4>
          <p class="roadmap-quarter-theme">{{ item.themeTitle }}</p>
          <ul class="roadmap-features-list">
            <li v-for="feature in item.features" :key="feature.name" class="roadmap-feature-item">
              <strong class="feature-name-roadmap">{{ feature.name }}</strong>
              <span class="status-badge-roadmap" :class="`status-${feature.status.toLowerCase().replace(/\s+/g, '-')}`">
                {{ feature.status }}
              </span>
              <p v-if="feature.description" class="feature-description-roadmap">{{ feature.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
