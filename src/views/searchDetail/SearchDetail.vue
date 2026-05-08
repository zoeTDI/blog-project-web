<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {CaSection} from "@/components/ca/caSection";
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {ArrowLeftIcon} from '@heroicons/vue/24/outline'
import CaTimeLine from "@/components/ca/caTimeline/src/CaTimeLine.vue";
import type {TimelineGroup} from "@/components/ca/caTimeline";
import {mockApiFetch} from "@/utils/mock.ts";
import {escapeHtml} from "markdown-it/lib/common/utils";

const route = useRoute();
const loadingStore = useLoadingStore();
const queryValue = ref<string>('');

const fetchSearchResult = async (params: object) => {
  const rawData = await mockApiFetch([
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
  ], 800);
  timeLineData.value = rawData.map(yearGroup => ({
    ...yearGroup,
    items: yearGroup.items.map(itemGroup => ({
      ...itemGroup,
      values: itemGroup.values.map(val => ({
        ...val,
        title: highlightText(val.title, queryValue.value)
      }))
    }))
  }));
}

const highlightText = (text: string, keyword: string):string => {
  if (!keyword || !text) return text;

  const safeText = escapeHtml(text);
  if(!keyword) return safeText;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(`(${escapedKeyword})`, 'gi');
  return text.replace(reg, '<span class="highlight">$1</span>');
}

const handleRouteQueryParams = async () => {
  const _ = {...route.query};
  if (!('src' in _)) _.src = 'unknown';
  if (!('sort' in _)) _.sort = 'created_at';
  if (!('timestamp' in _)) _.sort = new Date().getTime().toString();
  if (!('q' in _)) _.q = '';
  queryValue.value = _.q;
  await fetchSearchResult(_);
}

const timeLineData = ref<TimelineGroup[]>([])


onMounted(async () => {
  await handleRouteQueryParams();
  loadingStore.endLoading();
})
</script>

<template>
  <div class="search-detail">
    <ca-row>
      <ca-col>
        <ca-section :has-content="false">
          <template #title>搜索内容 / Search Content {{ queryValue }}</template>
          <template #subtitle>
            <router-link class="back-to-home" :to="{name: ROUTER_NAMES.HOME}">
              <arrow-left-icon class="icon" />
              Back to Home
            </router-link>
          </template>
        </ca-section>
      </ca-col>
    </ca-row>
    <ca-row style="margin-top: 30px;" :gap="30">
      <ca-col>
        <ca-section>
          <ca-time-line :data="timeLineData">
            <template #default="{item}">
              <router-link :to="item.to || {}" class="custom-card-link">
                <span class="post-date">{{item.date}}</span>
                <span class="post-title" v-html="item.title"></span>
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
    </ca-row>
  </div>
</template>

<style scoped>
.search-detail {
  width: var(--content-max-width-M);
  margin: 0 auto;
  padding: var(--content-padding-M);
}

.back-to-home {
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

.back-to-home .icon {
  margin-right: 8px;
  height: 16px;
}

.post-date {
  font-size: 0.85em;
  font-family: var(--font-text);
  color: var(--color-text-primary);
  margin-right: 16px;
  opacity: 0.7;
}

.post-title {
  font-weight: 500;
  color: var(--color-text-h);
}

.post-title :deep(.highlight) {
  color: var(--color-accent);
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
  color: var(--color-text-hover-accent);
}


</style>