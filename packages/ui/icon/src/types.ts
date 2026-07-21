import type { Component } from 'vue';

export interface CaIconProps {
  /**
   * 支持传入任意标准 Vue 图标组件（如 HeroIcons 或 createSimpleIcon 包装后的组件）
   */
  icon?: Component;
  /** 图标尺寸（数字表示 px，或带单位的字符串） */
  size?: number | string;
  /** 图标颜色 */
  color?: string;
}