<script setup lang="ts">
  import {
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon,
  } from '@heroicons/vue/24/outline';
  import { computed, onMounted, ref, shallowRef } from 'vue';
  import { isSameDay } from '@/utils/isFu.ts';
  import { mockApiFetch } from '@/utils/mock.ts';
  import {
    type CalendarProps,
    DAY_OF_WEEK_MAP,
    DayTodo,
    TODO_COLORS,
    type TodoData,
  } from '@/components/calendar';
  import { useDebounceFn } from '@/hooks/useDebounceFn.ts';
  import { caMessage } from '@/components/ca/caMessage';

  const mockData: TodoData = {
    2026: {
      5: {
        30: [
          {
            id: 1,
            title: '',
            context:
              '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
            color: TODO_COLORS[0].value,
          },
          { id: 2, title: '', context: '内容2', color: TODO_COLORS[1].value },
          {
            id: 3,
            title: '标题三',
            context: '内容3',
            color: TODO_COLORS[2].value,
          },
          { id: 4, title: '', context: '内容4', color: TODO_COLORS[3].value },
        ],
      },
    },
  };

  const props = withDefaults(defineProps<CalendarProps>(), {
    firstDayOfWeek: 'Monday',
  });

  const MAX_CACHE_SIZE = 24;
  const loadedMonths = shallowRef<Map<string, TodoData>>(new Map());
  const today = new Date();
  const startDay = ref(today);
  const todoData = ref<TodoData | null>(null);
  const year = computed(() => startDay.value.getFullYear());
  const month = computed(() => startDay.value.getMonth() + 1);
  const day = computed(() => startDay.value.getDate());
  const days = computed(() => {
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();

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

  const goToToday = async () => {
    startDay.value = new Date();
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();
    const key = `${year}-${month}`;
    const cacheData = getFromCache(key);
    if (cacheData) {
      todoData.value = cacheData;
    } else {
      const data = await fetchDate(year, month);
      if (data && Object.keys(data).length > 0) {
        todoData.value = data;
        cacheDataAndSetPriority(key, data);
      }
    }
  };
  const debounceGoToToday = useDebounceFn(async () => {
    await goToToday();
  }, 200);

  const handleYear = async (change: number) => {
    const newDate = new Date(startDay.value);
    newDate.setFullYear(newDate.getFullYear() + change);
    startDay.value = newDate;
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();
    const key = `${year}-${month}`;
    const cacheData = getFromCache(key);
    if (cacheData) {
      todoData.value = cacheData;
    } else {
      const data = await fetchDate(year, month);
      if (data && Object.keys(data).length > 0) {
        todoData.value = data;
        cacheDataAndSetPriority(key, data);
      }
    }
  };
  const debounceHandleYear = useDebounceFn(async (change: number) => {
    await handleYear(change);
  }, 200);

  const handleMonth = async (change: number) => {
    const newDate = new Date(startDay.value);
    newDate.setMonth(newDate.getMonth() + change);
    startDay.value = newDate;
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();
    const key = `${year}-${month}`;
    const cacheData = getFromCache(key);
    if (cacheData) {
      todoData.value = cacheData;
    } else {
      const data = await fetchDate(year, month);
      if (data && Object.keys(data).length > 0) {
        todoData.value = data;
        cacheDataAndSetPriority(key, data);
      }
    }
  };

  const debounceHandleMonth = useDebounceFn(async (change: number) => {
    await handleMonth(change);
  }, 200);

  const hasTodo = (date: Date): boolean => {
    if (!todoData.value) return false;
    const y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();
    const dayData = todoData.value[y]?.[m]?.[d];
    return !!(dayData && dayData.length > 0);
  };

  const fetchDate = async (year: number, month: number): Promise<TodoData> => {
    //   todo 未来在此处调用数据获取api
    try {
      return {} as TodoData;
    } catch (error) {
      // 消息组件，会在屏幕上弹出一个消息通知，3秒后消失
      caMessage.error('获取数据失败');
    }
  };

  const updateCachePriority = (key: string, data: TodoData) => {
    const cache = new Map(loadedMonths.value);
    if (cache.has(key)) {
      cache.delete(key);
    } else if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }
    cache.set(key, data);
    loadedMonths.value = cache;
  };

  const cacheDataAndSetPriority = (key: string, data: TodoData) => {
    const clonedData = JSON.parse(JSON.stringify(data));
    updateCachePriority(key, clonedData);
  };

  const getFromCache = (key: string): TodoData | undefined => {
    const cache = loadedMonths.value;
    if (!cache.has(key)) return undefined;
    const val = cache.get(key);
    if (val) {
      updateCachePriority(key, val);
    }
    return val;
  };

  onMounted(async () => {
    todoData.value = await mockApiFetch(mockData);
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();
    const key = `${year}-${month}`;
    cacheDataAndSetPriority(key, todoData.value);
  });
</script>

<template>
  <div class="small-calendar">
    <header class="header">
      <div class="left btns">
        <div
          class="last-year btn"
          @click="debounceHandleYear(-1)">
          <chevron-double-left-icon class="icon" />
        </div>
        <div
          class="last-month btn"
          @click="debounceHandleMonth(-1)">
          <chevron-left-icon class="icon" />
        </div>
      </div>
      <div
        class="today"
        @click="debounceGoToToday">
        {{ year }} / {{ month }} /
        {{ day }}
      </div>
      <div class="right btns">
        <div
          class="next-month btn"
          @click="debounceHandleMonth(1)">
          <chevron-right-icon clas="icon" />
        </div>
        <div
          class="next-year btn"
          @click="debounceHandleYear(1)">
          <chevron-double-right-icon class="icon" />
        </div>
      </div>
    </header>

    <section>
      <template
        v-for="dayOfLastMonth in days.lastDays"
        :key="dayOfLastMonth.getTime()">
        <div
          class="day last"
          :class="{
            weekend:
              dayOfLastMonth.getDay() == 6 || dayOfLastMonth.getDay() == 0,
            'has-todo': hasTodo(dayOfLastMonth),
          }">
          <div class="label">{{ dayOfLastMonth.getDate() }}</div>
          <div
            v-if="hasTodo(dayOfLastMonth)"
            class="indicator"></div>
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
            'has-todo': hasTodo(dayOfCurMonth),
          }">
          <div class="label">{{ dayOfCurMonth.getDate() }}</div>
          <div
            v-if="hasTodo(dayOfCurMonth)"
            class="indicator"></div>
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
            'has-todo': hasTodo(dayOfNextMonth),
          }">
          <div class="label">{{ dayOfNextMonth.getDate() }}</div>
          <div
            v-if="hasTodo(dayOfNextMonth)"
            class="indicator"></div>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
  .small-calendar {
    width: 100%;
    border: 1px solid var(--color-border);
    padding: 8px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px;
    background-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  }
  .today {
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
    aspect-ratio: 1/1;
    will-change: background-color, color;
    transition:
      background-color 150ms ease,
      color 150ms ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  section .day .label {
    width: 100%;
    font-size: 16px;
    text-align: center;
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

  .indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-top: 2px;
    background-color: var(--color-accent);
  }
</style>
