import type {RouteLocationNormalized, Router} from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {useUserStore} from "@/store/useUserStore.ts";
import {usePreferenceStore} from "@/store/usePreferenceStore.ts";

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

const handleLogin = (to: RouteLocationNormalized) => {
    const userStore = useUserStore()
    const authToken = userStore.getAuthToken()
    if (authToken && authToken !== '') {
        // 用户成功登录并且url中包含目的地址
        if (to.query?.to && to.query.to !== '') {
            return {path: to.query.to};
        }
        // 用户在已登录情况下手动访问登录页
        if (to.name == ROUTER_NAMES.LOGIN) {
            return {name: ROUTER_NAMES.NOT_FOUND};
        }
        // 放行
        return true;
    } else {
        // 没有token，跳转登录页
        return {
            name: ROUTER_NAMES.LOGIN,
            query: {
                to: to.path
            }
        }
    }
}

/**
 * 路由守卫函数
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
    // 前置守卫
    router.beforeEach(async (to, from) => {
        let toRouter = {name: ROUTER_NAMES.HOME};
        // 设置加载进度条
        const loadingStore = useLoadingStore();

        loadingStore.startLoading();

        if (to.meta?.requireLogin) {
            // 需要登录
            toRouter = handleLogin(to)
        } else {
            toRouter = true;
        }

        handleDocumentTitle(to);
        return toRouter;
    });

    // 后置守卫
    router.afterEach((to) => {
        // 暂不处理逻辑
    });
}

/**
 * 通用守卫配置
 * @param router
 */
const setupCommonGuard = (router: Router) => {
    const loadedPaths = new Set<string>()
    
    
    router.beforeEach((to) => {
        // 获取页面是否已经加载
        to.meta.loaded = loadedPaths.has(to.path);
        console.log("=>(guard.ts:88) to.meta.loaded", to.meta.loaded);
        
        const preferenceStore = usePreferenceStore()
        if (!to.meta.loaded && preferenceStore.getLoadingProgress()) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoading()
        }
        return true
    })
    router.afterEach(async (to) => {
        loadedPaths.add(to.path)

        const preferenceStore = usePreferenceStore()
        if(preferenceStore.getLoadingProgress()) {
            const loadingStore = useLoadingStore()
            await loadingStore.endLoading()
        }
    })
}

const setupAccessGuard = (router: Router) => {}

const createRouterGuard = (router: Router) => {
    setupCommonGuard(router)
    setupAccessGuard(router)
}

export {createRouterGuard};