<script setup lang="ts">
  import { inject, computed, type ComputedRef, onMounted } from 'vue';
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
  const currentLineUsed = inject<ComputedRef<number>>('CaRowUsedCols');
  const registerCol =
    inject<(span: number, offset: number) => void>('registerCol');

  const offsetElements = computed(() => {
    if (props.offset <= 0) return [];

    const remaining = 24 - (currentLineUsed?.value || 0);
    const safeOffset = getSafeNumber(props.offset, 24, 0);
    if (safeOffset <= remaining) {
      return [{ span: safeOffset }];
    } else {
      return [{ span: remaining }, { span: props.offset - remaining }];
    }
  });

  const style = computed(() => {
    const safeSpan = getSafeNumber(props.span, 24, 0);
    const ratio = (safeSpan / 24) * 100;
    const gap = getSafeNumber(rowGap!.value) * (1 - safeSpan / 24);
    return {
      flex: `0 0 calc(${ratio}% - ${gap}px)`,
    };
  });
  onMounted(() => {
    registerCol?.(props.span, props.offset);
  });
</script>

<template>
  <div
    v-for="(el, index) in offsetElements"
    :key="index"
    class="ca-col-offset"
    :style="{ flex: `0 0 ${(el.span / 24) * 100}%` }"></div>
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
    overflow: hidden;
    background-color: #aaaaaa;
  }
</style>
