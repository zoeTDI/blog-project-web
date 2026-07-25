import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CaSelect, CaSelectOption, CaSelectGroup } from '../index';

const meta = {
  title: 'Component/Select',
  component: CaSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaSelect (选择器组件)**

原生风格的下拉选择器，支持选项分组、多种尺寸、禁用状态等。下拉菜单通过 Teleport 挂载到 \`body\`，避免被父容器样式裁剪。

### 核心功能
* **选项分组**：通过 \`CaSelectGroup\` 组件实现分组展示。
* **多种尺寸**：支持 \`S\`、\`M\`、\`L\` 三种尺寸。
* **禁用状态**：整体禁用选择器。
* **智能定位**：自动根据视口空间调整下拉菜单展开方向（上方/下方）。
* **防裁剪**：下拉菜单独立挂载，不受父容器 \`overflow:hidden\` 影响。
        `,
      },
    },
  },
  argTypes: {
    size: {
      description: '选择器尺寸',
      control: 'select',
      options: ['S', 'M', 'L'],
      table: {
        defaultValue: { summary: 'M' },
      },
    },
    placeholder: {
      description: '占位文本',
      control: 'text',
      table: {
        defaultValue: { summary: 'Select' },
      },
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    modelValue: {
      description: '当前选中的值（v-model）',
      control: false,
    },
  },
  args: {
    size: 'M',
    placeholder: '请选择',
    disabled: false,
  },
} satisfies Meta<typeof CaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的选择器用法，通过 `v-model` 绑定选中值。',
      },
    },
  },
  render: (args) => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <div style="width: 240px;">
        <CaSelect v-model="value" v-bind="args">
          <CaSelectOption value="apple" label="苹果" />
          <CaSelectOption value="banana" label="香蕉" />
          <CaSelectOption value="orange" label="橙子" />
          <CaSelectOption value="grape" label="葡萄" />
        </CaSelect>
        <p style="margin-top: 8px; font-size: 14px; color: #666;">
          当前选中值: <strong>{{ value || '无' }}</strong>
        </p>
      </div>
    `,
  }),
};

/**
 * 不同尺寸
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `size` 属性可切换选择器的尺寸：`S`（小）、`M`（中）、`L`（大）。',
      },
    },
  },
  render: () => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const valueS = ref('');
      const valueM = ref('');
      const valueL = ref('');
      return { valueS, valueM, valueL };
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
        <div style="width: 180px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">尺寸 S</p>
          <CaSelect v-model="valueS" size="S" placeholder="小号">
            <CaSelectOption value="1" label="选项一" />
            <CaSelectOption value="2" label="选项二" />
          </CaSelect>
        </div>
        <div style="width: 180px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">尺寸 M (默认)</p>
          <CaSelect v-model="valueM" size="M" placeholder="中号">
            <CaSelectOption value="1" label="选项一" />
            <CaSelectOption value="2" label="选项二" />
          </CaSelect>
        </div>
        <div style="width: 180px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">尺寸 L</p>
          <CaSelect v-model="valueL" size="L" placeholder="大号">
            <CaSelectOption value="1" label="选项一" />
            <CaSelectOption value="2" label="选项二" />
          </CaSelect>
        </div>
      </div>
    `,
  }),
};

/**
 * 禁用状态
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `disabled` 属性即可禁用选择器，无法进行任何交互。',
      },
    },
  },
  render: () => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const value = ref('apple');
      return { value };
    },
    template: `
      <div style="width: 240px;">
        <CaSelect v-model="value" disabled placeholder="已禁用">
          <CaSelectOption value="apple" label="苹果" />
          <CaSelectOption value="banana" label="香蕉" />
        </CaSelect>
        <p style="margin-top: 8px; font-size: 14px; color: #999;">
          当前值: {{ value }}
        </p>
      </div>
    `,
  }),
};

/**
 * 选项分组
 */
export const Grouping: Story = {
  parameters: {
    docs: {
      description: {
        story: '使用 `CaSelectGroup` 组件对选项进行分组，组名会以标签形式展示。',
      },
    },
  },
  render: () => ({
    components: { CaSelect, CaSelectOption, CaSelectGroup },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <div style="width: 260px;">
        <CaSelect v-model="value" placeholder="请选择水果或蔬菜">
          <CaSelectGroup label="水果">
            <CaSelectOption value="apple" label="苹果" />
            <CaSelectOption value="banana" label="香蕉" />
            <CaSelectOption value="orange" label="橙子" />
          </CaSelectGroup>
          <CaSelectGroup label="蔬菜">
            <CaSelectOption value="tomato" label="番茄" />
            <CaSelectOption value="potato" label="土豆" />
            <CaSelectOption value="cucumber" label="黄瓜" />
          </CaSelectGroup>
        </CaSelect>
        <p style="margin-top: 8px; font-size: 14px; color: #666;">
          当前选中值: <strong>{{ value || '无' }}</strong>
        </p>
      </div>
    `,
  }),
};

/**
 * 受控与事件监听
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `v-model` 实现双向绑定，同时可监听 `@update:modelValue` 事件（或直接在模板中使用 `v-model` 表达式）。',
      },
    },
  },
  render: () => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const value = ref('');
      const lastSelected = ref('无');

      const handleChange = (newVal: any) => {
        lastSelected.value = newVal || '无';
      };

      const resetSelection = () => {
        value.value = '';
      };

      return { value, lastSelected, handleChange, resetSelection };
    },
    template: `
      <div style="width: 260px;">
        <CaSelect v-model="value" @update:model-value="handleChange" placeholder="选择一项">
          <CaSelectOption value="a" label="选项 A" />
          <CaSelectOption value="b" label="选项 B" />
          <CaSelectOption value="c" label="选项 C" />
        </CaSelect>
        <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 14px; color: #666;">当前值: <strong>{{ value || '无' }}</strong></span>
          <span style="font-size: 14px; color: #666;">上次选中: <strong>{{ lastSelected }}</strong></span>
          <button @click="resetSelection" style="padding: 4px 12px; cursor: pointer;">重置</button>
        </div>
      </div>
    `,
  }),
};

/**
 * 防裁剪演示（带 overflow:hidden 容器）
 */
export const PreventClipping: Story = {
  parameters: {
    docs: {
      description: {
        story: '即使选择器位于 `overflow: hidden` 的父容器内，下拉菜单也能完整展示（挂载到 `body`）。对比普通绝对定位会被裁剪的情况。',
      },
    },
  },
  render: () => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <div>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          下方虚线框内是一个 <code>overflow: hidden</code> 的容器，但下拉菜单不会被裁剪。
        </p>
        <div style="
          position: relative;
          width: 260px;
          height: 80px;
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 16px;
          overflow: hidden;
          background: #fafafa;
        ">
          <CaSelect v-model="value" placeholder="点击展开下拉">
            <CaSelectOption value="1" label="选项一（长文本测试）" />
            <CaSelectOption value="2" label="选项二" />
            <CaSelectOption value="3" label="选项三" />
          </CaSelect>
        </div>
        <p style="margin-top: 8px; font-size: 14px; color: #666;">
          当前选中: <strong>{{ value || '无' }}</strong>
        </p>
      </div>
    `,
  }),
};