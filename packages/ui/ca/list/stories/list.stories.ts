import { CaList, CaListItem } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/List',
  component: CaList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
          列表组件，由 CaList 容器与 CaListItem 列表项组成。支持三种模式（有序 ordered / 圆点 bullet / 无标识 plain）、标题（title）、自定义指针（cursor），列表项提供默认插槽与 prefix / suffix 前后缀插槽。
        `,
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['ordered', 'bullet', 'plain'],
      description: '列表模式：有序 / 圆点 / 无标识',
    },
    title: {
      control: 'text',
      description: '列表标题，为空时不渲染',
    },
  },
  args: {
    mode: 'plain',
    title: '',
  },
} satisfies Meta<typeof CaList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------- 基础列表 ----------
export const Default: Story = {
  parameters: {
    docs: { description: { story: '默认 plain 模式的基础列表。可在 Controls 面板切换 mode / title。' } },
  },
  render: (args) => ({
    components: { CaList, CaListItem },
    setup() {
      return { args };
    },
    template: `
      <CaList v-bind="args">
        <CaListItem>第一项内容</CaListItem>
        <CaListItem>第二项内容</CaListItem>
        <CaListItem>第三项内容</CaListItem>
      </CaList>
    `,
  }),
};

// ---------- 有序列表 ----------
export const Ordered: Story = {
  parameters: {
    docs: { description: { story: 'ordered 模式渲染为 ol，条目按数字编号。' } },
  },
  render: () => ({
    components: { CaList, CaListItem },
    template: `
      <CaList mode="ordered" title="上线任务清单">
        <CaListItem>需求评审</CaListItem>
        <CaListItem>技术方案设计</CaListItem>
        <CaListItem>开发与联调</CaListItem>
        <CaListItem>灰度发布</CaListItem>
      </CaList>
    `,
  }),
};

// ---------- 圆点列表 ----------
export const Bullet: Story = {
  parameters: {
    docs: { description: { story: 'bullet 模式在条目左侧渲染主题色圆点标识。' } },
  },
  render: () => ({
    components: { CaList, CaListItem },
    template: `
      <CaList mode="bullet" title="特性亮点">
        <CaListItem>支持 TypeScript 类型提示</CaListItem>
        <CaListItem>响应式布局，适配移动端</CaListItem>
        <CaListItem>主题色随全局变量切换</CaListItem>
      </CaList>
    `,
  }),
};

// ---------- 指针类型 ----------
export const Cursors: Story = {
  parameters: {
    docs: { description: { story: '通过 cursor 属性控制列表项的鼠标指针，悬停查看效果。' } },
  },
  render: () => ({
    components: { CaList, CaListItem },
    template: `
      <CaList>
        <CaListItem cursor="pointer">pointer（可点击）</CaListItem>
        <CaListItem cursor="text">text（文本选择）</CaListItem>
        <CaListItem cursor="not-allowed">not-allowed（禁用）</CaListItem>
        <CaListItem cursor="default">default（默认）</CaListItem>
      </CaList>
    `,
  }),
};

// ---------- 前后缀插槽 ----------
export const WithSlots: Story = {
  parameters: {
    docs: { description: { story: '通过 prefix / suffix 插槽放置头像、徽标等内容，默认插槽支持多行富文本结构。' } },
  },
  render: () => ({
    components: { CaList, CaListItem },
    template: `
      <CaList title="消息通知">
        <CaListItem>
          <template #prefix>
            <span style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #409eff; color: #fff; font-size: 12px;">系</span>
          </template>
          <div>
            <div style="font-weight: 600;">系统通知</div>
            <div style="font-size: 12px; color: #909399;">你的账号已通过审核</div>
          </div>
          <template #suffix>
            <span style="font-size: 12px; color: #909399;">12:30</span>
          </template>
        </CaListItem>
        <CaListItem>
          <template #prefix>
            <span style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #67c23a; color: #fff; font-size: 12px;">评</span>
          </template>
          <div>
            <div style="font-weight: 600;">评论提醒</div>
            <div style="font-size: 12px; color: #909399;">有人回复了你的评论</div>
          </div>
          <template #suffix>
            <span style="background: #f56c6c; color: #fff; font-size: 12px; border-radius: 8px; padding: 1px 6px;">2</span>
          </template>
        </CaListItem>
        <CaListItem>
          <template #prefix>
            <span style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #e6a23c; color: #fff; font-size: 12px;">赞</span>
          </template>
          <div>
            <div style="font-weight: 600;">点赞提醒</div>
            <div style="font-size: 12px; color: #909399;">你的文章获得了 20 个赞</div>
          </div>
          <template #suffix>
            <span style="font-size: 12px; color: #909399;">昨天</span>
          </template>
        </CaListItem>
      </CaList>
    `,
  }),
};
