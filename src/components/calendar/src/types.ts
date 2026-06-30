import { DAY_OF_WEEK_MAP, TODO_COLORS } from '@/components/calendar';

type DayOfWeek = keyof typeof DAY_OF_WEEK_MAP;
interface CalendarProps {
  // 设置一周的第一天
  firstDayOfWeek?: DayOfWeek;
}
type TodoItem = { id: number; title?: string; context: string; color?: string };
type TodoData = {
  [year: number]: {
    [month: number]: {
      [day: number]: TodoItem[];
    };
  };
};

interface DayTodoProps {
  todos: TodoItem[];
}

type TodoColor = (typeof TODO_COLORS)[number]['value'];

export type { CalendarProps, TodoData, TodoItem, DayTodoProps, TodoColor };
