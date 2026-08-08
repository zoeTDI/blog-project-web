import { type InjectionKey } from 'vue';
import type { CaTableContext } from './types.ts';

export const CaTableContextKey: InjectionKey<CaTableContext> = Symbol('caTableContextKey');