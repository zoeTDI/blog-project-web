<script setup lang="ts">
import {inject, computed} from 'vue';
import {RADIO_GROUP_KEY} from "./types.ts";

const props = defineProps<{
  value: any;
  label?: string;
  icon?: any;
}>();

const context = inject(RADIO_GROUP_KEY);

const isActive = computed(() => context?.modelValue.value === props.value);
const groupSize = computed(() => context?.size.value || 'M');

const handleClick = () => {
  context?.changeValue(props.value);
};
</script>

<template>
  <div
      class="ca-radio"
      :class="{ 'is-active': isActive }, `size-${groupSize}`"
      @click="handleClick"
  >
    <component :is="icon" v-if="icon" class="ca-radio__icon"/>
    <span v-if="label" class="ca-radio__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.ca-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px; /* 还原原 switch-btn 的 padding */
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--bg); /* 还原原背景色 */
  color: var(--text);
}

/* 尺寸策略：控制 Padding, Font-size, Icon-size */
.size-S { padding: 4px 10px; }
.size-S .ca-radio__label { font-size: 10px; }
.size-S .ca-icon { width: 12px; height: 12px; }

.size-M { padding: 6px 16px; }
.size-M .ca-radio__label { font-size: 11px; }
.size-M .ca-icon { width: 14px; height: 14px; }

.size-L { padding: 10px 24px; }
.size-L .ca-radio__label { font-size: 13px; }
.size-L .ca-icon { width: 18px; height: 18px; }

.ca-radio__label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  opacity: 0.5; /* 还原原未激活状态的透明度 */
}

.ca-radio:hover .ca-radio__label {
  opacity: 1;
}

/* 激活状态样式还原 */
.ca-radio.is-active {
  background-color: var(--accent-bg); /* 还原原 active 背景 */
}

.ca-radio.is-active .ca-radio__label {
  color: var(--accent);
  opacity: 1;
  font-weight: 600;
}

.ca-radio__icon {
  width: 14px;
  height: 14px;
  /* 如果有图标，也应用相同的颜色逻辑 */
}

.ca-radio.is-active .ca-radio__icon {
  color: var(--accent);
}
</style>