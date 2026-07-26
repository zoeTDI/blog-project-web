import type { Component } from 'vue';
import type { ComponentSize } from '#/component.ts';
import type { CaRadioLayout } from './constants.ts';

export interface CaRadioGroupProps {
  size?: ComponentSize;
  layout?: CaRadioLayout;
  disabled?: boolean;
}

export interface CaRadioProps {
  value: any;
  label?: string;
  icon?: Component;
  disabled?: boolean;
}
