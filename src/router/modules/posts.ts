import type { RouteRecordRaw } from 'vue-router';
import { DocumentIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/outline';

export const POST_ROUTER_NAME: Record<string, string> = {
  POST_MANAGE: 'PostManage',
  POST_EDIT: 'PostEdit',
  TRAVEL_POST_EDIT: 'TravelPostEdit',
};

const postRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: '文章管理',
    },
    path: '/posts', // 独立的前缀路径
    component: () => import('@/layouts/BackendLayout.vue'),
    redirect: '/posts/list',
    children: [
      {
        path: '/posts/list',
        name: POST_ROUTER_NAME.POST_MANAGE,
        component: () => import('@/views/post/postManage/PostManage.vue'),
        meta: {
          title: '文章管理',
          requireLogin: true,
          icon: DocumentIcon,
        },
      },
      {
        path: '/posts/edit/:id?',
        name: POST_ROUTER_NAME.POST_EDIT,
        component: () => import('@/views/post/postEdit/PostEdit.vue'),
        meta: {
          title: '编辑文章',
          requireLogin: true,
          icon: DocumentDuplicateIcon,
        },
      },
      {
        path: '/posts/travelEdit',
        name: POST_ROUTER_NAME.TRAVEL_POST_EDIT,
        component: () =>
          import('@/views/post/travelPostEdit/TravelPostEdit.vue'),
        meta: {
          title: '编辑旅行文章',
          requireLogin: true,
          icon: DocumentDuplicateIcon,
        },
      },
    ],
  },
];

export default postRouter;
