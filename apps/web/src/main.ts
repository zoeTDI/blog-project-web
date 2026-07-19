import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupStore } from './plugins/pinia.ts';
import { setupRouter } from './plugins/vueRouter.ts';
import { setupI18n } from '@/plugins/i18n.ts';
import { disableDefaultConfig } from '@/config/app/disableKeys.ts';
import { isProd } from '@/utils/isFu.ts';
import { initDebuggerBomb } from '@/config/app/debuggerBomb.ts';

const app = createApp(App);

if (isProd()) {
  disableDefaultConfig();
  initDebuggerBomb();
}
setupStore(app);
setupRouter(app);
setupI18n(app);
app.mount('#app');
