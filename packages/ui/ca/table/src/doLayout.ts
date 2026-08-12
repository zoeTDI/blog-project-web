import type { Ref } from 'vue';
import type { Store } from './types.ts';
import { isNumber } from '@caldm/utils';
import type { RenderColumn } from './tableColumn';

export const useDoLayout = (
  tableRef: Ref<HTMLElement | null>,
  store: Store,
) => {
  const resizeColumnsWidth = () => {
    if (!tableRef.value) return;
    let availableWidth = Math.floor(tableRef.value.clientWidth);
    let autoColumn: RenderColumn[] = [];
    store.state.columns.forEach((column: RenderColumn) => {
      if (isNumber(column?.width)) {
        availableWidth -= column.width;
      } else {
        autoColumn.push(column);
      }
    });

    if (availableWidth <= 0) {
      autoColumn.forEach((column) => {
        column.realWidth = isNumber(column?.minWidth) ? column.minWidth : 0;
      });
      return;
    }
    if (autoColumn.length < 1) return;

    const count = autoColumn.length;
    const baseWidth = Math.floor(availableWidth / count);
    autoColumn.forEach((column) => {
      if (isNumber(column?.minWidth)) {
        column.realWidth = Math.max(baseWidth, column.minWidth);
      } else {
        column.realWidth = baseWidth;
      }
    });
  };


  return {
    resizeColumnsWidth,
  };

};