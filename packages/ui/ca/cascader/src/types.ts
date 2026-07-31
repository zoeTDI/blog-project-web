import type { ComponentSize } from '#/component.ts';

export type CascaderValue = string | number;

export interface CascadeFieldName {
  label: string;
  value: string;
  children: string;
  disabled: string;
}

export type CascaderOption = Record<string, any>;

export interface CascaderProps {/** 尺寸 */
  size?: ComponentSize;
  /** 可选项数据 */
  options?: CascaderOption[];
  /** 占位文本 */
  placeholder?: string;
  /** 自定义字段映射 */
  fieldNames?: Partial<CascadeFieldName>;
  /** 路径分隔符 */
  splitChar?: string;
  /** 每列面板宽度 */
  optionWidth?: number | string;
  /** 是否允许选择任意一级 */
  changeOnSelect?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否允许一键清空 */
  clearable?: boolean;
}

export interface CascaderEmits {
  (e: 'change', value: CascaderValue[], selectedOptions: CascaderOption[]): void;
  (e: 'clear'): void;
}