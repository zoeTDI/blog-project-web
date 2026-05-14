<script setup lang="ts">
import ChinaMap from "@/views/travel/src/ChinaMap.vue";
import { useLoadingStore } from "@/store/useLoadingStore.ts";
import { onMounted } from "vue";
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
  <div class="travel">
    <div class="header-section">
      <h2>我的足迹</h2>
      <p class="subtitle">记录走过的每一座城市</p>
    </div>

    <div class="map-paper-container">
      <china-map />
    </div>
  </div>
</template>

<style scoped>
.travel {
  width: 100%;
  max-width: var(--content-max-width-L);
  padding: var(--content-padding-L); /* 增加顶部留白 */
  margin: 0 auto;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 40px;
  text-align: center;
}

.subtitle {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 14px;
  margin-top: 8px;
}

/* 核心优化：地图“纸张”容器 */
.map-paper-container {
  /* 1. 背景适配：浅色模式下为纯白，深色模式下为微亮的深灰色 */
  background: var(--color-container-bg);

  /* 2. 边框与圆角 */
  border: 1px solid var(--color-border);
  border-radius: 24px;

  /* 3. 内边距：给地图留出呼吸空间 */
  padding: 40px;

  /* 4. 阴影：让容器产生悬浮感 */
  box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.05),
      0 4px 20px -5px rgba(0, 0, 0, 0.03);

  /* 5. 玻璃拟态效果（可选） */
  backdrop-filter: blur(10px);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 深色模式下的阴影加强 */
:deep(.dark) .map-paper-container {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: rgba(30, 30, 30, 0.6); /* 更加深邃的半透明感 */
}

/* 响应式适配 */
@media (max-width: 768px) {
  .map-paper-container {
    padding: 15px;
    border-radius: 16px;
  }
  .travel {
    padding: var(--content-padding-S);
  }
}
</style>