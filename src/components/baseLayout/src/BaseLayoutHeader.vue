<script setup lang="ts"></script>

<template>
  <div class="base-layout-header">
    <slot name="logo"></slot>
    <div class="header-actions">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<style scoped>
  .base-layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 0;
  }
</style>
