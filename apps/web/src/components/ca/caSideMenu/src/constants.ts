import type { ComputedRef, InjectionKey } from 'vue';

export interface CaSideMenuContent {
  optionHeight: ComputedRef<number>;
}

export const DefaultWidth = 240;
export const DefaultOptionHeight = 44;

export const caSideMenuKey: InjectionKey<CaSideMenuContent> = Symbol('caSideMenuKey');
