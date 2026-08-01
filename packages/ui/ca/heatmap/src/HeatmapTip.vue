<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaHeatmapTipProps } from './types.ts';

  defineOptions({
    name: 'CaHeatmapTip',
  });

  const props = defineProps<CaHeatmapTipProps>();

  const ns = useCSSNamespace('heatmap-tip');
</script>

<template>
  <div v-if="data"
       :class="ns.b()"
       :style="{
         left: x+'px',
         top: y+'px',
         transform: 'translate(-50%, -100%) translateY(-8px)',}">
    <slot :data="data">
      <div :class="ns.e('default')">
        <div :class="ns.e('date')">{{ data.date }}</div>
        <div :class="ns.e('count')">{{ data.count }}</div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
  .ca-heatmap-tip {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, calc(-100% - 8px));
  }

  .ca-heatmap-tip__default {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(4px);
    white-space: nowrap;
  }

  .ca-heatmap-tip__date {
    font-weight: 500;
  }

  .ca-heatmap-tip__count {
    opacity: 0.8;
    font-size: 11px;
  }
</style>