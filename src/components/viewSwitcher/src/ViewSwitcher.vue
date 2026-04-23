<script setup lang="ts">
interface Props {
  modelValue: string;
  total: number;
  // 1. 响应式列数控制
  cols?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  // 2. 统计信息显示开关
  showCount?: boolean;
  // 3. 底部边框开关
  showBorder?: boolean;
  // 4. 动态模式选项
  options?: Array<{ label: string; value: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  showBorder: true,
  cols: () => ({desktop: 4, tablet: 2, mobile: 1}),
  options: () => [
    {label: 'LIST', value: 'list'},
    {label: 'CARD', value: 'card'}
  ]
});

const emit = defineEmits(['update:modelValue']);

const setMode = (mode: string) => {
  emit('update:modelValue', mode);
};
</script>

<template>
  <div class="view-switcher-container">
    <div
        class="view-switcher-action-bar"
        :class="{ 'no-border': !showBorder }"
    >
      <div class="action-left">
        <span v-if="showCount" class="results-count">ALL POSTS / {{ total }}</span>
      </div>

      <div class="action-right">
        <div class="mode-controls">
          <button
              v-for="opt in options"
              :key="opt.value"
              :class="['switch-btn', { active: modelValue === opt.value }]"
              @click="setMode(opt.value)"
          >
            <span class="btn-text">{{ opt.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
        class="view-switcher-content"
        :style="{
        '--cols-desktop': cols.desktop,
        '--cols-tablet': cols.tablet,
        '--cols-mobile': cols.mobile
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.view-switcher-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.view-switcher-action-bar.no-border {
  border-bottom: none;
}

.results-count {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--text);
  opacity: 0.6;
}

.mode-controls {
  display: flex;
  gap: 1px;
  background-color: var(--border);
  border: 1px solid var(--border);
}

.switch-btn {
  background-color: var(--bg);
  border: none;
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.btn-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text);
  opacity: 0.5;
}

.switch-btn.active {
  background-color: var(--accent-bg);
}

.switch-btn.active .btn-text {
  color: var(--accent);
  opacity: 1;
  font-weight: 600;
}

.switch-btn:hover:not(.active) .btn-text {
  opacity: 1;
}

/* 响应式：控制统计信息的显示 */
@media (max-width: 480px) {
  .results-count { display: none; }
  .view-switcher-action-bar { justify-content: flex-end; }
}
</style>