export interface CaPaginationProps {
  quick?: boolean;
  maxPage?: number;
  total?: number;
}

export interface CaPaginationEmits {
  (e: 'change', cur: number, total: number): void;
}
