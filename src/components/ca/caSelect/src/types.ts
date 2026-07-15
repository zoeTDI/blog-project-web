export type CaSelectOption = {
  label: string;
  value: any;
};

export type CaSelectGroup = {
  label: string;
  options: CaSelectOption[];
};

export interface CaSelectProps {
  placeholder?: string;
  size?: 'S' | 'M' | 'L';
}

export interface CaSelectGroupProps {
  label?: string;
}

export type CaSelectOptionProps = CaSelectOption;

export interface CaSelectEmits {}

export interface CaSelectExpose {}
