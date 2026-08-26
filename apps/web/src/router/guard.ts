import type { RouteLocationNormalized, Router } from 'vue-router';
import { useLoadingStore } from '@/store/useLoadingStore.ts';
import { ROUTER_NAMES } from '@/router/routerNames.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { preferences, defaultPreferences } from '@/core/preferences';
import { i18n, ROUTER_PREFIX } from '@/plugins/i18n.ts';
import { getDynamicText } from '@/utils/translate.ts';
import { isEmpty, isString } from '@caldm/utils';

const WHITE_LIST = Object.values(ROUTER_NAMES);

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

  router.beforeEach((to: RouteLocationNormalized) => {
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
  router.beforeEach((to: RouteLocationNormalized) => {
    const userStore = useUserStore();
    // 无需检查权限
    if (WHITE_LIST.includes(to.name as string)) {
      // 前往登录页
      if (to.name === ROUTER_NAMES.LOGIN) {
        // 已登录
        if (userStore.isLoggedIn()) {
          // 已登录用户不允许前往登录页，重定向到默认首页
          return {
            path:
              isString(preferences.app.defaultHomePath) &&
              !isEmpty(preferences.app.defaultHomePath)
                ? preferences.app.defaultHomePath
                : defaultPreferences.app.defaultHomePath,
          };
        } else {
          // 用户未登录，前往默认页
          return true;
        }
      } else {
        // 在白名单内，且去的不是登录页，放行
        return true;
      }
    }
    // 登录校验
    if (!userStore.isLoggedIn()) {
      // 访问权限检查
      // 明确忽略权限检查，直接放行
      if (to.meta?.ignoreAccess) {
        return true;
      }
      // 没有登录并且去往需要权限校验的页面，直接跳转到登录页，并添加重定向。
      return { name: ROUTER_NAMES.HOME, query: { to: to.path } };
    }
    // 可在此处进一步添加角色校验和权限校验
    return true;
  });
};

const createRouterGuard = (router: Router) => {
  setupCommonGuard(router);
  setupAccessGuard(router);
};

export { createRouterGuard };
