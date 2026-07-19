<script setup lang="ts">
  import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
  import { preferenceManager, preferences } from '@/core/preferences';
  import { computed } from 'vue';
  import type { ButtonProps } from '@/components/globalTools';

  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });

  const curThemeMode = computed(() => preferences.theme.mode);

  const toggleTheme = () =>
    preferenceManager.updatePreferences({
      theme: { mode: curThemeMode.value === 'light' ? 'dark' : 'light' },
    });
</script>

<template>
  <button
    :class="['tool-btn', shape]"
    @click="toggleTheme"
    title="切换主题">
    <SunIcon
      v-show="curThemeMode === 'light'"
      class="icon" />
    <MoonIcon
      v-show="curThemeMode === 'dark'"
      class="icon" />
  </button>
</template>

<style scoped>
  @import 'style.css';
</style>
