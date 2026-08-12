import { isString, isUndefined } from '@caldm/utils';
import { h } from 'vue';
import type { RenderColumn } from './tableColumn';

type Props = {
  tableLayout: 'fixed' | 'auto'
  columns?: any[]
}

export function colgroupHelper(props: Props) {
  const isAuto = props.tableLayout === 'auto';
  let columns = props?.columns || [];

  const getPropsData = (column: RenderColumn, i: number) => {
    const propsData = {
      key: `${props.tableLayout}_${column.prop}`,
      style: {},
      name: undefined as string | undefined,
    };
    if (isAuto) {
      propsData.style = {
        width: `${column.realWidth}px`,
      };
    }
    propsData.name = `ca-table-column-${i}`;
    return propsData;
  };

  return h(
    'colgroup',
    {},
    columns.map((column, i) => h('col', getPropsData(column, i))),
  );
}

colgroupHelper.props = ['columns', 'tableLayout'];