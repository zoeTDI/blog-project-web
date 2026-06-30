<script setup lang="ts">
  import { type MessageItemProps } from '@/components/ca/caMessage';

  withDefaults(defineProps<MessageItemProps>(), {
    type: 'primary',
    content: '',
  });
  defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<template>
  <div :class="['ca-message-item', `ca-message-${type}`]">
    <span class="ca-message-item_content">{{ content }}</span>
    <button
      class="ca-message-item_close"
      @click="$emit('close')">
      x
    </button>
  </div>
</template>

<style scoped>
  .ca-message-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    pointer-events: auto; /* 恢复鼠标交互 */
    min-width: 200px;
    justify-content: space-between;
  }

  /* 针对不同类型的样式定义 */
  .ca-message-primary {
    border-left: 4px solid var(--primary-color, #1890ff);
  }
  .ca-message-success {
    border-left: 4px solid var(--success-color, #52c41a);
  }
  .ca-message-error {
    border-left: 4px solid var(--error-color, #ff4d4f);
  }
  .ca-message-warn {
    border-left: 4px solid var(--warning-color, #faad14);
  }

  .ca-message-item_close {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
    color: #999;
  }

  .ca-message-item_close:hover {
    color: #333;
  }
</style>
