import type { RouteRecordRaw } from "vue-router";

export const CATEGORY_ROUTER_NAME: Record<string, string> = {
  CATEGORY_MANAGE: 'CategoryManage',
  TAG_MANAGE: 'TagManage',
}

const categoriesRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: '分类与标签',
    },
    path: '/categories', // 独立的前缀路径
    component: () => import('@/layouts/BackendLayout.vue'),
    redirect: '/categories/manage',
    children: [
      {
        path: '/categories/manage',
        name: CATEGORY_ROUTER_NAME.CATEGORY_MANAGE,
        component: () => import('@/views/categoryManage/CategoryManage.vue'),
        meta: {
          title: '分类管理',
          requireLogin: true,
        }
      },
      {
        path: '/categories/tags',
        name: CATEGORY_ROUTER_NAME.TAG_MANAGE,
        component: () => import('@/views/tagManage/TagManage.vue'),
        meta: {
          title: '标签管理',
          requireLogin: true,
        }
      }
    ]
  }
]

export default categoriesRouter