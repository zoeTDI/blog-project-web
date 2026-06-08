import type {RouteRecordRaw} from "vue-router";


export const BACKEND_ROUTER_NAME = {
    DASHBOARD: 'Dashboard',
}

const analysisRouter: RouteRecordRaw = [
    {
        meta: {
            title: `分析`,
        },
        path: '/analysis',
        component: () => import('@/layouts/BackendLayout.vue'),
        redirect: '/analysis/dashboard',
        children: [
            {
                path: '/analysis/dashboard',
                name: BACKEND_ROUTER_NAME.DASHBOARD,
                component: () => import('@/views/analysis/dashboard/Dashboard.vue'),
                meta: {
                    title: '仪表盘',
                    requireLogin: true,
                }
            }
        ]
    }
    
]

export default analysisRouter