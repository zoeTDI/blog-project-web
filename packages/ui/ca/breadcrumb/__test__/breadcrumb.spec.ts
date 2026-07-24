import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { h, markRaw } from 'vue';
import CaBreadcrumb from '../src/Breadcrumb.vue';
import type { CaBreadcrumbItem } from '../src/types';

describe('CaBreadcrumb.vue', () => {
  let wrapper: VueWrapper<any> | null = null;

  // 测试数据定义
  const mockItems: CaBreadcrumbItem[] = [
    { label: '首页', to: '/' },
    { label: '系统管理', to: '/system' },
    { label: '用户列表', to: '/system/user' },
  ];

  // 使用 markRaw 包裹虚拟图标组件，防止 Vue 抛出响应式性能警告
  const dummyIcon = markRaw({
    render: () => h('svg', { class: 'dummy-icon' }),
  });

  beforeEach(() => {
    wrapper = null;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  describe('基础渲染与 Props', () => {
    it('当 items 长度不大于 1 时不渲染 ol 节点', () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: [{ label: '首页' }],
        },
      });

      expect(wrapper.find('nav').exists()).toBe(true);
      expect(wrapper.find('ol').exists()).toBe(false);
    });

    it('当 items 包含多个数据项时能够正确渲染面包屑列表与分隔符', () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: mockItems,
        },
      });

      const listItems = wrapper.findAll('li');
      expect(listItems.length).toBe(mockItems.length);

      // 验证文本渲染
      expect(listItems[0].text()).toContain('首页');
      expect(listItems[1].text()).toContain('系统管理');
      expect(listItems[2].text()).toContain('用户列表');

      // 验证分隔符图标渲染（末尾项不渲染分隔符）
      const separators = wrapper.findAll('.ca-breadcrumb__suffix');
      expect(separators.length).toBe(mockItems.length - 1);
    });

    it('默认偏好设置 (preferences) 校验与显示控制', () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: mockItems,
        },
      });

      // 验证默认 enable 为 true，nav 正常渲染
      expect(wrapper.find('nav').exists()).toBe(true);
    });

    it('当 preferences.enable 为 false 时整体不渲染 nav', () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: mockItems,
          preferences: {
            enable: false,
          },
        },
      });

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('渲染前缀图标 (prefixIcon) 与后缀图标 (suffixIcon)', () => {
      const itemsWithIcons: CaBreadcrumbItem[] = [
        { label: '首页', prefixIcon: dummyIcon },
        { label: '设置', suffixIcon: dummyIcon },
      ];

      wrapper = mount(CaBreadcrumb, {
        props: {
          items: itemsWithIcons,
        },
      });

      // 检查前缀与后缀图标组件是否按配置渲染
      expect(wrapper.find('.ca-breadcrumb__icon').exists()).toBe(true);
      expect(wrapper.findAll('.dummy-icon').length).toBe(2);
    });
  });

  describe('交互与事件处理', () => {
    it('点击面包屑项时能够触发 click 事件并传递对应的 item 和 index 参数', async () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: mockItems,
        },
      });

      const listItems = wrapper.findAll('.ca-breadcrumb__text');

      // 点击第二个数据项（索引 1）
      await listItems[1].trigger('click');

      // 校验 emit 事件触发及参数正确性
      const clickEmits = wrapper.emitted('click');
      expect(clickEmits).toBeTruthy();
      expect(clickEmits).toHaveLength(1);
      expect(clickEmits![0]).toEqual([mockItems[1], 1]);
    });
  });

  describe('响应性变化校验', () => {
    it('当 items 属性响应式更新时视图能实时刷新', async () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: mockItems,
        },
      });

      expect(wrapper.findAll('li').length).toBe(3);

      // 动态更新 items 增加一项
      const updatedItems = [
        ...mockItems,
        { label: '新增节点' },
      ];
      await wrapper.setProps({ items: updatedItems });

      expect(wrapper.findAll('li').length).toBe(4);
      expect(wrapper.findAll('li')[3].text()).toContain('新增节点');
    });
  });

  describe('边界条件测试', () => {
    it('处理未传 items 或传入空数组场景', () => {
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: [],
        },
      });

      expect(wrapper.find('nav').exists()).toBe(true);
      expect(wrapper.find('ol').exists()).toBe(false);
    });

    it('支持渲染包含超长文本与特殊字符的 label', () => {
      const longLabel = 'A'.repeat(200) + ' <script>alert(1)</script>';
      wrapper = mount(CaBreadcrumb, {
        props: {
          items: [
            { label: longLabel },
            { label: '正常节点' },
          ],
        },
      });

      const textNode = wrapper.find('.ca-breadcrumb__text');
      expect(textNode.text()).toContain(longLabel);
      // Vue 自动转义 XSS，防止 Script 注入执行
      expect(wrapper.html()).not.toContain('<script>');
    });
  });
});