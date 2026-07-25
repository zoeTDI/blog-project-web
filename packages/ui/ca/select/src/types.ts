export type CaSelectOption = {
  label: string;
  value: any;
};

export type CaSelectGroup = {
  label: string;
  options: CaSelectOption[];
};

export interface CaSelectProps {
  disabled?: boolean;
  placeholder?: string;
  size?: 'S' | 'M' | 'L';
}

export interface CaSelectDropdownProps {
  placement: 'top' | 'bottom';
  top: number;        // 视口坐标 Y
  left: number;       // 视口坐标 X
  minWidth: number;   // 输入框宽度，保证下拉与输入框同宽
  maxHeight: number;  // 下拉菜单最大高度
}

export interface CaSelectGroupProps {
  label?: string;
}

export type CaSelectOptionProps = CaSelectOption;