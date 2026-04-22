import type {App} from "vue";
import {createRouter, createWebHashHistory} from "vue-router";
import routes from '../router/index.ts'
import {setupRouterGuard} from "../router/guard.ts";

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({left: 0, right: 0})
})

export function setupRouter(app: App<Element>) {
    app.use(router);
    setupRouterGuard(router);
}