import type {Component} from "vue";

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
  TabItem,
  ContextMenuItem,
}