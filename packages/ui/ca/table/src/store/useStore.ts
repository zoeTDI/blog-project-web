import { reactive } from 'vue';
import type { Store } from '../types.ts';
import type { TableColumnProps } from '../tableColumn';

export const useStore = (): Store => {
  const state = reactive<{
    columns: TableColumnProps[];
  }>({
    columns: [],
  });

  const registerColumn = (props: TableColumnProps) => {
    state.columns.push(props);
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