<script setup lang="ts">
import { provide, computed } from 'vue';

const props = withDefaults(defineProps<{
  gutter?: number; // 栅格间距
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  align?: 'top' | 'middle' | 'bottom';
}>(), {
  gutter: 0,
  justify: 'start',
  align: 'top'
});

// 将 gutter 注入给子组件 Col
provide('CaRowGutter', computed(() => props.gutter));

const rowStyle = computed(() => {
  const margin = props.gutter > 0 ? `${props.gutter / -2}px` : '';
  return {
    marginLeft: margin,
    marginRight: margin,
    justifyContent: props.justify,
    alignItems: props.align === 'middle' ? 'center' : (props.align === 'bottom' ? 'flex-end' : 'flex-start')
  };
});
</script>

<template>
  <div class="ca-row" :style="rowStyle">
    <slot />
  </div>
</template>

<style scoped>
.ca-row {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
</style>