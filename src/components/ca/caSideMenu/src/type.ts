interface MenuItem {
  title: string;
  fullPath: string;
  path: string;
  icon?: string;
  hidden?: boolean;
  children?: MenuItem[];
}

export {MenuItem}