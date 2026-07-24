import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CaAvatar from '../src/Avatar.vue';

describe('CaAvatar Component', () => {
  const defaultProps = {
    url: 'https://example.com/avatar.png',
  };

  it('是否正常渲染基础图片和结构', () => {
    const wrapper = mount(CaAvatar, {
      props: defaultProps,
    });

    // 检查组件渲染
    expect(wrapper.find('.ca-avatar_wrapper').exists()).toBe(true);

    // 检查 img 属性设置
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(defaultProps.url);
  });

  it('正确应用自定义尺寸 (size) 与 圆角 (radius)', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        size: 100,
        radius: 20,
      },
    });

    const wrapperEl = wrapper.find('.ca-avatar_wrapper').element as HTMLElement;
    const containerEl = wrapper.find('.ca-avatar_container').element as HTMLElement;

    expect(wrapperEl.style.width).toBe('100px');
    expect(wrapperEl.style.height).toBe('100px');
    expect(containerEl.style.borderRadius).toBe('20%');
  });

  it('在 showDot 为 false 时不显示红点/角标', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        showDot: false,
        dots: { content: 5 },
      },
    });

    expect(wrapper.find('.dot').exists()).toBe(false);
  });

  it('正确渲染单个角标与对应颜色', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        showDot: true,
        dots: {
          color: 'red',
          position: 'top-right',
          content: 'NEW',
        },
      },
    });

    const dot = wrapper.find('.dot');
    expect(dot.exists()).toBe(true);
    expect(wrapper.find('.dot-content').text()).toBe('NEW');

    // 校验 preset 颜色解析
    const dotEl = dot.element as HTMLElement;
    expect(dotEl.style.backgroundColor).toBe('rgb(248, 113, 113)'); // #f87171 的 rgb 表示
  });

  it('正确渲染多个角标 (dots 传入数组)', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        showDot: true,
        dots: [
          { position: 'top-right', color: 'red' },
          { position: 'bottom-right', color: 'green' },
        ],
      },
    });

    const dots = wrapper.findAll('.dot');
    expect(dots.length).toBe(2);
  });

  it('当 hideLargeNumber 为 true 且数字超过 99 时显示 99+', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        showDot: true,
        hideLargeNumber: true,
        dots: {
          content: 120,
        },
      },
    });

    const dotContent = wrapper.find('.dot-content');
    expect(dotContent.text()).toContain('99');
    expect(wrapper.find('.plus-sign').exists()).toBe(true);
  });

  it('图片加载失败时替换为 errorUrl', async () => {
    const errorUrl = 'https://example.com/fallback.png';
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        errorUrl,
      },
    });

    const img = wrapper.find('img');

    // 触发图片加载失败事件
    await img.trigger('error');

    expect(img.attributes('src')).toBe(errorUrl);
  });

  it('alt 属性正常绑定到 img 标签', () => {
    const wrapper = mount(CaAvatar, {
      props: {
        ...defaultProps,
        alt: '用户头像',
      },
    });

    expect(wrapper.find('img').attributes('alt')).toBe('用户头像');
  });
});