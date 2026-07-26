import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { ComponentSize } from '#/component.ts';

export type CaRadioLayout = 'list' | 'flow';

export interface CaRadioGroupContext {
  modelValue: ComputedRef<Ref>;
  size: ComputedRef<ComponentSize>;
  layout: ComputedRef<CaRadioLayout>;
  disabled: ComputedRef<boolean>;
  changeEvent: (val: any) => void;
}

export const caRadioGroupKey: InjectionKey<CaRadioGroupContext> = Symbol('caRadioGroupKey');