<script setup lang="ts">
import { computed, type Component } from 'vue';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type {SwitchOption} from "@/components/ca/caSwitch";

const props = withDefaults(defineProps<{
  modelValue: any;
  options?: [SwitchOption, SwitchOption];
  prefix?: string;
  mode?: 'full' | 'icon';
}>(), {
  mode: 'icon',
  prefix: ''
});

const emit = defineEmits(['update:modelValue']);

const defaultOptions: [SwitchOption, SwitchOption] = [
  { value: true, label: 'ON', icon: CheckIcon },
  { value: false, label: 'OFF', icon: XMarkIcon }
];

// 获取最终使用的配置
const currentOptions = computed(() => props.options || defaultOptions);

// 计算当前匹配的选项对象
const activeOption = computed(() => {
  return currentOptions.value.find(opt => opt.value === props.modelValue) || currentOptions.value[0];
});

// 切换逻辑：在两个布尔值（或自定义选项值）之间切换
const toggle = () => {
  const [opt1, opt2] = currentOptions.value;
  const nextValue = props.modelValue === opt1.value ? opt2.value : opt1.value;
  emit('update:modelValue', nextValue);
};
</script>

<template>
  <div
      class="ca-switch"
      :class="[`is-${mode}`]"
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
}

.ca-switch:hover {
  border-color: var(--accent);
}

.is-icon {
  padding: 8px;
}

.is-full {
  padding: 6px 12px;
  gap: 12px;
}

.ca-switch__text {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  white-space: nowrap;
  letter-spacing: 1px;
}

.ca-switch__prefix {
  opacity: 0.6;
}

.ca-switch__icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ca-icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.ca-switch:active .ca-icon {
  transform: scale(0.85);
}
</style>