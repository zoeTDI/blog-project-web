import type { ComponentSize } from '#/component.ts';

export type CascaderValue = string | number;

/** 单个选项的完整值路径 */
export type CascaderPath = CascaderValue[];

/** 多选模式下的值路径集合 */
export type CascaderMultipleValue = CascaderPath[];

/** Cascader 支持的双向绑定值 */
export type CascaderModelValue = CascaderPath | CascaderMultipleValue;

export interface CascadeFieldName {
  label: string;
  value: string;
  children: string;
  disabled: string;
}

export type CascaderOption = Record<string, any>;

/** change 事件返回的选项路径 */
export type CascaderSelectedOptions = CascaderOption[] | CascaderOption[][];

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
  /** 是否启用多选模式 */
  multiple?: boolean;
  /** 多选时父子节点是否相互独立 */
  checkStrictly?: boolean;
  /** 多选时是否折叠已选标签 */
  collapseTags?: boolean;
  /** 折叠前最多展示的标签数量 */
  maxCollapseTags?: number;
}

export interface CascaderEmits {
  (e: 'change', value: CascaderModelValue, selectedOptions: CascaderSelectedOptions): void;
  (e: 'clear'): void;
}
