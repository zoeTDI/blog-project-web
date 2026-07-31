import { ref } from 'vue';
import { CaCascader } from '../index';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

// 模拟测试数据
const mockOptions = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'yuhang', label: '余杭区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [{ value: 'haishu', label: '海曙区' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [{ value: 'gulou', label: '鼓楼区' }],
      },
    ],
  },
];

// 自定义字段映射数据示例
const customFieldOptions = [
  {
    id: '100',
    name: '电子产品',
    subList: [
      { id: '101', name: '手机' },
      { id: '102', name: '电脑' },
    ],
  },
  {
    id: '200',
    name: '服装',
    subList: [{ id: '201', name: '男装' }],
  },
];

const meta = {
  title: 'Component/Cascader',
  component: CaCascader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### 级联选择器 (Cascader)

级联选择器用于在一个多层级的数据集中进行分级选择，例如省市区联动、商品多级分类等。

#### 特性
- **标准 BEM 规范**：支持与主题系统的样式融合。
- **三种尺寸**：支持 \`S\` | \`M\` | \`L\` 尺寸。
- **Teleport 挂载**：弹窗自动 Teleport 至 \`body\` 下，不受父级容器 \`overflow: hidden\` 截断。
- **防越界响应**：自动识别视口边距，灵活切换展开方向。
- **灵活的选择模式**：支持默认的“单选叶子节点”以及 \`changeOnSelect\`（选择任意一级）。
- **字段自定义**：支持通过 \`fieldNames\` 映射非标准结构的后台数据。
`,
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'object',
      description: '双向绑定的选中值（节点 key/value 的数组路径）',
      table: {
        type: { summary: 'CascaderValue[]' },
        defaultValue: { summary: '[]' },
      },
    },
    options: {
      control: 'object',
      description: '可选项数据源',
      table: {
        type: { summary: 'CascaderOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
      description: '组件尺寸大小',
      table: {
        type: { summary: "'S' | 'M' | 'L'" },
        defaultValue: { summary: "'M'" },
      },
    },
    placeholder: {
      control: 'text',
      description: '未选择时的占位提示文本',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'请选择'" },
      },
    },
    splitChar: {
      control: 'text',
      description: '展示路径的分隔符',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "' / '" },
      },
    },
    optionWidth: {
      control: 'number',
      description: '每一列下拉面板的宽度（像素 px 或 CSS 宽度字符串）',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '180' },
      },
    },
    changeOnSelect: {
      control: 'boolean',
      description: '是否允许选择任意一级节点（若为 false，则只能选择末尾叶子节点）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description: '是否显示一键清空图标按钮',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用组件',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fieldNames: {
      control: 'object',
      description: '自定义 label / value / children / disabled 字段名称映射',
      table: {
        type: { summary: 'Partial<CascadeFieldName>' },
        defaultValue: { summary: "{ label: 'label', value: 'value', children: 'children', disabled: 'disabled' }" },
      },
    },
  },
  args: {
    options: mockOptions,
    placeholder: '请选择城市',
    size: 'M',
    splitChar: ' / ',
    optionWidth: 180,
    changeOnSelect: false,
    disabled: false,
    clearable: true,
  },
} satisfies Meta<typeof CaCascader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **基础用法**
 * 演示 \`v-model\` 绑定与基础树状数据选择。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最常见的级联选择器用法。可以通过 Storybook 控件控制面板交互。',
      },
    },
  },
  args: {
    options: mockOptions,
  },
  render: (args) => ({
    components: { CaCascader },
    setup() {
      const value = ref(['zhejiang', 'hangzhou', 'xihu']);
      return { args, value };
    },
    template: `
      <div style="padding-bottom: 220px;">
        <CaCascader v-bind="args" v-model="value" />
        <div style="margin-top: 16px; font-size: 14px; color: #666;">
          当前选中路径值 (v-model): <code>{{ value }}</code>
        </div>
      </div>
    `,
  }),
};

/**
 * **尺寸变体 (Sizes)**
 * 支持 \`S\`、\`M\`、\`L\` 三种尺寸，适应紧凑表单或大屏高亮场景。
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `size` 属性为 `S`、`M` 或 `L` 可以调整输入框与下拉项的大小。',
      },
    },
  },
  render: (args) => ({
    components: { CaCascader },
    setup() {
      const valS = ref([]);
      const valM = ref(['zhejiang', 'hangzhou']);
      const valL = ref([]);
      return { args, valS, valM, valL };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start; padding-bottom: 220px;">
        <div>
          <span style="display: inline-block; width: 60px; font-size: 13px;">Small:</span>
          <CaCascader v-bind="args" size="S" v-model="valS" placeholder="Small size" />
        </div>
        <div>
          <span style="display: inline-block; width: 60px; font-size: 13px;">Medium:</span>
          <CaCascader v-bind="args" size="M" v-model="valM" placeholder="Medium size" />
        </div>
        <div>
          <span style="display: inline-block; width: 60px; font-size: 13px;">Large:</span>
          <CaCascader v-bind="args" size="L" v-model="valL" placeholder="Large size" />
        </div>
      </div>
    `,
  }),
};

/**
 * **选择任意一级 (changeOnSelect)**
 * 设置 \`changeOnSelect\` 为 \`true\` 后，点击非末尾节点也可以直接进行选中与提交。
 */
export const ChangeOnSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: '开启 `changeOnSelect` 后，允许选择任意一级父节点，而无需选到最末尾的叶子节点。',
      },
    },
  },
  args: {
    changeOnSelect: true,
  },
  render: (args) => ({
    components: { CaCascader },
    setup() {
      const value = ref(['zhejiang']);
      return { args, value };
    },
    template: `
      <div style="padding-bottom: 220px;">
        <CaCascader v-bind="args" v-model="value" />
        <div style="margin-top: 16px; font-size: 14px; color: #666;">
          当前选中路径值 (v-model): <code>{{ value }}</code>
        </div>
      </div>
    `,
  }),
};

/**
 * **自定义字段名称 (fieldNames)**
 * 后台接口数据字段名称不同时，可通过 \`fieldNames\` 属性进行映射配置。
 */
export const CustomFields: Story = {
  parameters: {
    docs: {
      description: {
        story: '当数据结构的键名不为默认的 `label`, `value`, `children` 时（例如为 `name`, `id`, `subList`），传入 `fieldNames` 自定义字段配置。',
      },
    },
  },
  args: {
    options: customFieldOptions,
    fieldNames: {
      label: 'name',
      value: 'id',
      children: 'subList',
    },
  },
  render: (args) => ({
    components: { CaCascader },
    setup() {
      const value = ref(['100', '101']);
      return { args, value };
    },
    template: `
      <div style="padding-bottom: 220px;">
        <CaCascader v-bind="args" v-model="value" />
        <div style="margin-top: 16px; font-size: 14px; color: #666;">
          当前选中路径值 (v-model): <code>{{ value }}</code>
        </div>
      </div>
    `,
  }),
};

/**
 * **禁用状态 (Disabled)**
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `disabled` 属性为 `true` 禁用选择器。',
      },
    },
  },
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { CaCascader },
    setup() {
      const value = ref(['zhejiang', 'hangzhou']);
      return { args, value };
    },
    template: `
      <CaCascader v-bind="args" v-model="value" />
    `,
  }),
};