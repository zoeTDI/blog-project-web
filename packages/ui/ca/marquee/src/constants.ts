import {
  ChatBubbleOvalLeftIcon, // primary
  CheckCircleIcon, // success
  ExclamationTriangleIcon, // warn
  XCircleIcon, // error
} from '@heroicons/vue/24/outline';

export const caMarqueeIconMap = {
  info: ChatBubbleOvalLeftIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon
} as const;