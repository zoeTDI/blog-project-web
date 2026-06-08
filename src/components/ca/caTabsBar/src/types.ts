import type {Component} from "vue";

interface HomeTabParam {
  path: string;
  title: string;
  icon?: any;
}

interface TabItem {
  title: string;
  path: string;
  pinned: boolean;
  icon?: Component
}

interface ContextMenuItem {
  key: string;
  label: string;
  disabled: boolean;
  action: () => void;
  divider?: boolean;
  icon?: Component;
}

export {
  HomeTabParam,
  TabItem,
  ContextMenuItem,
}