<script setup lang="ts">
  import { GlobeAltIcon } from '@heroicons/vue/24/outline';
  import { type ButtonProps, MenuPopover } from '@/components/globalTools';
  import { computed, ref } from 'vue';
  import { preferenceManager, preferences } from '@/core/preferences';
  import { TIMEZONE_OPTIONS } from '@caldm/core';
  import type { TimezoneOption } from '@caldm/core';

  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });
  const activeMenu = ref<string | null>(null);

  const timezones = Object.values(TIMEZONE_OPTIONS).map((option: string) => ({
    label: option,
    value: option,
  }));

  const toggleMenu = (menu: string, event: MouseEvent) => {
    event.stopPropagation();
    activeMenu.value = activeMenu.value === menu ? null : menu;
  };

  /**
   * 当前的网站时区
   */
  const curTimezone = computed(() => preferences.app.timezone);

  /**
   * 更新时区
   */
  const updateTimezone = (value: TimezoneOption) => {
    preferenceManager.updatePreferences({ app: { timezone: value } });
    activeMenu.value = null;
  };
</script>

<template>
  <div class="tool-wrapper">
    <button
      :class="['tool-btn', shape]"
      @click="toggleMenu('timezone', $event)"
      title="切换时区">
      <GlobeAltIcon class="icon" />
    </button>
    <MenuPopover
      :modelValue="activeMenu === 'timezone'"
      @update:modelValue="activeMenu = null"
      :options="timezones"
      :selected-value="curTimezone"
      @select="(val) => updateTimezone(val)" />
  </div>
</template>

<style scoped>
  @import 'style.css';
</style>
