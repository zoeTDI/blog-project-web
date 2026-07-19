<script setup lang="ts">
  import { computed } from 'vue';
  import { type MessageItemProps } from '@/components/ca/caMessage';
  import {
    ChatBubbleOvalLeftIcon, // primary
    CheckCircleIcon, // success
    ExclamationTriangleIcon, // warn
    XCircleIcon, // error
  } from '@heroicons/vue/24/outline';

  const props = withDefaults(defineProps<MessageItemProps>(), {
    type: 'primary',
    content: '',
  });

  defineEmits<{
    (e: 'close'): void;
  }>();

  const iconComponent = computed(() => {
    const icons = {
      primary: ChatBubbleOvalLeftIcon,
      success: CheckCircleIcon,
      warn: ExclamationTriangleIcon,
      error: XCircleIcon,
    };
    return icons[props.type];
  });
</script>

<template>
  <div :class="['ca-message-item', `ca-message-${type}`]">
    <component
      :is="iconComponent"
      class="ca-message-icon" />

    <span class="ca-message-item_content">{{ content }}</span>

    <button
      class="ca-message-item_close"
      @click="$emit('close')">
      ×
    </button>
  </div>
</template>

<style scoped>
  .ca-message-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    min-width: 240px;
    justify-content: flex-start;
    color: #fff;
  }

  /* 图标样式 */
  .ca-message-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  /* 类型背景色 */
  .ca-message-primary {
    background-color: var(--primary-color, #1890ff);
  }
  .ca-message-success {
    background-color: var(--success-color, #52c41a);
  }
  .ca-message-error {
    background-color: var(--error-color, #ff4d4f);
  }
  .ca-message-warn {
    background-color: var(--warning-color, #faad14);
  }

  .ca-message-item_close {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    padding: 0;
  }

  .ca-message-item_close:hover {
    color: #fff;
  }
</style>
