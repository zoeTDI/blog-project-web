import type { CaCalendarProps, CalendarDay } from '../types.ts';
import { computed, ref, watch } from 'vue';
import { BASE_WEEK, DAY_OF_WEEK_MAP } from '../constants.ts';
import { isSameDay } from '@caldm/utils';

export const useCalendar = (
  props: CaCalendarProps,
  emits?: Function,
) => {
  const today = new Date();

  const currentDate = ref(props.startDay ? new Date(props.startDay) : new Date());

  watch(
    () => props.startDay,
    (val) => {
      if (val) {
        currentDate.value = val;
      }
    },
  );

  const updateDate = (newDate: Date) => {
    currentDate.value = newDate;
    if (emits) {
      emits('update:startDay', newDate);
      emits('change', newDate);
    }
  };

  // 切换上一年
  const prevYear = () => {
    const d = new Date(currentDate.value);
    d.setDate(1);
    d.setFullYear(d.getFullYear() - 1);
    updateDate(d);
  };

  // 切换下一年
  const nextYear = () => {
    const d = new Date(currentDate.value);
    d.setDate(1);
    d.setFullYear(d.getFullYear() + 1);
    updateDate(d);
  };

  // 切换上一个月
  const prevMonth = () => {
    const d = new Date(currentDate.value);
    const targetMonth = d.getMonth() - 1;
    d.setDate(1);
    d.setMonth(targetMonth);
    updateDate(d);
  };

  // 切换下一个月
  const nextMonth = () => {
    const d = new Date(currentDate.value);const targetMonth = d.getMonth() + 1;
    d.setDate(1);
    d.setMonth(targetMonth);
    updateDate(d);
  };

  // 跳转到当前年月 (今天)
  const goToday = () => {
    updateDate(new Date());
  };

  // 动态生成星期表头名称列表 (根据 firstDayOfWeek)
  const weekDays = computed(() => {
    const firstDayOfWeek = props.firstDayOfWeek ? props.firstDayOfWeek : BASE_WEEK[0];
    const startIndex = BASE_WEEK.indexOf(firstDayOfWeek);
    if (startIndex === -1) return BASE_WEEK;
    return [...BASE_WEEK.slice(startIndex), ...BASE_WEEK.slice(0, startIndex)];
  });

  const daysList = computed<CalendarDay[]>(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    const firstDayOfWeek = props.firstDayOfWeek ? props.firstDayOfWeek : BASE_WEEK[0];
    const firstDayOfMonth = new Date(year, month, 1);
    const startOfWeek = DAY_OF_WEEK_MAP[firstDayOfWeek];

    let preDayCount = firstDayOfMonth.getDay() - startOfWeek;
    if (preDayCount < 0) preDayCount += 7;

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalGridCount = 42;

    const result: CalendarDay[] = [];

    for (let i = 0; i < totalGridCount; i++) {
      const dayOffset = i - preDayCount + 1;
      const date = new Date(year, month, dayOffset);
      const dayOfWeek = date.getDay();

      result.push({
        date,
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        isPrevMonth: i < preDayCount,
        isCurrentMonth: i >= preDayCount && i < preDayCount + totalDaysInMonth,
        isNextMonth: i >= preDayCount + totalDaysInMonth,
        isToday: isSameDay(today, date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      });
    }
    return result;
  });

  const hasTodo = (date: Date): boolean => {
    if (!props.todoData) return false;
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return !!props.todoData[y]?.[m]?.[d]?.length;
  };

  return {
    currentDate,
    weekDays,
    daysList,
    hasTodo,
    prevYear,
    nextYear,
    prevMonth,
    nextMonth,
    goToday,
  };
};