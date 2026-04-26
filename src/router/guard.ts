import type {RouteLocationNormalized, Router} from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore.ts";

const handleDocumentTitle = (to: RouteLocationNormalized) => {
    // 修改标题
    let title = '';
    switch (to.name) {
        case 'Tag':
            title = 'Tag';
            break;
        default:
            title = to.meta?.title;
            break;
    }
    const siteName = import.meta.env.VITE_SITE_TITLE || "电子灭虫录";
    document.title = title ? `${title} - ${siteName}` : siteName;
}

/**
 * 路由守卫函数
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
    // 前置守卫
    router.beforeEach(async (to, from, next) => {
        // 设置加载进度条
        const loadingStore = useLoadingStore();
        loadingStore.startLoading();
        handleDocumentTitle(to);
        next();
    });

    // 后置守卫
    router.afterEach((to) => {
        // 暂不处理逻辑
    });
}