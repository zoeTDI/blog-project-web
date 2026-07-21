import type { Component } from 'vue';
import type { ComponentSize } from '#/component.ts';


export type CaButtonType = 'primary' | 'text' | 'outline';

export interface CaButtonProps {
  type?: CaButtonType;
  size?: ComponentSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: Component;
  iconPosition?: 'left' | 'right';
  hoverEffect?: 'none' | 'expand';
  block?: boolean;
  round?: boolean;
}

export interface CaButtonEmits {
  (e: 'click', event: MouseEvent): void;
}