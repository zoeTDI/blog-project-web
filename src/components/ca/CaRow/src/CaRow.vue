<script setup lang="ts">
  import { provide, computed, ref } from 'vue';
  import { getSafeNumber } from '@/utils/safeFu.ts';
  interface RowProps {
    gap?: number;
  }

  const props = withDefaults(defineProps<RowProps>(), {
    gap: 0,
    offset: 0,
  });

  const usedCols = ref<number>(0);

  const registerCol = (span: number, offset: number) => {
    const safeSpan = getSafeNumber(span, 24, 0);
    const safeOffset = getSafeNumber(offset, 24, 0);

    const totalNeeded = safeSpan + safeOffset;

    if (usedCols.value + safeOffset + safeSpan > 24) {
      usedCols.value = (usedCols.value + safeOffset + safeSpan) % 24;
    } else {
      usedCols.value += totalNeeded;
    }
  };

  provide(
    'CaRowGap',
    computed(() => props.gap)
  );
  provide('registerCol', registerCol);

  const rowStyles = computed(() => ({
    gap: `${props.gap}px`,
  }));
</script>

<template>
  <div
    class="ca-row"
    :style="rowStyles">
    <slot />
  </div>
</template>

<style scoped>
  .ca-row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    background-color: #d9d9d9;
    /* 确保 gap 产生的额外宽度不会撑破容器（在特定 flex 模式下有用） */
  }
</style>
