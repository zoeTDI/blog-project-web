import type {Component} from "vue";

interface MenuItem {
  title: string;
  fullPath: string;
  path: string;
  icon?: Component;
  hidden?: boolean;
  children?: MenuItem[];
}

export {MenuItem}