interface TabItem {
  title: string;
  path: string;
  pinned: boolean;
  icon?: Comment
}

interface ContextMenuItem {
  key: string;
  label: string;
  disabled: boolean;
  action: () => void;
  divider?: boolean;
}

export {
  TabItem,
  ContextMenuItem,
}