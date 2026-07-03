<script setup lang="ts">
  import type { HeatmapValue } from '@/components/ca/caHeatmap';

  interface Props {
    visible: boolean;
    x: number;
    y: number;
    data: HeatmapValue | null;
  }

  defineProps<Props>();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible && data"
      class="ca-heatmap-tip"
      :style="{ left: `${x}px`, top: `${y}px` }">
      <div class="tip-content">
        <span class="tip-date">{{ data.date }}</span>
        <span class="tip-count">{{ data.count }}</span>
      </div>
      <div class="tip-arrow"></div>
    </div>
  </Transition>
</template>

<style scoped>
  .ca-heatmap-tip {
    position: absolute;
    transform: translate(-50%, -100%);
    margin-top: -8px;
    background: rgba(15, 23, 42, 0.9);
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 999;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: none;
  }

  .tip-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tip-date {
    color: #94a3b8;
    font-size: 11px;
  }

  .tip-count {
    font-weight: 500;
  }

  .tip-arrow {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(15, 23, 42, 0.9);
  }

  /* 动画效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -95%);
  }
</style>
