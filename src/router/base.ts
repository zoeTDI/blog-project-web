import type {RouteRecordRaw} from "vue-router";

/**
 * @description 路由配置说明
 * * 1. 结构嵌套 (children):
 * 依据【页面布局 (Layout)】进行嵌套。只要页面共用同一个 Header/Sider 壳子，
 * 就必须作为该 Layout 路由的 children，以确保切换时公共组件不重新渲染（保持状态）。
 * * 2. 路径嵌套 (path):
 * 依据【业务逻辑 (Logic)】进行嵌套。URL 路径应反映模块的层级关系，
 * 例如 /user/settings，即使它和 /dashboard 共用同一个 Layout。
 * * 3. 注意事项:
 * - 若逻辑上有嵌套但 UI 结构完全不同（如全屏页面），请将其定义为平级路由。
 * - 这种“结构与逻辑分离”的设计旨在平衡【组件复用性能】与【URL 语义化】。
 */
export const baseRouter: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'), // 父组件是布局
        children: [
            {
                path: '', // 默认访问 / 时显示 Dashboard
                name: 'Home',
                component: () => import('@/views/home/Home.vue'),
                meta: {
                    title: '首页'
                }
            }
        ]
    },
    {
        path: '/notes',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'NoteList',
                component: () => import('@/views/notes/List.vue'),
                meta: {
                    title: '博客文章'
                }
            }
        ]
    }
]