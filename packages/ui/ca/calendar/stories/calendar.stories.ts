import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CaCalendar } from '../index.ts';
import type { CaCalendarExpose, TodoData, TodoItem } from '../index.ts';

// Mock Data Generators & Helpers
const MOCK_TASKS = [
  { title: '周报编写', context: '完成本周前端项目进度总结并发送给团队负责人' },
  { title: 'UI 规范', context: '与设计团队对接 Vue 3 组件库的新版设计标尺' },
  { title: '缺陷修复', context: '排查并修复线上反馈的表格排序错乱 Bug' },
  { title: '架构优化', context: '重构全局状态管理逻辑，降低非必要的组件渲染' },
  { title: '技术分享', context: '准备下周团队内部关于前端性能优化的 PPT' },
  { title: '接口对接', context: '与后端确认用户权限校验 API 的参数细节' },
  { title: '文档更新', context: '补充完善新增组件的使用说明与示例代码' },
];

const COLORS = ['#3B82F633', '#22C55E33', '#F59E0B33', '#EF444433', '#A855F733', undefined];

/**
 * Generates mock todo data across a date range
 */
function generateMockTodoData(
  centerDate: Date = new Date(2026, 6, 30),
  daysBefore: number = 7,
  daysAfter: number = 7,
  density: 'sparse' | 'normal' | 'dense' = 'normal',
): TodoData {
  const todoData: TodoData = {};

  const startTime = centerDate.getTime() - daysBefore * 24 * 60 * 60 * 1000;
  const endTime = centerDate.getTime() + daysAfter * 24 * 60 * 60 * 1000;

  for (let time = startTime; time <= endTime; time += 24 * 60 * 60 * 1000) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const chance = density === 'dense' ? 0.95 : density === 'sparse' ? 0.3 : 0.7;

    if (Math.random() < chance) {
      const maxCount = density === 'dense' ? 6 : 3;
      const taskCount = Math.floor(Math.random() * maxCount) + 1;
      const dayTasks: TodoItem[] = [];

      for (let i = 0; i < taskCount; i++) {
        const randomTask = MOCK_TASKS[Math.floor(Math.random() * MOCK_TASKS.length)];
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const numericId = year * 1000000 + month * 10000 + day * 100 + (i + 1);

        dayTasks.push({
          id: numericId,
          context: randomTask.context,
          ...(Math.random() > 0.2 ? { title: randomTask.title } : {}),
          ...(randomColor ? { color: randomColor } : {}),
        });
      }

      if (!todoData[year]) todoData[year] = {};
      if (!todoData[year][month]) todoData[year][month] = {};
      todoData[year][month][day] = dayTasks;
    }
  }

  return todoData;
}

const FIXED_DATE = new Date(2026, 6, 30); // 2026-07-30

const meta = {
  title: 'Component/Calendar',
  component: CaCalendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### CaCalendar 月历组件
支持待办事项展示（卡片列表/圆点指示器模式）、响应式移动端适配、手势滑动切换切月以及弹窗/侧边抽屉明细查看。
        `,
      },
    },
  },
  argTypes: {
    startDay: {
      control: 'date',
      description: '初始显示的基准日期',
    },
    firstDayOfWeek: {
      control: 'select',
      options: ['Monday', 'Sunday', 'Saturday'],
      description: '每周起始日（默认周一）',
    },
    displayMode: {
      control: 'select',
      options: [undefined, 'default', 'dot'],
      description: '展示模式：`default`（展开展示）、`dot`（指示点）、`undefined`（自动响应式）',
    },
    todoData: {
      control: 'object',
      description: '按 `[year][month][day]` 层级组织的待办数据',
    },
    'onUpdate:startDay': {
      action: 'update:startDay',
      description: '当日期改变时触发（支持 v-model:startDay）',
    },
    onChange: {
      action: 'change',
      description: '切换月份/年份时触发的事件',
    },
  },
  args: {
    startDay: FIXED_DATE,
    firstDayOfWeek: 'Monday',
    displayMode: undefined,
  },
} satisfies Meta<typeof CaCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础默认故事：响应式模式（桌面端显示为展开列表，移动端切换为 Dot 模式）
 */
export const Default: Story = {
  args: {
    todoData: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 强制指定为 Dot（小圆点）模式
 */
export const DotMode: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `displayMode="dot"` 强制以小圆点指示器形式展现 Todo 标记。点击日期单元格可打开抽屉明细。',
      },
    },
  },
  args: {
    displayMode: 'dot',
    todoData: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 强制指定为 Default（卡片展开）模式
 */
export const DetailedMode: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `displayMode="default"` 直接展示每项待办的简要标题和内容卡片（超出显示最大限制时呈现 +N 更多）。',
      },
    },
  },
  args: {
    displayMode: 'default',
    todoData: generateMockTodoData(FIXED_DATE, 10, 10, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 高负载/高密度待办数据测试 (Heavy Data Load)
 */
export const DenseTodoData: Story = {
  parameters: {
    docs: {
      description: {
        story: '模拟每天均有 4~6 条待办事项的情明，测试截断展示（+N 更多）以及抽屉列表的滚动排版。',
      },
    },
  },
  args: {
    todoData: generateMockTodoData(FIXED_DATE, 20, 20, 'dense'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 周首日设置为周日 (Start From Sunday)
 */
export const SundayFirstDay: Story = {
  parameters: {
    docs: {
      description: {
        story: '配置 `firstDayOfWeek="Sunday"` 将周日设置为每周的第一列。',
      },
    },
  },
  args: {
    firstDayOfWeek: 'Sunday',
    todoData: generateMockTodoData(FIXED_DATE, 10, 10, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 无数据空状态 (Empty State)
 */
export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: '当 `todoData` 为 `null` 或空对象时的展示效果。',
      },
    },
  },
  args: {
    todoData: {},
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `<CaCalendar v-bind="args" />`,
  }),
};

/**
 * 组件暴露方法测试 (Exposed API Methods Controls)
 * 测试操作：通过外部按钮直接控制日历的翻页与跳转
 */
export const ExposedMethods: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过模板引用 (`ref`) 调用组件暴露的 `prevMonth`、`nextMonth`、`goToday` 等控制方法。',
      },
    },
  },
  args: {
    todoData: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      const calendarRef = ref<CaCalendarExpose | null>(null);

      const handlePrev = () => calendarRef.value?.prevMonth();
      const handleNext = () => calendarRef.value?.nextMonth();
      const handleToday = () => calendarRef.value?.goToday();
      const handlePrevYear = () => calendarRef.value?.prevYear();
      const handleNextYear = () => calendarRef.value?.nextYear();

      return {
        args,
        calendarRef,
        handlePrev,
        handleNext,
        handleToday,
        handlePrevYear,
        handleNextYear,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <button @click="handlePrevYear">上一年</button>
          <button @click="handlePrev">上一月</button>
          <button @click="handleToday">今天</button>
          <button @click="handleNext">下一月</button>
          <button @click="handleNextYear">下一年</button>
        </div>
        <CaCalendar ref="calendarRef" v-bind="args" />
      </div>
    `,
  }),
};