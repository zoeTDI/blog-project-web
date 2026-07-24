import type { CaButtonType } from '../../button';
import type { ComponentSize } from '#/component.ts';

export interface CaCardFooterAction {
  key: string;
  label: string;
  onClick?: (...args: any[]) => void;
  timeout?: number;
  type?: CaButtonType;
  run?: () => void;
}

export interface CaCardProps {
  headerMaxHeight?: ComponentSize | number;
  footerMaxHeight?: ComponentSize | number;
  footerActions?: CaCardFooterAction[];
}