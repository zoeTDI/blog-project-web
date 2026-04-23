import type { Router } from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore.ts";

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
        // 修改标题
        const {title} = to.meta;
        const siteName = "电子灭虫录";
        document.title = title ? `${title} - ${siteName}` : siteName;
        next();
    });

    // 后置守卫
    router.afterEach((to) => {
        // 暂不处理逻辑
    });
}