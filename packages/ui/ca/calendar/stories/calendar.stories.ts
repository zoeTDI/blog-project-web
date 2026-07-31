import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { type Component, ref } from 'vue';
import { CaCalendar, type CaCalendarData } from '../index.ts';
import type { PanelChangePayload } from '../index.ts';
import type { CaCalendarExpose } from '../index.ts';
import { action } from 'storybook/actions';

interface TodoItem {
  id: number;
  title?: string;
  context: string;
  color?: string;
}

type TodoData = CaCalendarData<TodoItem[]>;

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
    const month = date.getMonth() + 1;
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

      todoData[`${year}-${String(month).padStart(2, '0')}-${day}`] = dayTasks;
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
    loading: {
      control: 'boolean',
      description: '异步数据加载中状态遮罩',
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
    data: {
      control: 'object',
      description: '按 `[year][month][day]` 层级组织的待办数据',
    },
    'onUpdate:startDay': {
      action: 'update:startDay',
      description: '当日期改变时触发（支持 v-model:startDay）',
    },
    'onPanel-change': {
      action: 'panel-change',
      description: '视图/月份切换时触发，包含当前网格起止日期与年月',
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
    data: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),

  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      const c = (val: any) => {
        console.log('🚀 ~ c ~ val: ', val);
      };
      return { args, c };
    },
    template: `
      <CaCalendar v-bind="args" @click="c">
        <template v-for="(list, date) in args.data"
                  :key="date"
                  #[date]="{ dataItem }">
          {{ dataItem || '不存在数据' }}
        </template>
      </CaCalendar>`,
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
    data: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
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
    data: generateMockTodoData(FIXED_DATE, 10, 10, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
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
    data: generateMockTodoData(FIXED_DATE, 20, 20, 'dense'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
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
    data: generateMockTodoData(FIXED_DATE, 10, 10, 'normal'),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
  }),
};

/**
 * 无数据空状态 (Empty State)
 */
export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: '当 `data` 为 `null` 或空对象时的展示效果。',
      },
    },
  },
  args: {
    data: {},
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
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
    data: generateMockTodoData(FIXED_DATE, 15, 15, 'normal'),
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

/**
 * 演示：Loading 加载遮罩状态
 */
export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `loading="true"` 打开全局加载遮罩层，阻断网络请求期间的用户重复点击与手势切换。',
      },
    },
  },
  args: {
    loading: true,
    data: generateMockTodoData(FIXED_DATE, 7, 7),
  },
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      return { args };
    },
    template: `
      <CaCalendar v-bind="args" />`,
  }),
};

/**
 * 演示：模拟真正的“按需加载 + 内存缓存”业务场景
 * 点击翻页或跳转时触发 panel-change 事件，延迟模拟 API 请求，展示 Loading 遮罩并回填数据。
 */
export const AsyncFetchAndCache: Story = {
  parameters: {
    docs: {
      description: {
        story: '完整模拟真实业务场景：监听 `@panel-change` 事件，自动命中/不命中缓存。未命中时开启 `loading` 遮罩并模拟异步 API 请求。',
      },
    },
  },
  // 👈 注意：这里将原有的 args: { data: null } 移除或清空，防止干扰
  render: (args) => ({
    components: { CaCalendar },
    setup() {
      const loading = ref(false);
      const data = ref<TodoData>({});
      const loadedCache = new Set<string>();

      // 模拟后端 API
      const mockFetchApi = (year: number, month: number): Promise<TodoData> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // 生成该月份的随机 Todo 数据
            const result = generateMockTodoData(new Date(year, month, 15), 15, 15);
            resolve(result);
          }, 800); // 模拟 800ms 网络延迟
        });
      };

      const handlePanelChange = async (payload: PanelChangePayload) => {
        // 触发 Storybook Actions 面板记录
        action('panel-change')(payload);

        // 注意：假设此时 payload.month 已经回归 1 ~ 12
        const cacheKey = `${payload.year}-${payload.month}`;

        // 1. 命中缓存判断
        if (loadedCache.has(cacheKey)) {
          console.info(
            `%c[Cache Hit] 🎯 命中缓存: ${cacheKey}`,
            'color: #22c55e; font-weight: bold; font-size: 14px;',
          );
          console.log("🚀 ~ handlePanelChange ~ data: ", data.value);
          console.log("🚀 ~ handlePanelChange ~ loadedCache: ", loadedCache);
          return;
        }

        // 2. 未命中缓存：发起网络请求
        try {
          console.info(
            `%c[Cache Miss] 🚀 发起网络请求: ${cacheKey}`,
            'color: #3b82f6; font-weight: bold; font-size: 14px;',
          );
          console.log("🚀 ~ handlePanelChange ~ data: ", data.value);
          console.log("🚀 ~ handlePanelChange ~ loadedCache: ", loadedCache);
          loading.value = true;

          // mockFetchApi 返回新的平铺格式 Record<string, T>，例如 { "2026-07-01": [...], ... }
          const newData = await mockFetchApi(payload.year, payload.month);

          // 直接把请求到的新日期数据合并到平铺的对象中
          data.value = {
            ...data.value,
            ...newData,
          };

          // 标记该月份已缓存
          loadedCache.add(cacheKey);
        } finally {
          loading.value = false;
        }
      };

      return {
        args,
        startDay: FIXED_DATE,
        loading,
        data,
        handlePanelChange,
      };
    },
    // 👈 关键点：不再使用 v-bind="args"，手动绑定需要的属性和事件，避免 args 里的 null 或 mock action 强行覆写
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 13px; color: #666; padding: 4px 8px; background: #f3f4f6; border-radius: 4px;">
          💡 提示：按 <b>F12</b> 打开控制台。初次加载会提示 <b>[Cache Miss] 发起网络请求</b>；切换月份后再切换回来会提示 <b>[Cache
          Hit] 命中缓存</b>。
        </div>
        <CaCalendar
          :start-day="startDay"
          :loading="loading"
          :data="data"
          :display-mode="args.displayMode"
          @panel-change="handlePanelChange"
        />
      </div>
    `,
  }),
};