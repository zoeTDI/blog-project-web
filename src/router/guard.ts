import type { Router } from 'vue-router';

/**
 * 路由守卫函数
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
    // 前置守卫
    router.beforeEach(async (to, from, next) => {
        // 暂不处理逻辑
        next();
    });

    // 后置守卫
    router.afterEach((to) => {
        // 暂不处理逻辑
    });
}