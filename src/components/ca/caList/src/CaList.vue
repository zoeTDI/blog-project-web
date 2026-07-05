<script setup lang="ts">
  interface Props {
    mode?: 'ordered' | 'bullet' | 'plain';
    title?: string;
  }

  withDefaults(defineProps<Props>(), {
    mode: 'plain',
    title: undefined,
  });
</script>

<template>
  <component
    :is="mode === 'ordered' ? 'ol' : 'ul'"
    class="ca-list"
    :class="`is-mode-${mode}`">
    <h4
      class="ca-list-title"
      v-if="title">
      {{ title }}
    </h4>
    <component
      :is="mode === 'ordered' ? 'ol' : 'ul'"
      class="ca-list-container"
      :class="`is-mode-${mode}`">
      <slot></slot>
    </component>
  </component>
</template>

<style scoped>
  .ca-list {
    width: 100%;
  }

  .ca-list-title {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: var(--color-text-h);
    font-weight: 600;
  }

  .ca-list-container {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  /* 1. 有序列表模式 */
  .is-mode-ordered {
    list-style: decimal inside; /* 数字显示在内部以保持对齐 */
    color: var(--color-text-primary);
  }
  /* 利用 deep 选择器微调 Item 表现 */
  :deep(.is-mode-ordered .ca-list-item) {
    display: list-item; /* 恢复列表项特性以显示数字 */
  }
  :deep(.is-mode-ordered .ca-list-item > div) {
    display: inline-flex; /* 保持内部 Flex 布局 */
  }

  /* 2. 无序有标识符模式 (如小圆点) */
  .is-mode-bullet {
    list-style: none;
  }
  :deep(.is-mode-bullet .ca-list-item-prefix::before) {
    content: '•';
    color: var(--color-accent);
    font-weight: bold;
  }

  /* 3. 无标识符模式 */
  .is-mode-plain {
    list-style: none;
  }
</style>
