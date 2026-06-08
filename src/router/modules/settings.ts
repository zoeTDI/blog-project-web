import type { RouteRecordRaw } from "vue-router";

export const SYSTEM_ROUTER_NAME: Record<string, string> = {
  SYSTEM_SETTING: 'SystemSetting',
  PROFILE_SETTING: 'ProfileSetting',
}

const settingsRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: '系统配置'
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
        }
      },
      {
        path: '/settings/profile',
        name: SYSTEM_ROUTER_NAME.PROFILE_SETTING,
        component: () => import('@/views/profileSetting/ProfileSetting.vue'),
        meta: {
          title: '个人设置',
          requireLogin: true,
        }
      }
    ]
  }
]

export default settingsRouter