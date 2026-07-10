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

  const style = computed(() => {
    const safeSpan = getSafeNumber(props.span, 24, 0);
    const ratio = (safeSpan / 24) * 100;
    const gap = getSafeNumber(rowGap!.value) * (1 - safeSpan / 24);
    return {
      flex: `0 0 calc(${ratio}% - ${gap}px)`,
    };
  });
</script>

<template>
  <div
    class="ca-col"
    :style="style">
    <slot />
  </div>
</template>

<style scoped>
  .ca-col {
    box-sizing: border-box;
    min-width: 0;
  }
</style>
