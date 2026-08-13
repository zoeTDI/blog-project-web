import type { TableColumnProps } from './tableColumn';
import type { CSSProperties, VNode } from 'vue';

export interface RenderCellScope<T = any> {
  row: T;
  $index: number;
}

export type RenderCell<T = any> = (scope: RenderCellScope<T>) => VNode[] | VNode | unknown;

export interface Store {
  state: Record<string, any>;
  registerColumn: (props: TableColumnProps) => void;
  unregisterColumn: (prop: string) => void;
}

export interface CaTableContext {
  store: Store | null;
}

export interface CaTableProps {
  data: any[];
  height?: string | number;
  maxHeight?: number;
  rowClassName?: string | ((row: any, index: number) => string);
  rowStyle?: CSSProperties | ((row: any, index: number) => CSSProperties);
  cellClassName?: string | ((row: any, prop: string, rowIndex: number, columnIndex: number) => string);
  cellStyle?: CSSProperties | ((row: any, prop: string, rowIndex: number, columnIndex: number) => CSSProperties);
  /**
   * 斑马条纹
   */
  stripe?: boolean;
  /**
   * 列边框
   */
  border?: boolean;
}

