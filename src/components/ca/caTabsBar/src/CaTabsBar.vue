<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";
import type {TabItem} from "@/components/ca/caTabsBar";
import {XMarkIcon} from "@heroicons/vue/24/outline";
import {useTabStore} from "@/store/useTabStore.ts";

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

const activeTabPath = computed(() => route.path)

const tabList = computed<TabItem[]>(() => tabStore.tabs)

const handleClickTab = (path: string) => {
  router.push(path)
}

const handleTabClose = (e: Event, path: string) => {
  e.stopPropagation()
  const nextPath = tabStore.closeTab(path, route.path)
  if (nextPath && nextPath !== route.path) {
    router.push(nextPath)
  }
}
</script>

<template>
  <nav class="tabs-bar">
    <div v-for="tab in tabList"
         :key="tab.path"
         :class="['tab-item', {active: activeTabPath === tab.path}]"
         @click="handleClickTab(tab.path)"
    >
      <span class="tab-title">{{ tab.title }}</span>
      <span v-if="tab.closeable !== false" class="close-icon" @click="handleTabClose($event, tab.path)">
      <x-mark-icon/>
    </span>

    </div>
  </nav>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-bottom: 1px solid transparent;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  color: #1890ff;
  background-color: #f5f5f5;
}

.tab-item.active {
  color: #1890ff;
  background-color: #fff;
  border-color: #e8e8e8;
  height: 33px; /* 微微提高 1px，盖住 nav 的下边框，形成连贯视觉 */
  margin-bottom: -1px;
  position: relative;
  z-index: 2;
}

.tab-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1890ff;
  border-radius: 4px 4px 0 0;
}

.tab-title {
  white-space: nowrap;
}

.close-icon {
  margin-left: 8px;
  font-size: 14px;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  transition: all 0.2s;
  color: #999;
}

.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: #666;
}
</style>