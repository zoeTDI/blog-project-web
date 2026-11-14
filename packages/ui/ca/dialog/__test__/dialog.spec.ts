import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CaDialog from '../src/Dialog.vue';
import type { CaDialogAction, CaDialogExpose } from '../src/types';

describe('CaDialog.vue', () => {
  let wrapper: VueWrapper<any> | null = null;

  // 统一的 mount 配置：把 Teleport 打桩(stub)掉，使其在组件内部就地渲染
  const mountDialog = (options: Record<string, any> = {}) => {
    return mount(CaDialog, {
      global: {
        stubs: {
          teleport: true,
        },
      },
      ...options,
    });
  };

  const openDialog = async (options: Record<string, any> = {}) => {
    wrapper = mountDialog(options);
    (wrapper.vm as unknown as CaDialogExpose).open();
    await wrapper.vm.$nextTick();
    return wrapper;
  };

  beforeEach(() => {
    wrapper = null;
    document.body.style.overflow = '';
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.style.overflow = '';
  });

  describe('Expose API & 基础状态显隐控制', () => {
    it('应该默认隐藏弹窗，并能通过 open/close 方法切换显示状态与触发事件', async () => {
      wrapper = mountDialog();

      const vm = wrapper.vm as unknown as CaDialogExpose;

      expect(wrapper.find('.ca-dialog').exists()).toBe(false);

      vm.open();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ca-dialog').exists()).toBe(true);
      expect(wrapper.find('.ca-dialog__container').exists()).toBe(true);
      expect(wrapper.emitted('open')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([true]);

      vm.close();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.ca-dialog').exists()).toBe(false);
      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('update:visible')?.[1]).toEqual([false]);
    });

    it('重复调用 open/close 时不应重复触发事件', async () => {
      wrapper = mountDialog();
      const vm = wrapper.vm as unknown as CaDialogExpose;

      vm.open();
      vm.open();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('open')).toHaveLength(1);
      expect(wrapper.emitted('update:visible')).toHaveLength(1);

      vm.close();
      vm.close();

      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(wrapper.emitted('update:visible')).toHaveLength(2);
    });

    it('支持通过 visible 属性受控显示', async () => {
      wrapper = mountDialog({
        props: {
          visible: true,
          title: '受控弹窗',
        },
      });

      expect(wrapper.find('.ca-dialog').exists()).toBe(true);
      expect(wrapper.find('.ca-dialog__title').text()).toBe('受控弹窗');
    });
  });

  describe('Props & 尺寸计算', () => {
    it('默认使用 M 尺寸并渲染对应修饰符', async () => {
      await openDialog();

      const container = wrapper!.find('.ca-dialog__container');
      expect(container.classes()).toContain('ca-dialog--M');
      expect(container.attributes('style')).toContain('--ca-dialog-width: 520px');
    });

    it('size 为 L 时宽度为 720px', async () => {
      await openDialog({ props: { size: 'L' } });

      expect(wrapper!.find('.ca-dialog__container').attributes('style')).toContain(
        '--ca-dialog-width: 720px',
      );
    });

    it('width 为数字时按像素计算，并优先于 size', async () => {
      await openDialog({ props: { size: 'L', width: 600 } });

      expect(wrapper!.find('.ca-dialog__container').attributes('style')).toContain(
        '--ca-dialog-width: 600px',
      );
    });

    it('width 为字符串时按 CSS 宽度原样使用', async () => {
      await openDialog({ props: { width: 'min(720px, 90vw)' } });

      expect(wrapper!.find('.ca-dialog__container').attributes('style')).toContain(
        '--ca-dialog-width: min(720px, 90vw)',
      );
    });

    it('当 showClose 为 false 且没有标题时，不渲染头部', async () => {
      await openDialog({ props: { showClose: false } });

      expect(wrapper!.find('.ca-dialog__header').exists()).toBe(false);
    });

    it('存在 footerActions 时应渲染底部区域', async () => {
      await openDialog({
        props: {
          footerActions: [{ key: 'ok', label: '确定' }],
        },
      });

      expect(wrapper!.find('.ca-dialog__footer').exists()).toBe(true);
      expect(wrapper!.find('.ca-dialog__footer').text()).toContain('确定');
    });
  });

  describe('交互与事件处理', () => {
    it('默认点击遮罩层应触发关闭', async () => {
      await openDialog();

      await wrapper!.find('.ca-dialog').trigger('click');

      expect(wrapper!.find('.ca-dialog').exists()).toBe(false);
      expect(wrapper!.emitted('close')).toBeTruthy();
    });

    it('当 closeOnClickOverlay 为 false 时，点击遮罩层不响应关闭', async () => {
      await openDialog({ props: { closeOnClickOverlay: false } });

      await wrapper!.find('.ca-dialog').trigger('click');

      expect(wrapper!.find('.ca-dialog').exists()).toBe(true);
      expect(wrapper!.emitted('close')).toBeFalsy();
    });

    it('点击容器内部内容不应触发遮罩关闭逻辑', async () => {
      await openDialog();

      await wrapper!.find('.ca-dialog__container').trigger('click');

      expect(wrapper!.find('.ca-dialog').exists()).toBe(true);
      expect(wrapper!.emitted('close')).toBeFalsy();
    });

    it('点击右上角关闭按钮能够正常关闭弹窗', async () => {
      await openDialog();

      await wrapper!.find('.ca-dialog__close-btn').trigger('click');

      expect(wrapper!.find('.ca-dialog').exists()).toBe(false);
      expect(wrapper!.emitted('close')).toBeTruthy();
    });

    it('按下 Esc 键能够关闭弹窗', async () => {
      await openDialog();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await wrapper!.vm.$nextTick();

      expect(wrapper!.find('.ca-dialog').exists()).toBe(false);
      expect(wrapper!.emitted('close')).toBeTruthy();
    });

    it('当 closeOnPressEscape 为 false 时，Esc 不关闭弹窗', async () => {
      await openDialog({ props: { closeOnPressEscape: false } });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await wrapper!.vm.$nextTick();

      expect(wrapper!.find('.ca-dialog').exists()).toBe(true);
      expect(wrapper!.emitted('close')).toBeFalsy();
    });

    it('点击 footerActions 应触发回调与 action 事件，并可按配置关闭弹窗', async () => {
      const onClick = vi.fn();
      const action: CaDialogAction = {
        key: 'confirm',
        label: '确定',
        closeOnClick: true,
        onClick,
      };

      await openDialog({ props: { footerActions: [action] } });

      await wrapper!.find('.ca-dialog__footer button').trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(wrapper!.emitted('action')?.[0]?.[0]).toMatchObject({ key: 'confirm' });
      expect(wrapper!.find('.ca-dialog').exists()).toBe(false);
    });
  });

  describe('滚动锁定与局部挂载', () => {
    it('全局模式下打开弹窗应锁定页面滚动，关闭后恢复', async () => {
      await openDialog();

      expect(document.body.style.overflow).toBe('hidden');

      (wrapper!.vm as unknown as CaDialogExpose).close();
      await wrapper!.vm.$nextTick();

      expect(document.body.style.overflow).toBe('');
    });

    it('局部挂载时添加 is-local 类且不锁定页面滚动', async () => {
      const target = document.createElement('div');
      document.body.appendChild(target);

      await openDialog({ props: { appendTo: target } });

      expect(wrapper!.find('.ca-dialog').classes()).toContain('is-local');
      expect(document.body.style.overflow).toBe('');

      document.body.removeChild(target);
    });

    it('打开状态下卸载组件应恢复页面滚动', async () => {
      await openDialog();
      expect(document.body.style.overflow).toBe('hidden');

      wrapper!.unmount();
      wrapper = null;

      expect(document.body.style.overflow).toBe('');
    });

    it('卸载组件时应移除键盘监听器', async () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      await openDialog();
      wrapper!.unmount();
      wrapper = null;

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeSpy.mockRestore();
    });

    it('多个弹窗同时打开时，应在全部关闭后才恢复页面滚动', async () => {
      wrapper = mountDialog({ props: { visible: true } });
      const second = mountDialog({ props: { visible: true, title: '第二个弹窗' } });
      await wrapper.vm.$nextTick();
      await second.vm.$nextTick();

      expect(document.body.style.overflow).toBe('hidden');

      wrapper.unmount();
      wrapper = null;

      expect(document.body.style.overflow).toBe('hidden');

      second.unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Slots 插槽渲染', () => {
    it('正确渲染 header、默认与 footer 插槽', async () => {
      wrapper = mountDialog({
        props: { visible: true },
        slots: {
          header: '<div class="custom-header">自定义标题</div>',
          default: '<div class="custom-content">自定义主体内容</div>',
          footer: '<div class="custom-footer">自定义底部</div>',
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.custom-header').text()).toBe('自定义标题');
      expect(wrapper.find('.custom-content').text()).toBe('自定义主体内容');
      expect(wrapper.find('.custom-footer').text()).toBe('自定义底部');
    });
  });
});
