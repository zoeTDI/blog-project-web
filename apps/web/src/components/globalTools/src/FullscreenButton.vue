<script setup lang="ts">
  import {
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
  } from '@heroicons/vue/24/outline';
  import { onMounted, onUnmounted, ref } from 'vue';
  import type { ButtonProps } from '@/components/globalTools';
  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });

  const isFullScreen = ref(!!document.fullscreenElement);

  const updateFullscreenState = () => {
    isFullScreen.value = !!document.fullscreenElement;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  onMounted(() =>
    document.addEventListener('fullscreenchange', updateFullscreenState)
  );
  onUnmounted(() =>
    document.removeEventListener('fullscreenchange', updateFullscreenState)
  );
</script>

<template>
  <button
    :class="['tool-btn', shape]"
    @click="toggleFullscreen"
    title="全屏">
    <ArrowsPointingOutIcon
      v-show="!isFullScreen"
      class="icon" />
    <ArrowsPointingInIcon
      v-show="isFullScreen"
      class="icon" />
  </button>
</template>

<style scoped>
  @import 'style.css';
</style>
