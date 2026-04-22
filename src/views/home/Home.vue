<script setup lang="ts">

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
      <div class="grid-item" @click="$router.push('/notes')">
        <div class="item-header">
          <span class="index">01</span>
          <span class="tag">COLLECTION</span>
        </div>
        <div class="item-body">
          <h2>NOTES</h2>
          <p>心得 / 经验 / 归档</p>
        </div>
      </div>

      <div class="grid-item" @click="$router.push('/social')">
        <div class="item-header">
          <span class="index">02</span>
          <span class="tag">LIFE</span>
        </div>
        <div class="item-body">
          <h2>SOCIAL</h2>
          <p>行程 / 旅行 / 兴趣</p>
        </div>
      </div>

      <div class="grid-item tech-showcase">
        <div class="item-header">
          <span class="index">03</span>
          <span class="tag">DEMO</span>
        </div>
        <div class="item-body">
          <h2>TECH</h2>
          <p>Speed / Animation / Stack</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-map {
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 个人介绍部分 */
.intro-section {
  margin-bottom: 60px;
}

.owner-name {
  /* 使用全局 h1 样式，此处微调边距 */
  margin: 0 0 24px 0;
  color: var(--text-h);
}

.contact-info {
  display: flex;
  gap: 32px;
  font-family: var(--mono);
  font-size: 14px;
  text-transform: uppercase;
}

.info-item a:hover {
  color: var(--accent);
  text-decoration: underline;
}

/* 细线条分割 */
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--border);
  margin-bottom: 60px;
}

/* 导航网格布局 */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  /* 网格线效果：利用背景色和 gap */
  background-color: var(--border);
  gap: 1px;
  border: 1px solid var(--border);
}

.grid-item {
  background-color: var(--bg-color);
  padding: 40px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

/* 悬停效果：使用全局 accent 强调色 */
.grid-item:hover {
  background-color: var(--accent-bg);
}

.grid-item:hover h2 {
  color: var(--accent);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.index {
  font-family: var(--mono);
  font-size: 12px;
  opacity: 0.5;
}

.tag {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
}

.item-body h2 {
  /* 使用全局 h2 样式 */
  margin-bottom: 12px;
  transition: color 0.3s;
}

.item-body p {
  font-size: 14px;
  color: var(--text);
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