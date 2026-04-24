import type { InjectionKey, Component } from 'vue';

export interface RadioGroupContext {
    modelValue: any;
    changeValue: (val: any) => void;
}

// 用于 provide/inject 的唯一标识
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('caRadioGroup');

export interface RadioProps {
    value: any;
    label?: string;
    icon?: Component;
}