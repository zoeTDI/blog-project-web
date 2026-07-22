export type CaListMode = 'ordered' | 'bullet' | 'plain';

export interface CaListProps {
  mode?: CaListMode;
  title?: string;
}

export type CursorType = 'pointer' | 'default' | 'text' | 'not-allowed' | '';