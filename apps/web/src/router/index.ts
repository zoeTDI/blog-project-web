import { baseRouter } from './base.ts';
import type { RouteRecordRaw } from 'vue-router';
import { isArray } from '@caldm/utils';

const modules = import.meta.glob('./modules/*.ts', { eager: true });

const dynamicRoutes: RouteRecordRaw[] = [];
Object.keys(modules).forEach((key) => {
  const module = modules[key] as any;
  const routerModule = module.default;
  if (routerModule) {
    if (isArray(routerModule)) {
      dynamicRoutes.push(...routerModule);
    } else {
      dynamicRoutes.push(routerModule);
    }
  }
});

const routes = [...baseRouter, ...dynamicRoutes];

export default routes;
