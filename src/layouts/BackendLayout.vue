<script setup lang="ts">
  import { CaTabsBar, type HomeTabParam } from '@/components/ca/caTabsBar';
  import { CaSideMenu } from '@/components/ca/caSideMenu';
  import { computed, ref, watch, type VNodeRef } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useTabStore } from '@/store/useTabStore.ts';
  import { preferences } from '@/core/preferences';
  import { CaBreadcrumb } from '@/components/ca/caBreadcrumb';
  import { GlobalTools } from '@/components/globalTools';
  import { UserBox } from '@/components/userBox';
  import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
  } from '@heroicons/vue/24/outline';

  const route = useRoute();
  const router = useRouter();
  const tabStore = useTabStore();

  const defaultHomePath = preferences.app.defaultHomePath;
  const homeRouteResolved = router.resolve(defaultHomePath);
  const homeTabConfig: HomeTabParam = {
    path: defaultHomePath,
    title: (homeRouteResolved.meta?.title as string) || '首页',
    icon: homeRouteResolved.meta?.icon,
  };

  const sideMenuRef = ref<VNodeRef | null>(null);
  const isMenuFold = computed(() => sideMenuRef.value?.isFold ?? false);
  const handleMenu = () => {
    if (!sideMenuRef.value) {
      return;
    }
    sideMenuRef.value.foldMenu();
  };

  watch(
    () => route.path,
    (newPath) => {
      // 逻辑 A：如果进入了 Layout 却没指定具体子路由，或者来到了根路径，自动跳转到配置的默认页
      if (newPath === '/backend' || newPath === '/') {
        router.replace(defaultHomePath);
        return;
      }

      // 逻辑 B：正常添加标签页，并把首页路径传给 store 内部做持久化和查重
      tabStore.addTab(
        {
          path: route.path,
          meta: route.meta,
        },
        homeTabConfig
      );
    },
    { immediate: true } // 页面首次加载时就触发一次
  );
</script>

<template>
  <div class="backend-layout">
    <div class="wrapper">
      <div class="side">
        <ca-side-menu ref="sideMenuRef" />
      </div>
      <div class="container">
        <header class="header">
          <button
            class="side-menu-control-btn"
            @click="handleMenu">
            <ChevronDoubleRightIcon v-show="isMenuFold" />
            <ChevronDoubleLeftIcon v-show="!isMenuFold" />
          </button>
          <ca-breadcrumb style="margin-right: auto" />
          <global-tools class="global-tools-container" />
          <user-box />
        </header>

        <ca-tabs-bar />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .backend-layout {
    width: 100vw;
    height: 100vh;
    min-width: 1024px;
    overflow: hidden;
    background-color: var(--color-container-bg);
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
      sans-serif;
  }

  .wrapper {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .side {
    height: 100%;
    background-color: #001529;
    color: #fff;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.3s;
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-container-bg);
    overflow: hidden;
  }

  /* 顶部顶栏 */
  .header {
    height: 64px;
    border-bottom: 1px solid var(--color-border-accent);
    display: flex;
    align-items: center;
    padding: 0 24px;
    z-index: 10;
  }

  .header .side-menu-control-btn {
    background-color: transparent;
    width: 28px;
    padding: 4px 6px;
    aspect-ratio: 1/1;
    border: 1px solid var(--color-border-accent);
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 50ms ease;
  }

  .header .side-menu-control-btn:hover {
    background-color: var(--color-bg-hover);
  }

  .header .side-menu-control-btn svg {
    color: var(--color-accent);
    transform: translateY(2px);
  }

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: var(--color-context-bg);
  }

  .global-tools-container {
    position: relative;
    margin-right: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
  }

  .global-tools-container::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: #dcdfe6;
  }
</style>
