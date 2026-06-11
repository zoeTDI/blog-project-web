import type { RouteRecordRaw } from 'vue-router';
import { ChartBarSquareIcon, Squares2X2Icon } from '@heroicons/vue/24/outline';

export const BACKEND_ROUTER_NAME = {
  DASHBOARD: 'Dashboard',
};

const analysisRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `分析`,
      icon: Squares2X2Icon,
      allowDefaultHome: true,
    },
    path: '/analysis',
    component: () => import('@/layouts/BackendLayout.vue'),
    redirect: '/analysis/dashboard',
    children: [
      {
        path: '/analysis/dashboard',
        name: BACKEND_ROUTER_NAME.DASHBOARD,
        component: () => import('@/views/analysis/dashboard/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requireLogin: true,
          icon: ChartBarSquareIcon,
        },
      },
    ],
  },
];

export default analysisRouter;
