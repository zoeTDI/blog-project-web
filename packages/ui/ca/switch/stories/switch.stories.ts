import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import CaSwitch from '../src/Switch.vue';
import { CaSwitchMode } from '../src/constants.ts';
import type { CaSwitchOption } from '../src/types.ts';

import {
  Bars3Icon,
  Squares2X2Icon,
  TableCellsIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

/**
 * 示例使用的 Mock 数据选项
 */
const viewModeOptions: CaSwitchOption[] = [
  { label: '列表视图', value: 'list', icon: Bars3Icon },
  { label: '网格视图', value: 'grid', icon: Squares2X2Icon },
  { label: '表格视图', value: 'table', icon: TableCellsIcon },
];

const themeOptions: CaSwitchOption[] = [
  { label: '浅色模式', value: 'light', icon: SunIcon },
  { label: '深色模式', value: 'dark', icon: MoonIcon },
  { label: '跟随系统', value: 'system', icon: ComputerDesktopIcon },
];

/**
 * Storybook 元数据配置 (Meta)
 */
const meta = {
  title: 'Component/Switch',
  component: CaSwitch,
  // 启用自动生成的文档页面 (Autodocs)
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### CaSwitch 分段选择器 / 模式切换器

用于在同一界面的不同视图或模式之间进行快速切换。支持带图标或纯文本/图标混排模式，具有平滑的滑动动画指示块与悬停提示效果。

#### 核心特性：
- **两种展示模式**：图标模式 (\`icon\`) 与 完整模式 (\`full\`)[cite: 1, 2]。
- **三种尺寸**：支持 \`S\`、\`M\`、\`L\` 三种标准尺寸。
- **平滑动画**：动态计算选中块与悬停块的位置及宽度，具备丝滑的过渡动画。
- **自适应响应**：基于 \`ResizeObserver\` 与 \`IntersectionObserver\`，确保在容器变动或延迟加载时指示块位置准确[cite: 2]。
        `,
      },
    },
  },
  // 配置 Controls 面板中各个属性的控件类型与描述信息
  argTypes: {
    options: {
      description: '可选项列表，每一项包含 `value`、`label` 和可选的 `icon` 组件。',
      control: 'object',
      table: {
        type: { summary: 'CaSwitchOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    mode: {
      description: '切换器的展示模式：<br/>- `icon`: 仅展示图标（固定宽高）<br/>- `full`: 展示图标与文本标签',
      control: 'inline-radio',
      options: [CaSwitchMode.ICON, CaSwitchMode.FULL],
      table: {
        type: { summary: `'icon' | 'full'` },
        defaultValue: { summary: CaSwitchMode.ICON },
      },
    },
    size: {
      description: '切换器的尺寸级别，影响整体高度、内边距与图标/字体大小。',
      control: 'select',
      options: ['S', 'M', 'L'],
      table: {
        type: { summary: `'S' | 'M' | 'L'` },
        defaultValue: { summary: 'M' },
      },
    },
    prefix: {
      description: '自定义前缀类名或样式前缀。',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '\'\'' },
      },
    },
  },
  // 默认绑定的全局 Controls 初始参数
  args: {
    mode: CaSwitchMode.ICON,
    size: 'M',
    prefix: '',
    options: viewModeOptions,
  },
} satisfies Meta<typeof CaSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==========================================
// 1. 基础用法 (Default Story)
// ==========================================
/**
 * 基础图标切换模式（默认）。仅展示图标，适合工具栏等紧凑场景。
 */
export const Default: Story = {
  name: '基础图标模式 (Icon Only)',
  parameters: {
    docs: {
      description: {
        story: '默认模式为 `icon`，点击选项时会动态计算高亮滑块的位置并滑动过渡。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwitch },
    setup() {
      // 模拟绑定选中的状态
      const currentView = ref('grid');
      return { args, currentView };
    },
    template: `
      <div>
        <CaSwitch v-bind="args" v-model="currentView" />
        <div style="font-size: 13px; color: #666; margin-top: 12px;">
          当前选中值: <strong>{{ currentView }}</strong>
        </div>
      </div>
    `,
  }),
};

// ==========================================
// 2. 完整图文模式 (Full Mode)
// ==========================================
/**
 * 完整图文模式，同时展示图标与文本 Label。
 */
export const FullMode: Story = {
  name: '完整模式 (Full Mode)',
  parameters: {
    docs: {
      description: {
        story: '设置 `mode="full"` 时，组件会根据文字宽度自适应各选项的宽度，滑块也会随文字宽度调整。',
      },
    },
  },
  args: {
    mode: CaSwitchMode.FULL,
    options: themeOptions,
  },
  render: (args) => ({
    components: { CaSwitch },
    setup() {
      const activeTheme = ref('light');
      return { args, activeTheme };
    },
    template: `
      <div>
        <CaSwitch v-bind="args" v-model="activeTheme" />
        <div style="font-size: 13px; color: #666; margin-top: 12px;">
          当前主题: <strong>{{ activeTheme }}</strong>
        </div>
      </div>
    `,
  }),
};

// ==========================================
// 3. 尺寸对比 (Sizes)
// ==========================================
/**
 * 组件提供 S、M、L 三种尺寸，适应不同的布局排版需求。
 */
export const Sizes: Story = {
  name: '尺寸对比 (Sizes)',
  parameters: {
    docs: {
      description: {
        story: '包含 `S` (26px)、`M` (32px)、`L` (38px) 三种尺寸规格。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwitch },
    setup() {
      const valS = ref('list');
      const valM = ref('grid');
      const valL = ref('table');
      return { args, valS, valM, valL, options: viewModeOptions };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start;">
        <div>
          <div style="font-size: 12px; margin-bottom: 6px; color: #888;">Small (S)</div>
          <CaSwitch v-bind="args" size="S" v-model="valS" :options="options" mode="full" />
        </div>
        <div>
          <div style="font-size: 12px; margin-bottom: 6px; color: #888;">Medium (M - 默认)</div>
          <CaSwitch v-bind="args" size="M" v-model="valM" :options="options" mode="full" />
        </div>
        <div>
          <div style="font-size: 12px; margin-bottom: 6px; color: #888;">Large (L)</div>
          <CaSwitch v-bind="args" size="L" v-model="valL" :options="options" mode="full" />
        </div>
      </div>
    `,
  }),
};

// ==========================================
// 4. 无图标纯文本 (Text Only)
// ==========================================
/**
 * 选项可不传 `icon` 字段，仅展示文本。
 */
export const TextOnly: Story = {
  name: '纯文本模式 (Text Only)',
  parameters: {
    docs: {
      description: {
        story: '当 `options` 中仅包含 `label` 和 `value` 时，可以实现简洁的 Tab 分段切换效果。',
      },
    },
  },
  args: {
    mode: CaSwitchMode.FULL,
    options: [
      { label: '日视图', value: 'day' },
      { label: '周视图', value: 'week' },
      { label: '月视图', value: 'month' },
      { label: '年视图', value: 'year' },
    ],
  },
  render: (args) => ({
    components: { CaSwitch },
    setup() {
      const timeUnit = ref('week');
      return { args, timeUnit };
    },
    template: `
      <CaSwitch v-bind="args" v-model="timeUnit" />
    `,
  }),
};

// ==========================================
// 5. 布尔值 (Boolean Value)
// ==========================================
/**
 * `options` 的 `value` 支持 `boolean` 类型，适用于开/关等二值场景。
 * 初始值为 `false` 时滑块定位、resize 同步等高亮逻辑均正常。
 */
export const BooleanValue: Story = {
  name: '布尔值 (Boolean Value)',
  parameters: {
    docs: {
      description: {
        story: '选项 `value` 为 `true` / `false` 时，选中 `false` 的滑块定位与高亮均正常。',
      },
    },
  },
  args: {
    mode: CaSwitchMode.FULL,
    options: [
      { label: '开启', value: true, icon: CheckIcon },
      { label: '关闭', value: false, icon: XMarkIcon },
    ],
  },
  render: (args) => ({
    components: { CaSwitch },
    setup() {
      // 初始为 false，用于验证 falsy 值下的滑块同步逻辑
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <div>
        <CaSwitch v-bind="args" v-model="enabled" />
        <div style="font-size: 13px; color: #666; margin-top: 12px;">
          当前状态: <strong>{{ enabled ? '开启' : '关闭' }}</strong>
        </div>
      </div>
    `,
  }),
};