<script setup lang="ts">
  import { computed } from 'vue';
  import { parseToHexColor } from '@/utils/parse.js';
  import type { SimpleIconProps } from '@/components/icon';

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
