import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import CaTextarea from '../src/Textarea.vue';

describe('CaTextarea.vue', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  it('uses percentage dimensions once and lets inner elements fill their parent', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        width: '100%',
        height: '100%',
      },
    });

    const fieldStyle = wrapper.attributes('style');

    expect(fieldStyle).toContain('width: 100%');
    expect(fieldStyle).toContain('height: 100%');
    expect(fieldStyle).toContain('--ca-inner-width: 100%');
    expect(fieldStyle).toContain('--ca-inner-height: 100%');
    expect(fieldStyle).not.toContain('calc(100%');
  });

  it('accepts zero as an explicit numeric dimension', () => {
    const wrapper = mount(CaTextarea, {
      props: {
        width: 0,
        height: 0,
      },
    });

    expect(wrapper.attributes('style')).toContain('width: 0px');
    expect(wrapper.attributes('style')).toContain('height: 0px');
  });
});
