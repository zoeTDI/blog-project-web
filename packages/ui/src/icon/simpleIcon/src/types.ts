import type { SimpleIcon } from 'simple-icons';

interface SimpleIconProps {
  icon: SimpleIcon;
  size?: number | string;
  color?: string;
  colored?: boolean; // 是否使用图标原本的彩色
}

export type { SimpleIconProps };
