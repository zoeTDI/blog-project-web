import type { ComputedRef, InjectionKey, Ref } from 'vue';

interface CaSelect {
  inputWidth: ComputedRef<number>;
  selectedValue: Ref<any>;
  selectOption: (value: any, label: string) => void;
}

export const caSelectKey: InjectionKey<CaSelect> = Symbol('caSelectKey');
