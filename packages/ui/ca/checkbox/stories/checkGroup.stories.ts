import { CaCheckboxGroup, CaCheckbox } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'Component/CheckboxGroup',
  component: CaCheckboxGroup,
  subcomponents: { CaCheckbox },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '复选框组组件，用于组合管理多个 CaCheckbox。支持响应式双向绑定（v-model）、批量禁用、控制组件尺寸以及设置最少/最多勾选数量。',
      },
    },
  },
  argTypes: {
    disabled: {
      description: '是否禁用整个复选框组',
      control: 'boolean',
    },
    size: {
      description: '复选框组中子组件的尺寸',
      control: 'select',
      options: ['S', 'M', 'L'],
    },
    min: {
      description: '至少选择的数量',
      control: {
        type: 'number',
        step: 1,
      },
      table: {
        type: { summary: 'number' },
      },
    },
    max: {
      description: '最多选择的数量',
      control: {
        type: 'number',
        step: 1,
      },
      table: {
        type: { summary: 'number' },
      },
    },
  },
  args: {
    disabled: false,
    size: 'M',
  },
} satisfies Meta<typeof CaCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '基础复选框组用法。使用 `v-model` 绑定选中项数组。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaCheckboxGroup, CaCheckbox },
    setup() {
      const selected = ref<number[]>([]);
      return { args, selected };
    },
    template: `
      <div>Selected: {{ JSON.stringify(selected) }}</div>
      <CaCheckboxGroup v-model="selected" v-bind="args">
        <CaCheckbox v-for="i in 5" :key="i" :label="'Value ' + i" :value="i" />
      </CaCheckboxGroup>
    `,
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `disabled` 为 `true` 可以禁用整个复选框组及其所有子项。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { CaCheckboxGroup, CaCheckbox },
    setup() {
      const selected = ref<number[]>([]);
      return { args, selected };
    },
    template: `
      <div>Selected: {{ JSON.stringify(selected) }}</div>
      <CaCheckboxGroup v-model="selected" v-bind="args">
        <CaCheckbox v-for="i in 5" :key="i" :label="'Value ' + i" :value="i" />
      </CaCheckboxGroup>
    `,
  }),
};

export const MinAndMax: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `min` 和 `max` 控制可勾选的数量区间（例如：最少选择 1 个，最多选择 3 个）。达到限制时剩余选项会被自动禁用。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    min: 1,
    max: 3,
  },
  render: (args) => ({
    components: { CaCheckboxGroup, CaCheckbox },
    setup() {
      const selected = ref<number[]>([1]);
      return { args, selected };
    },
    template: `
      <div>Selected: {{ JSON.stringify(selected) }}</div>
      <CaCheckboxGroup v-model="selected" v-bind="args">
        <CaCheckbox v-for="i in 5" :key="i" :label="'Value ' + i" :value="i" />
      </CaCheckboxGroup>
    `,
  }),
};

export const CheckedByData: Story = {
  parameters: {
    docs: {
      description: {
        story: '可以通过向绑定数组赋初始值来指定默认勾选的项（例如初始选中 [1, 2, 4]）。',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaCheckboxGroup, CaCheckbox },
    setup() {
      const selected = ref<number[]>([1, 2, 4]);
      return { args, selected };
    },
    template: `
      <div>Selected: {{ JSON.stringify(selected) }}</div>
      <CaCheckboxGroup v-model="selected" v-bind="args">
        <CaCheckbox v-for="i in 5" :key="i" :label="'Value ' + i" :value="i" />
      </CaCheckboxGroup>
    `,
  }),
};

export const ChangeEventEquivalence: Story = {
  parameters: {
    description: {
      story: '演示在 `<CaCheckboxGroup>` 上直接监听 `@change` 与在每个子组件 `<CaCheckbox>` 上分别监听 `@change` 的等价效果。`CaCheckboxGroup` 会在子组件触发选择时透传转发 `(checked, value)` 参数。',
    },
    source: {
      code: {
        type: 'code',
      },
    },
  },
  render: () => ({
    components: { CaCheckboxGroup, CaCheckbox },
    setup() {
      const groupLogs = ref<string[]>([]);
      const itemLogs = ref<string[]>([]);

      // CaCheckboxGroup 抛出的 change 事件有两个重载签名
      const handleGroupChange = (...args: any[]) => {
        if (args.length === 2) {
          const [checked, value] = args;
          groupLogs.value.unshift(`Group 收到 -> checked: ${checked}, value: ${value}`);
        }
      };

      const handleItemChange = (checked: boolean, value: any) => {
        itemLogs.value.unshift(`Item 收到 -> checked: ${checked}, value: ${value}`);
      };
      const codeGroup =
        `<CaCheckboxGroup @change="fn">
  <CaCheckbox label="1" :value="1" />
  <CaCheckbox label="2" :value="2" />
  <CaCheckbox label="3" :value="3" />
</CaCheckboxGroup>`;

      const codeItem =
        `<CaCheckboxGroup>
  <CaCheckbox label="1" :value="1" @change="fn" />
  <CaCheckbox label="2" :value="2" @change="fn" />
  <CaCheckbox label="3" :value="3" @change="fn" />
</CaCheckboxGroup>`;
      return {
        groupLogs,
        itemLogs,
        handleGroupChange,
        handleItemChange,
        codeGroup,
        codeItem,
      };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: stretch;">
        <!-- 方式 A：Group 监听 -->
        <div
          style="flex: 1; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">方式 A：Group 上统一绑定 @change</div>
            <pre
              style="background: #f3f4f6; padding: 10px; border-radius: 6px; font-size: 12px; font-family: monospace; overflow-x: auto; margin-bottom: 16px; color: #374151;">{{ codeGroup }}</pre>

            <div style="margin-bottom: 12px;">
              <CaCheckboxGroup @change="handleGroupChange">
                <CaCheckbox label="1" :value="1" />
                <CaCheckbox label="2" :value="2" />
                <CaCheckbox label="3" :value="3" />
              </CaCheckboxGroup>
            </div>
          </div>

          <div
            style="padding: 8px 12px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; font-size: 13px;">
            <div style="font-weight: 600; color: #4b5563; margin-bottom: 4px;">日志输出：</div>
            <div v-if="groupLogs.length === 0" style="color: #9ca3af; font-style: italic;">暂无触发记录</div>
            <div v-for="(log, i) in groupLogs.slice(0, 3)" :key="i" style="color: #10b981; font-family: monospace;">
              {{ log }}
            </div>
          </div>
        </div>

        <!-- 方式 B：Item 独立监听 -->
        <div
          style="flex: 1; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">方式 B：每个 Child 独立绑定 @change</div>
            <pre
              style="background: #f3f4f6; padding: 10px; border-radius: 6px; font-size: 12px; font-family: monospace; overflow-x: auto; margin-bottom: 16px; color: #374151;">{{ codeItem }}</pre>

            <div style="margin-bottom: 12px;">
              <CaCheckboxGroup>
                <CaCheckbox label="1" :value="1" @change="handleItemChange" />
                <CaCheckbox label="2" :value="2" @change="handleItemChange" />
                <CaCheckbox label="3" :value="3" @change="handleItemChange" />
              </CaCheckboxGroup>
            </div>
          </div>

          <div
            style="padding: 8px 12px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; font-size: 13px;">
            <div style="font-weight: 600; color: #4b5563; margin-bottom: 4px;">日志输出：</div>
            <div v-if="itemLogs.length === 0" style="color: #9ca3af; font-style: italic;">暂无触发记录</div>
            <div v-for="(log, i) in itemLogs.slice(0, 3)" :key="i" style="color: #10b981; font-family: monospace;">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};