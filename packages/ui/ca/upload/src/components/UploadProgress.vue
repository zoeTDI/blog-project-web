<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';

  defineOptions({
    name: 'CaUploadProgress',
  });

  export type ProgressStatus = 'default' | 'success' | 'error' | 'warning';

  const props = withDefaults(
    defineProps<{
      percent?: number;
      status?: ProgressStatus;
      strokeWidth?: number;
      showText?: boolean;
    }>(),
    {
      percent: 0,
      status: 'default',
      strokeWidth: 2,
      showText: true,
    },
  );

  const { b, e, m, is } = useCSSNamespace('upload-progress');

  // 格式化并限制百分比在 0 - 100 范围
  const validPercent = computed(() => {
    return Math.min(100, Math.max(0, Math.round(props.percent)));
  });

  // 进度条 Outer/Inner 样式配置
  const outerStyle = computed(() => ({
    height: `${props.strokeWidth}px`,
  }));

  const innerStyle = computed(() => ({
    width: `${validPercent.value}%`,
  }));
</script>

<template>
  <div :class="[b(), m(status), is('show-text', showText)]">
    <div :class="e('outer')" :style="outerStyle">
      <div :class="e('inner')" :style="innerStyle" />
    </div>
    <span v-if="showText" :class="e('text')">
      {{ validPercent }}%
    </span>
  </div>
</template>

<style scoped>
  .ca-upload-progress {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .ca-upload-progress__outer {
    flex: 1;
    background-color: var(--color-progress-bg, #e5e7eb);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .ca-upload-progress__inner {
    height: 100%;
    background-color: var(--color-primary, #3b82f6);
    border-radius: 9999px;
    transition: width 0.3s ease-in-out, background-color 0.3s ease;
  }

  .ca-upload-progress__text {
    margin-left: 8px;
    font-size: 12px;
    color: var(--color-text-secondary, #6b7280);
    line-height: 1;
    min-width: 32px;
    text-align: right;
  }

  .ca-upload-progress--success .ca-upload-progress__inner {
    background-color: var(--color-success, #10b981);
  }

  .ca-upload-progress--error .ca-upload-progress__inner {
    background-color: var(--color-error, #ef4444);
  }

  .ca-upload-progress--warning .ca-upload-progress__inner {
    background-color: var(--color-warning, #f59e0b);
  }
</style>