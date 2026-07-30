import type { DAY_OF_WEEK_MAP } from './constants.ts';

export type DayOfWeek = keyof typeof DAY_OF_WEEK_MAP;

export type TodoItem = { id: number; title?: string; context: string; color?: string };

export type TodoData = {
  [year: number]: {
    [month: number]: {
      [day: number]: TodoItem[];
    };
  };
};

export interface CalendarDay {
  date: Date;
  year: number;
  /* 0 ~ 11 */
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  key: string;
}

export interface CaCalendarProps {
  startDay?: Date;
  firstDayOfWeek?: DayOfWeek;
  todoData?: TodoData | null;
}

export interface CaCalendarEmits {
  (e: 'update:startDay', val: Date): void;

  (e: 'change', val: Date): void;
}

export interface CaCalendarExpose {
  prevYear: () => void;
  nextYear: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
}