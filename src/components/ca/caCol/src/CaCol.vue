<script setup lang="ts">
  import { inject, computed, type ComputedRef } from 'vue';
  import { getSafeNumber } from '@/utils/safeFu.ts';

  interface ColProps {
    span?: number;
    offset?: number;
  }

  const props = withDefaults(defineProps<ColProps>(), {
    span: 24,
    offset: 0,
  });

  const rowGap = inject<ComputedRef<number>>('CaRowGap');

  const colStyles = computed(() => {});

  const getSafeValue = (val: any) => {
    return getSafeNumber(val, 24, 0);
  };
</script>

<template>
  <div class="ca-col">
    <slot />
  </div>
</template>

<style scoped>
  .ca-col {
    box-sizing: border-box;
    min-width: 0;
  }
</style>
