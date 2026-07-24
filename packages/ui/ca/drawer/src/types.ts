/**
 * 抽屉展开方向
 */
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * 抽屉大小模式
 */
type DrawerSize = 'auto' | 'full';

/**
 * CaDrawer 组件的 Props 定义
 */
interface CaDrawerProps {
  /** 抽屉展开方向，默认为 'right' */
  placement?: DrawerPlacement;
  /** 展开大小：内容大小 (auto) 或 全屏 (full)，默认为 'auto' */
  size?: DrawerSize;
  /** 点击遮罩层是否允许关闭，默认为 true */
  closeOnClickOverlay?: boolean;
  /**
   * 自定义抽屉大小：
   * > 1 时单位为 px；
   * 0 < customSize <= 1 时为视口尺寸的比例（百分比）；
   * <= 0 时忽略该字段。
   */
  customSize?: number;
}

/**
 * CaDrawer 组件暴露给外部的方法接口
 */
interface CaDrawerExpose {
  /** 打开抽屉 */
  open: () => void;
  /** 关闭抽屉 */
  close: () => void;
}

/**
 * 组件事件定义
 */
interface CaDrawerEmits {
  (e: 'update:visible', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
}

export type {
  DrawerPlacement,
  DrawerSize,
  CaDrawerProps,
  CaDrawerExpose,
  CaDrawerEmits,
};