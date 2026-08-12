import type { CSSProperties } from 'vue';
import type { RenderCell } from '../types.ts';

export interface TableColumnProps<T = any> {
  prop: string;
  label: string;
  /**
   * 自定义宽度
   */
  width?: number;
  /**
   * 未设置 width 时，将根据 minWidth 分配剩余宽度
   */
  minWidth?: number;
  columnClassName?: string | ((key: string) => string);
  columnStyle?: CSSProperties | ((key: string) => CSSProperties);
  renderCell?: RenderCell<T>
}

export interface RenderColumn extends TableColumnProps{
  realWidth?: number;
}