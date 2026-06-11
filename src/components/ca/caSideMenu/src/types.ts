import type { Component } from 'vue';

interface MenuItem {
  no?: number;
  title: string;
  name: string;
  path: string;
  icon?: Component;
  hidden?: boolean;
  children?: MenuItem[];
}

export type { MenuItem };
