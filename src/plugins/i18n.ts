import { createI18n, useI18n } from 'vue-i18n';
import { messages } from '@/locales';
import type { App } from 'vue';
import { preferences, SUPPORT_LANGUAGE_OPTIONS } from '@/core/preferences';

const ROUTER_PREFIX = 'router.';

const getInitialLocale = () => {
  return preferences.app.locale || SUPPORT_LANGUAGE_OPTIONS.zh_CN;
};

/**
 * 获取翻译后的字符串，如果没有，则返回传入的字符串
 * @param str
 */
const translateString = (str: string): string => {
  let translation = str;
  if (translation.startsWith(ROUTER_PREFIX)) {
    translation = useI18n().t(translation);
  }
  return translation;
};

const i18n = createI18n({
  locale: getInitialLocale(),
  fallbackLocale: SUPPORT_LANGUAGE_OPTIONS.en_US,
  messages,
});

const setupI18n = (app: App<Element>) => {
  app.use(i18n);
};

const $t = i18n.global.t;

export { setupI18n, i18n, $t, ROUTER_PREFIX, translateString };
