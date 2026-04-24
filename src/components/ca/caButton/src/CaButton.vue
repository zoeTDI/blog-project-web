<script setup lang="ts">
import { computed } from 'vue';
import {type ButtonProps, type ButtonType} from '@/components/ca/caButton';
import type {ComponentSize} from "#/component.ts";

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'secondary' as ButtonType,
  size: 'M' as ComponentSize,
  loading: false,
  disabled: false,
  iconPosition: 'left' as const,
  hoverEffect: 'none' as const,
  block: false,
  round: false,
  nativeType: 'button' as const
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};

// 计算类名
const buttonClasses = computed(() => [
  'ca-button',
  `is-${props.type}`,
  `is-${props.size}`,
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
    'is-block': props.block,
    'is-round': props.round,
    [`hover-${props.hoverEffect}`]: props.hoverEffect !== 'none'
  }
]);
</script>

<template>
  <button
      :type="nativeType"
      :class="buttonClasses"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <component
        :is="icon"
        v-if="icon && !loading && iconPosition === 'left'"
        class="ca-btn-icon is-left"
    />

    <span class="ca-btn-content">
      <slot />

      <span v-if="loading" class="ca-btn-loader">
        <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </span>
    </span>

    <component
        :is="icon"
        v-if="icon && !loading && iconPosition === 'right'"
        class="ca-btn-icon is-right"
    />
  </button>
</template>

<style scoped>
.ca-button {
  --btn-accent: var(--accent);
  --btn-text: var(--text);
  --btn-border: var(--border);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 1px solid var(--btn-border);
  background: transparent;
  color: var(--btn-text);
  font-family: var(--mono);
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
  white-space: nowrap;
  gap: 8px;
}

/* --- 尺寸策略 --- */
.is-S { padding: 4px 12px; font-size: 11px; height: 28px; }
.is-M { padding: 8px 24px; font-size: 12px; height: 36px; }
.is-L { padding: 12px 40px; font-size: 14px; height: 48px; }

.is-block { width: 100%; display: flex; }
.is-round { border-radius: 24px; }

/* --- 类型风格 --- */
.is-primary {
  border-color: var(--btn-text);
}

.is-text {
  border-color: transparent;
  padding-left: 4px;
  padding-right: 4px;
}

/* --- 悬停动效：宽度扩张 (List.vue 专用) --- */
.hover-expand:hover:not(:disabled) {
  padding-left: 60px;
  padding-right: 60px;
  border-color: var(--btn-accent);
  color: var(--btn-accent);
}

.ca-button:hover:not(:disabled):not(.hover-expand) {
  border-color: var(--btn-accent);
  color: var(--btn-accent);
}

/* --- 点击反馈 --- */
.ca-button:active:not(:disabled) {
  transform: scale(0.97);
}

/* --- Loading 状态与打点动画 --- */
.is-loading {
  cursor: wait;
  opacity: 0.7;
}

.ca-btn-loader {
  display: inline-flex;
  margin-left: 4px;
  width: 12px;
  text-align: left;
}

.dot {
  animation: dot-blink 1.4s infinite both;
  font-weight: bold;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-blink {
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 0; transform: translateY(0); }
}

/* --- 图标样式 --- */
.ca-btn-icon {
  width: 1.2em;
  height: 1.2em;
  transition: transform 0.3s ease;
}

/* --- 禁用状态 --- */
.is-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(1);
}
</style>