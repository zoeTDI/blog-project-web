export type MessageTypeOption = 'primary' | 'success' | 'error' | 'warn';

export interface MessageOption {
  type: MessageTypeOption;
  content: string;
  /**
   * 延迟消失时间（单位：ms）
   */
  duration?: number;
}

export interface MessageInstance extends MessageOption {
  id: string;
}

export interface MessageItemProps {
  type?: MessageTypeOption;
  content: string;
}

export interface MessageItemEmits {
  (e: 'close'): void;
}

export interface MessageItemExpose {
  add: (option: MessageOption) => void;
  remove: (id: string) => void;
}