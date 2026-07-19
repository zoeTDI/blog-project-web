<script setup lang="ts">
  import type { HeroIconProps } from '@/components/icon';
  import { computed } from 'vue';
  import { parseToHexColor } from '@/utils/parse.ts';

  const props = withDefaults(defineProps<HeroIconProps>(), {
    size: 24,
  });

  const color = computed(() => {
    return parseToHexColor(props.color);
  });
</script>

<template>
  <div class="heroicon">
    <component
      :is="props.icon"
      class="icon"
      :style="{
        width: props.size + 'px',
        height: props.size + 'px',
        color: color || 'currentColor',
      }" />
  </div>
</template>

<style scoped>
  .heroicon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    width: 100%;
    height: 100%;
  }
</style>
