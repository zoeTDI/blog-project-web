import type { TableColumnProps } from './tableColumn';
import { isFunction, isObject, isString } from '@caldm/utils';
import type { CSSProperties } from 'vue';

export const columnClassName = (column: TableColumnProps) => {
  if (!column) return;
  if (isString(column.columnClassName)) return column.columnClassName;
  else if (isFunction(column.columnClassName)) return column.columnClassName(column.prop);
};

export const columnStyle = (column: TableColumnProps) => {
  if (!column) return;
  if (isFunction(column.columnStyle)) return column.columnStyle(column.prop);
  else if (isObject(column.columnStyle)) return column.columnStyle;
};

export const rowClassName = (
  row: any,
  index: number,
  rowClassName?: string | ((row: any, index: number) => string),
) => {
  if (!rowClassName) return;
  if (isString(rowClassName)) return rowClassName;
  else if (isFunction(rowClassName)) return rowClassName(row, index);
};

export const rowStyle = (
  row: any,
  index: number,
  rowStyle?: CSSProperties | ((row: any, index: number) => CSSProperties),
) => {
  if (!rowStyle) return;
  if (isFunction(rowStyle)) return rowStyle(row, index);
  else if (isObject(rowStyle)) return rowStyle;
};

export const cellClassName = (
  row: any,
  prop: string,
  rowIndex: number,
  columnIndex: number,
  cellClassName?: string | ((row: any, prop: string, rowIndex: number, columnIndex: number) => string),
) => {
  if (!cellClassName) return;
  if (isString(cellClassName)) return cellClassName;
  else if (isFunction(cellClassName)) return cellClassName(row, prop, rowIndex, columnIndex);
};

export const cellStyle = (
  row: any,
  prop: string,
  rowIndex: number,
  columnIndex: number,
  cellStyle?: CSSProperties | ((row: any, prop: string, rowIndex: number, columnIndex: number) => CSSProperties),
) => {
  if (!cellStyle) return;
  if (isFunction(cellStyle)) return cellStyle(row, prop, rowIndex, columnIndex);
  else if (isObject(cellStyle)) return cellStyle;
};