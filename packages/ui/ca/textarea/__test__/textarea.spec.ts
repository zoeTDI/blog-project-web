import { mount } from '@vue/test-utils';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import CaTextarea from '../src/Textarea.vue';

let resizeCallback!: ResizeObserverCallback;

const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

const triggerResize = (element: HTMLTextAreaElement, width: number, height: number) => {
  element.getBoundingClientRect = vi.fn(() => ({
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }));

  resizeCallback([
    { target: element } as ResizeObserverEntry,
  ], {} as ResizeObserver);
};

describe('CaTextarea.vue', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('使用默认属性正常渲染', () => {
    const wrapper = mount(CaTextarea);
    const textarea = wrapper.get('textarea');

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'ca-field',
      'ca-field--size-M',
      'is-border',
    ]));
    expect(wrapper.attributes('style')).toContain('width: auto');
    expect(wrapper.attributes('style')).toContain('height: auto');
    expect(textarea.attributes('rows')).toBeUndefined();
    expect(textarea.attributes('cols')).toBeUndefined();
    expect(textarea.attributes('disabled')).toBeUndefined();
    expect(textarea.attributes('readonly')).toBeUndefined();
    expect(observe).toHaveBeenCalledWith(textarea.element);
  });

  it('将有效的原生属性传递给 textarea', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        rows: 6,
        cols: 40,
        minlength: 2,
        maxlength: 20,
        disabled: true,
        readonly: true,
      },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes()).toMatchObject({
      rows: '6',
      cols: '40',
      minlength: '2',
      maxlength: '20',
      disabled: '',
      readonly: '',
    });
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'is-disabled',
      'is-readonly',
    ]));
  });

  it('忽略非正数 rows 和 cols', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        rows: 0,
        cols: -1,
      },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('rows')).toBeUndefined();
    expect(textarea.attributes('cols')).toBeUndefined();
  });

  it('更新 v-model 并透传 input 和 change 事件', async () => {
    const wrapper = mount(CaTextarea, {
      props: {
        modelValue: '初始内容',
      },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.element.value).toBe('初始内容');

    await textarea.setValue('更新内容');
    expect(wrapper.emitted('update:modelValue')).toEqual([['更新内容']]);
    expect(wrapper.emitted('input')?.[0]?.[0]).toBe('更新内容');
    expect(wrapper.emitted('input')?.[0]?.[1]).toBeInstanceOf(Event);

    await textarea.trigger('change');
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('更新内容');
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event);
  });

  it('在聚焦和失焦时更新状态并派发事件', async () => {
    const wrapper = mount(CaTextarea);
    const textarea = wrapper.get('textarea');

    await textarea.trigger('focus');
    expect(wrapper.classes()).toContain('is-focus');
    expect(wrapper.emitted('focus')).toHaveLength(1);

    await textarea.trigger('blur');
    expect(wrapper.classes()).not.toContain('is-focus');
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('显示字数统计并根据长度更新错误状态', async () => {
    const wrapper = mount(CaTextarea, {
      props: {
        modelValue: '',
        minlength: 2,
        maxlength: 5,
      },
    });

    expect(wrapper.get('.ca-field__count').text().replace(/\s/g, '')).toBe('2/0/5');
    expect(wrapper.classes()).toContain('is-length-error');

    await wrapper.setProps({ modelValue: '测试' });
    expect(wrapper.get('.ca-field__count').text().replace(/\s/g, '')).toBe('2/2/5');
    expect(wrapper.classes()).not.toContain('is-length-error');

    await wrapper.setProps({ modelValue: '超过最大长度' });
    expect(wrapper.classes()).toContain('is-length-error');
  });

  it('应用尺寸、圆角和 resize 相关配置', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        width: 320,
        height: 180,
        radius: 8,
        size: 'L',
        resize: true,
        horizontal: true,
        vertical: true,
      },
    });
    const style = wrapper.attributes('style');

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'ca-field--size-L',
      'is-radius',
      'is-resize',
      'is-horizontal',
      'is-vertical',
    ]));
    expect(style).toContain('width: 320px');
    expect(style).toContain('height: 180px');
    expect(style).toContain('--ca-inner-width: 100%');
    expect(style).toContain('--ca-inner-height: 100%');
    expect(style).toContain('--ca-radius: 8px');
  });

  it('百分比尺寸只计算一次并让内部元素填满父级', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        width: '100%',
        height: '100%',
      },
    });
    const style = wrapper.attributes('style');

    expect(style).toContain('width: 100%');
    expect(style).toContain('height: 100%');
    expect(style).toContain('--ca-inner-width: 100%');
    expect(style).toContain('--ca-inner-height: 100%');
    expect(style).not.toContain('calc(100%');
  });

  it('接受数值 0 作为明确尺寸', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        width: 0,
        height: 0,
      },
    });

    expect(wrapper.attributes('style')).toContain('width: 0px');
    expect(wrapper.attributes('style')).toContain('height: 0px');
  });

  it('拖拽后同步 textarea 和外层尺寸', async () => {
    const wrapper = mount(CaTextarea, {
      props: {
        resize: true,
        size: 'M',
      },
    });
    const textarea = wrapper.get('textarea').element;

    triggerResize(textarea, 100, 50);
    triggerResize(textarea, 120, 70);
    await nextTick();

    const style = wrapper.attributes('style');
    expect(style).toContain('width: 134px');
    expect(style).toContain('height: 80px');
    expect(style).toContain('--ca-inner-width: 120px');
    expect(style).toContain('--ca-inner-height: 70px');
  });

  it('卸载时停止监听 textarea 尺寸', () => {
    const wrapper = mount(CaTextarea);
    const textarea = wrapper.get('textarea').element;

    wrapper.unmount();

    expect(unobserve).toHaveBeenCalledWith(textarea);
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
