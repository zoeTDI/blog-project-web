import { buildProps } from '@caldm/utils';

export type CaColSizeObject = {
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
};

export type CaColSize = number | CaColSizeObject;

export interface CaColProps {
  tag?: string;
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
}

export const caColProps = buildProps({
  tag: {
    type: String,
    default: 'div',
  },
  span: {
    type: Number,
    default: 24,
  },
  offset: {
    type: Number,
    default: 0,
  },
  pull: {
    type: Number,
    default: 0,
  },
  push: {
    type: Number,
    default: 0,
  },
} as const);