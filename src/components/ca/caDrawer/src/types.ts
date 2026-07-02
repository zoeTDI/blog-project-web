/**
 * 抽屉展开方向
 */
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * 抽屉大小模式
 */
type DrawerSize = 'auto' | 'full';

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

export type { DrawerPlacement, DrawerSize, CaDrawerExpose, CaDrawerEmits };
