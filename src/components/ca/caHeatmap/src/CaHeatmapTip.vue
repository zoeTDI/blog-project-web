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
    background: color-mix(
      in srgb,
      var(--color-text-primary, #000000) 92%,
      var(--color-bg, #ffffff)
    );
    color: var(--color-bg, #ffffff);
    padding: 6px 10px;
    border: 1px solid
      color-mix(in srgb, var(--color-text-primary) 15%, transparent);
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 999;
    box-shadow:
      0 4px 12px -2px rgba(0, 0, 0, 0.15),
      0 2px 6px -1px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    transition:
      background-color 0.3s,
      color 0.3s,
      border-color 0.3s;
  }

  .tip-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tip-date {
    color: color-mix(in srgb, var(--color-bg, #ffffff) 65%, transparent);
    font-size: 11px;
  }

  .tip-count {
    font-weight: 600;
  }

  .tip-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid
      color-mix(
        in srgb,
        var(--color-text-primary, #000000) 92%,
        var(--color-bg, #ffffff)
      );
  }

  .tip-arrow::after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid
      color-mix(
        in srgb,
        var(--color-text-primary, #000000) 92%,
        var(--color-bg, #ffffff)
      );
    z-index: -1;
  }

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
