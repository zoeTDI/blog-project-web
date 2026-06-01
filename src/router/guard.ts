import type {RouteLocationNormalized, Router} from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {usePermissionStore} from "@/store/usePermissionStore.ts";
import {getUserMenu} from "@/api/user.ts";

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
    router.beforeEach(async (to, from) => {
        // 设置加载进度条
        const loadingStore = useLoadingStore();
        const authStore = useAuthStore();
        const permissionStore = usePermissionStore();

        loadingStore.startLoading();

        if (to.name === ROUTER_NAMES.TAG_DETAIL && !to.query?.id) {
            return {name: ROUTER_NAMES.NOT_FOUND};
        }

        const auth_token = authStore.get_auth_token();

        if (to.meta?.requireLogin) {
            if (!auth_token) {
                return {name: ROUTER_NAMES.LOGIN};
            }

            if (!permissionStore.getIsRoutesAdded()) {
                try {
                    const res = await getUserMenu();
                    await permissionStore.generateAndAddRoutes(res.data);
                    return {...to, replace: true};;
                } catch (error) {
                    console.error('加载动态路由失败: ', error);;
                    authStore.logout();
                    permissionStore.resetPermission();
                }
            }
        } else {
            // 用户登录后手动输入/login访问登录页时，直接跳转到首页
            if (to.name === ROUTER_NAMES.LOGIN && auth_token) {
                return { name: ROUTER_NAMES.HOME };
            }
            // 用户登录后访问前台页面时，也要准备后后台页面
            if (auth_token && !permissionStore.isRoutesAdded) {
                try {
                    const res = await getUserMenu();
                    await permissionStore.generateAndAddRoutes(res.data);
                    return {...to, replace: true};;;
                } catch (error) {
                    console.error('静默加载动态路由失败: ', error);
                }
            }
        }
        handleDocumentTitle(to);
        return true;
    });

    // 后置守卫
    router.afterEach((to) => {
        // 暂不处理逻辑
    });
}