type MessageTypeOption = 'primary' | 'success' | 'error' | 'warn';

interface MessageOption {
  type: MessageTypeOption;
  content: string;
  /**
   * 延迟消失时间（单位：ms）
   */
  duration?: number;
}

interface MessageInstance extends MessageOption {
  id: string;
}

interface MessageItemProps {
  type?: MessageTypeOption;
  content: string;
}

export type {
  MessageTypeOption,
  MessageOption,
  MessageInstance,
  MessageItemProps,
};
