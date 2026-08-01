// heatmap.stories.ts
import { CaHeatmap } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { HeatmapData } from './types.ts';

// ---------- 工具函数 ----------
function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 生成指定年份全年的随机热力图数据（每天一条，count 0~12） */
function generateYearData(year: number): HeatmapData {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const result: HeatmapData = {};
  let id = 1;
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateStr = formatDate(currentDate);
    result[dateStr] = {
      id: id++,
      date: dateStr,
      count: getRandomInt(0, 12),
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
}

// ---------- 默认数据 ----------
const defaultYear = 2025;
const defaultData = generateYearData(defaultYear);

// ---------- Meta 配置 ----------
const meta = {
  title: 'Component/Heatmap',
  component: CaHeatmap,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
贡献热力图（日历热力图），用于可视化展示按日期分布的数据密度（如打卡次数、提交量、活动参与度等）。

**主要特性**  
- 自适应容器宽度，响应式布局  
- 支持自定义颜色分级（通过 \`levelBy\` 控制阈值）  
- 悬浮显示详情 Tooltip（可自定义内容）  
- 支持加载状态和年份切换  
- 自动生成月份标签和图例

**使用场景**  
GitHub 贡献图、用户活跃度分析、项目提交日历等。
        `,
      },
    },
  },
  argTypes: {
    year: {
      description: '当前显示的年份，支持双向绑定（`update:year` 事件）',
      control: { type: 'number', min: 2000, max: 2100, step: 1 },
      table: { defaultValue: { summary: '当前年份' } },
    },
    data: {
      description: '热力图数据，键为 `YYYY-MM-DD` 格式的日期，值为包含 `count` 字段的对象',
      control: false,
      table: { type: { summary: 'Record<string, HeatmapValue>' } },
    },
    rate: {
      description: '宽高比（`height / rate` 为实际高度），若为 `null` 则使用 `height` 固定值',
      control: { type: 'number', min: 0.1, max: 3, step: 0.1 },
      table: { defaultValue: { summary: 'null' } },
    },
    height: {
      description: 'SVG 高度（像素），当 `rate` 为 `null` 时生效',
      control: { type: 'number', min: 100, max: 600, step: 10 },
      table: { defaultValue: { summary: 240 } },
    },
    bottomHeight: {
      description: '底部区域占高度的百分比（用于显示月份标签和图例）',
      control: { type: 'number', min: 1, max: 50, step: 1 },
      table: { defaultValue: { summary: 25 } },
    },
    firstDayOfWeek: {
      description: '每周起始日，0 = 周日，1 = 周一',
      control: { type: 'select', options: [0, 1] },
      table: { defaultValue: { summary: 1 } },
    },
    levelBy: {
      description: '颜色分级阈值数组（4 个数值），分别对应级别 1~4 的上限，超过第 4 个阈值归为级别 5',
      control: { type: 'object' },
      table: { defaultValue: { summary: '[3, 5, 10, 15]' } },
    },
    loading: {
      description: '是否显示加载遮罩',
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    weekdayFormat: {
      description: '星期标签格式，`full` / `short` / `numeric` / `chinese`',
      control: { type: 'select', options: ['full', 'short', 'numeric', 'chinese'] },
      table: { defaultValue: { summary: 'short' } },
    },
    customWeekdayLabels: {
      description: '自定义星期标签映射，键为 1~7（1=周一），值为显示文本',
      control: { type: 'object' },
      table: { defaultValue: { summary: '{}' } },
    },
  },
  args: {
    year: defaultYear,
    data: defaultData,
    rate: null,
    height: 240,
    bottomHeight: 25,
    firstDayOfWeek: 1,
    levelBy: [3, 5, 10, 15],
    loading: false,
    weekdayFormat: 'short',
    customWeekdayLabels: {},
  },
} satisfies Meta<typeof CaHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------- Stories ----------

/** 基础用法，展示默认样式和交互 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '使用 2025 年全年随机数据，周起始日为周一，星期缩写为英文短格式。悬停格子可查看详情。',
      },
    },
  },
};

/** 自定义分级阈值，调整颜色映射敏感度 */
export const CustomLevels: Story = {
  args: {
    levelBy: [2, 5, 9, 15],
  },
  parameters: {
    docs: {
      description: {
        story: '将阈值设为 `[2, 5, 9, 15]`，使低值区域颜色更浅，高值区域更突出。',
      },
    },
  },
};

/** 周起始日改为周日 */
export const SundayFirst: Story = {
  args: {
    firstDayOfWeek: 0,
  },
  parameters: {
    docs: {
      description: {
        story: '设置 `firstDayOfWeek=0`，每周从周日开始排列。',
      },
    },
  },
};

/** 中文星期简写 */
export const ChineseWeekdays: Story = {
  args: {
    weekdayFormat: 'chinese',
  },
  parameters: {
    docs: {
      description: {
        story: '使用 `weekdayFormat="chinese"` 显示“周一”～“周日”中文标签。',
      },
    },
  },
};

/** 加载状态 */
export const Loading: Story = {
  args: {
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '开启加载遮罩，适用于数据异步获取场景。',
      },
    },
  },
};

/** 自定义 Tooltip 插槽，展示额外字段 */
export const CustomTip: Story = {
  render: (args) => ({
    components: { CaHeatmap },
    setup() {
      return { args };
    },
    template: `
      <CaHeatmap v-bind="args">
        <template #tip="{ data }">
          <div style="background: #1e293b; color: #f1f5f9; padding: 8px 14px; border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,0.25); font-size: 13px; line-height: 1.6;">
            <div><strong>{{ data.date }}</strong></div>
            <div>活跃度：{{ data.count }} 次</div>
            <div style="opacity:0.7; font-size:12px;">ID: {{ data.id }}</div>
          </div>
        </template>
      </CaHeatmap>
    `,
  }),
  args: {
    // 沿用默认 args
  },
  parameters: {
    docs: {
      description: {
        story: '通过 `#tip` 插槽自定义浮层内容，可以访问 `data` 对象中的所有字段。',
      },
    },
  },
};