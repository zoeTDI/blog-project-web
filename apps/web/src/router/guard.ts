import type { RouteLocationNormalized, Router } from 'vue-router';
import { useLoadingStore } from '@/store/useLoadingStore.ts';
import { ROUTER_NAMES } from '@/router/routerNames.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { preferences, defaultPreferences } from '@/core/preferences';
import { i18n, ROUTER_PREFIX } from '@/plugins/i18n.ts';
import { getDynamicText } from '@/utils/translate.ts';

const getWebsiteName = () => {
  return getDynamicText({
    'zh-CN':
      preferences.app.websiteName_zh_CN ||
      defaultPreferences.app.websiteName_zh_CN,
    'en-US':
      preferences.app.websiteName_en_US ||
      defaultPreferences.app.websiteName_en_US,
  });
};

const processDocumentTitle = (pageName: string) => {
  let translation = pageName;
  if (translation.startsWith(ROUTER_PREFIX)) {
    translation = i18n.global.t(translation);
  }
  if (typeof translation === 'string' && translation !== '') {
    document.title = `${getWebsiteName()} - ${translation}`;
  } else {
    document.title = getWebsiteName();
  }
};

/**
 * 通用守卫配置
 * @param router
 */
const setupCommonGuard = (router: Router) => {
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    // 获取页面是否已经加载
    to.meta.loaded = loadedPaths.has(to.path);

    if (!to.meta.loaded && preferences.transition.progress) {
      const loadingStore = useLoadingStore();
      loadingStore.startLoading();
    }
    return true;
  });
  router.afterEach(async (to) => {
    loadedPaths.add(to.path);

    if (preferences.transition.progress) {
      const loadingStore = useLoadingStore();
      await loadingStore.endLoading();
    }

    processDocumentTitle(to.meta.title);
  });
};

const setupAccessGuard = (router: Router) => {
  const getPathString = (val: any): string =>
    Array.isArray(val) ? val[0] : (val as string);
  router.beforeEach((to: RouteLocationNormalized) => {
    const userStore = useUserStore();
    // 无需检查权限
    if (Object.values(ROUTER_NAMES).includes(to.name as string)) {
      // 前往登录页
      if (to.name === ROUTER_NAMES.LOGIN) {
        // 已登录
        if (userStore.isLoggedIn()) {
          // 存在重定向页面
          if (to.query?.to && to.query.to !== '') {
            // 前往重定向页面
            return { path: getPathString(to.query.to) };
          } else {
            // 如果直接放行，就前往登录页了，这是不行的。
            // 前往默认首页
            return {
              path:
                preferences.app.defaultHomePath &&
                preferences.app.defaultHomePath !== ''
                  ? preferences.app.defaultHomePath
                  : defaultPreferences.app.defaultHomePath,
            };
          }
        } else {
          // 去往登录页，且没有token，放行
          return true;
        }
      } else {
        // 在白名单内，且去的不是登录页，放行
        return true;
      }
    }

    if (!userStore.isLoggedIn()) {
      // 访问权限检查
      // 明确忽略权限检查，直接放行
      if (to.meta?.ignoreAccess) {
        return true;
      } else if (to.name !== ROUTER_NAMES.LOGIN) {
        // 没有访问权限，且去往的不是登录页
        // 返回登录页，添加重定向路径
        return {
          name: ROUTER_NAMES.LOGIN,
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { to: to.fullPath },
          replace: true,
        };
      }
      // 没有登录，不是去往登录页，阻止
      return { name: ROUTER_NAMES.HOME };
    }
    return true;
  });
};

const createRouterGuard = (router: Router) => {
  setupCommonGuard(router);
  setupAccessGuard(router);
};

export { createRouterGuard };
