<script setup lang="ts">
  import { computed } from 'vue';
  import type { HeroIconProps } from '@/icon';

  defineOptions({
    name: 'CaHeroIcon',
  });

  const props = withDefaults(defineProps<HeroIconProps>(), {
    size: 24,
  });

  const color = computed(() => {
    return parseToHexColor(props.color);
  });

  const parseToHexColor = (value: any): string | null => {
    if (value === null || value === undefined) return null;
    let str: string = String(value).trim().toLowerCase();
    const hexRegex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
    const match = str.match(hexRegex);
    if (match) {
      let hex: string = match[1];
      if (hex.length === 3 || hex.length === 4) {
        hex = hex
          .split('')
          .map((char: string) => char + char)
          .join('');
      }
      if (hex.length === 8) {
        hex = hex.slice(0, 6);
      }
      return `#${hex}`;
    }
    return null;
  };

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