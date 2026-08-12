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
      props.data || []
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
  <div :class="[ns.b()]"
       :style="{maxHeight: maxHeight}"
       ref="tableRef">
    <div ref="hiddenColumns" class="hidden-columns">
      <slot />
    </div>
    <table :class="ns.e('header')">
      <colgroupHelper :tableLayout="tableLayout" :columns="store.state.columns" />
      <thead>
        <tr>
          <td v-for="(col, index) in store.state.columns" :key="col.prop">
            <div :class="[ns.e('cell')]">
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
          :class="rowClassName(rowVal, rowIndex, props.rowClassName)"
          :style="rowStyle(rowVal, rowIndex, props.rowStyle)">
        <td v-for="(col, colIndex) in store.state.columns"
            :key="col.key"
            :class="columnClassName(col)"
            :style="columnStyle(col)">
          <div :class="[
                ns.e('cell'),
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
  .ca-table {
    overflow: auto;
    border: 1px solid var(--color-border);
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
    background-color: #e1e1e1;
  }

  .ca-table__header .ca-table__cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    padding: 8px;
  }

  .ca-table__header .ca-table__cell .ca-table__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-table__header .ca-table__cell .ca-table__sort-control {
    margin-left: 4px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }

  .ca-table__header .ca-table__cell .ca-table__sort-control > div {
    font-size: 8px;
    cursor: pointer;
    will-change: color;
  }

  .ca-table__header .ca-table__cell .ca-table__sort-control > div.is-active {
    color: var(--color-accent);
  }

  .ca-table__body {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
  }
</style>