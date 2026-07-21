<script setup lang="ts">
  import { computed } from 'vue';
  import type { SimpleIconProps } from '@/icon/simpleIcon/src/types.ts';

  defineOptions({
    name: 'CaSimpleIcon',
  });

  const props = withDefaults(defineProps<SimpleIconProps>(), {
    size: 24,
    color: '',
    colored: false,
  });
  const fillColor = computed(() => {
    if (props.color && parseToHexColor(props.color)) {
      return props.color;
    }
    if (props.colored) {
      return `#${props.icon.hex}`;
    }
    return 'currentColor';
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
  <svg
    :width="size"
    :height="size"
    viewbox="0 0 24 24"
    :fill="fillColor"
    xmlns="http://www.w3.org/2000/svg">
    <title>{{ icon.title }}</title>
    <path :d="icon.path"></path>
  </svg>
</template>

<style scoped>

</style>