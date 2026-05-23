<script setup lang="ts">
import { useLoadingStore } from "@/store/useLoadingStore.ts";
import { ROUTER_NAMES } from "@/router/routerNames.ts";
import {CaVirtualGrid, type ImageItem} from "@/components/ca/caVirtualGrid";
import {onMounted} from "vue";


const loadingStore = useLoadingStore();

const baseData = [
  {id: 1, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514121222230.webp', alt: 'Factorio'},
  {id: 2, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122455480.webp', alt: '戴森球计划'},
  {id: 3, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122043047.webp', alt: '鬼谷八荒'},
  {id: 4, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122811723.webp', alt: '只狼'},
  {id: 5, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122811726.webp', alt: '赛博朋克：2077'},
  {id: 6, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122811724.webp', alt: '巫师三'},
  {id: 7, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122811725.webp', alt: '放松时光'},
  {id: 8, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514122811722.webp', alt: 'warframe'},
  {id: 9, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641006.webp', alt: '黑神话：悟空'},
  {id: 10, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641013.webp', alt: '空洞骑士'},
  {id: 12, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641008.webp', alt: '暖雪'},
  {id: 13, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641004.webp', alt: '了不起的修仙模拟器'},
  {id: 14, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641005.webp', alt: '龙崖'},
  {id: 11, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641009.webp', alt: 'Noita'},
  {id: 15, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641010.webp', alt: '古墓丽影'},
  {id: 16, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641011.webp', alt: '刺客信条：大革命'},
  {id: 17, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641007.webp', alt: '命运石之门'},
  {id: 18, url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260514123641012.webp', alt: 'OPUS MAGNUM'},
]

const rawImages: ImageItem[] = [...baseData];

onMounted(() => {
  loadingStore.endLoading();
})
</script>

<template>
  <div class="games">
    <header class="page-header">
      <div class="header-content">
        <h1 class="title">游戏画廊</h1>
        <p class="description">
          欢迎来到视觉中心。这里展示了精选的游戏艺术图集，采用了高性能虚拟列表技术，
          支持响应式布局与无缝循环滚动。
        </p>
      </div>
    </header>
    <div class="grid-container">
      <ca-virtual-grid :list="rawImages" :min-width="320" :aspect-ratio="16/9" is-loop>
        <template #item="{ item, position }">
          <router-link
              :to="{ name: ROUTER_NAMES.GAME_DETAIL, params: { id: item.id } }"
              class="img-wrapper"
              :style="{
              height: position.height + 'px',
              width: position.width + '%',
              left: position.left + '%',
              transform: `translate3d(0, ${position.top}px, 0)`
            }"
          >
            <img :src="item.url" :alt="item.alt" />
          </router-link>
        </template>
      </ca-virtual-grid>
    </div>
  </div>
</template>

<style scoped>
.games {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  padding: 60px 40px 40px;
  background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  flex-shrink: 0; /* 确保 header 不会被压缩 */
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #fff, #888);
  -webkit-background-clip: text;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #aaa;
}

.grid-container {
  flex: 1;
  position: relative;
  width: 100%;
  overflow: hidden;
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

.img-wrapper:hover { opacity: 1 !important; }

.img-wrapper::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.img-wrapper:hover::after { opacity: 1; }

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.img-wrapper:hover img { transform: scale(1.05); }
</style>