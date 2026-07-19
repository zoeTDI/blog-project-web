import { caMarqueeIconMap } from '@/components/ca/caMarquee';

export interface CaMarqueeProps {
  icon: keyof typeof caMarqueeIconMap;
  // 跑马灯内容
  content?: string;
  // 是否支持手动关闭，若不支持，则默认延时关闭
  closeable?: boolean;
  // 延时时间（单位ms）
  duration?: number;
  // 当内容过多时，是否开启文字循环滚动。默认开启
  scrollable?: boolean;
  // 滚动速度（单位px）。默认50
  speed?: number;
}

export interface CaMarqueeEmits {}

export interface CaMarqueeExpose {}
