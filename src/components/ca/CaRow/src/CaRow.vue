<script setup lang="ts">
import { provide, computed } from 'vue';

interface RowProps {
  gap?: number;
  offset?: number;
}

const props = withDefaults(defineProps<RowProps>(), {
  gap: 0,
  offset: 0
});

provide('CaRowGap', computed(() => props.gap));
provide('CaRowOffset', computed(() => props.offset));

const rowStyles = computed(() => ({
  gap: `${props.gap}px`,
  // 将 gap 暴露为 CSS 变量，供子组件计算
  '--ca-row-gap': `${props.gap}px`
}));
</script>

<template>
  <div class="ca-row" :style="rowStyles">
    <slot />
  </div>
</template>

<style scoped>
.ca-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  /* 确保 gap 产生的额外宽度不会撑破容器（在特定 flex 模式下有用） */
}
</style>