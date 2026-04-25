<script setup lang="ts">
import {onMounted, ref} from "vue";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaSection} from "@/components/ca/caSection";
import {TagCloud} from "@/components/tagCloud";
import {CaList, CaListItem} from "@/components/ca/caList";

// 标签云
// Mock 标签数据
const tags = ref([
  {name: 'Vue3', count: 25},
  {name: 'JavaScript', count: 30},
  {name: 'TypeScript', count: 18},
  {name: 'Canvas', count: 12},
  {name: 'CSS布局', count: 22},
  {name: '前端工程化', count: 8},
  {name: '极简主义', count: 15},
  {name: 'Three.js', count: 5},
  {name: '性能优化', count: 14},
  {name: '算法', count: 6},
  {name: 'Node.js', count: 10},
  {name: 'Vite', count: 20},
]);

const categories = ref([
  {name: '前端开发', count: 12},
  {name: '后端技术', count: 8},
  {name: '随笔感悟', count: 15},
  {name: 'UI/UX 设计', count: 5},
  {name: '读书笔记', count: 10},
  {name: '前端开发', count: 12},
  {name: '后端技术', count: 8},
  {name: '随笔感悟', count: 15},
  {name: 'UI/UX 设计', count: 5},
  {name: '读书笔记', count: 10}
]);

const height = 280;

const loadingStore = useLoadingStore();
onMounted(() => {
  loadingStore.endLoading();
})
</script>

<template>
  <div class="archive">
    <ca-row>
      <ca-col>
        <h2 class="page-title">文章归档 / ARCHIVES</h2>
      </ca-col>
    </ca-row>
    <ca-row :gap="40">
      <ca-col :span="18">
        <ca-section title="所有标签 / ALL TAGS">
          <tag-cloud :tags="tags" :height="height"/>
        </ca-section>
      </ca-col>
      <ca-col :span="6">
        <ca-section title="所有分类 / ALL CATEGORIES">
          <div class="category-scroll-container" :style="{height: `${height}px`}">
            <ca-list mode="plain">
              <ca-list-item v-for="cat in categories" :key="cat.name">
                <router-link :to="{}"><span class="cat-name">{{ cat.name }}</span></router-link>
                <template #suffix>
                  <span class="cat-count">{{ cat.count }}</span>
                </template>
              </ca-list-item>
            </ca-list>
          </div>
        </ca-section>
      </ca-col>
    </ca-row>
    <ca-row style="margin-top: 40px">
      <ca-col>
        <ca-section title="按月份 / BY MONTH" subtitle="ALL POSTS / 10">
          Note List
        </ca-section>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
.archive {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 48px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 55px;
}

/* 在 Archive.vue 样式中处理分类的滚动 */
.category-scroll-container {
  overflow-y: auto;
  padding-right: 10px;
}

/* 美化滚动条 (可选) */
.category-scroll-container::-webkit-scrollbar {
  width: 4px;
}

.category-scroll-container::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.category-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

.cat-name {
  font-size: 15px;
  cursor: pointer;
}

.cat-count {
  font-weight: 500;
}
</style>