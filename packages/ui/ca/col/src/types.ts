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