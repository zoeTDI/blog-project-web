import { CaRow } from '../index.ts';
import { CaCol } from '../../col/index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Row',
  component: CaRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
          Row 与 Col 组成的 24 栅格布局系统。Row 作为行容器，支持列间距（gap）、水平排列（justify）与垂直对齐（align）；Col 作为列，占据 1~24 的宽度，支持偏移（offset）与排序（push/pull）。
        `,
      },
    },
  },
  argTypes: {
    tag: { control: 'text', description: '渲染的 HTML 标签，默认 div' },
    gap: {
      control: { type: 'number', min: 0 },
      description: '列间距（px），通过 Row 负 margin + Col 内 padding 实现',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'],
      description: '水平排列方式',
    },
    align: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
      description: '垂直对齐方式',
    },
  },
  args: {
    tag: 'div',
    gap: 0,
    justify: 'start',
  },
} satisfies Meta<typeof CaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 演示块通用样式 */
const demoBlockStyle = {
  background: '#409eff',
  color: '#fff',
  textAlign: 'center',
  padding: '8px 0',
  borderRadius: '4px',
} as const;

/** 演示块备用样式（用于区分被移动的列） */
const altBlockStyle = {
  ...demoBlockStyle,
  background: '#67c23a',
} as const;

// ---------- 基础栅格 ----------
export const Default: Story = {
  parameters: {
    docs: { description: { story: '默认 24 栅格，三个 span=8 的列均分行宽。可在 Controls 面板调整 gap / justify / align。' } },
  },
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args, demoBlockStyle };
    },
    template: `
      <CaRow v-bind="args">
        <CaCol :span="8"><div :style="demoBlockStyle">8</div></CaCol>
        <CaCol :span="8"><div :style="demoBlockStyle">8</div></CaCol>
        <CaCol :span="8"><div :style="demoBlockStyle">8</div></CaCol>
      </CaRow>
    `,
  }),
};

// ---------- 列间距 ----------
export const WithGap: Story = {
  parameters: {
    docs: { description: { story: '设置 gap 后，列与列之间产生间距，且行两端与容器边缘保持对齐。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return { demoBlockStyle };
    },
    template: `
      <CaRow :gap="16">
        <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
        <CaCol :span="12"><div :style="demoBlockStyle">12</div></CaCol>
        <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
      </CaRow>
    `,
  }),
};

// ---------- 水平排列 ----------
export const Justify: Story = {
  parameters: {
    docs: { description: { story: '六种 justify 水平排列方式对比，每行三列 span=6，共占 18/24 宽。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return {
        justifies: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'] as const,
        demoBlockStyle,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="j in justifies" :key="j" style="background: #f5f7fa; border-radius: 4px; padding: 8px;">
          <div style="margin-bottom: 8px; font-size: 12px; color: #909399;">justify: {{ j }}</div>
          <CaRow :justify="j">
            <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
            <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
            <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
          </CaRow>
        </div>
      </div>
    `,
  }),
};

// ---------- 垂直对齐 ----------
export const Align: Story = {
  parameters: {
    docs: { description: { story: '三种 align 垂直对齐方式对比，列内容高度不同时效果明显。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return {
        aligns: ['top', 'middle', 'bottom'] as const,
        demoBlockStyle,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="a in aligns" :key="a" style="background: #f5f7fa; border-radius: 4px; padding: 8px;">
          <div style="margin-bottom: 8px; font-size: 12px; color: #909399;">align: {{ a }}</div>
          <CaRow :align="a" style="height: 100px;">
            <CaCol :span="6"><div :style="{ ...demoBlockStyle, height: '30px', lineHeight: '30px', padding: 0 }">30px</div></CaCol>
            <CaCol :span="6"><div :style="{ ...demoBlockStyle, height: '70px', lineHeight: '70px', padding: 0 }">70px</div></CaCol>
            <CaCol :span="6"><div :style="{ ...demoBlockStyle, height: '50px', lineHeight: '50px', padding: 0 }">50px</div></CaCol>
          </CaRow>
        </div>
      </div>
    `,
  }),
};

// ---------- 列偏移 ----------
export const Offset: Story = {
  parameters: {
    docs: { description: { story: '通过 offset 让列向右偏移指定栅格数。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return { demoBlockStyle };
    },
    template: `
      <CaRow>
        <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
        <CaCol :span="6" :offset="6"><div :style="demoBlockStyle">6 / offset 6</div></CaCol>
        <CaCol :span="6"><div :style="demoBlockStyle">6</div></CaCol>
      </CaRow>
    `,
  }),
};

// ---------- 列顺序 ----------
export const PushAndPull: Story = {
  parameters: {
    docs: { description: { story: '通过 push / pull 改变列的位置：第一列向右推 6 格，第二列向左拉 18 格，两列视觉上互换顺序。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return { demoBlockStyle, altBlockStyle };
    },
    template: `
      <CaRow>
        <CaCol :span="18" :push="6"><div :style="demoBlockStyle">span 18 / push 6</div></CaCol>
        <CaCol :span="6" :pull="18"><div :style="altBlockStyle">span 6 / pull 18</div></CaCol>
      </CaRow>
    `,
  }),
};

// ---------- 自定义标签 ----------
export const CustomTag: Story = {
  parameters: {
    docs: { description: { story: '通过 tag 属性将 Row 渲染为 ul、Col 渲染为 li，生成语义化的列表结构。' } },
  },
  render: () => ({
    components: { CaRow, CaCol },
    setup() {
      return { demoBlockStyle };
    },
    template: `
      <CaRow tag="ul" :gap="8" style="list-style: none; margin: 0; padding: 0;">
        <CaCol tag="li" :span="6"><div :style="demoBlockStyle">li 6</div></CaCol>
        <CaCol tag="li" :span="6"><div :style="demoBlockStyle">li 6</div></CaCol>
        <CaCol tag="li" :span="6"><div :style="demoBlockStyle">li 6</div></CaCol>
      </CaRow>
    `,
  }),
};
