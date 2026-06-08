<script setup lang="ts">
// 骨架布局，暂无需引入复杂逻辑
import {CaTabsBar} from "@/components/ca/caTabsBar";
</script>

<template>
  <div class="backend-layout">
    <div class="wrapper">
      <aside class="side">
        <div class="logo">Logo</div>
        <div class="menu-placeholder">Menu Placeholder</div>
      </aside>

      <div class="container">
        <header class="header">
          <span>Breadcrumb / User Info</span>
        </header>

        <ca-tabs-bar />
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

/* 侧边栏：固定宽度，满高 */
.side {
  width: 240px;
  height: 100%;
  background-color: #001529; /* 经典的深色后台主题色 */
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止被右侧挤压变形 */
  transition: width 0.3s; /* 预留后期折叠动画 */
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

.menu-placeholder {
  flex: 1;
  padding: 20px;
  color: rgba(255, 255, 255, 0.65);
}

/* 右侧容器：占据剩余的所有宽度，自适应 */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa; /* 浅灰色背景衬托内容区 */
  overflow: hidden;
}

/* 顶部顶栏 */
.header {
  height: 64px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 10; /* 保证阴影在标签页之上 */
}

/* 主要内容区：独立滚动，不影响全局 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* 内容过多时自动出现滚动条 */
}

.content-placeholder {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  min-height: 100%; /* 撑满内容区 */
  box-sizing: border-box;
  border: 1px dashed #cbd5e1; /* 虚线框暗示这里是内容槽 */
  color: #94a3b8;
}
</style>