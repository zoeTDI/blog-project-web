import type { ComponentSize } from '#/component.ts';

export interface CaTextareaProps {
  width?: number | string;
  height?: number | string;
  rows?: number;
  cols?: number;
  radius?: boolean | number;
  border?: boolean;
  size?: ComponentSize;
  resize?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minlength?: number;
  maxlength?: number;
  disabled?: boolean;
  readonly?: boolean;
}

export interface CaTextareaEmits {
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'change', value: string, event: Event): void;
  (e: 'input', value: string, event: Event): void;
}

export interface CaTextareaExpose {

}