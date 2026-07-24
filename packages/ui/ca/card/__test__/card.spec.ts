import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CaCard from '../src/Card.vue';
import { CaButton } from '../../button';

describe('CaCard.vue', () => {
  it ('验证插槽渲染', () => {
    const wrapper = mount(CaCard, {
      slots: { default: `<div class="content">Body Content</div>` },
    });
    expect(wrapper.find('.content').exists()).toBe(true);
  });
  it('验证 header/footer 自动显隐', () => {
    const wrapper = mount(CaCard, {
      slots: { header: '<div class="header-content">Title</div>' },
    });
    expect(wrapper.find('.ca-card__header').exists()).toBe(true);
    expect(wrapper.find('.header-content').text()).toBe('Title');
  });
  it('验证 footerActions 配置项渲染', async () => {
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

    expect(buttons.length).toBe(2);
  });
  it('验证防抖功能', async () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const actions = [{ key: 'test', label: '点击', onClick, timeout: 500 }];

    const wrapper = mount(CaCard, {
      props: { footerActions: actions },
    });

    await wrapper.vm.$nextTick();

    const button = wrapper.findComponent(CaButton);

    await button.trigger('click');
    await button.trigger('click');
    await button.trigger('click');

    expect(onClick).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    await vi.runAllTimersAsync();

    expect(onClick).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
