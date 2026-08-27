import { enableAutoUnmount, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import CaCascader from '../src/Cascader.vue';
import type { CascaderOption } from '../src/types';

enableAutoUnmount(afterEach);

const options: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'yuhang', label: '余杭', disabled: true },
        ],
      },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    disabled: true,
    children: [{ value: 'nanjing', label: '南京' }],
  },
];

const customFieldOptions: CascaderOption[] = [
  {
    id: 1,
    name: '前端',
    items: [{ id: 11, name: 'Vue' }],
  },
];

const openMenu = async (wrapper: VueWrapper) => {
  await wrapper.get('.ca-cascader__trigger').trigger('click');
  await nextTick();
};

const getDropdown = () => document.body.querySelector<HTMLElement>('.ca-cascader__dropdown');

const getOptions = () => (
  Array.from(document.body.querySelectorAll<HTMLElement>('.ca-cascader__option'))
);

const clickOption = async (index: number) => {
  getOptions()[index].click();
  await nextTick();
};

const clickMore = async (index: number) => {
  const icons = document.body.querySelectorAll<HTMLElement>('.ca-cascader__icon--more');
  icons[index].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await nextTick();
};

describe('CaCascader 单选模式', () => {
  it('使用默认配置正常渲染', () => {
    const wrapper = mount(CaCascader);
    const input = wrapper.get('input');

    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'ca-cascader',
      'ca-cascader--size-M',
      'ca-cascader--direction-right',
    ]));
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('disabled')).toBeUndefined();
    expect(input.element.value).toBe('');
    expect(getDropdown()).toBeNull();
    expect(wrapper.props()).toMatchObject({
      multiple: false,
      checkStrictly: false,
      collapseTags: false,
      maxCollapseTags: 1,
    });
  });

  it('根据初始路径显示完整标签并生成对应层级面板', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
      },
    });

    expect(wrapper.get('input').element.value).toBe('浙江 / 杭州 / 西湖');

    await openMenu(wrapper);

    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(3);
    expect(document.body.querySelectorAll('.ca-cascader__option.is-active')).toHaveLength(3);
  });

  it('逐级导航并在选择叶子节点后提交路径和关闭面板', async () => {
    const wrapper = mount(CaCascader, {
      props: { options },
    });

    await openMenu(wrapper);
    await clickOption(0);
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(2);
    expect(wrapper.emitted('change')).toBeUndefined();

    await clickOption(3);

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [['zhejiang', 'ningbo']],
    ]);
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['zhejiang', 'ningbo']);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual([
      options[0],
      options[0].children[1],
    ]);
    expect(wrapper.get('input').element.value).toBe('浙江 / 宁波');
    expect(getDropdown()).toBeNull();
  });

  it('开启 changeOnSelect 后允许提交非叶子节点且保持面板打开', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        changeOnSelect: true,
      },
    });

    await openMenu(wrapper);
    await clickOption(0);

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [['zhejiang']],
    ]);
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['zhejiang'],
      [options[0]],
    ]);
    expect(wrapper.get('input').element.value).toBe('浙江');
    expect(getDropdown()).not.toBeNull();
  });

  it('禁用组件时不打开面板', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        disabled: true,
      },
    });

    await openMenu(wrapper);

    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    expect(getDropdown()).toBeNull();
  });

  it('禁用选项不会导航或触发选择事件', async () => {
    const wrapper = mount(CaCascader, {
      props: { options },
    });

    await openMenu(wrapper);
    await clickOption(1);

    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(getDropdown()).not.toBeNull();
  });

  it('清空当前路径并派发 change 和 clear 事件', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
        clearable: true,
      },
    });

    await wrapper.get('.ca-cascader__icon--clear').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]]);
    expect(wrapper.emitted('change')?.[0]).toEqual([[], []]);
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.get('input').element.value).toBe('');
    expect(wrapper.find('.ca-cascader__icon--clear').exists()).toBe(false);
  });

  it('支持自定义字段映射和路径分隔符', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options: customFieldOptions,
        modelValue: [1, 11],
        splitChar: ' > ',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'items',
        },
      },
    });

    expect(wrapper.get('input').element.value).toBe('前端 > Vue');

    await openMenu(wrapper);
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(2);
    expect(getOptions().map((item) => item.textContent?.trim())).toEqual(['前端', 'Vue']);
  });

  it('响应外部 modelValue 和 options 更新', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        modelValue: ['zhejiang', 'ningbo'],
      },
    });

    expect(wrapper.get('input').element.value).toBe('浙江 / 宁波');

    await wrapper.setProps({ modelValue: ['zhejiang', 'hangzhou', 'yuhang'] });
    expect(wrapper.get('input').element.value).toBe('浙江 / 杭州 / 余杭');

    await wrapper.setProps({ options: [] });
    expect(wrapper.get('input').element.value).toBe('');
  });

  it('面板打开时外部模型更新不会打断当前导航路径', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        modelValue: ['zhejiang', 'hangzhou', 'xihu'],
      },
    });

    await openMenu(wrapper);
    await clickOption(0);
    await clickOption(2);
    expect(wrapper.get('input').element.value).toBe('浙江 / 杭州');

    await wrapper.setProps({ modelValue: ['zhejiang', 'ningbo'] });

    expect(wrapper.get('input').element.value).toBe('浙江 / 杭州');
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(3);

    document.body.click();
    await nextTick();
    expect(wrapper.get('input').element.value).toBe('浙江 / 宁波');
  });

  it('将多选模型归一化为路径集合并以第一条路径初始化导航', () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        modelValue: [
          ['zhejiang', 'ningbo'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ],
      },
    });

    expect(wrapper.findAll('.ca-cascader__tag--label').map((tag) => tag.text())).toEqual([
      '宁波',
      '西湖',
    ]);
  });

  it('点击组件外部时关闭面板并恢复已提交路径', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        modelValue: ['zhejiang', 'ningbo'],
      },
    });

    await openMenu(wrapper);
    await clickOption(0);
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(2);

    document.body.click();
    await nextTick();

    expect(getDropdown()).toBeNull();
    expect(wrapper.get('input').element.value).toBe('浙江 / 宁波');
  });

  it('应用尺寸、占位符和面板宽度配置', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        size: 'L',
        placeholder: '请选择地区',
        optionWidth: '12rem',
      },
    });

    expect(wrapper.classes()).toContain('ca-cascader--size-L');
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择地区');

    await openMenu(wrapper);
    expect(getDropdown()?.classList).toContain('ca-cascader--size-L');
    expect(document.body.querySelector<HTMLElement>('.ca-cascader__panel')?.style.width).toBe('12rem');
  });
});

describe('CaCascader 多选逻辑', () => {
  it('连续选择多个叶子节点且保持面板打开', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
      },
    });

    await openMenu(wrapper);
    await clickMore(0);
    await clickOption(3);

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      ['zhejiang', 'ningbo'],
    ]);
    expect(getDropdown()).not.toBeNull();

    await clickMore(2);
    await clickOption(4);

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      ['zhejiang', 'ningbo'],
      ['zhejiang', 'hangzhou', 'xihu'],
    ]);
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual([
      [options[0], options[0].children[1]],
      [options[0], options[0].children[0], options[0].children[0].children[0]],
    ]);
    expect(getDropdown()).not.toBeNull();
  });

  it('再次点击已选叶子节点时取消选择', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        modelValue: [['zhejiang', 'ningbo']],
      },
    });

    await openMenu(wrapper);
    await clickMore(0);
    await clickOption(3);

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[], []]);
    expect(getDropdown()).not.toBeNull();
  });

  it('非严格多选模式勾选父节点时选择全部可用叶子并跳过禁用后代', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
      },
    });

    await openMenu(wrapper);
    const rootCheckbox = document.body.querySelector<HTMLInputElement>('.ca-cascader__checkbox')!;
    rootCheckbox.click();
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      ['zhejiang', 'hangzhou', 'xihu'],
      ['zhejiang', 'ningbo'],
    ]);
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(1);

    rootCheckbox.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([]);
  });

  it('展开箭头只改变导航层级而不修改选中值', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
      },
    });

    await openMenu(wrapper);
    await clickMore(0);

    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(2);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('严格多选模式允许独立选择和取消父节点', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        checkStrictly: true,
      },
    });

    await openMenu(wrapper);
    await clickOption(0);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      ['zhejiang'],
    ]);

    await clickOption(0);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([]);
    expect(getDropdown()).not.toBeNull();
  });

  it('多选清空时提交空路径集合', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        clearable: true,
        modelValue: [
          ['zhejiang', 'ningbo'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ],
      },
    });

    await wrapper.get('.ca-cascader__icon--clear').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[], []]);
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('渲染复选框并展示选中与半选状态', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        modelValue: [['zhejiang', 'ningbo']],
      },
    });

    await openMenu(wrapper);

    const firstPanel = document.body.querySelector('.ca-cascader__panel')!;
    const rootCheckboxes = firstPanel.querySelectorAll<HTMLInputElement>('.ca-cascader__checkbox');
    expect(rootCheckboxes).toHaveLength(2);
    expect(rootCheckboxes[0].checked).toBe(false);
    expect(rootCheckboxes[0].indeterminate).toBe(true);
    expect(rootCheckboxes[1].disabled).toBe(true);

    await clickMore(0);
    const checkboxes = document.body.querySelectorAll<HTMLInputElement>('.ca-cascader__checkbox');
    expect(checkboxes[3].checked).toBe(true);
    expect(getOptions()[3].classList).toContain('is-selected');
  });

  it('使用标签展示多选结果并支持折叠和单项删除', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        collapseTags: true,
        maxCollapseTags: 1,
        modelValue: [
          ['zhejiang', 'ningbo'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ],
      },
    });

    expect(wrapper.findAll('.ca-cascader__tag--label')).toHaveLength(1);
    expect(wrapper.get('.ca-cascader__tag--label').text()).toBe('宁波');
    expect(wrapper.get('.ca-cascader__tag--collapsed').text()).toBe('+1');
    expect(wrapper.get('.ca-cascader__tag').attributes('title')).toBe('浙江 / 宁波');

    await wrapper.get('.ca-cascader__tag--remove').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      ['zhejiang', 'hangzhou', 'xihu'],
    ]);
    expect(wrapper.get('.ca-cascader__tag--label').text()).toBe('西湖');
    expect(wrapper.find('.ca-cascader__tag--collapsed').exists()).toBe(false);
  });

  it('无选中项时显示多选占位文本', () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        placeholder: '请选择多个地区',
      },
    });

    expect(wrapper.get('.ca-cascader__placeholder').text()).toBe('请选择多个地区');
    expect(wrapper.find('input[type="text"]').exists()).toBe(false);
  });

  it('响应外部多选模型更新并刷新标签', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
        modelValue: [['zhejiang', 'ningbo']],
      },
    });

    await wrapper.setProps({
      modelValue: [
        ['zhejiang', 'hangzhou', 'xihu'],
        ['zhejiang', 'ningbo'],
      ],
    });

    expect(wrapper.findAll('.ca-cascader__tag--label').map((tag) => tag.text())).toEqual([
      '西湖',
      '宁波',
    ]);
  });

  it('关闭并重新打开面板后保留已选路径状态', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options,
        multiple: true,
      },
    });

    await openMenu(wrapper);
    await clickMore(0);
    await clickOption(3);
    await wrapper.get('.ca-cascader__trigger').trigger('click');
    expect(getDropdown()).toBeNull();

    await openMenu(wrapper);
    const checkboxes = document.body.querySelectorAll<HTMLInputElement>('.ca-cascader__checkbox');
    expect(document.body.querySelectorAll('.ca-cascader__panel')).toHaveLength(2);
    expect(checkboxes[3].checked).toBe(true);
  });

  it('多选模式支持自定义字段映射', async () => {
    const wrapper = mount(CaCascader, {
      props: {
        options: customFieldOptions,
        multiple: true,
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'items',
        },
      },
    });

    await openMenu(wrapper);
    document.body.querySelector<HTMLInputElement>('.ca-cascader__checkbox')!.click();
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([[1, 11]]);
    expect(wrapper.get('.ca-cascader__tag--label').text()).toBe('Vue');
  });
});
