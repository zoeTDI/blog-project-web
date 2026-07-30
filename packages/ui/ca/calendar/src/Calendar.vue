<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useCalendar } from './composables/useCalendar.ts';
  import type { CaCalendarEmits, CaCalendarExpose, CaCalendarProps, TodoItem, TransitionControl } from './types.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from '@heroicons/vue/24/outline';
  import { WEEK_SHORT_MAP } from './constants.ts';
  import CaCalendarTodo from './CalendarTodo.vue';
  import type { CaDrawerExpose } from '../../drawer';
  import CaDrawer from '../../drawer/src/Drawer.vue';

  defineOptions({
    name: 'CaCalendar',
  });

  const props = withDefaults(defineProps<CaCalendarProps>(), {
    startDay: () => new Date(),
    firstDayOfWeek: 'Monday',
    displayMode: 'default',
  });

  const emits = defineEmits<CaCalendarEmits>();

  const drawerRef = ref<CaDrawerExpose | null>(null);

  const activeDate = ref<Date | null>(null);
  const activeTodoList = ref<TodoItem[]>([]);
  const selectedTodoId = ref<number | null>(null);
  const transitionName = ref<TransitionControl>('slide-next');
  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const isMobile = ref(false);

  const ns = useCSSNamespace('calendar');

  const {
    currentDate,
    weekDays,
    daysList,
    prevYear,
    prevMonth,
    nextMonth,
    nextYear,
    goToday,
    getTodoList,
  } = useCalendar(props, emits);

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
    ];
    return cls;
  });

  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth() + 1);
  const day = computed(() => currentDate.value.getDate());
  const drawerPlacement = computed(() => (isMobile.value ? 'bottom' : 'right'));
  const drawerCustomSize = computed(() => (isMobile.value ? 0.6 : 380));

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };

  const handlePrevMonth = () => {
    transitionName.value = 'slide-prev';
    prevMonth();
  };

  const handleNextMonth = () => {
    transitionName.value = 'slide-next';
    nextMonth();
  };

  const handlePrevYear = () => {
    transitionName.value = 'slide-prev';
    prevYear();
  };

  const handleNextYear = () => {
    transitionName.value = 'slide-next';
    nextYear();
  };

  const handleGoToday = () => {
    const today = new Date();
    if (today < currentDate.value) {
      transitionName.value = 'slide-prev';
    } else {
      transitionName.value = 'slide-next';
    }
    goToday();
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    touchStartY.value = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.value;
    const deltaY = e.changedTouches[0].clientY - touchStartY.value;

    const threshold = 40;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        handleNextMonth();
      } else {
        handlePrevMonth();
      }
    }
  };

  const handleViewTodo = (dayDate: Date) => {
    const todos = getTodoList(dayDate);
    if (!todos || todos.length === 0) return;
    activeDate.value = dayDate;
    activeTodoList.value = todos;
    drawerRef.value?.open();
  };

  defineExpose<CaCalendarExpose>({
    prevYear: handlePrevYear,
    nextYear: handleNextYear,
    prevMonth: handlePrevMonth,
    nextMonth: handleNextMonth,
    goToday: handleGoToday,
  });

  onMounted(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile);
  });
</script>

<template>
  <div :class="classes">
    <div :class="ns.e('control')">
      <div :class="ns.e('left')">
        <CaIcon :icon="ChevronDoubleLeftIcon"
                :size="24"
                @click="handlePrevYear" />
        <CaIcon :icon="ChevronLeftIcon"
                :size="24"
                @click="handlePrevMonth" />
      </div>
      <div :class="ns.e('center')"
           @click="handleGoToday">
        {{ year }} / {{ month }} / {{ day }}
      </div>
      <div :class="ns.e('right')">
        <CaIcon :icon="ChevronRightIcon"
                :size="24"
                @click="handleNextMonth" />
        <CaIcon :icon="ChevronDoubleRightIcon"
                :size="24"
                @click="handleNextYear" />
      </div>
    </div>
    <header :class="ns.e('header')">
      <div :class="ns.e('header-cell')"
           v-for="item in weekDays"
           :key="item">
        <span :class="ns.m('week-full')">{{ item }}</span>
        <span :class="ns.m('week-short')">{{ WEEK_SHORT_MAP[item] }}</span>
      </div>
    </header>
    <div :class="ns.e('body-wrapper')"
         @touchstart="handleTouchStart"
         @touchend="handleTouchEnd">
      <Transition :name="transitionName" mode="out-in">
        <section :class="ns.e('container')"
                 :key="`${year}-${month}`">
          <template v-for="dayItem in daysList" :key="dayItem.date">
            <div :class="[
                    ns.e('day'),
                    ns.is('last', dayItem.isPrevMonth),
                    ns.is('cur', !dayItem.isPrevMonth && !dayItem.isNextMonth),
                    ns.is('next', dayItem.isNextMonth),
                    ns.is('weekend', dayItem.isWeekend),
                    ns.is('mode-dot', props.displayMode === 'dot')
                  ]"
                 @click="handleViewTodo(dayItem.date)">
              <div :class="[
                ns.e('label'),
                ns.is('today', dayItem.isToday),
              ]">
                {{ dayItem.day }}
              </div>
              <CaCalendarTodo :items="getTodoList(dayItem.date)"
                              :max-visible="2"
                              :mode="props.displayMode" />
            </div>
          </template>
        </section>
      </Transition>
    </div>
  </div>
  <CaDrawer ref="drawerRef"
            :placement="drawerPlacement"
            :custom-size="drawerCustomSize">
    <template #header>
      <div class="todo-drawer-title" v-if="activeDate">
        <h3>{{ activeDate.getFullYear() }}年{{ activeDate.getMonth() + 1 }}月{{ activeDate.getDate() }}日</h3>
        <span class="todo-count">共 {{ activeTodoList.length }} 项待办</span>
      </div>
    </template>
    <div class="todo-drawer-content">
      <div
        v-for="todo in activeTodoList"
        :key="todo.id"
        :class="['todo-detail-card', { 'is-selected': todo.id === selectedTodoId }]"
        :style="{ borderLeftColor: todo.color || 'var(--color-accent, #3b82f6)' }"
      >
        <div v-if="todo.title" class="todo-detail-title">
          {{ todo.title }}
        </div>
        <div class="todo-detail-context">
          {{ todo.context }}
        </div>
      </div>
    </div>
  </CaDrawer>
</template>

<style scoped>
  .ca-calendar {
    width: 100%;
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .ca-calendar__control {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid var(--color-border);
    user-select: none;
  }

  .ca-calendar__left,
  .ca-calendar__right {
    flex: 0 0 auto;
    cursor: pointer;
  }

  .ca-calendar__left {
    margin-right: auto;
  }

  .ca-calendar__center {
    flex: 0 0 auto;
    text-align: center;
    cursor: pointer;
  }

  .ca-calendar__right {
    margin-left: auto;
  }

  .ca-calendar__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    border-bottom: 1px solid var(--color-border);
    gap: 0;
    flex: 1 1 100%;
    user-select: none;
  }

  .ca-calendar__header-cell {
    flex: 1;
    border-right: 1px solid var(--color-border);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }

  .ca-calendar__header-cell:last-child {
    border-right: unset;
  }

  .ca-calendar--week-full {
    display: inline;
  }

  .ca-calendar--week-short {
    display: none;
  }

  .ca-calendar__body-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    touch-action: pan-y;
  }

  .ca-calendar__container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-width: 0;
    align-content: center;
    justify-items: center;
  }

  .ca-calendar__day {
    position: relative;
    width: 100%;
    min-width: 0;
    padding: 4px 8px;
    aspect-ratio: 8/5;
    display: flex;
    flex-direction: column;
    align-items: start;
    will-change: background-color, color;
    transition: background-color 150ms ease, color 150ms ease;
    overflow: hidden;
  }

  .ca-calendar__day.is-mode-dot {
    justify-content: center;
    align-items: center;
  }

  .ca-calendar__day:hover {
    color: var(--color-text-primary);
    background-color: color-mix(in srgb, var(--color-bg-hover) 80%, black);
  }

  .ca-calendar__label {
    width: 100%;
    font-size: 20px;
    cursor: pointer;
  }

  .ca-calendar__day.is-mode-dot .ca-calendar__label {
    width: auto;
    text-align: center;
  }

  .is-last,
  .is-next {
    color: #aaa;
  }

  .is-today {
    color: var(--color-accent);
  }

  .is-weekend {
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .todo-drawer-title {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .todo-drawer-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .todo-count {
    font-size: 12px;
    color: var(--color-text-secondary, #6b7280);
  }

  .todo-drawer-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
  }

  .todo-detail-card {
    padding: 12px;
    background-color: var(--color-bg-hover, #f9fafb);
    border-radius: 6px;
    border-left: 4px solid var(--color-accent, #3b82f6);
    transition: all 0.2s ease;
  }

  .todo-detail-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--color-text-primary);
  }

  .todo-detail-context {
    font-size: 13px;
    line-height: 1.5;
    color: var(--color-text-regular, #374151);
    /* 允许完整展示文字并按需自动换行 */
    word-break: break-word;
    white-space: pre-wrap;
  }

  /* 下一个月 (向左滑入/滑出) */
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;
  }

  .slide-next-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .slide-next-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }

  /* 上一个月 (向右滑入/滑出) */
  .slide-prev-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }

  .slide-prev-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  @media screen and (max-width: 768px) {
    .ca-calendar--week-full {
      display: none;
    }

    .ca-calendar--week-short {
      display: inline;
      font-size: 14px; /* 移动端可按需微调字号 */
    }

    /* 缩小表头内边距适应窄屏 */
    .ca-calendar__header-cell {
      padding: 4px 0;
      font-weight: 500;
    }

    .ca-calendar__day {
      aspect-ratio: 1/1;
      padding: 2px 4px;
    }
  }
</style>