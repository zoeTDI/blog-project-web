<script setup lang="ts">
  import type { CaIconProps } from './types.ts';
  import { computed, type CSSProperties, markRaw, toRaw } from 'vue';

  defineOptions({
    name: 'CaIcon',
  });
  const props = withDefaults(defineProps<CaIconProps>(), {
    size: '1em',
  });

  const renderIcon = computed(() => {
    if (!props.icon) return null;
    return typeof props.icon === 'object' ? markRaw(toRaw(props.icon)) : props.icon;
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
    :is="renderIcon"
    v-if="renderIcon"
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