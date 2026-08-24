import type { RouteRecordRaw } from 'vue-router';
import { DocumentIcon, DocumentDuplicateIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import { ROUTER_PREFIX } from '@/plugins/i18n.ts';

export const POST_ROUTER_NAME: Record<string, string> = {
  POST_MANAGE: 'PostManage',
  POST_EDIT: 'PostEdit',
  POST_NEW: 'PostNew',
  TRAVEL_POST_EDIT: 'TravelPostEdit',
};

const postRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `${ROUTER_PREFIX}posts`,
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
          title: `${ROUTER_PREFIX}postManage`,
          requireLogin: true,
          prefixIcon: DocumentIcon,
        },
      },
      {
        path: "/posts/new",
        name: POST_ROUTER_NAME.POST_NEW,
        component: () => import('@/views/post/postEdit/PostEdit.vue'),
        meta: {
          title: `${ROUTER_PREFIX}postNew`,
          requrieLogin: true,
          prefixIcon: PencilSquareIcon,
        }
      },
      {
        path: '/posts/edit/:id?',
        name: POST_ROUTER_NAME.POST_EDIT,
        component: () => import('@/views/post/postEdit/PostEdit.vue'),
        meta: {
          title: `${ROUTER_PREFIX}postEdit`,
          requireLogin: true,
          prefixIcon: DocumentDuplicateIcon,
        },
      },
      {
        path: '/posts/travelEdit',
        name: POST_ROUTER_NAME.TRAVEL_POST_EDIT,
        component: () =>
          import('@/views/post/travelPostEdit/TravelPostEdit.vue'),
        meta: {
          title: `${ROUTER_PREFIX}travelPostEdit`,
          requireLogin: true,
          prefixIcon: DocumentDuplicateIcon,
        },
      },
    ],
  },
];

export default postRouter;
