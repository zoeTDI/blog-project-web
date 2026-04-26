<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {CaSection} from "@/components/ca/caSection";
import {ArrowLeftIcon} from "@heroicons/vue/24/outline";
import CaTimeLine from "@/components/ca/caTimeline/src/CaTimeLine.vue";
import type {TimelineGroup} from "@/components/ca/caTimeline";
import {mockApiFetch} from "@/utils/mock.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

const route = useRoute();
const loadingStore = useLoadingStore();


const getTagName = () => {
  return route.query?.name || '';
}

const tagList = ref([]);
const timeLineData = ref<TimelineGroup[]>([
  {
    title: '2024年',
    items: [
      {
        itemTitle: '04',
        values: [
          {
            id: '1',
            title: '文章标题#0',
            tags: ['Vue3', 'Paginator']
          },
          {
            id: '2',
            title: '文章标题#1',
            tags: ['Vue3', 'Paginator']
          },
          {
            id: '3',
            title: '文章标题#2',
            tags: ['Vue3', 'Paginator']
          }
        ]
      },
      {
        itemTitle: '02',
        values: [
          {
            id: '4',
            title: '文章标题#3',
            tags: ['Vue3', 'Paginator']
          },
          {
            id: '5',
            title: '文章标题#4',
            tags: ['Vue3', 'Paginator']
          },
          {
            id: '6',
            title: '文章标题#5',
            tags: ['Vue3', 'Paginator']
          }
        ]
      }
    ]
  }
])

const mockData = [
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
];

onMounted(async () => {
  tagList.value = await mockApiFetch(mockData, 800);
  tagList.value.filter((item) => {
    let id = route.query?.id || -1;
    return item != id;
  })
  loadingStore.endLoading();
})

</script>

<template>
  <div class="by-tag">
    <ca-row>
      <ca-col>
        <ca-section :has-content="false">
          <template #title>标签 / TAG {{ getTagName() }}</template>
          <template #subtitle>
            <router-link class="back-to-archives" :to="{name: ROUTER_NAMES.ARCHIVES}">
              <arrow-left-icon class="icon"/>
              Back to Archive
            </router-link>
          </template>
        </ca-section>
      </ca-col>
    </ca-row>
    <ca-row style="margin-top: 30px;" :gap="30">
      <ca-col :span="18">
        <ca-section>
          <ca-time-line :data="timeLineData">
            <template #default="{item}">
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
          </ca-time-line>
        </ca-section>
      </ca-col>
      <ca-col :span="6">
        <ca-row :gap="8">
          <ca-col>
            <ca-section>
              <span class="current-tag">#{{ getTagName() }}</span>
              <div class="other-tags">
                <span class="other-tags__item" v-for="item in tagList.filter((tag) => tag?.id != route.query?.id)"
                      :key="item.id">
                  <router-link :to="{name: ROUTER_NAMES.TAG_DETAIL, query: {...item}}">
                  #{{ item?.name || '' }}
                  </router-link>
                </span>
              </div>
            </ca-section>
          </ca-col>
        </ca-row>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
.by-tag {
  width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
}

.back-to-archives {
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

.back-to-archives .icon {
  margin-right: 8px;
  height: 16px;
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

.current-tag {
  font-size: 1.4em;
  background-color: var(--bg-gray);
  padding: 4px 8px;
  border-radius: 4px;
}

.other-tags {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  font-size: 14px;
  max-height: 180px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.other-tags__item {
  transition: all .3s ease;
}

.other-tags__item:hover {
  color: var(--accent);
}
</style>