import { type ComponentPublicInstance, h, render } from 'vue';
import {
  CaMessageContainer,
  type MessageOption,
} from '@/components/ca/caMessage';

let containerInstance: ComponentPublicInstance | null = null;
const getContainer = () => {
  if (!containerInstance) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const vnode = h(CaMessageContainer);
    render(vnode, container);
    containerInstance = vnode.component?.exposed as ComponentPublicInstance;
  }
  return containerInstance;
};

export const caMessage = {
  add(option: MessageOption) {
    const instance = getContainer();
    (instance as any).add(option);
  },
  success(content: string, duration?: number) {
    this.add({ type: 'success', content, duration });
  },
  error(content: string, duration?: number) {
    this.add({ type: 'error', content, duration });
  },
  warn(content: string, duration?: number) {
    this.add({ type: 'warn', content, duration });
  },
  primary(content: string, duration?: number) {
    this.add({ type: 'primary', content, duration });
  },
};
