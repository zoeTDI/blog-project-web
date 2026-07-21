import type { Component } from 'vue';
import { CaHeroIcon, CaSimpleIcon } from '../index.ts';
import type { IconType } from '../index.ts';

const iconRegistry = new Map<string, Component>();

iconRegistry.set('hero', CaHeroIcon);
iconRegistry.set('simple', CaSimpleIcon);

/**
 * 获取指定类型的图标组件
 * @param type 图标库类型
 */
export function getIconComponent(type: IconType | string): Component | undefined {
  return iconRegistry.get(type);
}

/**
 * 扩展/注册新的图标库组件（为未来第三方或自定义图标库留出的扩展接口）
 * @param type 图标库类型标识
 * @param component 图标库对应的封装组件
 */
export function registerIconLibrary(type: string, component: Component): void {
  if (iconRegistry.has(type)) {
    console.warn(`[CaIcon]: Icon type "${type}" is already registered and will be overwritten.`);
  }
  iconRegistry.set(type, component);
}