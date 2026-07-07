import type { ValueOf } from '#/utils';

export const DotPositionOption = {
  topRight: 'top-right',
  bottomRight: 'bottom-right',
} as const;

export type DotPosition = ValueOf<typeof DotPositionOption>;

export const DotColorMap = {
  green: '#34d399',
  red: '#f87171',
  yellow: '#fbbf24',
  gray: '#9ca3af',
} as const;

export type DotColor = keyof typeof DotColorMap;

export interface DotConfig {
  position?: DotPosition;
  color?: DotColor | string;
  content?: string | number;
}

export interface CaAvatarProps {
  radius?: number;
  alt?: string;
  url: string;
  errorUrl?: string;
  size?: number;
  showDot?: boolean;
  hideLargeNumber?: boolean;
  dots?: DotConfig | DotConfig[];
}
