import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupStore } from './plugins/pinia.ts';
import { setupRouter } from './plugins/vueRouter.ts';
import { setupI18n } from '@/plugins/i18n.ts';
import { disableDefaultConfig } from '@/config/app/disableKeys.ts';
import { initDebuggerBomb } from '@/config/app/debuggerBomb.ts';

const app = createApp(App);

/**
 * 是否为开发环境
 */
const isDev = (): boolean => import.meta.env.DEV;
/**
 * 是否为生产环境
 */
const isProd = (): boolean => import.meta.env.PROD;

if (isProd()) {
  disableDefaultConfig();
  initDebuggerBomb();
}
setupStore(app);
setupRouter(app);
setupI18n(app);
app.mount('#app');
