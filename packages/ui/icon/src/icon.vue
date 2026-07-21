<script setup lang="ts">
  import type { CaIconProps } from './types.ts';
  import { computed, type CSSProperties } from 'vue';

  defineOptions({
    name: 'CaIcon',
  });
  const props = withDefaults(defineProps<CaIconProps>(), {
    size: '1em',
  });

  const style = computed<CSSProperties>(() => {
    if (!props.size && !props.color) return {};
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size;
    return {
      fontSize: sizeValue,
      color: props.color,
    };
  });
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    class="ca-icon"
    :style="style"
    aria-hidden="true"
  />
</template>

<style scoped>
  .ca-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    line-height: 1em;
    flex-shrink: 0;
  }
</style>