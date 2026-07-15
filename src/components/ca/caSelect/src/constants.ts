import type { ComputedRef, InjectionKey } from 'vue';

interface CaSelect {
  inputWidth: ComputedRef<number>
}

export const caSelectKey: InjectionKey<CaSelect> = Symbol('caSelectKey');