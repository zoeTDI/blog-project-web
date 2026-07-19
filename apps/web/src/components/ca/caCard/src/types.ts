import type { CaButtonType } from '@/components/ca/caButton';

interface CaCardFooterAction {
  key: string;
  label: string;
  onClick?: (...args: any[]) => void;
  timeout?: number;
  type?: CaButtonType;
  run?: () => void;
}

export type { CaCardFooterAction };
