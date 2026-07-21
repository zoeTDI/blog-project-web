<script setup lang="ts">
  import type { CaColProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, type CSSProperties, inject } from 'vue';
  import { caRowContextKey } from '../../row';

  defineOptions({
    name: 'CaCol',
  });

  const props = withDefaults(defineProps<CaColProps>(), {
    tag: 'div',
    span: 24,
    offset: 0,
    pull: 0,
    push: 0,
  });

  const ns = useCSSNamespace('col');

  const { gap } = inject(caRowContextKey, { gap: computed(() => 0) });

  const classes = computed(() => {
    const cls: string[] = [];
    const pos = ['span', 'offset', 'pull', 'push'] as const;
    pos.forEach((prop) => {
      const size = props[prop];
      if (isNumber(size)) {
        if (prop === 'span') cls.push(ns.s(`${props[prop]}`));
        else if (size > 0) cls.push(ns.s(`${prop}-${props[prop]}`));
      }
    });

    if (gap.value) cls.push(ns.is('gap'));
    return [ns.b(), ...cls];
  });

  const style = computed(() => {
    const styles: CSSProperties = {};
    if (gap.value > 0) {
      styles.paddingLeft = styles.paddingRight = `${gap.value / 2}px`;
    }
    return styles;
  });

  const isNumber = (val: any): val is number => typeof val === 'number';

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