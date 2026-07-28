import { CaCheckbox } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

const meta = {
  title: 'Component/Checkbox',
  component: CaCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基础复选框组件。可独立使用，支持文本标签设置、尺寸控制、选中/禁用状态控制以及双向绑定。',
      },
    },
  },
  argTypes: {
    label: {
      description: '复选框展示的文本',
      control: 'text',
    },
    value: {
      description: '复选框绑定对应的值',
      control: 'object',
    },
    size: {
      description: '尺寸',
      control: 'select',
      options: ['S', 'M', 'L'],
    },
    checked: {
      description: '是否勾选（只读/非响应式使用场景）',
      control: 'boolean',
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean',
    },
    onChange: {
      description: '值改变时触发的回调，参数为 (checked, value)',
      action: 'change',
    },
  },
  args: {
    label: 'Label',
    value: 'Value',
    size: 'M',
    checked: false,
    disabled: false,
    onChange: fn(),
  },
} satisfies Meta<typeof CaCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '默认基础形态。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaCheckbox },
    setup() {
      return { args };
    },
    template: `
      <CaCheckbox v-bind="args" :label="args.label" :value="args.value" />
    `,
  }),
};

export const Size: Story = {
  parameters: {
    docs: {
      description: {
        story: '不同尺寸的复选框，包含 `S`、`M`、`L` 三种选项。',
      },
      source: {
        type: 'code',
      },
    },
  },
  render: (args) => ({
    components: { CaCheckbox },
    setup() {
      return { args };
    },
    template: `
      <CaCheckbox label="Size S" value="S" size="S" />
      <CaCheckbox label="Size M" value="M" size="M" />
      <CaCheckbox label="Size L" value="L" size="L" />
    `,
  }),
};

export const CheckedByProps: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过直接向 Props 传入 `checked` 字段控制默认勾选状态。',
      },
      source: {
        type: 'code',
      },
    },
  },
  render: (args) => ({
    components: { CaCheckbox },
    setup() {
      return { args };
    },
    template: `
      <CaCheckbox label="Checked: true" :value="'default checked'" checked />
      <CaCheckbox label="Checked: false" :value="'not default checked'" />
    `,
  }),
};

export const CheckedByData: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过响应式数据 `v-model` 来绑定多个独立复选框，驱动默认勾选状态。',
      },
      source: {
        type: 'code',
      },
    },
  },
  render: (args) => ({
    components: { CaCheckbox },
    setup() {
      const data = ref([1, 2, 3]);
      return { args, data };
    },
    template: `
      <div>Data: {{ JSON.stringify(data.value) }}</div>
      <div>
        <CaCheckbox v-model="data" v-for="i in 5" :key="i" :label="'Value ' + i" :value="i" />
      </div>
    `,
  }),
};

export const ChangeEvent: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过绑定 `@change` 事件监听勾选状态改变。回调函数接收两个参数：`(checked: boolean, value: CheckboxValueType)`。',
      },
      source: {
        code: {
          type: 'code',
        },
      },
    },
  },
  args: {
    label: '触发 Change 事件',
    value: 'event-value',
    onChange: fn(), // 配合 Storybook Actions 面板自动记录
  },
  render: (args) => ({
    components: { CaCheckbox },
    setup() {
      const lastChecked = ref<boolean | null>(null);
      const lastValue = ref<any>('');

      const onChange = (checked: boolean, value: any) => {
        lastChecked.value = checked;
        lastValue.value = value;
        // 同时触发 storybook 传入的 action 打印到 Actions 面板
        if (args.onChange) {
          args.onChange(checked, value);
        }
      };

      return { args, onChange, lastChecked, lastValue };
    },
    template: `
      <div>
        <CaCheckbox
          v-bind="args"
          :label="args.label"
          :value="args.value"
          @change="onChange"
        />
        <div style="margin-top: 12px; font-size: 14px; color: #666;">
          <div><b>选中状态 (checked):</b> {{ lastChecked !== null ? lastChecked : '未选择' }}</div>
          <div><b>绑定值 (value):</b> {{ lastValue || '未选择' }}</div>
        </div>
      </div>
    `,
  }),
};
