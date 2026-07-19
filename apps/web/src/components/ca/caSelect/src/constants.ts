import type { ComputedRef, InjectionKey, Ref } from 'vue';

interface CaSelect {
  selectedValue: Ref<any>;
  selectOption: (value: any, label: string) => void;
}

interface CaSelectStyle {
  selectWidth: ComputedRef<number>;
}

export const caSelectKey: InjectionKey<CaSelect> = Symbol('caSelectKey');
export const caSelectStyleKey: InjectionKey<CaSelectStyle> = Symbol('caSelectStyleKey');