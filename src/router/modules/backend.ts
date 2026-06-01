export const BACKEND_ROUTER_NAME = {
    MANAGEMENT_PAGE: 'ManagementPage'
}

export const backendRouter = [
    {
        path: '/managementPage',
        name: BACKEND_ROUTER_NAME.MANAGEMENT_PAGE,
        component: () => import('@/views/managementPage/ManagementPage.vue'),
        meta: {
            title: '管理页面',
            requireLogin: true,
        }
    }
]