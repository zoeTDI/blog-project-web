import type { ComputedRef } from 'vue';

export interface CaTableColumnProps {
  prop: string;
  label: string;
  width?: number;
}

export interface CaTableContext {
  data: ComputedRef<any[]>;
  rowClassName?: ComputedRef<Record<number, string[]>>;
}

export interface CaTableProps {
  data: any[];
  rowClassName?: Record<number, string[]>;
}

export interface CaTableTipProps {
  x?: number;
  y?: number;
  visible?: boolean;
  label?: string;
  rowData?: any;
}

export interface CaTableEmits {

}

export interface CaTableExpose {

}
