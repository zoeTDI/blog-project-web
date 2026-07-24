import { CaAvatar, DotPositionOption } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Avatar',
  component: CaAvatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CaAvatar 头像组件，支持自定义尺寸、圆角、错误图回退机制以及角标（Dot）的状态指示与数字显示。',
      },
    },
  },
  argTypes: {
    // 基础属性控制
    url: {
      control: 'text',
      description: '头像图片 URL 地址',
      table: {
        type: { summary: 'string' },
      },
    },
    errorUrl: {
      control: 'text',
      description: '图片加载失败时的占位图 URL',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Panda' },
      },
    },
    alt: {
      control: 'text',
      description: '图像替代文本',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: { type: 'range', min: 24, max: 200, step: 4 },
      description: '头像组件的宽高尺寸 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '80' },
      },
    },
    radius: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
      description: '圆角百分比 (%)(如 50 为圆形，0 为正方形)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '50' },
      },
    },
    // Dot 角标相关控制
    showDot: {
      control: 'boolean',
      description: '是否显示角标',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideLargeNumber: {
      control: 'boolean',
      description: '角标数字超过 99 时是否隐藏并显示为 99+',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dots: {
      control: 'object',
      description: '角标配置项（对象或数组），支持位置、颜色及文字内容',
      table: {
        type: { summary: 'DotConfig | DotConfig[]' },
        defaultValue: { summary: '[]' },
      },
    },
  },
  args: {
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    alt: 'User Avatar',
    size: 80,
    radius: 50,
    showDot: false,
    hideLargeNumber: false,
  },

} satisfies Meta<typeof CaAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认基础用法
 */
export const Default: Story = {
  args: {},
};

/**
 * 不同形状与圆角展示
 */
export const Shapes: Story = {
  render: (args) => ({
    components: { CaAvatar },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 20px; align-items: center;">
        <CaAvatar :url="args.url" v-bind="args" :radius="50" alt="圆形" />
        <CaAvatar :url="args.url" v-bind="args" :radius="20" alt="圆角矩形" />
        <CaAvatar :url="args.url" v-bind="args" :radius="0" alt="正方形" />
      </div>
    `,
  }),
};

/**
 * 不同尺寸展示
 */
export const Sizes: Story = {
  render: (args) => ({
    components: { CaAvatar },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 20px; align-items: flex-end;">
        <CaAvatar :url="args.url" v-bind="args" :size="40" />
        <CaAvatar :url="args.url" v-bind="args" :size="64" />
        <CaAvatar :url="args.url" v-bind="args" :size="96" />
        <CaAvatar :url="args.url" v-bind="args" :size="128" />
      </div>
    `,
  }),
};

/**
 * 角标（Status Dot）不同颜色与位置示例
 */
export const StatusDots: Story = {
  args: {
    showDot: true,
  },
  render: (args) => ({
    components: { CaAvatar },
    setup() {
      const topGreen = { position: DotPositionOption.topRight, color: 'green' };
      const bottomRed = { position: DotPositionOption.bottomRight, color: 'red' };
      const bottomYellow = { position: DotPositionOption.bottomRight, color: 'yellow' };
      const customHex = { position: DotPositionOption.bottomRight, color: '#8b5cf6' };
      return { args, topGreen, bottomRed, bottomYellow, customHex };
    },
    template: `
      <div style="display: flex; gap: 20px; align-items: center;">
        <CaAvatar :url="args.url" v-bind="args" :dots="topGreen" />
        <CaAvatar :url="args.url" v-bind="args" :dots="bottomRed" />
        <CaAvatar :url="args.url" v-bind="args" :dots="bottomYellow" />
        <CaAvatar :url="args.url" v-bind="args" :dots="customHex" />
      </div>
    `,
  }),
};

/**
 * 带有数字/文字内容的角标（带 99+ 逻辑控制）
 */
export const DotWithContent: Story = {
  args: {
    showDot: true,
    hideLargeNumber: true,
  },
  render: (args) => ({
    components: { CaAvatar },
    setup() {
      const singleDigit = { position: DotPositionOption.topRight, color: 'red', content: 5 };
      const doubleDigit = { position: DotPositionOption.topRight, color: 'red', content: 99 };
      const overflowNumber = { position: DotPositionOption.topRight, color: 'red', content: 120 };
      const textContent = { position: DotPositionOption.bottomRight, color: 'green', content: 'NEW' };
      return { args, singleDigit, doubleDigit, overflowNumber, textContent };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <CaAvatar :url="args.url" v-bind="args" :dots="singleDigit" />
        <CaAvatar :url="args.url" v-bind="args" :dots="doubleDigit" />
        <CaAvatar :url="args.url" v-bind="args" :dots="overflowNumber" />
        <CaAvatar :url="args.url" v-bind="args" :dots="textContent" />
      </div>
    `,
  }),
};

/**
 * 多角标同时展示示例（右上与右下）
 */
export const MultipleDots: Story = {
  args: {
    showDot: true,
    dots: [
      { position: DotPositionOption.topRight, color: 'red', content: 99 },
      { position: DotPositionOption.bottomRight, color: 'green' },
    ],
  },
};

/**
 * 图片加载失败与回退机制示例
 */
export const ImageErrorFallback: Story = {
  args: {
    url: 'https://invalid-image-url.com/not-exist.png',
    errorUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Panda',
    alt: 'Error Fallback Avatar',
  },
};