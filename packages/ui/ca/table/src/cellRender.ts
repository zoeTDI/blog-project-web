export const cellRender = (props: { col: any; row: any; rowIndex: number }) => {
  if (props.col.renderCell) {
    return props.col.renderCell({ row: props.row, $index: props.rowIndex });
  }
  return props.row[props.col.prop];
};

cellRender.props=['col', 'row', 'rowIndex']