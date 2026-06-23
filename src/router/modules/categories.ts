import type { RouteRecordRaw } from 'vue-router';
import { TagIcon, InboxStackIcon } from '@heroicons/vue/24/outline';
import { ROUTER_PREFIX } from '@/plugins/i18n.ts';

export const CATEGORY_ROUTER_NAME: Record<string, string> = {
  CATEGORY_MANAGE: 'CategoryManage',
  TAG_MANAGE: 'TagManage',
};

const categoriesRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `${ROUTER_PREFIX}categories`,
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
          title: `${ROUTER_PREFIX}categoryManage`,
          requireLogin: true,
          icon: InboxStackIcon,
        },
      },
      {
        path: '/categories/tags',
        name: CATEGORY_ROUTER_NAME.TAG_MANAGE,
        component: () => import('@/views/tagManage/TagManage.vue'),
        meta: {
          title: `${ROUTER_PREFIX}tagManage`,
          requireLogin: true,
          icon: TagIcon,
        },
      },
    ],
  },
];

export default categoriesRouter;
