import type { HeroIconProps } from '@/icon/heroIcon/src/types.ts';
import type { SimpleIconProps } from '@/icon/simpleIcon/src/types.ts';

export type IconType = 'hero' | 'simple';

export interface HeroIconDispatcherProps extends HeroIconProps {
  type: 'hero';
}

export interface SimpleIconDispatcherProps extends SimpleIconProps {
  type: 'simple';
}

export type CaIconProps = HeroIconDispatcherProps | SimpleIconDispatcherProps;