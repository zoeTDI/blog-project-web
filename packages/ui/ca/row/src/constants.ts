import type { ComputedRef, InjectionKey } from 'vue';

interface CaRowContext {
  gap: ComputedRef<number>
}

export const caRowContextKey: InjectionKey<CaRowContext> = Symbol('caRowContextKey');