<script setup lang="ts">
  import {
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon,
  } from '@heroicons/vue/24/outline';
  import { computed } from 'vue';
  import { isSameDay } from '@/utils/isFu.ts';
  import {
    DAY_OF_WEEK_MAP,
    type DayOfWeek,
    DayTodo,
    type TodoData,
  } from '@/components/calendar';

  const props = withDefaults(
    defineProps<{
      firstDayOfWeek?: DayOfWeek;
      todoData?: TodoData | null;
      startDay?: Date;
    }>(),
    {
      firstDayOfWeek: 'Monday',
      todoData: () => ({}),
      startDay: () => new Date(),
    }
  );

  const emit = defineEmits<{
    (e: 'update:startDay', startDay: Date): void;
    (e: 'request-data', startDay: Date): void;
    (e: 'date-click', data: { year: number; month: number; day: number }): void;
  }>();

  const today = new Date();
  const year = computed(() => props.startDay.getFullYear());
  const month = computed(() => props.startDay.getMonth() + 1);
  const day = computed(() => props.startDay.getDate());
  const days = computed(() => {
    const year = props.startDay.getFullYear();
    const month = props.startDay.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = DAY_OF_WEEK_MAP[props.firstDayOfWeek];
    let preDayCount = firstDayOfMonth.getDay() - firstDayOfWeek;
    if (preDayCount < 0) preDayCount += 7;

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const lastDays = Array.from({ length: preDayCount }, (_, i) => {
      return new Date(year, month, i - preDayCount + 1);
    });

    const curDays = Array.from({ length: totalDaysInMonth }, (_, i) => {
      return new Date(year, month, i + 1);
    });

    const nextDaysCount = 42 - (preDayCount + totalDaysInMonth);
    const nextDays = Array.from({ length: nextDaysCount }, (_, i) => {
      return new Date(year, month + 1, i + 1);
    });

    return {
      lastDays,
      curDays,
      nextDays,
    };
  });

  const changeDate = (newDate: Date) => {
    emit('update:startDay', newDate);
    emit('request-data', newDate);
  };

  const goToToday = async () => {
    changeDate(today);
  };

  const handleYear = async (change: number) => {
    const newDate = new Date(props.startDay);
    newDate.setFullYear(newDate.getFullYear() + change);
    changeDate(newDate);
  };

  const handleMonth = async (change: number) => {
    const newDate = new Date(props.startDay);
    newDate.setMonth(newDate.getMonth() + change);
    changeDate(newDate);
  };

  const hasTodo = (date: Date): boolean => {
    if (!props.todoData) return false;

    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    // 逐层检查是否存在
    const yearData = props.todoData[y];
    const monthData = yearData ? yearData[m] : undefined;
    const dayData = monthData ? monthData[d] : undefined;

    // 如果 dayData 存在且数组长度大于 0，则返回 true
    return !!(dayData && dayData.length > 0);
  };
  const handleDateClick = (date: Date) => {
    emit('date-click', {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    });
  };
</script>

<template>
  <div class="big-calendar">
    <!--   头部区域 -->
    <header class="header">
      <div class="left btns">
        <div
          class="last-year btn"
          @click="handleYear(-1)">
          <chevron-double-left-icon class="icon" />
        </div>
        <div
          class="last-month btn"
          @click="handleMonth(-1)">
          <chevron-left-icon class="icon" />
        </div>
      </div>
      <div
        class="today"
        @click="goToToday()">
        {{ year }} / {{ month }} /
        {{ day }}
      </div>
      <div class="right btns">
        <div
          class="next-month btn"
          @click="handleMonth(1)">
          <chevron-right-icon clas="icon" />
        </div>
        <div
          class="next-year btn"
          @click="handleYear(1)">
          <chevron-double-right-icon class="icon" />
        </div>
      </div>
    </header>
    <!--   内容区域 -->
    <section>
      <template
        v-for="dayOfLastMonth in days.lastDays"
        :key="dayOfLastMonth.getTime()">
        <div
          class="day last"
          :class="{
            weekend:
              dayOfLastMonth.getDay() == 6 || dayOfLastMonth.getDay() == 0,
          }">
          <div
            class="label"
            @click="handleDateClick(dayOfLastMonth)">
            {{ dayOfLastMonth.getDate() }}
          </div>
          <day-todo
            v-if="hasTodo(dayOfLastMonth)"
            :todos="
              todoData![dayOfLastMonth.getFullYear()][
                dayOfLastMonth.getMonth()
              ][dayOfLastMonth.getDate()]
            " />
        </div>
      </template>
      <template
        v-for="dayOfCurMonth in days.curDays"
        :key="dayOfCurMonth.getTime()">
        <div
          class="day cur"
          :class="{
            today: isSameDay(today, dayOfCurMonth),
            weekend: dayOfCurMonth.getDay() == 6 || dayOfCurMonth.getDay() == 0,
          }">
          <div
            class="label"
            @click="handleDateClick(dayOfCurMonth)">
            {{ dayOfCurMonth.getDate() }}
          </div>
          <day-todo
            v-if="hasTodo(dayOfCurMonth)"
            :todos="
              todoData![dayOfCurMonth.getFullYear()][dayOfCurMonth.getMonth()][
                dayOfCurMonth.getDate()
              ]
            " />
        </div>
      </template>
      <template
        v-for="dayOfNextMonth in days.nextDays"
        :key="dayOfNextMonth.getTime()">
        <div
          class="day next"
          :class="{
            weekend:
              dayOfNextMonth.getDay() == 6 || dayOfNextMonth.getDay() == 0,
          }">
          <div
            class="label"
            @click="handleDateClick(dayOfNextMonth)">
            {{ dayOfNextMonth.getDate() }}
          </div>
          <day-todo
            v-if="hasTodo(dayOfNextMonth)"
            :todos="
              todoData![dayOfNextMonth.getFullYear()][
                dayOfNextMonth.getMonth()
              ][dayOfNextMonth.getDate()]
            " />
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
  .big-calendar {
    width: 100%;
    border: 1px solid var(--color-border);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px;
    background-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  }
  .header .today {
    cursor: pointer;
    padding: 4px 8px;
    will-change: background-color;
    transition: background-color 150ms ease;
  }
  .header .today:hover {
    background-color: var(--color-bg-hover);
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 8px;
  }
  .btn {
    width: 24px;
    height: 24px;
    aspect-ratio: 1/1;
    cursor: pointer;
    padding: 4px;
    will-change: background-color;
    transition: background-color 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
  }
  .btn:hover {
    background-color: var(--color-bg-hover);
  }
  section {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-width: 0;
    align-content: center;
    justify-items: center;
  }
  section .day {
    width: 100%;
    min-width: 0;
    padding: 4px 8px;
    aspect-ratio: 8/5;
    display: flex;
    flex-direction: column;
    align-items: start;
    will-change: background-color, color;
    transition:
      background-color 150ms ease,
      color 150ms ease;
    overflow: hidden;
  }
  section .day .label {
    width: 100%;
    font-size: 20px;
    cursor: pointer;
  }
  section .day:hover,
  section .day.weekend:hover {
    color: var(--color-text-primary);
    background-color: color-mix(in srgb, var(--color-bg-hover) 80%, black);
  }
  section .day.last {
    color: #aaa;
  }
  section .day.next {
    color: #aaa;
  }
  section .day.today {
    color: red;
  }
  section .day.weekend {
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  }
</style>
