<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue';

interface ColProps {
  span?: number;
  offset?: number;
}

const props = withDefaults(defineProps<ColProps>(), {
  span: 24,
  offset: 0
});

const rowGap = inject<ComputedRef<number>>('CaRowGap');
const rowOffset = inject<ComputedRef<number>>('CaRowOffset');

const colStyles = computed(() => {
  const totalOffset = (rowOffset?.value || 0) + props.offset;
  const gap = rowGap?.value || 0;

  // 基础比例 (0-1)
  const ratio = props.span / 24;
  const offsetRatio = totalOffset / 24;

  // 核心公式说明：
  // 在使用了 display: flex 和 gap 的容器中
  // 总有效宽度 = 100% - (所有间距占用的像素)
  // 如果当前列占比例 ratio，则它的 flex-basis 应该是总有效宽度的 ratio

  return {
    // 这里的 100% * ratio 是基础宽度
    // gap * (1 - ratio) 是为了抵消 flex gap 模式下的偏移量
    // 这样能保证 24 栅格填满时，最右侧没有任何多余间距
    flex: `0 0 calc(${ratio * 100}% - ${gap * (1 - ratio)}px)`,
    maxWidth: `calc(${ratio * 100}% - ${gap * (1 - ratio)}px)`,
    marginLeft: offsetRatio > 0 ? `calc(${offsetRatio * 100}% + ${gap * offsetRatio}px)` : '0'
  };
});
</script>

<template>
  <div class="ca-col" :style="colStyles">
    <slot />
  </div>
</template>

<style scoped>
.ca-col {
  box-sizing: border-box;
  min-width: 0;
}
</style>