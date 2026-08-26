import type { ComponentSize } from '#/component.ts';
import type { Component } from 'vue';

export interface CaInputProps {
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  prefix?: string | Component;
  suffix?: string | Component;
  radius?: number;
  border?: boolean;
  type?: 'text' | 'number' | 'password';
  // todo 完成以下props
  /* 在type为text和password时有效 */
  length?: number;
  showCounter?: boolean;
  counterFormatter?: (current: number, max: number) => string;
  /* 在type为number时有效 */
  max?: number;
  min?: number;
}

export interface CaInputEmits {
  (e: 'change', value: string): void;
  (e: 'input', value: string): void;
  (e: 'focus', value: FocusEvent): void;
  (e: 'blur', value: FocusEvent): void;
  (e: 'clear'): void;
}

export interface InputExpose {

}