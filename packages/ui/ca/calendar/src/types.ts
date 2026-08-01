import type { DAY_OF_WEEK_MAP } from './constants.ts';

export type TransitionControl = 'slide-next' | 'slide-prev';

export type DayOfWeek = keyof typeof DAY_OF_WEEK_MAP;


// YYYY-MM-DD: T
export type CaCalendarData = Record<string, any>;

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

export interface CaCalendarProps {
  startDay?: Date;
  firstDayOfWeek?: DayOfWeek;
  data?: CaCalendarData;
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

export interface CaCalendarEmits {
  (e: 'update:startDay', val: Date): void;

  (e: 'change', val: Date): void;

  (e: 'panel-change', payload: PanelChangePayload): void;

  (e: 'click', datestamp: string, d: any | undefined): void;
}

export interface CaCalendarExpose {
  prevYear: () => void;
  nextYear: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
}

