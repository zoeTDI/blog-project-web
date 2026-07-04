<script setup lang="ts">
  import type { SimpleIconProps } from '@/components/simpleIcon';
  import { computed } from 'vue';
  import { parseToHexColor } from '@/utils/parse.ts';

  const props = withDefaults(defineProps<SimpleIconProps>(), {
    size: 24,
    color: '',
  });
  const fillColor = computed(() => {
    const propsColor = parseToHexColor(props.color);
    return propsColor ? props.color : `#${props.icon.hex}`;
  });
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

<style scoped></style>
