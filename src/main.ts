import { createApp } from 'vue';
import './style.css';
import '@/assets/markdown.css';
import App from './App.vue';
import { setupStore } from './plugins/pinia.ts';
import { setupRouter } from './plugins/vueRouter.ts';
import { setupI18n } from '@/plugins/i18n.ts';

const app = createApp(App);
setupStore(app);
setupRouter(app);
setupI18n(app);
app.mount('#app');
