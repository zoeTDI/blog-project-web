import type { ComponentSize } from '#/component.ts';
import type { BaseData } from '#/data.ts';
import type { NonNullable } from '@caldm/utils';

export type CheckboxValueType = NonNullable<BaseData>;

export interface CaCheckboxGroupProps {
  disabled?: boolean;
  size?: ComponentSize;
  min?: number;
  max?: number;
}

export interface CaCheckboxGroupEmits {
  (e: 'change', value: CheckboxValueType[]): void;
  (e: 'change', checked: boolean, value: CheckboxValueType): void;
}

export interface CaCheckboxProps {
  label: string;
  value: CheckboxValueType;
  /**
   * 是否默认勾选（默认：false）
   */
  checked?: boolean;
  /**
   * 是否禁用（默认：false）
   */
  disabled?: boolean;
  /**
   * 组件尺寸（默认：M）
   */
  size?: ComponentSize;
}

export interface CaCheckboxEmits {
  (e: 'change', checked: boolean, value: CheckboxValueType): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}