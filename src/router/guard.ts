import type {RouteLocationNormalized, Router} from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {useUserStore} from "@/store/useUserStore.ts";
import {preferences} from "@/core/preferences";

/**
 * 通用守卫配置
 * @param router
 */
const setupCommonGuard = (router: Router) => {
  const loadedPaths = new Set<string>()
  
  router.beforeEach((to) => {
    // 获取页面是否已经加载
    to.meta.loaded = loadedPaths.has(to.path);
    
    if (!to.meta.loaded && preferences.transition.progress) {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading()
    }
    return true
  })
  router.afterEach(async (to) => {
    loadedPaths.add(to.path)
    
    if (preferences.transition.progress) {
      const loadingStore = useLoadingStore()
      await loadingStore.endLoading()
    }
    
    document.title = to.meta?.title || '';
  })
}

const setupAccessGuard = (router: Router) => {
  router.beforeEach((to: RouteLocationNormalized) => {
    const userStore = useUserStore()
    // 无需检查权限
    if (Object.values(ROUTER_NAMES).includes(to.name)) {
      // 用户已登录，手动输入url前往登录页面
      if (to.name === ROUTER_NAMES.LOGIN && userStore.getAuthToken()) {
        // 存在重定向页面
        if (to.query?.to && to.query.to !== '') {
          // 前往重定向页面
          return {path: to.path}
        } else {
          // 前往默认首页
          return {name: ROUTER_NAMES.HOME};
        }
      }
    }
    // 访问权限检查
    if (!userStore.getAuthToken()) {
      // 明确忽略权限检查，直接放行
      if (to.meta?.ignoreAccess) {
        return true;
      }
      // 没有访问权限，且去往的不是登录页
      if (to.name !== ROUTER_NAMES.LOGIN) {
        return {
          name: ROUTER_NAMES.LOGIN,
          query: to.fullPath === preferences.app.defaultHomePath ? {} : {to: to.fullPath},
          replace: true
        };
      }
      return true
    }
  })
}

const createRouterGuard = (router: Router) => {
  setupCommonGuard(router)
  setupAccessGuard(router)
}

export {createRouterGuard};