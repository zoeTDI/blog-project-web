<script setup lang="ts">
import {onMounted} from "vue";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

const loadingStore = useLoadingStore();
onMounted(() => {
  loadingStore.endLoading();
})
</script>

<template>
  <div class="home-map">
    <section class="intro-section">
      <h1 class="owner-name">NAME: YOUR NAME</h1>
      <div class="contact-info">
        <span class="info-item">EMAIL: <a href="mailto:example@mail.com">example@mail.com</a></span>
        <span class="info-item">GITHUB: <a href="https://github.com" target="_blank">@username</a></span>
      </div>
    </section>

    <div class="divider"></div>

    <div class="nav-grid">
      <div class="grid-item">
        <div class="item-header">
          <span class="index">01</span>
          <span class="tag">COLLECTION</span>
        </div>
        <div class="item-body">
          <div class="main-links">
            <router-link :to="{name: ROUTER_NAMES.NOTES}" class="nav-title">
              <h2>NOTES <span class="arrow">↗</span></h2>
            </router-link>
            <router-link :to="{name: ROUTER_NAMES.ARCHIVES}" class="nav-title">
              <h2>ARCHIVES <span class="arrow">↗</span></h2>
            </router-link>
          </div>
          <p>文章列表 / 技术心得 / 经验归档</p>
        </div>
      </div>

      <div class="grid-item">
        <div class="item-header">
          <span class="index">02</span>
          <span class="tag">PLAY</span>
        </div>
        <div class="item-body">
          <div class="main-links">
            <router-link :to="{name: ROUTER_NAMES.GAMES}" class="nav-title">
              <h2>GAMES<span class="arrow">↗</span></h2>
            </router-link>
          </div>
          <p>游戏 / 动漫 / 小说</p>
        </div>
      </div>

      <div class="grid-item">
        <div class="item-header">
          <span class="index">03</span>
          <span class="tag">WORLD</span>
        </div>
        <div class="item-body">
          <div class="main-link">
            <router-link :to="{name: ROUTER_NAMES.TRAVEL}" class="nav-title">
              <h2>TRAVEL<span class="arrow">↗</span></h2>
            </router-link>
          </div>
          <p>行程 / 旅行 / 兴趣</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-map {
  padding: 80px 40px;
  max-width: var(--content-max-width-M);
  margin: 0 auto;
}

/* 个人介绍部分 */
.intro-section {
  margin-bottom: 60px;
}

.owner-name {
  /* 使用全局 h1 样式，此处微调边距 */
  margin: 0 0 24px 0;
  color: var(--color-text-h);
}

.contact-info {
  display: flex;
  gap: 32px;
  font-family: var(--font-text);
  font-size: 14px;
  text-transform: uppercase;
}

.info-item a:hover {
  color: var(--color-text-hover-accent);
  text-decoration: underline;
}

/* 细线条分割 */
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border);
  margin-bottom: 60px;
}

/* 导航网格布局 */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  /* 网格线效果：利用背景色和 gap */
  background-color: var(--color-border);
  gap: 1px;
  border: 1px solid var(--color-border);
}

.grid-item {
  background-color: var(--color-container-bg);
  padding: 40px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.index {
  font-family: var(--font-text);
  font-size: 12px;
  opacity: 0.5;
}

.tag {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.main-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.nav-title {
  text-decoration: none;
  display: inline-block;
}

.nav-title h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 悬停效果：使用全局 accent 强调色 */
.grid-item a:hover {
  background-color: var(--color-bg-hover-accent);
}

.grid-item a:hover {
  color: var(--color-text-hover-accent);
}

.arrow {
  font-size: 18px;
  opacity: 0;
  transition: all 0.3s ease;
  transform: translateY(4px);
}

.nav-title:hover .arrow {
  opacity: 1;
  transform: translateY(0);
}

.item-body h2 {
  /* 使用全局 h2 样式 */
  margin-bottom: 12px;
  transition: color 0.3s;
}

.item-body p {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .home-map {
    padding: 40px 20px;
  }

  .grid-item {
    height: 240px;
    padding: 30px;
  }
}
</style>