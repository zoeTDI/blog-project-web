import type { Component } from 'vue';

declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题
    title: string;
    // 页面图标，会在面包屑导航、侧边菜单、标签页等地方使用
    icon?: Component;
    // 值为true时在侧边菜单中隐藏
    hidden?: boolean;
    // 自定义在侧边菜单中的排序，1为第一位，2为第二位，-1为最后一位，-2为倒数第二位，以此类推，若不设置，则根据title排序
    // 若该页面是用户偏好设置的默认页，则值会被覆盖为1
    no?: number;
    // 是否忽略访问权限，设置为true则不进行访问校验
    ignoreAccess?: boolean;
    // 是否固定标签页
    affixTab?: boolean;
    // 能否被设置为默认首页
    allowDefaultHome?: boolean;
  }
}
