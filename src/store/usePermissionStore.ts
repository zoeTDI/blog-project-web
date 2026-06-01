import {defineStore} from "pinia";
import {ref} from "vue";
import type {MenuDataItem} from "#/router";
import router from "@/router";

const modules = import.meta.glob('@/views/**/*.vue')

export const usePermissionStore = defineStore(
    'permissionStore',
    () => {
        const isRoutesAdded = ref<boolean>(false);
        const dynamicMenus = ref<MenuDataItem[]>([]);

        const getIsRoutesAdded = () => {
            return isRoutesAdded.value;
        }
        const setIsRoutesAdded = (value: boolean) => {
            // 将其转换为布尔值
            isRoutesAdded.value = !!value;
        }
        const getDynamicMenus = () => {
            return dynamicMenus.value;
        }
        const setDynamicMenus = (value: MenuDataItem[]) => {
            dynamicMenus.value = value;
        }

        const generateAndAddRoutes = async (backendMenus: MenuDataItem[]) => {
            dynamicMenus.value = backendMenus;
            const formatRoutes = filterAsyncRoutes(backendMenus);
            formatRoutes.forEach(route => {
                router.addRoute(route);
            })
            router.addRoute({
                path: '/:pathMatch(.*)*',
                redirect: '/404'
            })
        }
        const filterAsyncRoutes = (routes: MenuDataItem[]) => {
            return routes.map((route: MenuDataItem) => {
                const tmp = {...route};
                if (tmp.component) {
                    tmp.component = modules[`/src/views/${tmp.component}.vue`]
                }
                if (tmp.children && tmp.children.length > 0) {
                    tmp.children = filterAsyncRoutes(tmp.children)
                }
                return tmp;
            })
        }
        const resetPermission = () => {
            setIsRoutesAdded(false);
            setDynamicMenus([]);
        }

        return {
            isRoutesAdded,
            dynamicMenus,
            getIsRoutesAdded,
            generateAndAddRoutes,
            filterAsyncRoutes,
            resetPermission
        }
    }
)