import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {setupStore} from "./plugins/pinia.ts";
import {setupRouter} from "./plugins/vueRouter.ts";

const app = createApp(App);
setupStore(app);
setupRouter(app);
app.mount('#app');
