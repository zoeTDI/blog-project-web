import type { Component } from 'vue';

interface HomeTabParam {
  path: string;
  title: string;
  icon?: any;
}

interface TabItem {
  title: string;
  path: string;
  pinned: boolean;
  prefixIcon?: Component;
  suffixIcon?: Component;
}

interface ContextMenuItem {
  key: string;
  label: string;
  disabled: boolean;
  action: () => void;
  divider?: boolean;
  icon?: Component;
}

export type { HomeTabParam, TabItem, ContextMenuItem };
