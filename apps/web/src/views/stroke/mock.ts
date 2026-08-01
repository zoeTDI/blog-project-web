import type { TodoItem } from '@/views/stroke/Stroke.vue';

const MOCK_TASKS = [
  { title: '周报编写', context: '完成本周前端项目进度总结并发送给团队负责人' },
  { title: 'UI 规范', context: '与设计团队对接 Vue 3 组件库的新版设计标尺' },
  { title: '缺陷修复', context: '排查并修复线上反馈的表格排序错乱 Bug' },
  { title: '架构优化', context: '重构全局状态管理逻辑，降低非必要的组件渲染' },
  { title: '技术分享', context: '准备下周团队内部关于前端性能优化的 PPT' },
  { title: '接口对接', context: '与后端确认用户权限校验 API 的参数细节' },
  { title: '文档更新', context: '补充完善新增组件的使用说明与示例代码' },
];

const COLORS = [
  '#3B82F633',
  '#22C55E33',
  '#F59E0B33',
  '#EF444433',
  '#A855F733',
  undefined,
];

export const generateData = (
  year: number,
  month: number
): Record<string, TodoItem[]> => {
  const pad = (n: number, len: number = 2): string =>
    String(n).padStart(len, '0');

  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<string, TodoItem[]> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${pad(month)}-${pad(day)}`;
    const taskCount = Math.floor(Math.random() * 4); // 0 ~ 3
    const tasks: TodoItem[] = [];

    for (let i = 0; i < taskCount; i++) {
      // 从 MOCK_TASKS 随机选取一个模板
      const template =
        MOCK_TASKS[Math.floor(Math.random() * MOCK_TASKS.length)];
      const task: TodoItem = {
        id: parseInt(`${year}${pad(month)}${pad(day)}${pad(i + 1, 2)}`),
        context: template.context,
      };

      // 随机决定是否保留 title（30% 概率删除）
      if (Math.random() >= 0.3) {
        task.title = template.title;
      }

      // 随机选取颜色（可能为 undefined）
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (color !== undefined) {
        task.color = color;
      }

      tasks.push(task);
    }

    result[dateKey] = tasks;
  }

  return result;
};
