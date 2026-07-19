<script setup lang="ts">
  import type { ToolType, ToolShape } from './types';
  import {
    FullscreenButton,
    LanguageButton,
    PreferencesSettingButton,
    ThemeButton,
    TimezoneButton,
  } from '@/components/globalTools';

  interface Props {
    include?: ToolType[];
    shape?: ToolShape;
  }

  withDefaults(defineProps<Props>(), { shape: 'rounded' });
</script>

<template>
  <div class="global-tools">
    <slot>
      <theme-button :shape="shape" />
      <fullscreen-button :shape="shape" />
      <timezone-button :shape="shape" />
      <language-button :shape="shape" />
      <PreferencesSettingButton :shape="shape" />
    </slot>
  </div>
</template>

<style scoped>
  .global-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
