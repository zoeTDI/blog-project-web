<script setup lang="ts">
import {CaTabsBar, type HomeTabParam} from "@/components/ca/caTabsBar";
import {CaSideMenu} from "@/components/ca/caSideMenu";
import {watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useTabStore} from "@/store/useTabStore.ts";
import {preferences} from "@/core/preferences";
import {CaBreadcrumb} from "@/components/ca/caBreadcrumb";
import { GlobalTools } from "@/components/globalTools";

const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()

const defaultHomePath = preferences.app.defaultHomePath
const homeRouteResolved = router.resolve(defaultHomePath)
const homeTabConfig: HomeTabParam = {
  path: defaultHomePath,
  title: (homeRouteResolved.meta?.title as string) || '首页',
  icon: homeRouteResolved.meta?.icon
}

watch(
    () => route.path,
    (newPath) => {
      // 逻辑 A：如果进入了 Layout 却没指定具体子路由，或者来到了根路径，自动跳转到配置的默认页
      if (newPath === '/backend' || newPath === '/') {
        router.replace(defaultHomePath)
        return
      }

      // 逻辑 B：正常添加标签页，并把首页路径传给 store 内部做持久化和查重
      tabStore.addTab({
        path: route.path,
        meta: route.meta
      }, homeTabConfig)
    },
    { immediate: true } // 页面首次加载时就触发一次
)
</script>

<template>
  <div class="backend-layout">
    <div class="wrapper">
      <aside class="side">
        <div class="logo">Logo</div>
        <div class="menu-container">
          <ca-side-menu/>
        </div>
      </aside>

      <div class="container">
        <header class="header">
          <ca-breadcrumb style="margin-right: auto;" />
          <global-tools />
          <div class="user-info">
            <span>[用户头像/菜单占位]</span>
          </div>
        </header>

        <ca-tabs-bar/>
        <main class="main-content">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backend-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.side {
  width: 240px;
  height: 100%;
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #002140;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
}

.menu-container::-webkit-scrollbar {
  display: none;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  overflow: hidden;
}

/* 顶部顶栏 */
.header {
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 10;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

</style>