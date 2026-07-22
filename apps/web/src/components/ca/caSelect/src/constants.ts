import type { InjectionKey, Ref } from 'vue';

interface CaSelect {
  selectedValue: Ref<string | number | boolean | undefined>;
  registerOption: (value: any, label: string) => void
  selectOption: (value: any, label: string) => void;
}

interface CaSelectStyle {
  selectWidth: Ref<number>;
  placement: Ref<'bottom' | 'top'>;
}

export const caSelectKey: InjectionKey<CaSelect> = Symbol('caSelectKey');
export const caSelectStyleKey: InjectionKey<CaSelectStyle> = Symbol('caSelectStyleKey');