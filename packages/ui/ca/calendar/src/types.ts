import type { DAY_OF_WEEK_MAP } from './constants.ts';

export type TransitionControl = 'slide-next' | 'slide-prev';

export type DayOfWeek = keyof typeof DAY_OF_WEEK_MAP;


// YYYY-MM-DD: T
export type CaCalendarData<T> = Record<string, T>;

export interface CalendarDay {
  date: Date;
  year: number;
  /* 1 ~ 12 */
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  key: string;
}

export type DisplayMode = 'default' | 'dot';

export interface CaCalendarProps<T> {
  startDay?: Date;
  firstDayOfWeek?: DayOfWeek;
  data?: CaCalendarData<T>;
  displayMode?: DisplayMode;
  loading?: boolean;
}

export interface PanelChangePayload {
  year: number;
  /* 1 ~ 12 */
  month: number;
  startDate: Date; // 42格网格的第一天
  endDate: Date;   // 42格网格的最后一天
}

export interface CaCalendarEmits<T> {
  (e: 'update:startDay', val: Date): void;

  (e: 'change', val: Date): void;

  (e: 'panel-change', payload: PanelChangePayload): void;

  (e: 'click', d: T | undefined): void;
}

export interface CaCalendarExpose {
  prevYear: () => void;
  nextYear: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
}

