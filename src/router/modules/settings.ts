import type {RouteRecordRaw} from "vue-router";
import {AdjustmentsHorizontalIcon, Cog6ToothIcon, WrenchIcon} from '@heroicons/vue/24/outline'

export const SYSTEM_ROUTER_NAME: Record<string, string> = {
  SYSTEM_SETTING: 'SystemSetting',
  PROFILE_SETTING: 'ProfileSetting',
}

const settingsRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: '系统配置',
      icon: AdjustmentsHorizontalIcon,
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
          title: '系统设置',
          requireLogin: true,
          icon: Cog6ToothIcon,
        }
      },
      {
        path: '/settings/profile',
        name: SYSTEM_ROUTER_NAME.PROFILE_SETTING,
        component: () => import('@/views/profileSetting/ProfileSetting.vue'),
        meta: {
          title: '个人设置',
          requireLogin: true,
          icon: WrenchIcon,
        }
      }
    ]
  }
]

export default settingsRouter