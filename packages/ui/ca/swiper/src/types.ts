import type { ValueOf } from '@caldm/utils';
import { caSwiperImageFitMode, type caSwiperMode } from './constants.ts';

export type CaSwiperMode = ValueOf<typeof caSwiperMode>;
export type CaSwiperImageFitMode = ValueOf<typeof caSwiperImageFitMode>

export interface CaSwiperOption {
  /* 唯一标识 */
  id: number;
  /* 图片地址（必填） */
  url: string;
  /* 图片替代文本（可选） */
  alt?: string;
  /* 自定义携带数据 */
  data?: any;
}

export interface CaSwiperProps {
  /* 轮播图数据列表（可选） */
  options?: CaSwiperOption[] | string[];
  /* 轮播模式（可选，取值来自 caSwiperMode） */
  mode?: CaSwiperMode;
  /* 是否禁用轮播交互（可选） */
  disabled?: boolean;
  /* 自动轮播的延迟时间，若小于等于0则禁用自动轮播（单位：毫秒） */
  delay?: number;
  /* 是否显示控件手动切换轮播，若delay小于等于0则强制启用 */
  changeable?: boolean;
  /* 控件按钮大小 */
  btnSize?: number;
  /* 轮播图图片object-fit模式 */
  imageFitMode?: CaSwiperImageFitMode;
  /* 轮播图固定高度（例如: '300px', 300） */
  height?: string | number;
  /* 轮播图宽高比（例如: '16/9', 2, 1.5），推荐使用此项以支持响应式 */
  aspectRatio?: string | number;
}


export interface CaSwiperEmits {
  /**
   * 当轮播图图片切换时触发该事件
   * @param e
   * @param index 新的图片在数组中的索引位置
   * @param option 新的图片的CaSwiperOption
   */
  (e: 'change', index: number, option: CaSwiperOption | string): void;
  /**
   * 当轮播图图片被点击时触发该事件
   * @param e
   * @param index 被点击图片在数组中的索引位置
   * @param option 被点击图片的CaSwiperOption
   */
  (e: 'click', index: number, option: CaSwiperOption | string): void;
}

export interface CaSwiperExpose {
  /* 切换下一页 */
  next: () => void;
  /* 切换上一页 */
  prev: () => void;
}