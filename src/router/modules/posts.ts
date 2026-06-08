import type { RouteRecordRaw } from "vue-router";

export const POST_ROUTER_NAME: Record<string, string> = {
  POST_MANAGE: 'PostManage',
  POST_EDIT: 'PostEdit',
}

const postRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: '文章管理'
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
        }
      },
      {
        path: '/posts/edit/:id?',
        name: POST_ROUTER_NAME.POST_EDIT,
        component: () => import('@/views/post/postEdit/PostEdit.vue'),
        meta: {
          title: '编辑文章',
          requireLogin: true,
        }
      }
    ]
  }
]

export default postRouter