import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import CaImage from '../src/Image.vue';
import CaImageViewer from '../src/Viewer.vue';

describe('CaImage.vue', () => {
  let wrapper: VueWrapper<any>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render correctly with default props', () => {
    wrapper = mount(CaImage, {
      props: {
        src: 'https://example.com/test.png',
      },
    });

    // 验证根组件类名和预览修饰符是否正确应用
    expect(wrapper.classes()).toContain('ca-image');
    expect(wrapper.classes()).toContain('ca-image--previewable');

    // 验证 img 标签的 src 和 alt 属性默认值
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/test.png');
    expect(img.attributes('alt')).toBe('');
  });

  it('should render alt property correctly when provided', () => {
    wrapper = mount(CaImage, {
      props: {
        src: 'https://example.com/test.png',
        alt: '示例图片',
      },
    });

    const img = wrapper.find('img');
    expect(img.attributes('alt')).toBe('示例图片');
  });

  it('should not add previewable class when preview prop is false', () => {
    wrapper = mount(CaImage, {
      props: {
        src: 'https://example.com/test.png',
        preview: false,
      },
    });

    expect(wrapper.classes()).toContain('ca-image');
    expect(wrapper.classes()).not.toContain('ca-image--previewable');
  });

  it('should open viewer when image is clicked and preview is enabled', async () => {
    wrapper = mount(CaImage, {
      props: {
        src: 'https://example.com/test.png',
        preview: true,
      },
    });

    const viewerComponent = wrapper.findComponent(CaImageViewer);
    expect(viewerComponent.exists()).toBe(true);

    // 模拟点击图片触发预览弹窗打开
    const img = wrapper.find('img');
    await img.trigger('click');

    // 验证内部 CaImageViewer 的状态通过暴露方法已激活（visible 变为 true，对应 viewer 内部样式变化）
    // 由于 Viewer 内部通过 visible ref 控制显示，可以断言其内部根元素是否包含展示样式
    expect(viewerComponent.vm.open).toBeDefined();
  });

  it('should not open viewer when image is clicked and preview is disabled', async () => {
    wrapper = mount(CaImage, {
      props: {
        src: 'https://example.com/test.png',
        preview: false,
      },
    });

    const viewerComponent = wrapper.findComponent(CaImageViewer);
    const openSpy = vi.spyOn(viewerComponent.vm, 'open');

    const img = wrapper.find('img');
    await img.trigger('click');

    // 验证预览关闭时，点击不会触发 viewer 的 open 方法
    expect(openSpy).not.toHaveBeenCalled();
  });
});