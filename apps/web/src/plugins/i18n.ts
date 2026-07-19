import { createI18n } from 'vue-i18n';
import { messages } from '@/locales';
import type { App } from 'vue';
import {
  preferences,
  SUPPORT_LANGUAGE_OPTIONS,
  type SupportLanguageOption,
} from '@/core/preferences';

const ROUTER_PREFIX = 'router.';
const DEFAULT_MESSAGE: SupportLanguageOption = 'zh-CN';

const getInitialLocale = () => {
  return preferences.app.locale || SUPPORT_LANGUAGE_OPTIONS.zh_CN;
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

export { setupI18n, i18n, $t, ROUTER_PREFIX, DEFAULT_MESSAGE };
