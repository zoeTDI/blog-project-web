import { CaMarquee, type CaMarqueeProps } from '@/components/ca/caMarquee';
import { h, render } from 'vue';

export type MarqueeOptions = Partial<CaMarqueeProps>;

let marqueeContainer: HTMLElement | null = null;

const destroyMarquee = () => {
  if (marqueeContainer) {
    render(null, marqueeContainer);
    marqueeContainer.remove();
    marqueeContainer = null;
  }
};

/**
 * 核心调用方法
 */
export const caMarquee = {
  /**
   * 基础展示方法
   */
  show(options: MarqueeOptions | string) {
    // 1. 如果传入的是纯字符串，自动转换为 content 属性
    const propsData: MarqueeOptions =
      typeof options === 'string' ? { content: options } : options;

    // 2. 单例处理：如果已有公告，先将其销毁（或者你可以选择更新，但跑马灯一般直接覆盖较多）
    destroyMarquee();

    // 3. 创建宿主 DOM 容器
    marqueeContainer = document.createElement('div');
    document.body.appendChild(marqueeContainer);

    // 4. 将 props 传入，并建立销毁回调（组件关闭时要连带把外层宿主 div 一起删掉）
    const vnode = h(CaMarquee, {
      ...propsData,
      // 捕获组件内部由于 visible 改变或定时器结束触发的销毁，执行 DOM 清理
      onDestroy: () => {
        destroyMarquee();
      },
    });

    // 5. 渲染挂载
    render(vnode, marqueeContainer);

    // 返回一个手动关闭的方法，供调用者在外部随时控制关闭
    return {
      close: destroyMarquee,
    };
  },

  /**
   * 语义化便捷方法
   */
  info(content: string, options?: Omit<MarqueeOptions, 'content' | 'icon'>) {
    return this.show({ ...options, content, icon: 'info' });
  },

  success(content: string, options?: Omit<MarqueeOptions, 'content' | 'icon'>) {
    return this.show({ ...options, content, icon: 'success' });
  },

  warning(content: string, options?: Omit<MarqueeOptions, 'content' | 'icon'>) {
    return this.show({ ...options, content, icon: 'warning' });
  },

  error(content: string, options?: Omit<MarqueeOptions, 'content' | 'icon'>) {
    return this.show({ ...options, content, icon: 'error' });
  },

  /**
   * 手动强制关闭全局跑马灯
   */
  close() {
    destroyMarquee();
  },
}; 