type DayOfWeek = keyof typeof DAY_OF_WEEK_MAP;
interface CalendarProps {
  // 设置一周的第一天
  firstDayOfWeek?: DayOfWeek;
}
type TodoItem = { id: number; title?: string; context: string };
type TodoData = {
  [year: number]: {
    [month: number]: {
      [day: number]: TodoItem[];
    };
  };
};

const DAY_OF_WEEK_MAP = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

interface DayTodoProps {
  todos: TodoItem[];
}

export { DAY_OF_WEEK_MAP };
export type { CalendarProps, TodoData, TodoItem, DayTodoProps };
