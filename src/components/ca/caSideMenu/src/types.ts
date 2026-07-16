import type { Component } from 'vue';

export interface CaSideMenuProps {
  width?: number;
  optionHeight?: number;
}

interface MenuItem {
  no?: number;
  title: string;
  name: string;
  path: string;
  prefixIcon?: Component;
  suffixIcon?: Component;
  hidden?: boolean;
  children?: MenuItem[];
}

export type { MenuItem };
