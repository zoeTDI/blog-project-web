<script setup lang="ts">
  import { ref, onMounted, onUnmounted, provide, shallowRef, watch } from 'vue';
  import {
    BigCalendar,
    type CalendarProps,
    SmallCalendar,
    TODO_COLORS,
    type TodoData,
    type TodoItem,
  } from '@/components/calendar';
  import { caMessage } from '@/components/ca/caMessage';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { useDebounceFn } from '@caldm/hook';
  import { CaDrawer } from '@/components/ca/caDrawer';

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
  const caDrawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

  const isSmall = ref(false);

  const todoData = ref<TodoData | null>(null);
  const showTodo = ref<TodoItem[]>([]);
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

  const fetchData = async (
    year: number,
    month: number
  ): Promise<TodoData | null> => {
    //   todo 未来在此处调用数据获取api
    try {
      console.info('触发请求');
      console.info('请求参数：year ', year, ' month ', month);
      return {} as TodoData;
    } catch (error) {
      // 消息组件，会在屏幕上弹出一个消息通知，3秒后消失
      caMessage.error('获取数据失败');
      return null;
    }
  };

  const handleCalendarClick = (data: {
    year: number;
    month: number;
    day: number;
  }) => {
    if (!caDrawerRef.value) return;
    if (!todoData.value) return;
    if (
      !todoData.value[data.year] ||
      !todoData.value[data.year][data.month] ||
      !todoData.value[data.year][data.month][data.day]
    ) {
      return;
    }
    showTodo.value = todoData.value[data.year][data.month][data.day];
    caDrawerRef.value.open();
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
      @date-click="handleCalendarClick"
      @update:start-day="handleUpdateStartDay" />
    <big-calendar
      v-if="!isSmall"
      :start-day="startDay"
      :todo-data="todoData"
      :first-day-of-week="props.firstDayOfWeek"
      @date-click="handleCalendarClick"
      @update:start-day="handleUpdateStartDay" />
    <ca-drawer ref="caDrawerRef">
      <div class="todo-items-container">
        <div
          class="todo-item"
          v-for="item in showTodo"
          :key="item.id"
          :style="{
            backgroundColor: item.color,
          }">
          <div
            class="title"
            v-if="item.title"
            :style="{
              borderBottomColor: `color-mix(in srgb, ${item.color} 80%, black)`,
            }">
            {{ item.title }}
          </div>
          <div class="context">
            {{ item.context }}
          </div>
        </div>
      </div>
    </ca-drawer>
  </div>
</template>

<style scoped>
  .calendar {
    width: 100%;
    min-width: 300px;
  }
  .todo-items-container {
    width: max-content;
    min-width: 300px;
    max-width: 25svw;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
  .todo-item {
    padding: 20px;
    max-height: 350px;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .todo-item .title {
    padding-bottom: 6px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    margin-bottom: 12px;
  }
</style>
