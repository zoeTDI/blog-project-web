<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaTableProps } from './types.ts';
  import { computed, provide } from 'vue';
  import { CaTableContextKey } from './constants.ts';

  defineOptions({
    name: 'CaTable',
  });

  const props = withDefaults(defineProps<CaTableProps>(), {
    data: () => [],
    rowClassName: () => ({}),
  });

  const ns = useCSSNamespace('table');

  const data = computed(() => props.data);
  const rowClassName = computed(() => props.rowClassName);

  provide(CaTableContextKey, { data, rowClassName });
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('container')">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .ca-table {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--color-border);
  }

  .ca-table__container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1 0 auto;
  }
</style>