<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { CaInkTree } from '@caldm/ui';

  const themeMode = ref<'light' | 'dark'>('light');
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      themeMode.value = savedTheme;
    } else {
      themeMode.value = 'light';
    }
  });
</script>

<template>
  <div :class="['app-wrapper', themeMode]">
    <CaInkTree
      :max-trees="6"
      color-var-name="--text-primary" />
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
  .app-wrapper {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    /* 使用全局变量 */
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    transition:
      background-color 0.4s ease,
      color 0.4s ease;
  }

  .app-wrapper {
    isolation: isolate; /* 强制创建一个新的层级上下文 */
  }

  .layout-main {
    position: relative;
    z-index: 1;
    flex: 1;
    width: 100%;
  }
</style>