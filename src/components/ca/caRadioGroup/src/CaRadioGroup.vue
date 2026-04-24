<script setup lang="ts">
import {provide, computed} from 'vue';
import {RADIO_GROUP_KEY, type RadioLayout} from './types';
import type {ComponentSize} from "#/component.ts";

const props = withDefaults(defineProps<{
  modelValue: any;
  size?: ComponentSize;
  layout?: RadioLayout; // 默认 button-group
  columns?: number;     // 仅针对 grid 布局
}>(), {
  size: 'M',
  layout: 'list',
  columns: 2
});

const emit = defineEmits(['update:modelValue']);

const context = {
  modelValue: computed(() => props.modelValue),
  size: computed(() => props.size),
  layout: computed(() => props.layout),
  changeValue: (val: any) => emit('update:modelValue', val)
};

provide(RADIO_GROUP_KEY, context);

const containerStyle = computed(() => {
  if (props.layout === 'grid') {
    return {gridTemplateColumns: `repeat(${props.columns}, 1fr)`};
  }
  return {};
});
</script>

<template>
  <div
      class="ca-radio-group"
      :class="[`layout-${layout}`, `is-size-${size}`]"
      :style="containerStyle"
  >
    <slot/>
  </div>
</template>

<style scoped>
.ca-radio-group {
  display: inline-flex;
  gap: 1px;
}

/* 现有风格：有背景和细线边框 */
.layout-button-group {
  background-color: var(--border); /* 作为子组件间隙的颜色 */
  border: 1px solid var(--border); /* 外部边框 */
  gap: 1px; /* 子组件之间的细线 */
  padding: 0; /* 确保内部没有额外内边距 */
}

/* 第一种：纵向列表 */
.layout-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 第二种：横向流式 */
.layout-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* 第三种：宫格 */
.layout-grid {
  display: grid;
  gap: 12px;
}
</style>