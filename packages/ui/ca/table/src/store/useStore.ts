import { reactive } from 'vue';
import type { Store } from '../types.ts';
import type { RenderColumn, TableColumnProps } from '../tableColumn';

export const useStore = (): Store => {
  const state = reactive<{
    columns: RenderColumn[];
  }>({
    columns: [],
  });

  const registerColumn = (props: TableColumnProps) => {
    const renderColumn: RenderColumn = { ...props, realWidth: props?.width };
    state.columns.push(renderColumn);
  };
  const unregisterColumn = (prop: string) => {
    const i = state.columns.findIndex((item) => item.prop == prop);
    if (i > -1) {
      state.columns.splice(i, 1);
    }
  };

  return {
    state,
    registerColumn,
    unregisterColumn,
  };
};