<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (event: 'back'): void;
}>();
</script>

<template>
  <header class="about-header-ephemeral">
    <div class="header-content-container">
      <div class="logo-title-group text-center">
        <slot name="title" />
      </div>
      <button
        type="button"
        class="btn btn-secondary-ephemeral btn-sm back-button-ephemeral"
        @click="emit('back')"
      >
        <ArrowLeftIcon class="icon-sm" />
        Back to App
      </button>
    </div>
  </header>
</template>
