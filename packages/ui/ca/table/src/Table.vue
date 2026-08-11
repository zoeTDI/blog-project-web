<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaTableProps } from './types.ts';
  import { useStore } from './store/useStore.ts';
  import { computed, provide } from 'vue';
  import { CaTableContextKey } from './constants.ts';
  import { colgroupHelper } from './colgroupHelper.ts';
  import { isNumber, isString } from '@caldm/utils';
  import { columnClassName, columnStyle, rowClassName, rowStyle, cellClassName, cellStyle } from './utils.ts';

  defineOptions({
    name: 'CaTable',
  });

  const props = withDefaults(defineProps<CaTableProps>(), {
    data: () => [],
  });

  const store = useStore();
  const ns = useCSSNamespace('table');

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
</script>

<template>
  <div :class="[ns.b()]" :style="{maxHeight: maxHeight}">
    <div ref="hiddenColumns" class="hidden-columns">
      <slot />
    </div>
    <button @click="() => console.log(store.state)">Button</button>
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
            {{ rowVal[col.prop] }}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  .ca-table {
    overflow-y: scroll;
  }

  .hidden-columns {
    visibility: hidden;
    position: absolute;
    z-index: -1000;
  }
</style>