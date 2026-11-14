import type { CaButtonType } from '../../button';
import type { ComponentSize } from '#/component.ts';

/**
 * 弹窗尺寸
 */
export type DialogSize = ComponentSize;

/**
 * 弹窗底部操作按钮配置
 */
export interface CaDialogAction {
  /** 唯一标识 */
  key: string;
  /** 按钮文案 */
  label: string;
  /** 按钮类型，默认 primary */
  type?: CaButtonType;
  /** 点击后是否自动关闭弹窗，默认为 false */
  closeOnClick?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

/**
 * CaDialog 组件的 Props 定义
 */
export interface CaDialogProps {
  /** 是否显示弹窗 */
  visible?: boolean;
  /** 弹窗标题（也可通过 header 插槽自定义） */
  title?: string;
  /** 预设尺寸，默认 'M' */
  size?: DialogSize;
  /**
   * 自定义宽度：
   * 数字时单位为 px；字符串时原样使用（如 '40vw'、'600px'）。
   * 设置后优先级高于 size。
   */
  width?: number | string;
  /**
   * 挂载目标元素，接受 CSS 选择器或 HTMLElement。
   * 默认为 'body'（全局模式），若指定其他元素则切换为局部模式。
   */
  appendTo?: string | HTMLElement;
  /** 点击遮罩层是否允许关闭，默认为 true */
  closeOnClickOverlay?: boolean;
  /** 按下 Esc 是否允许关闭，默认为 true */
  closeOnPressEscape?: boolean;
  /** 是否显示右上角关闭按钮，默认为 true */
  showClose?: boolean;
  /** 打开时是否锁定页面滚动，默认为 true */
  lockScroll?: boolean;
  /** 底部操作按钮列表 */
  footerActions?: CaDialogAction[];
}

/**
 * CaDialog 组件暴露给外部的方法接口
 */
export interface CaDialogExpose {
  /** 打开弹窗 */
  open: () => void;
  /** 关闭弹窗 */
  close: () => void;
}

/**
 * 组件事件定义
 */
export interface CaDialogEmits {
  (e: 'update:visible', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'action', action: CaDialogAction): void;
}
