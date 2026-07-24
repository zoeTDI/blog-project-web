import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import CaDrawer from '../src/Drawer.vue';
import type { CaDrawerExpose } from '../src/types';

describe('CaDrawer.vue', () => {
  let wrapper: VueWrapper<any> | null = null;

  // 统一的 mount 配置：把 Teleport 打桩(stub)掉，使其在组件内部就地渲染
  const mountDrawer = (options: Record<string, any> = {}) => {
    return mount(CaDrawer, {
      global: {
        stubs: {
          teleport: true, // 禁用 Teleport 挂载到外部，留在 wrapper 内部以便正常 find
        },
      },
      ...options,
    });
  };

  beforeEach(() => {
    wrapper = null;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  describe('Expose API & 基础状态显隐控制', () => {
    it('应该默认隐藏抽屉，并能通过暴露的 open/close 方法切换显示状态与触发事件', async () => {
      wrapper = mountDrawer();

      const vm = wrapper.vm as unknown as CaDrawerExpose;

      // 默认不可见 (v-show 为 false)
      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(false);

      // 调用 open 方法
      vm.open();
      await wrapper.vm.$nextTick();

      // 验证 DOM 可见及 emit 事件触发
      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(true);
      expect(wrapper.emitted('open')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true]);

      // 调用 close 方法
      vm.close();
      await wrapper.vm.$nextTick();

      // 验证 DOM 隐藏及 close 事件触发
      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(false);
      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[1]).toEqual([false]);
    });
  });

  describe('Props & 布局计算', () => {
    it('应该使用默认 Props 正确渲染类名 (placement="right", size="auto")', async () => {
      wrapper = mountDrawer();

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      const container = wrapper.find('.ca-drawer__container');
      expect(container.classes()).toContain('ca-drawer--right');
      expect(container.classes()).not.toContain('is-full');
    });

    it('当 size 设置为 full 时，应渲染 is-full 类名', async () => {
      wrapper = mountDrawer({
        props: {
          size: 'full',
          placement: 'bottom',
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      const container = wrapper.find('.ca-drawer__container');
      expect(container.classes()).toContain('ca-drawer--bottom');
      expect(container.classes()).toContain('is-full');
    });

    it('计算 customSize 的 CSS 变量: 当 customSize > 1 时按 px 计算', async () => {
      wrapper = mountDrawer({
        props: {
          customSize: 300,
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      const container = wrapper.find('.ca-drawer__container');
      expect(container.attributes('style')).toContain('--ca-drawer-custom-size: 300px');
    });

    it('计算 customSize 的 CSS 变量: 0 < customSize <= 1 映射为百分比 (水平与垂直方向)', async () => {
      // 水平方向 (left/right) -> svw
      wrapper = mountDrawer({
        props: {
          placement: 'left',
          customSize: 0.5,
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ca-drawer__container').attributes('style')).toContain(
        '--ca-drawer-custom-size: 50svw'
      );

      // 销毁并测试垂直方向 (top/bottom) -> svh
      wrapper.unmount();
      wrapper = mountDrawer({
        props: {
          placement: 'top',
          customSize: 0.8,
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ca-drawer__container').attributes('style')).toContain(
        '--ca-drawer-custom-size: 80svh'
      );
    });

    it('当 customSize <= 0 时忽略并返回空样式对象', async () => {
      wrapper = mountDrawer({
        props: {
          customSize: 0,
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ca-drawer__container').attributes('style')).toBeFalsy();
    });
  });

  describe('交互与事件处理', () => {
    it('默认点击遮罩层应触发关闭', async () => {
      wrapper = mountDrawer();

      const vm = wrapper.vm as unknown as CaDrawerExpose;
      vm.open();
      await wrapper.vm.$nextTick();

      // 点击 Overlay 遮罩
      await wrapper.find('.ca-drawer__overlay').trigger('click');

      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(false);
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('当 closeOnClickOverlay 为 false 时，点击遮罩层不响应关闭', async () => {
      wrapper = mountDrawer({
        props: {
          closeOnClickOverlay: false,
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      await wrapper.find('.ca-drawer__overlay').trigger('click');

      // 状态仍为可见，不触发 close
      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(true);
      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('点击容器内部内容不应触发遮罩层的关闭逻辑（阻止冒泡）', async () => {
      wrapper = mountDrawer();

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      // 点击 Container 区域
      await wrapper.find('.ca-drawer__container').trigger('click');

      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(true);
      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('点击右上角关闭按钮能够正常关闭抽屉', async () => {
      wrapper = mountDrawer();

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      await wrapper.find('.ca-drawer__close-btn').trigger('click');

      expect(wrapper.find('.ca-drawer__overlay').isVisible()).toBe(false);
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('Slots 插槽渲染', () => {
    it('正确渲染默认插槽与 header 插槽', async () => {
      wrapper = mountDrawer({
        slots: {
          header: '<div class="custom-header">自定义标题</div>',
          default: '<div class="custom-content">自定义主体内容</div>',
        },
      });

      (wrapper.vm as unknown as CaDrawerExpose).open();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.custom-header').text()).toBe('自定义标题');
      expect(wrapper.find('.custom-content').text()).toBe('自定义主体内容');
    });
  });
});