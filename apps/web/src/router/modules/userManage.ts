import { ROUTER_PREFIX } from "@/plugins/i18n";
import { UserGroupIcon, UsersIcon } from "@heroicons/vue/24/outline";
import type { RouteRecordRaw } from "vue-router";

export const USER_MANAGE: Record<string, string> = {
  USER_LIST: 'UserList',
};

const userManageRouter: RouteRecordRaw[] = [
  {
    meta: {
      title: `${ROUTER_PREFIX}userManage`,
      prefixIcon: UserGroupIcon,
    },
    path: "/userManage",
    component: () => import('@/layouts/BackendLayout.vue'),
    redirect: '/userManage/list',
    children: [
      {
        path: '/userManage/list',
        name: USER_MANAGE.USER_LIST,
        component: () => import("@/views/userManage/userList/UserList.vue"),
        meta: {
          title: `${ROUTER_PREFIX}userList`,
          requireLogin: true,
          prefixIcon: UsersIcon
        }
      }
    ]
  }
]

export default userManageRouter;
