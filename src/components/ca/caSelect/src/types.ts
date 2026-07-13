export type CaSelectOption = string[]
export type CaSelectGroup = {
  label: string,
  options: CaSelectOption[]
}

export interface CaSelectProps {
  placeholder?: string;
  size?: 'S'|'M'|'L'
}

export interface CaSelectEmits {}

export interface CaSelectExpose {}
