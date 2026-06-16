import type { Component } from 'vue';

const MessageSource = {
  SYSTEM: 'system',
  USER: 'user',
} as const;

type MessageSourceType = (typeof MessageSource)[keyof typeof MessageSource];

interface BaseMessage {
  id: string | number;
  type: MessageSourceType;
  isRead: boolean;
  content: string;
  title?: string;
  timestamp: string | Date;
}

interface SystemMessage extends BaseMessage {
  type: typeof MessageSource.SYSTEM;
  icon?: Component;
}

interface UserMessage extends BaseMessage {
  type: typeof MessageSource.USER;
  avatarUrl: string;
  senderName: string;
}

type MessageItem = SystemMessage | UserMessage;

export type {
  MessageSourceType,
  BaseMessage,
  SystemMessage,
  UserMessage,
  MessageItem,
};
export { MessageSource };
