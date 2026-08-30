import { createHttp } from '@caldm/request';
import { useUserStore } from '@/store/useUserStore';
import { refreshToken } from '@/api';
import { CaMessage } from '@caldm/ui';
import router from '@/plugins/vueRouter'
import { ROUTER_NAMES } from '@/router/routerNames.ts';

const toLogin = async () => {
  const store = useUserStore();
  store.logout();
  await router.push({ name: ROUTER_NAMES.LOGIN });
};

/**
 * 处理身份验证失败
 */
const handleUnauthorized = async (): Promise<void> => {
  await refreshToken();
};

const handleErrorMessage = async (errMsg: string) => {
  CaMessage.error(errMsg);
  await toLogin();
};

const handleRefreshFailed = async () => {
  await toLogin();
  CaMessage.error('登录失效，请重新登录。');
};

export const defHttp = createHttp({
  baseURL: '/api',
  timeout: 10000,
  onUnauthorized: handleUnauthorized,
  onErrorMessage: handleErrorMessage,
  onRefreshFailed: handleRefreshFailed,
});
