import { buildProps } from '@/utils/runtime.ts';

export const CaRowJustify = [
  'start',
  'center',
  'end',
  'space-around',
  'space-between',
  'space-evenly',
] as const;

export const CaRowAlign = ['top', 'middle', 'bottom'] as const;

export interface CaRowProps {
  tag?: string;
  gap?: number;
  justify?: (typeof CaRowJustify)[number];
  align?: (typeof CaRowAlign)[number];
}

export const caRowProps = buildProps({
  tag: {
    type: String,
    default: 'div',
  },
  gutter: {
    type: Number,
    default: 0,
  },
  justify: {
    type: String,
    default: 'start',
    values: CaRowJustify,
  },
  align: {
    type: String,
    values: CaRowAlign,
  },
});