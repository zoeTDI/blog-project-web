import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TabItem } from '@/components/ca/caTabsBar';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { type RouteRecordNormalized, useRouter } from 'vue-router';
import { preferences } from '@/core/preferences';

export const useTabStore = defineStore(
  'tab',
  () => {
    const tabs = ref<TabItem[]>([]);
    const router = useRouter();
    const hasDefaultHome = ref<boolean>(false);

    const getDefaultHomeRoute = () => {
      const result = router
        .getRoutes()
        .filter((route) => route.path === preferences.app.defaultHomePath);
      if (result.length > 0) {
        hasDefaultHome.value = true;
        return result[0];
      } else {
        hasDefaultHome.value = false;
        return null;
      }
    };

    const defaultHomeRoute: RouteRecordNormalized | null =
      getDefaultHomeRoute();

    const routeToTabItem = (
      route: RouteRecordNormalized,
      overload: Partial<TabItem> = {} // 给 overload 一个默认值，防止空调用
    ): TabItem => {
      return {
        // 1. 设置默认值
        title: route.meta.title as string,
        path: route.path,
        prefixIcon: route.meta?.prefixIcon || HomeIcon,
        suffixIcon: route.meta?.suffixIcon || undefined,
        pinned: route.meta?.affixTab === true,

        // 2. 使用展开运算符覆盖默认值
        ...overload,
      };
    };

    /**
     * 初始化默认首页
     */
    const initAffixTab = () => {
      const routes = router.getRoutes();
      const unPinnedTabs = tabs.value.filter((tabItem) => !tabItem.pinned);
      const pinnedTabs: TabItem[] = routes
        .filter((route) => {
          if (hasDefaultHome.value) {
            return (
              route.meta?.affixTab === true &&
              route.path !== defaultHomeRoute!.path
            );
          } else {
            return route.meta?.affixTab === true;
          }
        })
        .map((route) => routeToTabItem(route));
      if (hasDefaultHome.value)
        pinnedTabs.unshift(routeToTabItem(defaultHomeRoute!, { pinned: true }));
      tabs.value = [...pinnedTabs, ...unPinnedTabs];
    };

    /**
     * 添加标签页
     */
    const addTab = (route: { path: string; meta: any }) => {
      if (route.meta?.hidden === true) return;

      // 确保首页始终存在
      initAffixTab();

      // 如果当前要添加的就是首页，直接返回（因为 initAffixTab 已经处理过了）
      if (hasDefaultHome.value && route.path === defaultHomeRoute!.path) return;

      // 添加其他普通标签页
      const isExist = tabs.value.some((tab) => tab.path === route.path);
      if (!isExist) {
        tabs.value.push({
          title: (route.meta?.title as string) || '未命名页面',
          path: route.path,
          pinned: false,
          prefixIcon: route.meta?.prefixIcon,
          suffixIcon: route.meta?.suffixIcon || undefined,
        });
      }
    };

    /**
     * 关闭标签页
     */
    const closeTab = (path: string, currentPath: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return;

      if (tabs.value[index].pinned) return currentPath;

      let nextActivePath = currentPath;
      if (path === currentPath) {
        const nextTab = tabs.value[index + 1] || tabs.value[index - 1];
        nextActivePath = nextTab ? nextTab.path : tabs.value[0]?.path || '/';
      }

      tabs.value.splice(index, 1);
      return nextActivePath;
    };

    /**
     * 功能：固定标签页
     * 逻辑：改变固定状态，并移动到列表左侧最后一个固定标签页的后方
     */
    const pinTab = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) return;

      const targetTab = tabs.value[index];
      targetTab.pinned = true;

      // 从原位置切出
      tabs.value.splice(index, 1);

      // 寻找左侧最后一个固定标签页的后方插入位置
      let lastPinnedIndex = 0;
      while (
        lastPinnedIndex < tabs.value.length &&
        tabs.value[lastPinnedIndex].pinned
      ) {
        lastPinnedIndex++;
      }

      // 紧随最后一个已固定标签后方插入
      tabs.value.splice(lastPinnedIndex, 0, targetTab);
    };

    /**
     * 新增功能：取消固定标签页
     * 逻辑：改变固定状态，并移动到所有剩余固定标签页的后方（即普通标签页的最前排）
     */
    const unpinTab = (path: string) => {
      const index = tabs.value.findIndex((tab) => tab.path === path);
      if (index === -1) {
        return;
      }
      const targetTab = tabs.value[index];
      targetTab.pinned = false;
      tabs.value.splice(index, 1);
      let lastPinnedIndex = 0;
      while (
        lastPinnedIndex < tabs.value.length &&
        tabs.value[lastPinnedIndex].pinned
      ) {
        lastPinnedIndex++;
      }
      tabs.value.splice(lastPinnedIndex, 0, targetTab);
    };

    /**
     * 功能：关闭左侧标签页
     * 逻辑：过滤掉当前标签左侧且未被固定的普通标签页
     */
    const closeLeftTabs = (path: string) => {
      const targetIndex = tabs.value.findIndex((tab) => tab.path === path);
      if (targetIndex === -1) return;

      tabs.value = tabs.value.filter((tab, index) => {
        if (index < targetIndex) {
          // 只有被固定或声明不可关闭的才能留下
          return tab.pinned;
        }
        return true;
      });
    };

    /**
     * 功能：关闭右侧标签页
     * 逻辑：过滤掉当前标签右侧且未被固定的普通标签页
     */
    const closeRightTabs = (path: string) => {
      const targetIndex = tabs.value.findIndex((tab) => tab.path === path);
      if (targetIndex === -1) return;

      tabs.value = tabs.value.filter((tab, index) => {
        if (index > targetIndex) {
          // 只有被固定或声明不可关闭的才能留下
          return tab.pinned;
        }
        return true;
      });
    };

    /**
     * 功能：关闭其他标签页
     * 逻辑：保留当前页、固定页以及不可关闭页，其余全部清空
     */
    const closeOtherTabs = (path: string) => {
      tabs.value = tabs.value.filter((tab) => tab.path === path || tab.pinned);
    };

    /**
     * 功能：关闭全部标签页
     * 逻辑：仅保留固定页以及不可关闭页
     */
    const closeAllTabs = () => {
      tabs.value = tabs.value.filter((tab) => tab.pinned);
    };

    return {
      tabs,
      addTab,
      closeTab,
      initAffixTab,
      pinTab,
      unpinTab,
      closeLeftTabs,
      closeRightTabs,
      closeOtherTabs,
      closeAllTabs,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['tabs'],
    },
  }
);
