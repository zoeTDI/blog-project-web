<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLoadingStore } from "@/store/useLoadingStore.ts";

const store = useLoadingStore();
const { isVisible, progress } = storeToRefs(store);
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="loading-bar-container">
      <div
          class="loading-progress"
          :style="{
          width: progress + '%',
          // 当进度达到100时，缩短过渡时间，让“冲刺”感更强
          transition: progress === 100
            ? 'width 0.2s ease-out'
            : 'width 10s cubic-bezier(0.1, 0.5, 0.1, 1)'
        }"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 9999;
  pointer-events: none;
}

.loading-progress {
  height: 100%;
  background-color: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  width: 0; /* 初始宽度 */
  will-change: width;
}

/* 渐隐过渡 */
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>