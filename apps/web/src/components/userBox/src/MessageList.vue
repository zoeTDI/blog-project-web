<script lang="ts" setup>
  import {
    type MessageItem,
    type UserMessage,
    MessageSource,
  } from '@/components/userBox';
  import { BellIcon } from '@heroicons/vue/24/outline';
  withDefaults(defineProps<{ messages?: MessageItem[] }>(), {
    messages: () => [],
  });
  const emit = defineEmits<{
    (e: 'mark-read', id: string | number): void;
  }>();
  const isUserMessage = (msg: MessageItem): msg is UserMessage => {
    return msg.type === MessageSource.USER;
  };
</script>

<template>
  <div class="message-list-container">
    <div
      v-if="messages?.length == 0"
      class="empty-state">
      暂无消息
    </div>
    <div
      v-for="msg in messages || []"
      :key="msg.id"
      @click="!msg.isRead && emit('mark-read', msg.id)"
      class="message-item">
      <div class="msg-left">
        <template v-if="isUserMessage(msg)">
          <img
            class="avatar"
            :src="msg.avatarUrl"
            :alt="msg.senderName || '用户消息'" />
        </template>
        <div
          class="system-icon-wrapper"
          v-else>
          <component
            v-if="msg.icon"
            :is="msg.icon"
            class="icon" />
          <bell-icon
            v-else
            class="icon" />
          <span
            v-if="!msg.isRead"
            class="unread-dot"></span>
        </div>
      </div>
      <div class="msg-right">
        <div
          class="msg-title"
          v-if="msg?.title">
          {{ msg.title }}
        </div>
        <div class="msg-content">
          {{ msg.content.split('\n')[0].slice(0, 100) + '...' }}
        </div>
      </div>
    </div>
    <div class="message-list-content"></div>
  </div>
</template>

<style scoped>
  .message-list-container {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;

    background-color: var(--color-container-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 1000;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  /*
   * Chrome, Safari, Edge 滚动条美化
   */
  .message-list-container::-webkit-scrollbar {
    width: 6px;
  }
  .message-list-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .message-list-container::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 3px;
  }

  .empty-state {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .message-item {
    display: flex;
    padding: 12px 16px;
    gap: 12px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .message-item:hover {
    background-color: var(--color-bg-hover);
  }

  .msg-left {
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .system-icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-context-bg);
    border-radius: 50%;
  }

  .icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-primary);
  }

  .unread-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: var(--color-accent);
    border-radius: 50%;
    border: 2px solid var(--color-container-bg);
  }

  .msg-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
  }

  .msg-title {
    font-weight: 600;
    color: var(--color-text-h);
    font-size: 14px;
  }

  .msg-content {
    font-size: 13px;
    color: var(--color-text-primary);
    line-height: 1.4;
  }
</style>
