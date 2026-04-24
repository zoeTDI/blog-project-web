<script setup lang="ts">
import { inject, computed } from 'vue';
import { RADIO_GROUP_KEY } from "@/components/ca/caRadioGroup"; // 请检查此引用路径是否正确

const props = defineProps<{
  value: any;
  label?: string;
  icon?: any;
}>();

const context = inject(RADIO_GROUP_KEY);

// 错误处理：如果没有 context，默认使用 button-group 布局
const isActive = computed(() => context?.modelValue.value === props.value);
const groupSize = computed(() => context?.size.value || 'M');
const layout = computed(() => context?.layout.value || 'button-group');

const handleClick = () => {
  if (context) {
    context.changeValue(props.value);
  }
};
</script>

<template>
  <div
      class="ca-radio"
      :class="[{ 'is-active': isActive }, `size-${groupSize}`, `mode-${layout}`]"
      @click="handleClick"
  >
    <div v-if="layout !== 'button-group'" class="ca-radio__indicator-wrapper">
      <div class="ca-radio__indicator">
        <div class="indicator-dot"></div>
      </div>
    </div>

    <div class="ca-radio__content">
      <component :is="icon" v-if="icon" class="ca-icon ca-radio__icon" />
      <span v-if="label" class="ca-radio__label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   Base
   ========================================================================== */
.ca-radio {
  display: flex;
  align-items: center; /* 垂直居中 */
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-family: var(--mono);
}

/* ==========================================================================
   Indicator (仅在非 button-group 下显示)
   ========================================================================== */
.ca-radio__indicator-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 解决椭圆问题 1: 确定外层宽度 */
  width: 1.5em;
  flex-shrink: 0; /* 解决椭圆问题 2: 防止被挤压 */
}

.ca-radio__indicator {
  /* 解决椭圆问题 3: 确定具体像素，不使用百分比或 1em */
  width: 14px;
  height: 14px;
  border: 1px solid var(--border);
  border-radius: 50%; /* 完美圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: var(--bg);
}

.indicator-dot {
  width: 6px;
  height: 6px;
  background-color: var(--accent);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s ease;
}

/* ==========================================================================
   Content Area
   ========================================================================== */
.ca-radio__content {
  display: flex;
  align-items: center;
  gap: 8px; /* 图标与文字的间距 */
  flex: 1;
  line-height: 1;
}

.ca-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0; /* 防止图标被挤压 */
  display: block;
}

.ca-radio__label {
  letter-spacing: 0.5px;
  color: var(--text);
}

/* ==========================================================================
   Mode: list, flow, grid
   ========================================================================== */
.mode-list, .mode-flow, .mode-grid {
  background: transparent;
  padding: 8px 0;
  gap: 12px; /* 标识符与内容区的间距 */
}

/* List 布局下可能需要撑满 */
.mode-list {
  width: 100%;
}

/* 激活状态 */
.is-active.mode-list .ca-radio__indicator,
.is-active.mode-flow .ca-radio__indicator,
.is-active.mode-grid .ca-radio__indicator {
  border-color: var(--accent);
}

.is-active.mode-list .indicator-dot,
.is-active.mode-flow .indicator-dot,
.is-active.mode-grid .indicator-dot {
  transform: scale(1);
}

.is-active.mode-list .ca-radio__label,
.is-active.mode-flow .ca-radio__label,
.is-active.mode-grid .ca-radio__label {
  color: var(--accent);
  font-weight: 600;
}

/* --- 统一处理激活状态下的颜色 --- */
.is-active .ca-radio__label,
.is-active .ca-radio__icon {
  /* 当父级处于 is-active 时，文字和图标都变为主题色 */
  color: var(--accent) !important;
  opacity: 1; /* 选中时取消透明度 */
}

/* ==========================================================================
   Mode: button-group
   ========================================================================== */
.mode-button-group {
  justify-content: center;
  background-color: var(--bg);
  color: var(--text);
  opacity: 0.6;
  flex: 1;
}

/* 尺寸还原 */
.size-S.mode-button-group { padding: 4px 10px; font-size: 10px; }
.size-M.mode-button-group { padding: 6px 12px; font-size: 11px; }
.size-L.mode-button-group { padding: 10px 16px; font-size: 14px; }

/* 激活还原 */
.mode-button-group.is-active {
  background-color: var(--accent-bg);
  color: var(--accent);
  opacity: 1;
}

/* ==========================================================================
   Hover & Size
   ========================================================================== */
.ca-radio:hover:not(.is-active) {
  opacity: 1;
}

/* 其他模式下的尺寸微调 */
.size-S.mode-list, .size-S.mode-flow, .size-S.mode-grid { gap: 8px; }
.size-S.mode-list .ca-radio__content,
.size-S.mode-flow .ca-radio__content,
.size-S.mode-grid .ca-radio__content { gap: 6px; }
.size-S .ca-radio__label { font-size: 10px; }
.size-S .ca-icon { width: 12px; height: 12px; }

.size-L .ca-radio__label { font-size: 13px; }
.size-L .ca-icon { width: 18px; height: 18px; }
</style>