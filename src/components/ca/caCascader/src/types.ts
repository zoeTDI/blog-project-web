interface CascadeFieldName {
  label: string;
  value: string;
  children: string;
}

interface CascaderProps<T = any> {
  type?: 'city' | 'custom';
  options?: T[];
  placeholder?: string;
  optionWidth?: number;
  fieldNames?: Partial<CascadeFieldName>;
  splitChar?: string;
}

export type { CascadeFieldName, CascaderProps };
