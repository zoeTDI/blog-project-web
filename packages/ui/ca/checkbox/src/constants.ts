import type { ComputedRef, InjectionKey } from 'vue';
import type { ComponentSize } from '#/component.ts';
import type { CheckboxValueType } from './types.ts';

export interface CaCheckboxGroupContext {
  modelValue: ComputedRef<CheckboxValueType[]>;
  size: ComputedRef<ComponentSize>;
  disabled: ComputedRef<boolean>;
  min: ComputedRef<number | undefined>;
  max: ComputedRef<number | undefined>;
  changeSelect: (value: CheckboxValueType, checked: boolean) => void;
}

export const caCheckboxGroupKey: InjectionKey<CaCheckboxGroupContext> = Symbol('caCheckboxGroupKey');