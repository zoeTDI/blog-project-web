<script setup lang="ts">
  import type { MessageItemEmits, MessageItemProps } from './types.ts';
  import { computed } from 'vue';
  import {
    ChatBubbleOvalLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon, XMarkIcon,
  } from '@heroicons/vue/24/outline';
  import { useCSSNamespace } from '@caldm/hook';
  import CaIcon from '../../../icon/src/Icon.vue';

  defineOptions({
    name: 'CaMessageItem',
  });

  const props = withDefaults(defineProps<MessageItemProps>(), {
    type: 'primary',
    content: '',
  });

  const ns = useCSSNamespace('message-item');

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.s(props.type || 'primary')];
    return cls;
  });

  defineEmits<MessageItemEmits>();

  const iconComponent = computed(() => {
    const icons = {
      primary: ChatBubbleOvalLeftIcon,
      success: CheckCircleIcon,
      warn: ExclamationTriangleIcon,
      error: XCircleIcon,
    };
    return icons[props.type] || ChatBubbleOvalLeftIcon;
  });
</script>

<template>
  <div :class="classes">
    <CaIcon :icon="iconComponent" :size="20" />
    <span :class="ns.e('content')">{{ content }}</span>
    <CaIcon
      :class="ns.e('close-btn')"
      :icon="XMarkIcon"
      :size="18"
      @click="$emit('close')" />
  </div>
</template>

<style scoped>
  .ca-message-item {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    min-width: 240px;
    justify-content: flex-start;
    color: #fff;
  }

  /* 类型背景色 */
  .ca-message-item-primary {
    background-color: var(--primary-color, #1890ff);
  }

  .ca-message-item-success {
    background-color: var(--success-color, #52c41a);
  }

  .ca-message-item-error {
    background-color: var(--error-color, #ff4d4f);
  }

  .ca-message-item-warn {
    background-color: var(--warning-color, #faad14);
  }

  .ca-message-item__content {
    margin-left: 8px;
    margin-right: 8px;
  }

  .ca-message-item__close-btn {
    margin-left: auto;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.7);
    transition: color 300ms ease;
  }

  .ca-message-item__close-btn:hover {
    color: #e50000;
  }
</style>