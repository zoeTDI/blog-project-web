<script setup lang="ts"></script>

<template>
  <div class="content-layout">
    <aside class="sidebar">
      <slot name="sidebar">
        <div class="default-sidebar">Sidebar</div>
      </slot>
    </aside>
    <main class="main-content">
      <slot name="content"></slot>
    </main>
  </div>
</template>

<style scoped>
  .content-layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #f5f7f9;
    overflow: hidden;
  }

  .sidebar {
    width: 280px;
    height: 100%;
    background-color: #ffffff;
    border-right: 1px solid #e8e8e8;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .main-content {
    flex: 1;
    height: 100%;
    padding: 24px;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>
