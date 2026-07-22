import type { ComputedRef, InjectionKey } from 'vue';
import type { CaListMode } from './types.ts';

interface CaList {
  mode: ComputedRef<CaListMode>;
}

export const caListKey: InjectionKey<CaList> = Symbol('caListKey');
