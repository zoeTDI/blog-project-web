interface City {
  value: number;
  label: string;
  level: 'province' | 'district';
  parentCode: number | null;
  children: City[];
}

interface Props {
  type?: 'city';
  placeholder?: string;
  optionWidth?: number;
}

export type { City, Props };
