import { type ComponentPublicInstance, h, render } from 'vue';
import CaMessageContainer from './Container.vue';
import type { MessageOption } from './types.ts';

let containerInstance: ComponentPublicInstance | null = null;
const getContainer = () => {
  // 非浏览器环境下直接返回
  if (!document) return;
  if (!containerInstance) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const vnode = h(CaMessageContainer);
    render(vnode, container);
    containerInstance = vnode.component?.exposed as ComponentPublicInstance;
  }
  return containerInstance;
}

export const CaMessage = {
  add(option: MessageOption) {
    const instance = getContainer();
    if (!instance) return;
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
}