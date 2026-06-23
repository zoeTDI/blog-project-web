import type { RouteRecordRaw } from 'vue-router';
import { ChartBarSquareIcon, Squares2X2Icon } from '@heroicons/vue/24/outline';
import { ROUTER_PREFIX } from '@/plugins/i18n.ts';

export const BACKEND_ROUTER_NAME = {
  DASHBOARD: 'Dashboard',
};

const analysisRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `${ROUTER_PREFIX}analysis`,
      icon: Squares2X2Icon,
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
          title: `${ROUTER_PREFIX}dashboard`,
          requireLogin: true,
          icon: ChartBarSquareIcon,
          allowDefaultHome: true,
        },
      },
    ],
  },
];

export default analysisRouter;
