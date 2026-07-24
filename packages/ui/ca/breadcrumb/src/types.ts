import type { Component } from 'vue';

export interface CaBreadcrumbPreferences {
  enable?: boolean;
  showIcon?: boolean;
  styleType?: 'background' | 'normal';
}

export interface CaBreadcrumbItem {
  /** 显示的文本 */
  label: string;
  /** 点击跳转的目标路由路径或 Route 对象 (可选) */
  to?: any;
  /** 前缀图标 (可选) */
  prefixIcon?: Component;
  /** 后缀图标 (可选) */
  suffixIcon?: Component;
}

export interface CaBreadcrumbProps {
  /** 偏好设置配置，不传则使用默认配置 */
  preferences?: CaBreadcrumbPreferences;
  /** 面包屑数据项列表（支持响应式更新） */
  items?: CaBreadcrumbItem[];
}

export interface CaBreadcrumbEmits {
  (e: 'click', item: CaBreadcrumbItem, index: number): void;
}

export interface CaBreadcrumbExpose {

}