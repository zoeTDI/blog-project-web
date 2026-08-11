import { isString, isUndefined } from '@caldm/utils';
import { h } from 'vue';
import type { TableColumnProps } from './tableColumn';

type Props = {
  tableLayout: 'fixed' | 'auto'
  columns?: any[]
}

export function colgroupHelper(props: Props) {
  const isAuto = props.tableLayout === 'auto';
  let columns = props?.columns || [];

  if (isAuto) {
    if (columns.every(({ width }) => isUndefined(width))) {
      columns = [];
    }
  }

  const getPropsData = (column: TableColumnProps) => {
    const propsData = {
      key: `${props.tableLayout}_${column.prop}`,
      style: {},
      name: undefined as string | undefined,
    };
    if (isAuto) {
      propsData.style = {
        width: `${column.width}px`,
      };
    } else {
      propsData.name = column.prop;
    }
    return propsData;
  };

  return h(
    'colgroup',
    {},
    columns.map((column) => h('col', getPropsData(column))),
  );
}

colgroupHelper.props = ['columns', 'tableLayout'];