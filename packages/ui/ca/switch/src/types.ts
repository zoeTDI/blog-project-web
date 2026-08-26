import type { Component } from 'vue';
import type { ComponentSize } from '#/component.ts';
import type { ValueOf } from '@caldm/utils';
import type { CaSwitchMode } from './constants.ts';

export interface CaSwitchOption<T = string> {
  value: T;
  label: string;
  icon?: Component;
}

export interface CaSwitchProps {
  options?: CaSwitchOption[];
  prefix?: string;
  mode?: ValueOf<typeof CaSwitchMode>;
  size?: ComponentSize;
}

