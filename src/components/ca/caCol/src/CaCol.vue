<script setup lang="ts">
import { inject, computed } from 'vue';

const props = withDefaults(defineProps<{
  span?: number;   // 24栅格占据的分数
  offset?: number; // 左侧偏移
}>(), {
  span: 24
});

const gutter = inject<computed<number>>('CaRowGutter');

const colStyle = computed(() => {
  const padding = gutter?.value ? `${gutter.value / 2}px` : '';
  return {
    paddingLeft: padding,
    paddingRight: padding,
    // 计算宽度：(span / 24) * 100%
    flex: `0 0 ${(props.span / 24) * 100}%`,
    maxWidth: `${(props.span / 24) * 100}%`,
    // 处理偏移
    marginLeft: props.offset ? `${(props.offset / 24) * 100}%` : ''
  };
});
</script>

<template>
  <div class="ca-col" :style="colStyle">
    <slot />
  </div>
</template>

<style scoped>
.ca-col {
  box-sizing: border-box;
}
</style>