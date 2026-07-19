import type { RouteRecordRaw } from 'vue-router';
import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  WrenchIcon,
} from '@heroicons/vue/24/outline';
import { ROUTER_PREFIX } from '@/plugins/i18n.ts';

export const SYSTEM_ROUTER_NAME: Record<string, string> = {
  SYSTEM_SETTING: 'SystemSetting',
  PROFILE_SETTING: 'ProfileSetting',
};

const settingsRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `${ROUTER_PREFIX}settings`,
      prefixIcon: AdjustmentsHorizontalIcon,
    },
    path: '/settings', // 独立的前缀路径
    component: () => import('@/layouts/BackendLayout.vue'),
    redirect: '/settings/system',
    children: [
      {
        path: '/settings/system',
        name: SYSTEM_ROUTER_NAME.SYSTEM_SETTING,
        component: () => import('@/views/systemSetting/SystemSetting.vue'),
        meta: {
          title: `${ROUTER_PREFIX}systemSetting`,
          requireLogin: true,
          prefixIcon: Cog6ToothIcon,
        },
      },
      {
        path: '/settings/profile',
        name: SYSTEM_ROUTER_NAME.PROFILE_SETTING,
        component: () => import('@/views/profileSetting/ProfileSetting.vue'),
        meta: {
          title: `${ROUTER_PREFIX}profileSetting`,
          requireLogin: true,
          prefixIcon: WrenchIcon,
        },
      },
    ],
  },
];

export default settingsRouter;
