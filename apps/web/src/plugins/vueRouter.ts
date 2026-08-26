import type {App} from "vue";
import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import routes from '../router/index.ts'
import {createRouterGuard} from "../router/guard.ts";

const router = createRouter({
    history:
        import.meta.env.VITE_ROUTER_HISTORY === 'hash'
            ? createWebHashHistory()
            : createWebHistory(),
    routes,
    scrollBehavior: (to, _form, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }
        return to.hash ? {behavior : 'smooth', el: to.hash} : {left: 0, right: 0}
    }
})

createRouterGuard(router)

export function setupRouter(app: App<Element>) {
    app.use(router);
}

export default router;