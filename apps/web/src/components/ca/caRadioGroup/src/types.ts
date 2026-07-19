import type {InjectionKey, Component, ComputedRef} from 'vue';
import type {ComponentSize} from "#/component.ts";

// 用于 provide/inject 的唯一标识
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('caRadioGroup');

export type RadioLayout = 'button-group' | 'list' | 'flow' | 'grid';

export interface RadioGroupContext {
    modelValue: ComputedRef<any>;
    size: ComputedRef<ComponentSize>;
    layout: ComputedRef<RadioLayout>;
    changeValue: (val: any) => void;
}

export interface RadioProps {
    value: any;
    label?: string;
    icon?: Component;
}