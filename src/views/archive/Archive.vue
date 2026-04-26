<script setup lang="ts">
import {onMounted, ref} from "vue";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaSection} from "@/components/ca/caSection";
import {TagCloud} from "@/components/tagCloud";
import {CaList, CaListItem} from "@/components/ca/caList";
import {CaTimeline} from "@/components/ca/caTimeline";
import {useRouter} from "vue-router";

// 标签云
// Mock 标签数据
const tags = ref([
  {id: 1, name: 'Vue3', count: 25},
  {id: 2, name: 'JavaScript', count: 30},
  {id: 3, name: 'TypeScript', count: 18},
  {id: 4, name: 'Canvas', count: 12},
  {id: 5, name: 'CSS布局', count: 22},
  {id: 6, name: '前端工程化', count: 8},
  {id: 7, name: '极简主义', count: 15},
  {id: 8, name: 'Three.js', count: 5},
  {id: 9, name: '性能优化', count: 14},
  {id: 10, name: '算法', count: 6},
  {id: 11, name: 'Node.js', count: 10},
  {id: 12, name: 'Vite', count: 20},
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

const year2024Data = ref([
  {
    title: '2025',
    items: [
      {
        itemTitle: '03',
        values: [
          {date: '2025-06-25', title: '深入理解Vue3响应原理', tags: ['Vue3', '源码']}
        ]
      }
    ]
  },
  {
    title: '2024',
    items: [
      {
        itemTitle: '03',
        values: [
          {date: '2024-03-25', title: '深入理解 Vue3 响应式原理', tags: ['Vue3', '源码']},
          {date: '2024-03-12', title: 'Canvas 性能优化实践', tags: ['Canvas', '性能']}
        ]
      },
      {
        itemTitle: '02',
        values: [
          {date: '2024-03-25', title: '深入理解 Vue3 响应式原理', tags: ['Vue3', '源码']},
          {date: '2024-03-12', title: 'Canvas 性能优化实践', tags: ['Canvas', '性能']}
        ]
      }
    ]
  },
  {
    title: '2023',
    items: [
      {
        itemTitle: '03',
        values: [
          {date: '2024-03-25', title: '深入理解 Vue3 响应式原理', tags: ['Vue3', '源码']},
          {date: '2024-03-12', title: 'Canvas 性能优化实践', tags: ['Canvas', '性能']}
        ]
      },
      {
        itemTitle: '02',
        values: [
          {date: '2024-03-25', title: '深入理解 Vue3 响应式原理', tags: ['Vue3', '源码']},
          {date: '2024-03-12', title: 'Canvas 性能优化实践', tags: ['Canvas', '性能']}
        ]
      }
    ]
  },
])

const height = 280;

const loadingStore = useLoadingStore();
const router = useRouter();
const handleTagClick = (value) => {
  console.log('value', value)
  router.push({name: 'Tag', query: {...value}})
}

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
        <ca-section>
          <template #title>所有标签 / ALL TAGS</template>
          <tag-cloud :tags="tags" :height="height" :on-tag-click="handleTagClick"/>
        </ca-section>
      </ca-col>
      <ca-col :span="6">
        <ca-section>
          <template #title>所有分类 / ALL CATEGORIES</template>
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
        <ca-section>
          <template #title>按月份 / BY MONTH</template>
          <template #subtitle>ALL POSTS / 10</template>
          <ca-timeline :data="year2024Data">
            <template #default="{ item }">
              <router-link :to="item.to || {}" class="custom-card-link">
                <span class="post-date">{{ item.date }}</span>
                <span class="post-title">{{ item.title }}</span>
                <div class="post-tags">
                <span v-for="tag in item.tags" :key="tag" class="post-tag">
                  #{{ tag }}
                </span>
                </div>
              </router-link>
            </template>
          </ca-timeline>
        </ca-section>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
.archive {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
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

/* 时间轴相关 */
.custom-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 12px 16px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.custom-card-link:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.post-date {
  font-size: 0.85em;
  font-family: var(--mono);
  color: var(--text);
  margin-right: 16px;
  opacity: 0.7;
}

.post-title {
  font-weight: 500;
  color: var(--text-h);
}

.post-tags {
  margin-top: 6px;
  display: flex;
  gap: 12px;
}

.post-tag {
  font-size: 0.8em;
  transition: all 0.2s ease;
}

.post-tag:hover {
  color: var(--accent);
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