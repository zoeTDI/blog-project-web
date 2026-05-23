<script setup lang="ts">
import ChinaMap from "@/views/travel/src/ChinaMap.vue";
import { useLoadingStore } from "@/store/useLoadingStore.ts";
import {computed, onMounted, ref, toRaw} from "vue";
import {mockApiFetch} from "@/utils/mock.ts";
import type {Footprint, TravelDataResponse} from "@/views/travel/src/types.ts";
import {MarkdownRender} from "@/components/markdownRender";
const loadingStore = useLoadingStore();
const rawMockData: TravelDataResponse = {
  footprints: [
    // 北京：修改为具体的区或使用 110100 (市辖区)
    { adcode: 110105, name: '朝阳区', articleCount: 15, visited: true, articles: ['demo1', 'demo2'] },
    // 上海：修改为具体的区
    { adcode: 310115, name: '浦东新区', articleCount: 8, visited: true, articles: ['demo1', 'demo2'] },
    // 杭州：330100 是杭州市本级
    { adcode: 330100, name: '杭州市', articleCount: 12, visited: true, articles: ['demo1', 'demo2'] },
    // 成都：510100 是成都市本级
    { adcode: 510100, name: '成都市', articleCount: 5, visited: true, articles: ['demo1', 'demo2'] },
    // 广州：440100 是广州市本级
    { adcode: 440100, name: '广州市', articleCount: 2, visited: true, articles: ['demo1', 'demo2'] },
    // 南京：320100 是南京市本级
    { adcode: 320100, name: '南京市', articleCount: 0, visited: false, articles: ['demo1', 'demo2'] },
  ],
  routes: [
    { id: 'r1', fromAdcode: 110105, toAdcode: 310115 }, // 朝阳 -> 浦东
    { id: 'r2', fromAdcode: 310115, toAdcode: 440100 }, // 浦东 -> 广州
    { id: 'r3', fromAdcode: 330100, toAdcode: 510100 }, // 杭州 -> 成都
  ]
};
const travelData = ref<TravelDataResponse>({ footprints: [], routes: [] });
const noteData = ref<string[]>([]);
const selectedCityAdcode = ref<number | null>(null);
const footprintMap = computed(() => {
  const map: Record<number, Footprint> = {};
  if (travelData.value?.footprints) {
    travelData.value.footprints.forEach(fp => {
      map[fp.adcode] = fp;
    });
  }
  return map;
});

const hasNotesForSelectedCity = computed(() => {
  if (!selectedCityAdcode.value) return false;
  const cityInfo = footprintMap.value[selectedCityAdcode.value];
  // 只有当用户去过，且关联的文章/笔记数组不为空时才展开
  return !!(cityInfo && cityInfo.visited && cityInfo.articles && cityInfo.articles.length > 0);
});

const handleCityClick = (cityProperties: any) => {
  const adcode = cityProperties.adcode;

  // 如果点击的是已经选中的城市，则再次点击关闭它（收起笔记栏）
  if (selectedCityAdcode.value === adcode) {
    selectedCityAdcode.value = null;
  } else {
    selectedCityAdcode.value = adcode;

    // 【此处可扩展】：根据 adcode 向后端异步请求该城市的详细笔记内容
    const cityInfo = footprintMap.value[adcode];
    if (cityInfo && cityInfo.articles) {
      // 模拟加载对应城市的笔记
      noteData.value = toRaw(cityInfo.articles);
      console.log(noteData.value)
    } else {
      noteData.value = [];
    }
  }
};

onMounted(async () => {
  travelData.value = await mockApiFetch(rawMockData, 800)
  loadingStore.endLoading()
})
</script>

<template>
  <div class="travel">
    <div class="header-section">
      <h2>我的足迹</h2>
      <p class="subtitle">记录走过的每一座城市</p>
    </div>

    <div class="content-section" :class="{ 'layout-split': hasNotesForSelectedCity }">
      <section class="map-paper-container">
        <china-map :data="travelData" @click-city="handleCityClick" />
      </section>
      <section class="note-paper-container">
        <div class="note-content-wrapper" v-if="hasNotesForSelectedCity">
          <div class="note-header">
            <h3>{{ footprintMap[selectedCityAdcode!].name }} · 旅行笔记</h3>
            <button class="close-btn" @click="selectedCityAdcode = null">✕</button>
          </div>

          <div class="note-scroll-area">
            <markdown-render
                v-for="(note, index) in noteData"
                :key="index"
                :content="note"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.travel {
  width: 100%;
  padding: var(--content-padding-L);
  margin: 0 auto;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 40px;
  text-align: center;
}

.subtitle {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 14px;
  margin-top: 8px;
}

.content-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 24px;
  align-items: flex-start;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 核心优化：地图“纸张”容器 */
.map-paper-container {
  flex: 0 1 40%;
  overflow: hidden;
  background: var(--color-container-bg);
  border: 1px solid var(--color-border);
  box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.05),
      0 4px 20px -5px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 深色模式下的阴影加强 */
:deep(.dark) .map-paper-container {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: rgba(30, 30, 30, 0.6); /* 更加深邃的半透明感 */
}

.note-paper-container {
  flex: 0 1 0%;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
  background: var(--color-container-bg);
  border: 0 solid var(--color-border);
  overflow: hidden;
  transition: flex 0.4s cubic-bezier(0.25, 1, 0.5, 1),
  opacity 0.2s ease,
  border-width 0.4s ease;
}
.layout-split .map-paper-container {
  flex: 0 0 40%;
}

.layout-split .note-paper-container {
  flex: 0 0 40%;
  width: auto;
  height: auto;
  opacity: 1;
  pointer-events: auto;
  border-width: 1px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.05);
}

.note-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 700px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.note-header h3 {
  margin: 0;
  font-family: var(--font-h);
  color: var(--color-text-h);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  opacity: 0.5;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
}
.close-btn:hover { opacity: 1; }

.note-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}
</style>