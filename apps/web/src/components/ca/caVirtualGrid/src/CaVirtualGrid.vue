<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CaVirtualGridProps, ImageItem, VirtualPosition } from "./types";

const props = withDefaults(defineProps<CaVirtualGridProps>(), {
  list: () => [],
  minWidth: 250,
  aspectRatio: 16 / 9,
  buffer: 2,
  isLoop: false
});

let resizeObserver: ResizeObserver | null = null;
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const containerHeight = ref(0);
const scrollTop = ref(0);

/**
 * 计算总高度占位
 * 如果开启循环，则设为一个极大的值 (1000行)
 * 如果不开启，则根据 list 长度计算实际高度
 */
const totalRows = computed(() => {
  if (props.isLoop) return 1000;
  return Math.ceil(props.list.length / dynamicColumns.value);
});

// 1. 计算列数
const dynamicColumns = computed(() => {
  const cols = Math.floor(containerWidth.value / props.minWidth);
  return cols > 0 ? cols : 1;
});

// 2. 计算行高
const dynamicItemHeight = computed(() => {
  const width = containerWidth.value / dynamicColumns.value;
  return width / props.aspectRatio;
});

// 3. 计算可见范围
const startRow = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / dynamicItemHeight.value) - props.buffer)
);

const endRow = computed(() =>
    Math.min(totalRows.value, startRow.value + Math.ceil(containerHeight.value / dynamicItemHeight.value) + props.buffer * 2)
);

// 4. 计算渲染项
const visibleItems = computed(() => {
  const items: Array<{ data: ImageItem } & VirtualPosition> = [];
  const cols = dynamicColumns.value;
  const itemWidthPercent = 100 / cols;
  const rowHeight = dynamicItemHeight.value;
  const imageCount = props.list.length;

  if (imageCount === 0 || rowHeight === 0) return [];

  for (let i = startRow.value; i < endRow.value; i++) {
    for (let j = 0; j < cols; j++) {
      // 开启循环时取模，关闭循环时如果超出实际索引则跳过
      const index = (i * cols + j);
      if (!props.isLoop && index >= imageCount) break;

      const originalData = props.list[index % imageCount];

      items.push({
        virtualId: `${i}-${j}`,
        data: originalData,
        top: i * rowHeight - scrollTop.value,
        width: itemWidthPercent,
        left: j * itemWidthPercent,
        height: rowHeight
      });
    }
  }
  return items;
});

// 5. 滚动逻辑
const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  let currentScroll = target.scrollTop;

  // 只有开启循环滚动时才执行重置逻辑
  if (props.isLoop) {
    const cols = dynamicColumns.value;
    const rowsPerGroup = Math.ceil(props.list.length / cols);
    const groupHeight = rowsPerGroup * dynamicItemHeight.value;

    if (groupHeight > 0) {
      // 仅向下循环：滚动超过 5 组高度后，重置回第 1 组对应的位置
      const limit = groupHeight * 5;
      if (currentScroll > limit) {
        target.scrollTop = (currentScroll % groupHeight) + groupHeight;
        currentScroll = target.scrollTop;
      }
    }
  }

  scrollTop.value = currentScroll;
};

// 6. 尺寸监听
const updateSize = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth;
    containerHeight.value = containerRef.value.offsetHeight;
  }
};

onMounted(() => {
  resizeObserver = new ResizeObserver(updateSize);
  if (containerRef.value) resizeObserver.observe(containerRef.value);
  window.addEventListener('resize', updateSize);
  updateSize();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', updateSize);
});
</script>

<template>
  <div class="virtual-scroll-container" ref="containerRef" @scroll="onScroll">
    <div class="phantom-spacer" :style="{ height: totalRows * dynamicItemHeight + 'px' }"></div>
    <div class="render-area">
      <slot
          name="item"
          v-for="item in visibleItems"
          :key="item.virtualId"
          :item="item.data"
          :position="item"
      ></slot>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.virtual-scroll-container::-webkit-scrollbar {
  display: none;
}

.phantom-spacer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  pointer-events: none;
}

.render-area {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  -webkit-mask-image: -webkit-linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
}
</style>