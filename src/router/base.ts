import type {RouteRecordRaw} from "vue-router";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

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
        component: () => import('@/layouts/DefaultLayout.vue'),
        redirect: '/home',
        children: [
            {
                path: '/home', // 默认访问 / 时显示 Dashboard
                name: ROUTER_NAMES.HOME,
                component: () => import('@/views/home/Home.vue'),
                meta: {
                    title: '首页'
                }
            }
        ]
    },
    // 文章页面
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '/notes',
                name: ROUTER_NAMES.NOTES,
                component: () => import('@/views/notes/Notes.vue'),
                meta: {
                    title: '博客文章'
                }
            },
            {
                path: '/postDetail/:id',
                name: ROUTER_NAMES.POST_DETAIL,
                component: () => import('@/views/postDetail/PostDetail.vue'),
            }
        ]
    },
    // 归档页面
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '/archives',
                name: ROUTER_NAMES.ARCHIVES,
                component: () => import('@/views/archive/Archive.vue'),
                meta: {
                    title: '归档'
                }
            },
            {
                path: '/tagDetail/:id',
                name: ROUTER_NAMES.TAG_DETAIL,
                component: () => import('@/views/tagDetail/TagDetail.vue')
            },
            {
                path: '/categoryDetail/:id',
                name: ROUTER_NAMES.CATEGORY_DETAIL,
                component: () => import('@/views/categoryDetail/CategoryDetail.vue'),
            },
            {
                path: '/searchDetail',
                name: ROUTER_NAMES.SEARCH_DETAIL,
                component: () => import('@/views/searchDetail/SearchDetail.vue'),
            }
        ]
    },
    // 游戏&动漫&兴趣页面
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'), // 父组件是布局
        children: [
            {
                path: '/games', // 默认访问 / 时显示 Dashboard
                name: ROUTER_NAMES.GAMES,
                component: () => import('@/views/games/Games.vue'),
                meta: {
                    title: '游戏'
                }
            },
            {
                path: '/games/:id',
                name: ROUTER_NAMES.GAME_DETAIL,
                component: () => import('@/views/gameDetail/GameDetail.vue')
            },
            {
                path: '/movies',
                name: ROUTER_NAMES.MOVIES,
                component: () => import('@/views/movies/Movies.vue'),
                meta: {
                    title: '影视'
                }
            },
            {
                path: '/movies/:id',
                name: ROUTER_NAMES.MOVIE_DETAIL,
                component: () => import('@/views/movieDetail/MovieDetail.vue')
            },
            {
                path: '/books',
                name: ROUTER_NAMES.BOOKS,
                component: () => import('@/views/books/Books.vue'),
                meta: {
                    title: '书架'
                }
            },
            {
                path: '/books/:id',
                name: ROUTER_NAMES.BOOKS_DETAIL,
                component: () => import('@/views/bookDetail/BookDetail.vue')
            },
            {
                path: '/travel',
                name: ROUTER_NAMES.TRAVEL,
                component: () => import('@/views/travel/Travel.vue'),
                meta: {
                    title: '旅行'
                }
            }
        ]
    },
    // 登录页面
    {
        path: '/',
        component: () => import('@/layouts/FullLayout.vue'),
        children: [
            {
                path: '/login',
                name: ROUTER_NAMES.LOGIN,
                component: () => import("@/views/login/Login.vue"),
                meta: {
                    title: '登录'
                }
            }
        ]
    },
    // 特殊页面
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '/404',
                name: 'NotFound',
                component: () => import('@/views/error/NotFound.vue'),
                meta: {
                    title: '404 Not Found',
                }
            }
        ]
    },
]