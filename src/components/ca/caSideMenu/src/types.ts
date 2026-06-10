import type { Component } from "vue";

interface MenuItem {
  title: string;
  name: string;
  path: string;
  icon?: Component;
  hidden?: boolean;
  children?: MenuItem[];
}

export type { MenuItem }