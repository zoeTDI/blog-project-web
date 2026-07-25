import type { caMarqueeIconMap } from './constants.ts';

export interface CaMarqueeProps {
  /** 图标类型 */
  icon?: keyof typeof caMarqueeIconMap;
  /** 跑马灯内容 */
  content?: string;
  /** 是否支持手动关闭，若不支持，则默认延时关闭 */
  closeable?: boolean;
  /** 延时时间（单位ms） */
  duration?: number;
  /** 当内容过多时，是否开启文字循环滚动。默认开启 */
  scrollable?: boolean;
  /** 滚动速度（单位px/s）。默认50 */
  speed?: number;
  /** 指定挂载的 HTML 节点，设置为 false 或 undefined 则不开启 Teleport */
  appendTo?: string | HTMLElement | false;
}

export type CaMarqueeEmits = {
  /** 点击关闭按钮或定时自动关闭时触发 */
  (e: 'close'): void;
};

export interface CaMarqueeExpose {
  /** 手动关闭组件的方法 */
  close: () => void;
}