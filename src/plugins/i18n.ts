import { createI18n } from 'vue-i18n';
import { messages } from '@/locales';
console.log('🚀 ~  ~ messages: ', messages);
import type { App } from 'vue';
import { SUPPORT_LANGUAGE_OPTIONS } from '@/core/preferences';

const i18n = createI18n({
  locale: SUPPORT_LANGUAGE_OPTIONS.zh_CN,
  fallbackLocale: SUPPORT_LANGUAGE_OPTIONS.en_US,
  messages,
});

const setupI18n = (app: App<Element>) => {
  app.use(i18n);
};

export { setupI18n, i18n };
