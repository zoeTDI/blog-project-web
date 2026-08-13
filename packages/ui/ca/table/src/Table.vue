<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaTableProps } from './types.ts';
  import { useStore } from './store/useStore.ts';
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import { CaTableContextKey } from './constants.ts';
  import { colgroupHelper } from './colgroupHelper.ts';
  import { isNumber, isString } from '@caldm/utils';
  import { columnClassName, columnStyle, rowClassName, rowStyle, cellClassName, cellStyle } from './utils.ts';
  import { useDoLayout } from './doLayout.ts';
  import { cellRender } from './cellRender.ts';
  import { filterCore } from './filterHelper.ts';

  defineOptions({
    name: 'CaTable',
  });

  const props = withDefaults(defineProps<CaTableProps>(), {
    data: () => [],
    stripe: false,
    border: false,
    size: 'M',
    highCurrent: false,
  });

  const tableRef = ref<HTMLElement | null>(null);

  const store = useStore();
  const ns = useCSSNamespace('table');
  let doLayout = null;
  let observer: ResizeObserver | null = null;
  const curSort = ref<{
    prop: string | null;
    sortBy: string | null;
    sortMethod: ((a: any, b: any) => number) | null;
    sortState: 'ascending' | 'descending' | null;
  }>({ prop: null, sortBy: null, sortMethod: null, sortState: null });

  const tableLayout = computed(() => {
    if (isNumber(props?.maxHeight)) {
      return 'fixed';
    }
    return 'auto';
  });

  const maxHeight = computed(() => {
    if (isString(props?.maxHeight)) return props.maxHeight;
    else if (isNumber(props?.maxHeight)) return props.maxHeight + 'px';
    return 'auto';
  });

  const tableData = computed(() => {
    return filterCore(
      {
        prop: curSort.value.prop ?? '',
        by: curSort.value.sortBy,
        method: curSort.value.sortMethod,
        state: curSort.value.sortState,
      },
      props.data || [],
    );
  });

  const handleSortControlClick = (col: any, sortState: 'ascending' | 'descending') => {
    // 点击同一个列的同一个方向，取消排序
    if (curSort.value.prop === col.prop && curSort.value.sortState === sortState) {
      curSort.value = { prop: null, sortBy: null, sortMethod: null, sortState: null };
    } else {
      curSort.value = {
        prop: col.prop,
        // 如果列配置了 sortBy 优先取 sortBy，否则默认使用 prop 作为 key
        sortBy: col.sortBy ?? col.prop,
        sortMethod: col.sortMethod ?? null,
        sortState,
      };
    }
  };

  provide(CaTableContextKey, { store });

  onMounted(() => {
    doLayout = useDoLayout(tableRef, store);
    doLayout.resizeColumnsWidth();
    if (tableRef.value) {
      observer = new ResizeObserver(doLayout.resizeColumnsWidth);
      observer.observe(tableRef.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
</script>

<template>
  <div :class="[ns.b(), ns.m(size)]"
       :style="[{maxHeight: maxHeight}]"
       ref="tableRef">
    <div ref="hiddenColumns" class="hidden-columns">
      <slot />
    </div>
    <table :class="ns.e('header')">
      <colgroupHelper :tableLayout="tableLayout" :columns="store.state.columns" />
      <thead>
      <tr :class="ns.e('row')">
        <td v-for="(col, index) in store.state.columns"
            :key="col.prop"
            :class="[
              ns.e('cell'),
              {[ns.m('border')]: border && (index + 1) != store.state.columns.length}
              ]">
          <div :class="[ns.e('cell-container')]">
            <div :class="ns.e('label')">
              {{ col.label }}
            </div>
            <div :class="ns.e('sort-control')"
                 v-if="col.sortable">
              <div
                :class="[ns.e('up'), ns.is('active', col.prop === curSort.prop && 'ascending' === curSort.sortState)]"
                @click="handleSortControlClick(col, 'ascending')">
                ▲
              </div>
              <div
                :class="[ns.e('up'), ns.is('active', col.prop === curSort.prop && 'descending' === curSort.sortState)]"
                @click="handleSortControlClick(col, 'descending')">
                ▼
              </div>
            </div>
          </div>
        </td>
      </tr>
      </thead>
    </table>
    <table :class="ns.e('body')">
      <colgroupHelper :tableLayout="tableLayout" :columns="store.state.columns" />
      <tbody>
      <tr v-for="(rowVal, rowIndex) in tableData || []"
          :key="rowIndex"
          :class="[
            ns.e('row'),
            rowClassName(rowVal, rowIndex, props.rowClassName),
            {
              [ns.m('stripe')]: (rowIndex + 1) % 2 === 0 && stripe,
              [ns.m('high-current')]: highCurrent
            }
            ]"
          :style="rowStyle(rowVal, rowIndex, props.rowStyle)">
        <td v-for="(col, colIndex) in store.state.columns"
            :key="col.key"
            :class="[
              ns.e('cell'),
              columnClassName(col),
              {[ns.m('border')]: border && (colIndex + 1) != store.state.columns.length}
              ]"
            :style="columnStyle(col)">
          <div :class="[
                  ns.e('cell-container'),
                  cellClassName(rowVal, col.key, rowIndex, colIndex, props.cellClassName)
                ]"
               :style="cellStyle(rowVal, col.key, rowIndex, colIndex, props.cellStyle)">
            <cellRender :col="col"
                        :row="rowVal"
                        :row-index="rowIndex" />
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  .ca-table.ca-table--S {
    --ca-table-font-size: 12px;
    --ca-table-cell-padding-y: 4px;
    --ca-table-cell-padding-x: 8px;
  }

  .ca-table.ca-table--M {
    --ca-table-font-size: 14px;
    --ca-table-cell-padding-y: 8px;
    --ca-table-cell-padding-x: 12px;
  }

  .ca-table.ca-table--L {
    --ca-table-font-size: 16px;
    --ca-table-cell-padding-y: 12px;
    --ca-table-cell-padding-x: 16px;
  }

  .ca-table {
    overflow: auto;
    color: var(--ca-table-cell-text-color);
    border: 1px solid var(--ca-table-border-color);
  }

  .hidden-columns {
    visibility: hidden;
    position: absolute;
    z-index: -1000;
  }

  .ca-table__header {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
    background-color: var(--ca-table-header-bg);
    color: var(--ca-table-header-text-color);
  }

  .ca-table__header .ca-table__row {
    border-bottom: 1px solid var(--ca-table-border-color);
  }

  .ca-table__header .ca-table__cell {
    padding: var(--ca-table-cell-padding-y) var(--ca-table-cell-padding-x);
    font-size: var(--ca-table-font-size);
    border-right: 1px solid transparent;
  }

  .ca-table__header .ca-table__cell.ca-table--border {
    border-right: 1px solid var(--ca-table-border-color);
  }

  .ca-table__header .ca-table__cell-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
  }

  .ca-table__header .ca-table__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-table__header .ca-table__sort-control {
    margin-left: 4px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }

  .ca-table__header .ca-table__sort-control > div {
    font-size: 8px;
    cursor: pointer;
    color: var(--ca-table-border-color);
    will-change: color;
  }

  .ca-table__header .ca-table__sort-control > div.is-active {
    color: var(--ca-table-sort-active-color);
  }

  .ca-table__body {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .ca-table__body .ca-table__row {
    border-bottom: 1px solid var(--ca-table-border-color);
  }

  .ca-table__body .ca-table__row:last-child {
    border-bottom: 1px solid transparent;
  }

  .ca-table__body .ca-table__row.ca-table--stripe {
    background-color: var(--ca-table-stripe-bg);
  }

  .ca-table__body .ca-table__row.ca-table--high-current:hover {
    background-color: var(--ca-table-row-hover-bg);
  }

  .ca-table__body .ca-table__cell {
    padding: var(--ca-table-cell-padding-y) var(--ca-table-cell-padding-x);
    font-size: var(--ca-table-font-size);
    border-right: 1px solid transparent;
  }

  .ca-table__body .ca-table__cell-container {
  }

  .ca-table__body .ca-table__cell.ca-table--border {
    border-right: 1px solid var(--ca-table-border-color);
  }
</style>