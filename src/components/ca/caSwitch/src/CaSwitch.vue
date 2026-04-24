<script setup lang="ts">
import { computed } from 'vue';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { SwitchOption } from "./types.ts";
import type {ComponentSize} from "#/component.ts";

const props = withDefaults(defineProps<{
  modelValue: any;
  options?: [SwitchOption, SwitchOption];
  prefix?: string;
  mode?: 'full' | 'icon';
  size?: ComponentSize; // 新增 size 属性
}>(), {
  mode: 'icon',
  prefix: '',
  size: 'M' // 默认为 M
});

const emit = defineEmits(['update:modelValue']);

const defaultOptions: [SwitchOption, SwitchOption] = [
  { value: true, label: 'ON', icon: CheckIcon },
  { value: false, label: 'OFF', icon: XMarkIcon }
];

const currentOptions = computed(() => props.options || defaultOptions);

const activeOption = computed(() => {
  return currentOptions.value.find(opt => opt.value === props.modelValue) || currentOptions.value[0];
});

const toggle = () => {
  const [opt1, opt2] = currentOptions.value;
  const nextValue = props.modelValue === opt1.value ? opt2.value : opt1.value;
  emit('update:modelValue', nextValue);
};
</script>

<template>
  <div
      class="ca-switch"
      :class="[`is-${mode}`, `size-${size}`]"
      @click="toggle"
      :title="activeOption.label"
  >
    <div v-if="mode === 'full'" class="ca-switch__text">
      <span v-if="prefix" class="ca-switch__prefix">{{ prefix }}</span>
      <span class="ca-switch__label">{{ activeOption.label ?? activeOption.value }}</span>
    </div>

    <div class="ca-switch__icon-holder">
      <component :is="activeOption.icon" class="ca-icon" />
    </div>
  </div>
</template>

<style scoped>
.ca-switch {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  background-color: transparent;
  gap: 8px; /* 文字和图标的间距 */
}

.ca-switch:hover {
  border-color: var(--accent);
}

/* --- 尺寸控制逻辑 --- */

/* 1. 仅图标模式 (is-icon) */
.is-icon.size-S { padding: 6px; }
.is-icon.size-M { padding: 8px; } /* 修改前的原尺寸 */
.is-icon.size-L { padding: 12px; }

/* 2. 全模式 (is-full) */
.is-full.size-S { padding: 4px 10px; }
.is-full.size-M { padding: 6px 14px; } /* 修改前的原尺寸 */
.is-full.size-L { padding: 10px 20px; }

/* 3. 内部元素尺寸调整 */
.size-S .ca-switch__text { font-size: 10px; }
.size-S .ca-icon { width: 12px; height: 12px; }

.size-M .ca-switch__text { font-size: 11px; } /* 修改前的原尺寸 */
.size-M .ca-icon { width: 14px; height: 14px; }

.size-L .ca-switch__text { font-size: 14px; }
.size-L .ca-icon { width: 18px; height: 18px; }

/* --- 基础文本样式 --- */
.ca-switch__text {
  font-family: var(--mono);
  letter-spacing: 1px;
  display: flex;
  gap: 4px;
}

.ca-switch__prefix {
  opacity: 0.5;
}

.ca-switch__label {
  color: var(--accent);
  font-weight: 600;
}

.ca-icon {
  color: var(--accent);
  display: block;
}
</style>