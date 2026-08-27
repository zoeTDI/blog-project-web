import { CaInput } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { RssIcon, TagIcon, UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline';

const meta = {
  title: 'Component/Input',
  component: CaInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
          基础输入框组件，支持文本、密码、数字三种类型，内置清空、前后缀、字数统计、尺寸及圆角定制。
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'number', 'password'],
      description: '输入框类型',
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
      description: '尺寸规格',
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    prefix: { control: 'object', description: '前置内容，可为字符串或 Vue 组件' },
    suffix: { control: 'object', description: '后置内容，可为字符串或 Vue 组件' },
    radius: { control: 'number', description: '圆角大小（px）' },
    border: { control: 'boolean' },
    length: { control: { type: 'number', min: 1, step: 1 }, description: '文本/密码最大长度' },
    showCounter: { control: 'boolean', description: '是否显示字数统计' },
    counterFormatter: { control: 'object', description: '自定义字数格式化函数' },
    max: { control: 'number', description: '数字最大值' },
    min: { control: 'number', description: '数字最小值' },
  },
  args: {
    type: 'text',
    disabled: false,
    readonly: false,
    clearable: true,
    size: 'M',
    radius: 0,
    border: true,
    showCounter: false,
  },
} satisfies Meta<typeof CaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------- 基础文本输入 ----------
export const Default: Story = {
  parameters: {
    docs: { description: { story: '默认文本输入框，带清空和前后缀占位。' } },
  },
  args: {
    prefix: 'Prefix',
    suffix: 'Suffix',
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 图标前后缀 ----------
export const WithIcon: Story = {
  parameters: {
    docs: { description: { story: '使用 Heroicons 作为前后缀图标。' } },
  },
  args: {
    prefix: RssIcon,
    suffix: TagIcon,
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 密码类型 ----------
export const Password: Story = {
  parameters: {
    docs: { description: { story: '密码输入框，输入内容会被遮掩。' } },
  },
  args: {
    type: 'password',
    prefix: LockClosedIcon,
    suffix: undefined,
    length: 20,
    showCounter: true,
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 数字输入（带范围） ----------
export const NumberWithRange: Story = {
  parameters: {
    docs: { description: { story: '数字输入框，限定最小值和最大值。' } },
  },
  args: {
    type: 'number',
    min: 0,
    max: 100,
    prefix: 'Age',
    clearable: true,
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 字数统计 ----------
export const WithCounter: Story = {
  parameters: {
    docs: { description: { story: '文本输入框显示字数统计，超出限制时计数变红。' } },
  },
  args: {
    length: 10,
    showCounter: true,
    suffix: undefined,
    prefix: 'Comment',
    clearable: true,
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 自定义字数格式化 ----------
export const CustomCounter: Story = {
  parameters: {
    docs: { description: { story: '通过 `counterFormatter` 自定义显示文案。' } },
  },
  args: {
    length: 20,
    showCounter: true,
    counterFormatter: (current: number, max: number) => `${current} / ${max} 字符`,
    prefix: 'Bio',
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};

// ---------- 三种尺寸 ----------
export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'S、M、L 三种尺寸对比。' } },
  },
  render: () => ({
    components: { CaInput },
    setup: () => ({
      sizes: ['S', 'M', 'L'] as const,
    }),
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <CaInput v-for="size in sizes" :key="size" v-model="size" :size="size" placeholder="Size" />
      </div>
    `,
  }),
};

// ---------- 禁用与只读 ----------
export const DisabledAndReadonly: Story = {
  parameters: {
    docs: { description: { story: '禁用和只读状态，清空按钮在只读时不可用。' } },
  },
  render: () => ({
    components: { CaInput },
    setup: () => ({
      disabledVal: 'Disabled',
      readonlyVal: 'Readonly',
    }),
    template: `
      <div style="display: flex; gap: 16px; flex-direction: column; max-width: 300px;">
        <CaInput v-model="disabledVal" disabled placeholder="Disabled" />
        <CaInput v-model="readonlyVal" readonly placeholder="Readonly" />
      </div>
    `,
  }),
};

// ---------- 事件演示 ----------
export const Emits: Story = {
  parameters: {
    docs: { description: { story: '监听 change、input、focus、blur、clear 事件，打开控制台查看输出。' } },
  },
  args: {
    prefix: UserIcon,
    suffix: TagIcon,
  },
  render: (args) => ({
    components: { CaInput },
    setup() {
      const handleChange = (val: string) => console.log('change:', val);
      const handleInput = (val: string) => console.log('input:', val);
      const handleFocus = (e: FocusEvent) => console.log('focus:', e);
      const handleBlur = (e: FocusEvent) => console.log('blur:', e);
      const handleClear = () => console.log('clear');
      return { args, handleChange, handleInput, handleFocus, handleBlur, handleClear };
    },
    template: `
      <CaInput
        v-bind="args"
        @change="handleChange"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @clear="handleClear"
      />
    `,
  }),
};

// ---------- 全功能示例 ----------
export const FullFeatured: Story = {
  parameters: {
    docs: { description: { story: '综合展示：图标前缀 + 数字类型 + 范围限制 + 圆角。' } },
  },
  args: {
    type: 'number',
    prefix: UserIcon,
    suffix: 'years',
    min: 18,
    max: 99,
    radius: 8,
    clearable: true,
    size: 'L',
  },
  render: (args) => ({
    components: { CaInput },
    setup: () => ({ args }),
    template: `<CaInput v-bind="args" />`,
  }),
};