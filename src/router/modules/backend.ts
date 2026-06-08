import type {RouteRecordRaw} from "vue-router";


export const BACKEND_ROUTER_NAME = {
    DASHBOARD: 'Dashboard',
    POST_MANAGE: 'PostManage',
    CATEGORY_MANAGE: 'CategoryManage',
    SYSTEM_SETTING: 'SystemSetting'
}

const backendRouter: RouteRecordRaw = [
    {
        meta: {
            title: `分析`,
        },
        path: '/',
        component: () => import('@/layouts/BackendLayout.vue'),
        children: [
            {
                path: '/dashboard',
                name: BACKEND_ROUTER_NAME.DASHBOARD,
                component: () => import('@/views/analysis/dashboard/Dashboard.vue'),
                meta: {
                    title: '管理页面',
                    requireLogin: true,
                }
            },
            {
                path: '/posts',
                name: BACKEND_ROUTER_NAME.POST_MANAGE,
                component: () => import('@/views/post/postManage/PostManage.vue'),
                meta: {
                    title: '文章管理',
                    requireLogin: true,
                }
            },
            {
                path: '/categories',
                name: BACKEND_ROUTER_NAME.CATEGORY_MANAGE,
                component: () => import('@/views/categoryManage/CategoryManage.vue'),
                meta: {
                    title: '分类管理',
                    requireLogin: true,
                }
            },
            {
                path: '/setting',
                name: BACKEND_ROUTER_NAME.SYSTEM_SETTING,
                component: () => import('@/views/systemSetting/SystemSetting.vue'),
                meta: {
                    title: '系统设置',
                    requireLogin: true,
                }
            }
        ]
    }
    
]

export default backendRouter