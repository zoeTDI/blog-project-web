<script setup lang="ts">
  import {
    ref,
    onMounted,
    onUnmounted,
    provide,
    shallowRef,
    computed,
    watch,
  } from 'vue';
  import {
    BigCalendar,
    type CalendarProps,
    SmallCalendar,
    TODO_COLORS,
    type TodoData,
  } from '@/components/calendar';
  import { caMessage } from '@/components/ca/caMessage';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { useDebounceFn } from '@/hooks/useDebounceFn.ts';

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

  const BREAKPOINT = 600;
  const MAX_CACHE_SIZE = 24;
  const containerRef = ref<HTMLElement | null>(null);
  const isSmall = ref(false);
  const todoData = ref<TodoData | null>(null);
  const startDay = ref(new Date());
  const loadedMonths = shallowRef<Map<string, TodoData>>(new Map());
  let observer: ResizeObserver | null = null;

  const handleUpdateStartDay = async (date: Date) => {
    startDay.value = date;
  };

  const debouncedFetchData = useDebounceFn(async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    const cache = getFromCache(key);
    if (cache) {
      todoData.value = cache;
    } else {
      const data = await fetchData(year, month);
      if (data) {
        todoData.value = data;
        cacheDataAndSetPriority(key, data);
      }
    }
  }, 500);

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

  const fetchData = async (year: number, month: number): Promise<TodoData> => {
    //   todo 未来在此处调用数据获取api
    try {
      console.info('触发请求');
      return {} as TodoData;
    } catch (error) {
      // 消息组件，会在屏幕上弹出一个消息通知，3秒后消失
      caMessage.error('获取数据失败');
    }
  };

  provide('calendarData', { todoData, startDay });

  watch(startDay, (newDate) => {
    debouncedFetchData(newDate);
  });

  onMounted(async () => {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当容器宽度小于 600px 时切换为小日历模式
        isSmall.value = entry.contentRect.width < BREAKPOINT;
      }
    });

    if (containerRef.value) {
      observer.observe(containerRef.value);
    }

    todoData.value = await mockApiFetch(mockData);
    const year = startDay.value.getFullYear();
    const month = startDay.value.getMonth();
    const key = `${year}-${month}`;
    cacheDataAndSetPriority(key, todoData.value);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
</script>

<template>
  <div
    class="calendar"
    ref="containerRef">
    <small-calendar
      v-if="isSmall"
      :start-day="startDay"
      :todo-data="todoData"
      :first-day-of-week="props.firstDayOfWeek"
      @update:start-day="handleUpdateStartDay" />
    <big-calendar
      v-if="!isSmall"
      :start-day="startDay"
      :todo-data="todoData"
      :first-day-of-week="props.firstDayOfWeek"
      @update:start-day="handleUpdateStartDay" />
  </div>
</template>

<style scoped>
  .calendar {
    width: 100%;
    height: 100%;
    min-width: 300px;
  }
</style>
