<script setup lang="ts">
  import type { TableColumnProps } from './types.ts';
  import { CaTableContextKey } from '../constants.ts';
  import { inject, onBeforeMount, onBeforeUnmount } from 'vue';

  defineOptions({
    name: 'CaTableColumn',
  });

  const { store } = inject(CaTableContextKey, { store: null });

  const props = withDefaults(defineProps<TableColumnProps>(), {});

  onBeforeMount(() => {
    if (store) {
      store.registerColumn(props);
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