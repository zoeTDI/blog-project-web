<script setup lang="ts">
  import type { CaRowProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, type CSSProperties, provide } from 'vue';
  import { caRowContextKey } from './constants.ts';

  defineOptions({
    name: 'CaRow',
  });

  const props = withDefaults(defineProps<CaRowProps>(), {
    tag: 'div',
    gap: 0,
    justify: 'start',
  });

  const ns = useCSSNamespace('row');

  const gap = computed(() => props.gap);

  provide(caRowContextKey, { gap });

  const classes = computed(() => {
    const classes: string[] = [
      ns.b(),
      ns.is(`justify-${props.justify}`, props.justify !== 'start'),
      ns.is(`align-${props.align}`, !!props.align),
    ];
    return classes;
  });

  const style = computed(() => {
    const styles: CSSProperties = {};
    if (!props.gap) {
      return styles;
    }
    styles.marginRight = styles.marginLeft = `-${gap.value / 2}px`;
    return styles;
  });
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :style="style">
    <slot />
  </component>
</template>

<style scoped>
  @import "../styles/style.css";
</style>