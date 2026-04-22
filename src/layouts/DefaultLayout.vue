<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 主题状态：light 或 dark
const themeMode = ref<'light' | 'dark'>('light');
const logoSrc = ref('');
// 切换主题方法
const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
  // 同步到本地存储，实现持久化
  localStorage.setItem('theme', themeMode.value);
};

// 初始化时从本地加载主题偏好
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  if (savedTheme) {
    themeMode.value = savedTheme;
  }
});
</script>

<template>
  <div :class="['app-wrapper', themeMode]">
    <div class="layout-border"></div>

    <header class="layout-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <div v-if="logoSrc && logoSrc.trim() !== ''" class="logo-img-wrapper">
            <img :src="logoSrc" alt="Logo" class="logo-img" />
          </div>

          <div class="logo-text-group">
            <div class="site-title">BLOG'S TITLE</div>
            <div class="site-slogan">记录、探索与生活的极简志</div>
          </div>
        </div>

        <nav class="header-nav">
          <button @click="toggleTheme" class="theme-switch">
            <span class="mode-label">{{ themeMode === 'light' ? 'NIGHT' : 'DAY' }}</span>
            <div class="switch-icon"></div>
          </button>
        </nav>
      </div>
    </header>

    <main class="layout-main">
      <router-view />
    </main>

    <footer class="layout-footer">
      <div class="footer-content">
        <div class="footer-left">
          <div class="copyright">
            © {{ new Date().getFullYear() }} BY YOURNAME
          </div>
        </div>

        <div class="footer-right">
          <div class="beian-container">
            <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXXXXXXXX"
                target="_blank"
                class="beian-item"
            >
              <img src="@/assets/备案编号图标.png" alt="公安备案图标" class="gongan-icon" />
              <span>某公网安备 XXXXXXXXXXXXXX号</span>
            </a>

            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                class="beian-item"
            >
              <span>XICP备XXXXXX号</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* 使用全局变量 */
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.4s ease, color 0.4s ease;
}

/* 极简细线条外框 */
.layout-border {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border: 1px solid var(--border);
  pointer-events: none;
  z-index: 9999;
  transition: border-color 0.4s ease;
}

/* Header 样式 */
.layout-header {
  padding: 40px 60px;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

/* Logo 图片包裹区 */
.logo-img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 40px; /* 根据设计需求调整高度 */
  width: auto;
  /* 如果是深色模式下黑色 Logo 不清晰，可配合 filter 处理 */
  transition: filter 0.4s ease;
}

/* 右侧文字组：上下排列 */
.logo-text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
}

/* 上部分：网站名称 */
.site-title {
  font-family: var(--heading); /* 全局衬线体 */
  font-size: 20px;
  font-weight: 600;
  color: var(--text-h);
  letter-spacing: 1px;
}

/* 下部分：个性签名 */
.site-slogan {
  font-family: var(--sans); /* 签名可以使用无衬线体增加现代感 */
  font-size: 11px;
  color: var(--text);
  opacity: 0.7;
  letter-spacing: 0.5px;
  margin-top: 2px;
  text-transform: uppercase; /* 可选：开启大写增加极简质感 */
}

/* 响应式微调 */
@media (max-width: 768px) {
  .site-title { font-size: 18px; }
  .site-slogan { font-size: 10px; }
  .logo-img { height: 32px; }
}

/* 主题切换按钮 */
.theme-switch {
  background: none;
  border: 1px solid var(--border);
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.theme-switch:hover {
  border-color: var(--accent);
}

.mode-label {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
}

/* 内容主体 */
.layout-main {
  flex: 1;
  width: 100%;
}

/* Footer 样式 */
.layout-footer {
  padding: 40px 60px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 1px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid var(--border);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.footer-content:hover {
  opacity: 1; /* 鼠标悬停时清晰显示，符合极简互动感 */
}

/* 备案容器：横向排列 */
.beian-container {
  display: flex;
  align-items: center;
  gap: 24px; /* 两个备案信息之间的间距 */
}

.beian-item {
  display: flex;
  align-items: center;
  gap: 4px; /* 图片与文字之间的微小间距 */
  color: inherit;
  text-decoration: none;
}

.beian-item:hover {
  color: var(--accent);
}

/* 公安图片大小与文字对齐的关键 */
.gongan-icon {
  height: 1.2em; /* 略大于 1em 以视觉抵消图标边距，确保感官上与文字对齐 */
  width: auto;
  vertical-align: middle;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .beian-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>