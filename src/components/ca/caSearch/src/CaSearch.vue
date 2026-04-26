<script setup lang="ts">
import { ref, nextTick } from "vue";
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  type?: 'static' | 'expand';
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'static',
  placeholder: '搜索文章 / SEARCH...'
})

const isExpanded = ref<boolean>(false);
const searchQuery = ref<string>('');
const inputRef = ref<HTMLInputElement | null>(null);

const toggleSearch = async () => {
  if (props.type === 'static') return;

  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    await nextTick();
    inputRef.value?.focus();
  } else {
    searchQuery.value = '';
  }
}

const handleClear = () => {
  searchQuery.value = '';
  inputRef.value?.focus();
}
</script>

<template>
  <div class="ca-search-root" :class="[type, { 'is-expanded': isExpanded }]">
    <div class="search-box">

      <Transition name="search-slide">
        <div v-if="type === 'static' || isExpanded" class="input-wrapper">
          <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="placeholder"
              class="inner-input"
          />
          <button v-if="searchQuery" class="action-btn clear" @click="handleClear">
            <XMarkIcon class="icon-svg" />
          </button>
        </div>
      </Transition>

      <button class="action-btn trigger" @click="toggleSearch">
        <MagnifyingGlassIcon class="icon-svg" />
      </button>

    </div>
  </div>
</template>

<style scoped>
/* 1. 根容器：确保在 Header 中占据正确位置 */
.ca-search-root {
  display: inline-flex;
  align-items: center;
  height: 40px;
  flex-shrink: 0;
  --search-height: 38px;
  --search-bg: var(--social-bg);
  --search-border: var(--border);
}

/* 2. 主体盒子：设置背景和边框线 */
.search-box {
  display: flex;
  align-items: center;
  height: var(--search-height);
  background: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: calc(var(--search-height) / 2);
  padding: 0 4px; /* 内部留白 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden; /* 关键：切除滑出的输入框 */
}

/* 3. 按钮基础样式：确保 1:1 比例，不塌陷 */
.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text);
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.action-btn:hover {
  color: var(--accent);
  background: var(--accent-bg);
}

.icon-svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* 4. 输入框容器 */
.input-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 12px;
  /* 静态模式固定宽度，展开模式根据动画计算 */
}

.inner-input {
  background: transparent;
  border: none;
  outline: none;
  height: 100%;
  width: 208px; /* 默认宽度 */
  font-family: var(--sans);
  font-size: 14px;
  color: var(--text-h);
}

/* ---------------- 模式差异处理 ---------------- */

/* 模式一：Static - 搜索框常驻 */
.static .search-box {
  width: 240px; /* 固定总宽 */
  background: var(--bg); /* 静态时通常希望背景更明显 */
}

.static .trigger {
  pointer-events: none; /* 静态模式下图标仅作为装饰 */
}

/* 模式二：Expand - 点击展开 */
.expand .search-box {
  width: 40px; /* 初始只显示圆圈 */
  border-color: transparent; /* 初始隐藏边框更极简 */
}

.expand.is-expanded .search-box {
  width: 260px; /* 展开后的总宽 */
  background: var(--bg);
  border-color: var(--border);
}

/* ---------------- 动画效果 ---------------- */
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s ease;
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* 当搜索框聚焦时增强边框色 */
.search-box:focus-within {
  border-color: var(--accent);
  background: var(--bg);
}
</style>