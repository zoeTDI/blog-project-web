import type { CSSProperties } from 'vue';

export interface TableColumnProps {
  prop: string;
  label: string;
  /**
   * 自定义宽度
   */
  width?: number;
  columnClassName?: string | ((key: string) => string);
  columnStyle?: CSSProperties | ((key: string) => CSSProperties)
}