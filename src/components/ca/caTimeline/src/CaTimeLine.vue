<script setup lang="ts">
import { reactive } from 'vue'
import type {TimelineGroup} from "@/components/ca/caTimeline";

const props = defineProps<{
  data: TimelineGroup[]
}>()

// 控制展开/折叠的状态管理
const expandedYears = reactive<Record<number, boolean>>({})
const expandedItems = reactive<Record<number, Record<number, boolean>>>({})

// 初始化状态
props.data.forEach((year, yIdx) => {
  expandedYears[yIdx] = true
  expandedItems[yIdx] = {}
  year.items.forEach((_, iIdx) => {
    expandedItems[yIdx][iIdx] = true
  })
})

const toggleYear = (index: number) => {
  expandedYears[index] = !expandedYears[index]
}

const toggleItem = (yIdx: number, iIdx: number) => {
  if (expandedItems[yIdx]) {
    expandedItems[yIdx][iIdx] = !expandedItems[yIdx][iIdx]
  }
}

const isItemExpanded = (yIdx: number, iIdx: number) => {
  return expandedItems[yIdx] && expandedItems[yIdx][iIdx]
}
</script>

<template>
  <div class="timeline-container">
    <div v-for="(yearGroup, yearIndex) in data" :key="yearIndex" class="year-group">
      <h2 class="year-title" @click="toggleYear(yearIndex)">
        {{ yearGroup.title }}
      </h2>

      <div v-show="expandedYears[yearIndex]" class="year-content">
        <div v-for="(item, itemIndex) in yearGroup.items" :key="itemIndex" class="item-group">
          <h3 class="item-title" @click="toggleItem(yearIndex, itemIndex)">
            {{ item.itemTitle}}
            <span class="dot" :class="{ 'is-collapsed': !isItemExpanded(yearIndex, itemIndex) }"></span>
          </h3>

          <div v-show="isItemExpanded(yearIndex, itemIndex)" class="values-list">
            <div
                v-for="(val, valIndex) in (item.values)"
                :key="valIndex"
                class="timeline-card"
            >
              <slot :item="val">
                {{ val.title }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持原有布局样式，移除 .card-link 等具体业务样式 */
.timeline-container {
  font-family: var(--sans);
  max-width: var(--content-max-width);
  margin: 0 auto;
  border-left: 1px solid var(--border);
  padding-left: 24px;
}

.year-title {
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  font-family: var(--heading);
  color: var(--text-h);
  margin-bottom: 16px;
}

.item-group {
  position: relative;
  margin-bottom: 24px;
}

.item-title {
  cursor: pointer;
  padding-left: 12px;
  font-family: var(--heading);
  color: var(--text-h);
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.dot {
  position: absolute;
  left: -31px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 2px solid var(--accent);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dot.is-collapsed {
  background: var(--bg);
  transform: scale(0.8);
  border-color: var(--text);
  border-radius: 2px;
}

.values-list {
  margin-left: 12px;
}

.timeline-card {
  margin-bottom: 4px;
}
</style>