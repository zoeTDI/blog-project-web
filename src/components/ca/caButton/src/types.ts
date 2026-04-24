import type { Component } from 'vue';
import type { ComponentSize } from '#/component.ts';

export type ButtonType = 'primary' | 'secondary' | 'text' | 'outline';

export interface ButtonProps {
    // 按钮风格类型
    type?: ButtonType;

    // 尺寸：S(小), M(中), L(大)
    size?: ComponentSize;

    // 是否处于加载状态
    loading?: boolean;

    // 是否禁用状态
    disabled?: boolean;

    // 按钮显示的图标（支持 HeroIcons 或其他组件）
    icon?: Component;

    // 图标位置
    iconPosition?: 'left' | 'right';

    // 特殊的 Hover 动效逻辑
    // 'none': 默认效果
    // 'expand': 宽度向两侧扩张（对应你 List.vue 的加载更多按钮）
    // 'glitch': 轻微的文字跳动效果（符合 Mono 风格）
    hoverEffect?: 'none' | 'expand' | 'glitch';

    // 是否为块级元素（占据 100% 宽度）
    block?: boolean;

    // 是否是圆角按钮（正圆形，通常用于仅图标按钮）
    round?: boolean;

    // 原生按钮类型
    nativeType?: 'button' | 'submit' | 'reset';
}
