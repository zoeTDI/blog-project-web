<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { mockApiFetch } from '@/utils/mock.ts';
  import {
    type CityInfo,
    MapContainer,
    type MarkedCityGroup,
  } from '@/components/mapComponent';
  import { MarkdownRender } from '@/components/markdownRender';

  const mockData: MarkedCityGroup[] = [
    {
      id: 1,
      style: { color: '#ff0000' },
      nodes: {
        110101: [110108, 140000, 430100],
      },
    },
    {
      id: 2,
      style: { color: '#00ff00' },
      nodes: {
        310120: [370200, 430100],
      },
    },
  ];
  const mockNoteData: Record<number, any[]> = {
    110101: ['### 北京东城区游记\n这里是东城区的风景...'],
    110108: [],
    140000: ['### 山西足迹\n平遥古城非常震撼。'],
    430100: [],
    310120: [],
    370200: [
      '### 青岛第一天\n吃海鲜，喝啤酒。',
      '### 青岛第二天\n金沙滩看日出。',
    ],
  };

  const markedCityGroup = ref<MarkedCityGroup[]>([]);
  const noteData = ref<Record<number, any[]>>({});
  const selectedCity = ref<CityInfo | null>(null);

  function getHoveredFootprint(a: CityInfo | null): {
    name: string;
    visited: boolean;
    articleCount: number;
  } | null {
    if (a) {
      const cityId = a.adcode;
      const notes = noteData.value[cityId];
      if (Array.isArray(notes)) {
        return {
          name: a.name,
          visited: true,
          articleCount: notes.length,
        };
      } else {
        return {
          name: a.name,
          visited: false,
          articleCount: 0,
        };
      }
    } else {
      return null;
    }
  }
  const currentNotes = computed(() => {
    if (!selectedCity.value) return [];
    const cityId = selectedCity.value.adcode;
    return noteData.value[cityId] || [];
  });
  const isSplitLayout = computed(() => {
    return selectedCity.value !== null && currentNotes.value.length > 0;
  });
  function closeNotePaper() {
    selectedCity.value = null;
  }
  function handleMapClick(cityInfo: CityInfo) {
    const cityId = cityInfo.adcode;
    const notes = noteData.value[cityId];

    // 如果点击的地区包含笔记，则开启双栏
    if (Array.isArray(notes) && notes.length > 0) {
      selectedCity.value = cityInfo;
    } else {
      // 如果点击了没有笔记的地区，可以根据业务决定是关闭双栏，还是保持原样
      selectedCity.value = null;
    }
  }
  onMounted(async () => {
    markedCityGroup.value = await mockApiFetch(mockData);
    noteData.value = await mockApiFetch(mockNoteData);
  });
</script>

<template>
  <div class="travel">
    <div class="header-section">
      <h2>我的足迹</h2>
      <p class="subtitle">记录走过的每一座城市</p>
    </div>

    <div
      class="content-section"
      :class="{ 'layout-split': isSplitLayout }">
      <section class="map-paper-container">
        <map-container
          @click-city="handleMapClick"
          :marked-city-groups="markedCityGroup">
          <template #info-panel="{ hoveredCity }">
            <div v-show="hoveredCity">
              <div v-show="getHoveredFootprint(hoveredCity as CityInfo)">
                <div>
                  地区名称：{{
                    getHoveredFootprint(hoveredCity as CityInfo)?.name ||
                    '未知地区'
                  }}
                </div>
                <div>
                  是否去过：{{
                    getHoveredFootprint(hoveredCity as CityInfo)?.visited ||
                    false
                      ? '✅ 已足迹'
                      : '❌ 未前往'
                  }}
                </div>
                <div>
                  文章数量：{{
                    getHoveredFootprint(hoveredCity as CityInfo)
                      ?.articleCount || 0
                  }}
                  篇
                </div>
              </div>

              <div v-show="!getHoveredFootprint(hoveredCity as CityInfo)">
                <div>该地区暂无足迹记录</div>
              </div>
            </div>

            <div v-show="!hoveredCity">暂无信息</div>
          </template>
        </map-container>
      </section>
      <section class="note-paper-container">
        <div
          v-if="selectedCity"
          style="height: 100%; display: flex; flex-direction: column">
          <div class="note-header">
            <h3>{{ selectedCity.name }} 的旅行笔记</h3>
            <button
              class="close-btn"
              @click="closeNotePaper">
              ✕
            </button>
          </div>

          <div class="note-scroll-area">
            <div
              v-for="(note, index) in currentNotes"
              :key="index"
              class="note-item-wrapper">
              <MarkdownRender :content="note" />
              <hr
                v-if="index < currentNotes.length - 1"
                class="note-divider" />
            </div>
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
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 50% 0fr 1fr;
    height: 80vh;
    gap: 24px;
    overflow: hidden;
    transition: grid-template-columns 0.5s ease;
  }

  .content-section.layout-split {
    grid-template-columns: 0fr 50% 1fr 0fr;
  }

  /* 核心优化：地图“纸张”容器 */
  .map-paper-container {
    grid-column: 2 / 3;
    overflow: hidden;
    background: var(--color-container-bg);
    border: 1px solid var(--color-border);
    box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.05),
      0 4px 20px -5px rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(10px);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  /* 深色模式下的阴影加强 */
  :deep(.dark) .map-paper-container {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(30, 30, 30, 0.6); /* 更加深邃的半透明感 */
  }

  .note-paper-container {
    grid-column: 3 / 4;
    background: var(--color-container-bg);
    overflow-y: scroll;
    opacity: 0;
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  .note-paper-container::-webkit-scrollbar {
    width: 6px;
  }
  .note-paper-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .note-paper-container::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 3px;
  }

  .layout-split .note-paper-container {
    padding: 24px;
    opacity: 1;
    pointer-events: auto;
    user-select: auto;
    -webkit-user-select: auto;
    -moz-user-select: auto;
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

  .close-btn:hover {
    opacity: 1;
  }

  .note-scroll-area {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
  }

  .note-item-wrapper {
    margin-bottom: 20px;
  }
  .note-divider {
    border: none;
    border-top: 1px dashed var(--color-border);
    margin: 24px 0;
    opacity: 0.5;
  }
</style>
