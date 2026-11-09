import { ROUTER_PREFIX } from "@/plugins/i18n";
import { UserGroupIcon, UserPlusIcon, UsersIcon } from "@heroicons/vue/24/outline";
import type { RouteRecordRaw } from "vue-router";

export const USER_MANAGE: Record<string, string> = {
  USER_LIST: 'UserList',
  CREATE_USER: "newUser"
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
      },
      {
        path: "/userManage/create",
        name: USER_MANAGE.CREATE_USER,
        component: () => import("@/views/userManage/newUser/NewUser.vue"),
        meta: {
          title: `${ROUTER_PREFIX}newUser`,
          requireLogin: true,
          prefixIcon: UserPlusIcon
        }
      }
    ]
  }
]

export default userManageRouter;
