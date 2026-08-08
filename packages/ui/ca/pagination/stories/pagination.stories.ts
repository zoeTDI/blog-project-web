import { CaPagination } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'Component/Pagination',
  component: CaPagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`CaPagination\` 分页器组件，用于长列表或大数据集的分页展示与控制。

### 特性
- 支持双向绑定 \`v-model\`（当前页码）。
- 支持配置最大可见页码数 \`maxPage\`，自动生成省略号。
- 点击省略号区域可快速展开数字输入框，直接跳转指定页码。
- 支持开启 \`quick\` 模式，快速跳转至首页或末页。
        `,
      },
    },
  },
  argTypes: {
    modelValue: {
      control: { type: 'number', min: 1 },
      description: '当前选中页码（支持 v-model 双向绑定）',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    quick: {
      control: 'boolean',
      description: '是否开启快速跳转到第一页/最后一页的快捷按钮',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxPage: {
      control: { type: 'number', step: 1, min: 1 },
      description: '最多显示的页码块数量（超过该值会自动以省略号形式折叠）',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    total: {
      control: { type: 'number', step: 1, min: 0 },
      description: '总页数',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onChange: {
      description: '页码改变时触发的回调函数',
      table: {
        type: { summary: '(cur: number, total: number) => void' },
      },
    },
  },
  args: {
    quick: false,
    maxPage: 5,
    total: 20,
  },
} satisfies Meta<typeof CaPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基础分页场景：展示常用页码切换及折叠省略号 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '基础的分页器，展示页码按钮、上一页/下一页，点击省略号可直接输入页码跳转。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    maxPage: 5,
    total: 20,
  },
  render: (args) => ({
    components: { CaPagination },
    setup() {
      const model = ref(1);
      const handleChange = (cur: number, totalPages: number) => {
        model.value = cur;
        console.log('Page change:', cur, totalPages);
      };
      return { args, model, handleChange };
    },
    template: `
      <div style="display: inline-block">
        <CaPagination v-bind="args" v-model="model" @change="handleChange" />
      </div>
    `,
  }),
};

/** 快速跳转场景：包含跳转至首页/末页按钮 */
export const Quick: Story = {
  parameters: {
    docs: {
      description: {
        story: '开启 `quick` 选项，可在左右两侧增加快速跳转至第一页/最后一页的按钮。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    quick: true,
    maxPage: 5,
    total: 20,
  },
  render: (args) => ({
    components: { CaPagination },
    setup() {
      const model = ref(5);
      const handleChange = (cur: number) => {
        model.value = cur;
      };
      return { args, model, handleChange };
    },
    template: `
      <div style="display: inline-block">
        <CaPagination v-bind="args" v-model="model" @change="handleChange" />
      </div>
    `,
  }),
};

/** 较少页数场景：总页数小于等于 maxPage，不出现省略号 */
export const FewPages: Story = {
  parameters: {
    docs: {
      description: {
        story: '当总页数 `total` 小于等于 `maxPage` 时，直接列出所有页码，不显示省略号。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    quick: false,
    maxPage: 5,
    total: 4,
  },
  render: (args) => ({
    components: { CaPagination },
    setup() {
      const model = ref(1);
      return { args, model };
    },
    template: `
      <div style="display: inline-block">
        <CaPagination v-bind="args" v-model="model" />
      </div>
    `,
  }),
};