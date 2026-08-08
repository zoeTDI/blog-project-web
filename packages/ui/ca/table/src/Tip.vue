<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaTableTipProps } from './types.ts';
  import { computed, type CSSProperties } from 'vue';

  defineOptions({
    name: 'CaTableTip',
  });

  const props = withDefaults(defineProps<CaTableTipProps>(), {
    x: 0,
    y: 0,
    visible: false,
    label: '',
    rowData: () => ({}),
  });

  const ns = useCSSNamespace('table-tip');

  const styles = computed<CSSProperties>(() => ({
    top: `${props.y}px`,
    left: `${props.x}px`,
  }));
</script>

<template>
  <Teleport to="body">
    <Transition :name="`${ns.b()}-fade`">
      <div
        v-if="visible"
        :class="ns.b()"
        :style="styles"
      >
        <slot :label="label" :row-data="rowData">
          {{ label }}
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .ca-table-tip {
    position: fixed;
    z-index: 3000;
    padding: 6px 12px;
    font-size: 12px;
    line-height: 1.4;
    color: #fff;
    background-color: #303133;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    pointer-events: none;
    white-space: normal;
    word-break: break-all;
    max-width: 300px;
    transform: translate(8px, 8px);
  }

  .ca-table-tip-fade-enter-active,
  .ca-table-tip-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .ca-table-tip-fade-enter-from,
  .ca-table-tip-fade-leave-to {
    opacity: 0;
    transform: translate(8px, 4px);
  }
</style>