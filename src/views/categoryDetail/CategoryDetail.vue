<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted, ref} from "vue";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {CaSection} from "@/components/ca/caSection";
import {useRoute} from "vue-router";
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {ArrowLeftIcon} from "@heroicons/vue/24/outline";
import CaTimeLine from "@/components/ca/caTimeline/src/CaTimeLine.vue";
import type {TimelineGroup} from "@/components/ca/caTimeline";
import {mockApiFetch} from "@/utils/mock.ts";

const route = useRoute();
const loadingStore = useLoadingStore();

const categoryList = ref([]);

const mockData = [
  {id: 1, name: 'cat1'},
  {id: 2, name: 'cat2222'},
  {id: 3, name: 'cat3'},
  {id: 4, name: 'cat4'},
  {id: 5, name: 'cat5'},
  {id: 6, name: 'cat6'},
  {id: 7, name: 'cat7'},
]

const getCategoryName = () => {
  return route.query?.name || '';
}


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

onMounted(async () => {
  categoryList.value = await mockApiFetch(mockData, 800);
  loadingStore.endLoading();
})
</script>

<template>
  <div class="category-detail">
    <ca-row>
      <ca-col>
        <ca-section :has-content="false">
          <template #title>分类 / CATEGORY {{ getCategoryName() }}</template>
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
              <span class="current-category">{{ getCategoryName() }}</span>
              <div class="other-categories">
                <span class="other-categories__item"
                      v-for="cat in categoryList.filter((cat) => cat?.id != route.query?.id)"
                      :key="cat.id">
                  <router-link :to="{name: ROUTER_NAMES.CATEGORY_DETAIL, query: {...cat}}">{{ cat?.name }}</router-link>
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
.category-detail {
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

.current-category {
  font-size: 1.4em;
  background-color: var(--bg-gray);
  padding: 4px 8px;
  border-radius: 4px;
}

.other-categories {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  column-gap: 12px;
  font-size: 14px;
  max-height: 180px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.other-categories__item {
  transition: all .3s ease;
}

.other-categories__item:hover {
  color: var(--accent);
}
</style>