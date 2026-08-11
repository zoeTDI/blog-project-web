import type { TableColumnProps } from './tableColumn';
import type { CSSProperties } from 'vue';

export interface Store {
  state: Record<string, any>;
  registerColumn: (prop: TableColumnProps) => void;
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
}

