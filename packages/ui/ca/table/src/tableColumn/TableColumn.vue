<script setup lang="ts">
  import type { TableColumnProps } from './types.ts';
  import { CaTableContextKey } from '../constants.ts';
  import { inject, onBeforeMount, onBeforeUnmount, useSlots } from 'vue';
  import type { RenderCell } from '../types.ts';

  defineOptions({
    name: 'CaTableColumn',
  });

  const { store } = inject(CaTableContextKey, { store: null });

  const props = withDefaults(defineProps<TableColumnProps>(), {
    sortable: false,
  });
  const slots = useSlots();

  onBeforeMount(() => {
    if (store) {
      const renderCell: RenderCell | undefined = slots.default
        ? (scope) => slots.default!(scope)
        : undefined;
      store.registerColumn({
        ...props,
        renderCell,
      });
    }
  });

  onBeforeUnmount(() => {
    if (store) {
      store.unregisterColumn(props.prop);
    }
  });
</script>

<template>

</template>

<style scoped>

</style>