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
            <div :class="ns.e('sort-control')" v-if="col.sortable"></div>
          </div>
        </td>
      </tr>
      </thead>
    </table>
    <table :class="ns.e('body')">
      <colgroupHelper :tableLayout="tableLayout" :columns="store.state.columns" />
      <tbody>
        <tr v-for="(rowVal, rowIndex) in data || []"
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

  .ca-table__body {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
  }
</style>