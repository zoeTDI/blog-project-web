<script setup lang="ts">

import {Bars3Icon, Squares2X2Icon} from '@heroicons/vue/24/outline';
import {computed} from "vue";
import {CaRadio, CaRadioGroup} from "@/components/ca/caRadioGroup"; // 建议引入图标增强视觉

interface Props {
  modelValue: string;
  total: number;
  cols?: { desktop?: number; tablet?: number; mobile?: number; };
  showCount?: boolean;
  showBorder?: boolean;
  // options 属性在原子化组件模式下变为可选，因为你可以直接在模板中写死，也可以保留
  options?: Array<{ label: string; value: string; icon?: any }>;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  showBorder: true,
  cols: () => ({desktop: 4, tablet: 2, mobile: 1}),
  options: () => [
    {label: 'LIST', value: 'list', icon: Bars3Icon},
    {label: 'CARD', value: 'card', icon: Squares2X2Icon}
  ]
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

</script>

<template>
  <div class="view-switcher-container">
    <div class="view-switcher-action-bar" :class="{ 'no-border': !showBorder }">
      <div class="action-left">
        <span v-if="showCount" class="results-count">ALL POSTS / {{ total }}</span>
      </div>
      <div class="action-right">
        <div class="action-right">
          <ca-radio-group v-model="internalValue" size="L" layout="button-group">
            <ca-radio
                v-for="opt in options"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
                :icon="opt.icon"
            />
          </ca-radio-group>
        </div>
      </div>
    </div>

    <div
        class="view-switcher-grid"
        :class="[`is-layout-${modelValue}`]"
        :style="{
        '--desktop-grid': cols.desktop,
        '--tablet-grid': cols.tablet,
        '--mobile-grid': cols.mobile
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

.view-switcher-grid {
  display: grid;
  transition: all 0.5s ease;
}

.is-layout-list {
  grid-template-columns: 1fr;
  gap: 24px;
}

.is-layout-card {
  grid-template-columns: repeat(var(--desktop-grid), 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .is-layout-card {
    grid-template-columns: repeat(var(--tablet-grid), 1fr);
  }
}

@media (max-width: 640px) {
  .is-layout-card {
    grid-template-columns: repeat(var(--mobile-grid), 1fr);
  }
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
  .results-count {
    display: none;
  }

  .view-switcher-action-bar {
    justify-content: flex-end;
  }
}
</style>