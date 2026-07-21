import type { SimpleIcon } from 'simple-icons';
import type { Component } from 'vue';

export interface HeroIconProps {
  icon: Component;
  size?: number;
  color?: string;
}

export interface SimpleIconProps {
  icon: SimpleIcon;
  size?: number | string;
  color?: string;
  colored?: boolean; // 是否使用图标原本的彩色
}

export type IconType = 'hero' | 'simple';

export interface HeroIconDispatcherProps extends HeroIconProps {
  type?: 'hero';
}

export interface SimpleIconDispatcherProps extends SimpleIconProps {
  type?: 'simple';
}

export type CaIconProps = HeroIconDispatcherProps | SimpleIconDispatcherProps;