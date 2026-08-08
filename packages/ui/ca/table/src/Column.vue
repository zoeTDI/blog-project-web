<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, inject, ref } from 'vue';
  import { CaTableContextKey } from './constants.ts';
  import type { CaTableColumnProps } from './types.ts';
  import { isArray, isNumber } from '@caldm/utils';
  import CaTableTip from './Tip.vue';

  defineOptions({
    name: 'CaTableColumn',
  });

  const props = withDefaults(defineProps<CaTableColumnProps>(), {});

  const { data, rowClassName } = inject(CaTableContextKey, {
    data: computed(() => []),
    rowClassName: computed(() => ({})),
  });

  const ns = useCSSNamespace('table-column');

  const tipState = ref({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    rowData: null as any,
  });

  const columnValue = computed(() => {
    if (data.value && isArray(data.value)) {
      return data.value.map((item) => item[props.prop]);
    }
    return [];
  });

  const styles = computed(() => {
    const rs: Record<string, string> = {};
    if (isNumber(props.width)) {
      const key: string = ns.cssVarBlockName('width');
      rs[key] = props.width + 'px';
      rs['flex'] = `0 0 ${props.width}px`;
    } else {
      rs['flex'] = '1 1 0%';
    }
    return rs;
  });

  const isOverflow = (el: HTMLElement): boolean => {
    return el.scrollWidth > el.clientWidth;
  };

  const handleCellMouseEnter = (e: MouseEvent, val: any, index: number) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    // 只有发生视觉截断时才显示 Tip
    if (isOverflow(target)) {
      const row = data.value?.[index] || {};
      tipState.value = {
        visible: true,
        x: e.clientX,
        y: e.clientY,
        label: String(val ?? ''),
        rowData: row,
      };
    }
  };

  const handleCellMouseMove = (e: MouseEvent) => {
    if (tipState.value.visible) {
      tipState.value.x = e.clientX;
      tipState.value.y = e.clientY;
    }
  };

  const handleCellMouseLeave = () => {
    if (tipState.value.visible) {
      tipState.value.visible = false;
    }
  };

  const getRowClassName = (i: number): string[] => {
    const rcMap = rowClassName?.value;
    if (rcMap && Object.hasOwn(rcMap, i)) {
      const cls = rcMap[i];
      if (isArray(cls)) {
        return cls;
      }
    }
    return [];
  };
</script>

<template>
  <div :class="ns.b()" :style="styles">
    <div :class="ns.e('label')">
      {{ props.label || '' }}
    </div>
    <div :class="ns.e('column-container')">
      <div v-for="(val, i) in columnValue"
           :key="i"
           :class="[ns.e('cell'), getRowClassName(i)]"
           @mouseenter="handleCellMouseEnter($event, val, i)"
           @mousemove="handleCellMouseMove"
           @mouseleave="handleCellMouseLeave">
        <slot :name="`${prop}+${i}`" :data="val">{{ val }}</slot>
      </div>
    </div>
    <CaTableTip
      :visible="tipState.visible"
      :x="tipState.x"
      :y="tipState.y"
      :label="tipState.label"
      :row-data="tipState.rowData"
    />
  </div>
</template>

<style scoped>
  .ca-table-column {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .ca-table-column__label {
    width: var(--ca-table-column-width, 100%);
    color: var(--color-text-primary);
    font-weight: bold;
    padding: 10px 20px;
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-table-column__column-container {
    width: var(--ca-table-column-width, 100%);
  }

  .ca-table-column__cell {
    width: 100%;
    padding: 10px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>