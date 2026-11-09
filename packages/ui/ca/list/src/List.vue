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

  const mode = computed(() => props.mode);

  provide(caListKey, { mode });

  const containerClasses = computed(() => [
    ns.e('container'),
    ns.is(`mode-${mode.value}`),
  ]);
</script>

<template>
  <div :class="ns.b()">
    <div
      :class="ns.e('title')"
      v-if="title">
      {{ title }}
    </div>
    <component
      :is="mode === 'ordered' ? 'ol' : 'ul'"
      :class="containerClasses">
      <slot></slot>
    </component>
  </div>
</template>

<style scoped>
  @import "../styles/style.css";
</style>