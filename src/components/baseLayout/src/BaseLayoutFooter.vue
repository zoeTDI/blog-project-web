<script setup lang="ts">
  import { preferences } from '@/core/preferences';
</script>

<template>
  <div class="base-layout-footer">
    <div class="footer-left">
      <div class="copyright">© {{ new Date().getFullYear() }} BY YOURNAME</div>
    </div>
    <div class="footer-right">
      <div class="beian-container">
        <a
          :href="preferences.copyright.gonganRecordNumberLink"
          target="_blank"
          class="beian-item">
          <img
            src="@/assets/备案编号图标.png"
            alt="公安备案图标"
            class="gongan-icon" />
          <span>{{ preferences.copyright.gonganRecordNumber }}</span>
        </a>

        <a
          :href="preferences.copyright.icpRecordNumberLink"
          target="_blank"
          class="beian-item">
          <span>{{ preferences.copyright.icpRecordNumber }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .base-layout-footer {
    max-width: 1200px;
    margin: 0 auto;
    border-top: 1px solid var(--color-border);
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  .base-layout-footer:hover {
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
    color: var(--color-text-hover-accent);
  }

  /* 公安图片大小与文字对齐的关键 */
  .gongan-icon {
    height: 1.2em; /* 略大于 1em 以视觉抵消图标边距，确保感官上与文字对齐 */
    width: auto;
    vertical-align: middle;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .base-layout-footer {
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
