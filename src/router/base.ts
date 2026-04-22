import type {RouteRecordRaw} from "vue-router";

export const baseRouter: RouteRecordRaw[] = [
    {
        name: "Root",
        path: "/",
        redirect: "/home",
        component: () => import('@/App.vue'),
        children: [
            {
                name: 'Home',
                path: '/home',
                component: () => import('@/views/Views.vue'),
            }
        ]
    }
]