import type {Component} from "vue";

export interface SwitchOption {
    value: any;        // 实际绑定的逻辑值（现在默认是 true / false）
    label?: string;    // 显示在界面上的文字（如 'ON' / 'OFF'）
    icon: Component;   // 对应的图标组件
}