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