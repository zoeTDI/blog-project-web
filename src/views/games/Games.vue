<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

interface imageItem {
  id: number;
  url: string;
  alt: string;
}

const loadingStore = useLoadingStore();

const props = defineProps({
  itemHeight: { default: 200 }, // 单行高度
  columns: { default: 4 },      // 每行列数
  buffer: { default: 2 }        // 上下预留行数
});

const imageCount = 10;
const rawImages: imageItem[] = Array.from({ length: imageCount }, (_, i) => ({
  id: i + 1, // 实际 ID
  url: `https://picsum.photos/200?random=${i}`,
  alt: `Game Image ${i + 1}`
}));

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(800); // 容器视口高度

// 1. 计算总行数（给一个极大的值模拟无限滚动，或根据需求动态增长）
const totalRows = 1000;

// 2. 计算当前显示的行索引范围
const startRow = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer));
const endRow = computed(() => Math.min(totalRows, startRow.value + Math.ceil(containerHeight.value / props.itemHeight) + props.buffer * 2));

// 3. 切片数据：只获取当前视口需要的图片
const visibleItems = computed(() => {
  const items = [];
  const itemWidthPercent = 100 / props.columns;

  for (let i = startRow.value; i < endRow.value; i++) {
    for (let j = 0; j < props.columns; j++) {
      const index = (i * props.columns + j) % imageCount;
      const originalItem = rawImages[index];

      items.push({
        virtualId: `${i}-${j}`,
        ...originalItem,
        // 关键修改：i * props.itemHeight 是绝对位置
        // 减去 scrollTop.value，图片就会相对于 .render-area 视口定位
        top: i * props.itemHeight - scrollTop.value,
        width: itemWidthPercent,
        left: j * itemWidthPercent
      });
    }
  }
  return items;
});

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  let currentScroll = target.scrollTop;

  const rowsPerGroup = Math.ceil(imageCount / props.columns);
  const groupHeight = rowsPerGroup * props.itemHeight;

  // 1. 实现向上滚动的无限循环
  if (currentScroll <= 0) {
    target.scrollTop = groupHeight;
    currentScroll = groupHeight;
  }

  // 2. 实现向下滚动的无限循环
  // 当滚动超过 5 组图片高度时，神不知鬼不觉地跳回第 2 组
  const limit = groupHeight * 5;
  if (currentScroll > limit) {
    target.scrollTop = currentScroll % groupHeight + groupHeight;
    currentScroll = target.scrollTop;
  }

  scrollTop.value = currentScroll;
};

onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
  <div class="virtual-scroll-container" ref="containerRef" @scroll="onScroll">
    <div class="phantom-spacer" :style="{ height: totalRows * props.itemHeight + 'px' }"></div>

    <div class="render-area">
      <router-link
          v-for="item in visibleItems"
          :to="{name: ROUTER_NAMES.GAME_DETAIL, params: {id: item.id}}"
          :key="item.virtualId"
          class="img-wrapper"
          :style="{
            height: props.itemHeight + 'px',
            width: item.width + '%',
            left: item.left + '%',
            transform: `translate3d(0, ${item.top}px, 0)`
          }"
      >
        <img :src="item.url" alt="" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll-container {
  position: relative;
  height: 800px;
  overflow-y: auto;
  scrollbar-width: none;
}
.phantom-spacer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.render-area {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 800px;
  width: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  -webkit-mask-image: -webkit-linear-gradient(
    to bottom,
    transparent 0%,
    #000 10%,
    #000 90%,
    transparent 100%
  );
  mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
  );
}
.img-wrapper {
  position: absolute;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
  display: block;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>