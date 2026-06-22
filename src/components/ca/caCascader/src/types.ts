interface CascadeFieldName {
  label: string;
  value: string;
  children: string;
}

interface CascaderProps {
  type?: 'city' | 'custom';
  options?: any[];
  placeholder?: string;
  optionWidth?: number;
  fieldNames?: Partial<CascadeFieldName>;
  splitChar?: string;
}

export type { CascadeFieldName, CascaderProps };
