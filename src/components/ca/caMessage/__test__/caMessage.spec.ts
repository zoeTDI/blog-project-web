import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { CaMessageContainer } from '@/components/ca/caMessage';

describe('CaMessageContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该能够添加并渲染消息', async () => {
    const wrapper = mount(CaMessageContainer);
    // 调用 expose 中的 add 方法
    wrapper.vm.add({ type: 'success', content: '测试成功消息', duration: 0 });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.ca-message-item').exists()).toBe(true);
    expect(wrapper.text()).toContain('测试成功消息');
  });

  it('应该能够通过点击关闭按钮手动移除消息', async () => {
    const wrapper = mount(CaMessageContainer);
    wrapper.vm.add({ type: 'error', content: '错误消息', duration: 0 });
    await wrapper.vm.$nextTick();

    const closeBtn = wrapper.find('.ca-message-item_close');
    await closeBtn.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.ca-message-item').exists()).toBe(false);
  });

  it('应该在指定时间后自动消失', async () => {
    const wrapper = mount(CaMessageContainer);
    wrapper.vm.add({ type: 'primary', content: '定时消失', duration: 2000 });
    await wrapper.vm.$nextTick();

    // 此时消息应存在
    expect(wrapper.find('.ca-message-item').exists()).toBe(true);

    // 快进时间
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();

    // 消息应消失
    expect(wrapper.find('.ca-message-item').exists()).toBe(false);
  });
});
