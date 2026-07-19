import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { CaButton } from '@/components/ca/caButton';
import { CaCard } from '@/components/ca/caCard';

describe('CaCard.vue', () => {
  // 1. 验证插槽渲染
  it('renders content in default slot', () => {
    const wrapper = mount(CaCard, {
      slots: { default: '<div class="content">Body Content</div>' },
    });
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  // 2. 验证 header/footer 自动显隐
  it('shows header when slot is provided', () => {
    const wrapper = mount(CaCard, {
      slots: { header: '<div class="header-content">Title</div>' },
    });
    expect(wrapper.find('.layout-header').exists()).toBe(true);
    expect(wrapper.find('.header-content').text()).toBe('Title');
  });

  // 3. 验证 footerActions 配置项渲染
  it('renders buttons from footerActions', async () => {
    const onClick = vi.fn();
    const actions = [
      { key: 'save', label: '保存', onClick },
      { key: 'cancel', label: '取消' },
    ];

    const wrapper = mount(CaCard, {
      props: { footerActions: actions },
      slots: {},
    });

    // 等待组件处理 v-if/v-else 逻辑
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents(CaButton);
    // 打印 debug 信息辅助排查
    console.log(wrapper.html());

    expect(buttons.length).toBe(2);
  });

  // 4. 验证防抖功能 (Timeout)
  it('executes onClick with debounce when timeout is provided', async () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const actions = [{ key: 'test', label: '点击', onClick, timeout: 500 }];

    const wrapper = mount(CaCard, {
      props: { footerActions: actions },
    });

    // 确保计算属性和渲染完成
    await wrapper.vm.$nextTick();

    const button = wrapper.findComponent(CaButton);

    // 1. 连续触发 3 次点击
    await button.trigger('click');
    await button.trigger('click');
    await button.trigger('click');

    // 2. 验证：此时因为还在防抖期内，onClick 应该还没调用
    expect(onClick).not.toHaveBeenCalled();

    // 3. 关键：将时间推进到防抖时间之后
    // 必须使用 await 确保定时器内部逻辑执行完毕
    vi.advanceTimersByTime(500);

    // 某些环境下需要额外触发一次 flush 保证微任务队列处理完毕
    await vi.runAllTimersAsync();

    // 4. 断言
    expect(onClick).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
