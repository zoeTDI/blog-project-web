import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { CaSwitchOption } from '@caldm/ui';

export const booleanOptions = [
  { label: '是', value: 'true', icon: CheckIcon },
  { label: '否', value: 'false', icon: XMarkIcon },
] as CaSwitchOption<string>[];

export const mdEditModeOptions = [
  { label: '源码', value: 'code' },
  { label: '实时', value: 'preview' },
  { label: '预览', value: 'read' },
];
