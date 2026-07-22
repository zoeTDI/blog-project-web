<script setup lang="ts">
  import { caListKey } from './constants.ts';
  import type { CaListProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, provide } from 'vue';

  defineOptions({
    name: 'CaList',
  });

  const props = withDefaults(defineProps<CaListProps>(), {
    mode: 'plain',
    title: undefined,
  });

  const ns = useCSSNamespace('list');

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.s(mode.value)];
    return cls;
  });

  const mode = computed(() => props.mode);

  provide(caListKey, { mode });
</script>

<template>
  <div :class="classes">
    <div
      :class="ns.e('title')"
      v-if="title">
      {{ title }}
    </div>
    <component
      :is="mode === 'ordered' ? 'ol' : 'ul'"
      :class="ns.e('container')">
      <slot></slot>
    </component>
  </div>
</template>

<style scoped>
  @import "../styles/style.css";
</style>