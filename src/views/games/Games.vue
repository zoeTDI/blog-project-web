<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
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

const containerWidth = ref(window.innerWidth);

const dynamicColumns = computed(() => {
  const minWidth = 250;
  const cols = Math.floor(containerWidth.value / minWidth);
  return cols > 0 ? cols : 1;
})

const updateWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth;
  }
}

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

const dynamicItemHeight = computed(() => {
  const width = containerWidth.value / dynamicColumns.value;
  return width * (9 / 16);
});

const startRow = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / dynamicItemHeight.value) - props.buffer)
);

const endRow = computed(() =>
    Math.min(totalRows, startRow.value + Math.ceil(containerHeight.value / dynamicItemHeight.value) + props.buffer * 2)
);

const visibleItems = computed(() => {
  const items = [];
  const cols = dynamicColumns.value;
  const itemWidthPercent = 100 / cols;
  const rowHeight = dynamicItemHeight.value; // 使用动态计算的行高

  for (let i = startRow.value; i < endRow.value; i++) {
    for (let j = 0; j < cols; j++) {
      const index = (i * cols + j) % imageCount;
      const originalItem = rawImages[index];

      items.push({
        virtualId: `${i}-${j}`,
        ...originalItem,
        // 关键：位置计算使用动态行高
        top: i * rowHeight - scrollTop.value,
        width: itemWidthPercent,
        left: j * itemWidthPercent,
        height: rowHeight // 传递给模板使用
      });
    }
  }
  return items;
});

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  let currentScroll = target.scrollTop;
  const cols = dynamicColumns.value;
  const rowsPerGroup = Math.ceil(imageCount / cols);

  const groupHeight = rowsPerGroup * dynamicItemHeight.value;

  if (currentScroll <= 0) {
    target.scrollTop = groupHeight;
    currentScroll = groupHeight;
  }

  const limit = groupHeight * 5;
  if (currentScroll > limit) {
    target.scrollTop = currentScroll % groupHeight + groupHeight;
    currentScroll = target.scrollTop;
  }

  scrollTop.value = currentScroll;
};

onMounted(() => {
  updateWidth();
  window.addEventListener('resize', updateWidth);
  loadingStore.endLoading()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
})
</script>

<template>
  <div class="virtual-scroll-container" ref="containerRef" @scroll="onScroll">
    <div
        class="phantom-spacer"
        :style="{ height: totalRows * dynamicItemHeight + 'px' }"
    ></div>

    <div class="render-area">
      <router-link
          v-for="item in visibleItems"
          :to="{name: ROUTER_NAMES.GAME_DETAIL, params: {id: item.id}}"
          :key="item.virtualId"
          class="img-wrapper"
          :style="{
            height: item.height + 'px', // 使用动态高度
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
  transition: opacity 0.3s ease;
}

.img-wrapper:hover {
  opacity: 1 !important;
}

.img-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明 */
  opacity: 0; /* 默认不可见 */
  transition: opacity 0.3s ease;
  z-index: 1;
}

.img-wrapper:hover::after {
  opacity: 1;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.img-wrapper:hover img {
  transform: scale(1.05);
}
</style>