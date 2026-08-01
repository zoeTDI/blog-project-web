<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useCalendar } from './composables/useCalendar.ts';
  import type {
    CaCalendarEmits,
    CaCalendarExpose,
    CaCalendarProps,
    CalendarDay,
    TransitionControl,
  } from './types.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from '@heroicons/vue/24/outline';
  import { WEEK_SHORT_MAP } from './constants.ts';

  defineOptions({
    name: 'CaCalendar',
  });

  const props = withDefaults(defineProps<CaCalendarProps>(), {
    startDay: () => new Date(),
    firstDayOfWeek: 'Monday',
    displayMode: undefined,
    data: () => ({}),
  });

  const emits = defineEmits<CaCalendarEmits>();

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
  } = useCalendar(props, emits);

  const classes = computed(() => {
    return [
      ns.b(),
      ns.is('loading', props.loading),
    ];
  });

  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth() + 1);
  const day = computed(() => currentDate.value.getDate());
  const effectiveDisplayMode = computed(() => {
    if (props.displayMode) {
      return props.displayMode;
    }
    return isMobile.value ? 'dot' : 'default';
  });

  const getDayData = (dayItem: CalendarDay): any | undefined => {
    const datestamp = `${dayItem.year}-${String(dayItem.month).padStart(2, '0')}-${String(dayItem.day).padStart(2, '0')}`;
    return props.data?.[datestamp];
  };

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

  const handleClick = (dayItem: CalendarDay) => {
    emits(
      'click',
      `${dayItem.year}-${String(dayItem.month).padStart(2, '0')}-${String(dayItem.day).padStart(2, '0')}`,
      getDayData(dayItem));
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
      <Transition name="fade">
        <div v-if="loading" :class="ns.e('loading-mask')">
          <div :class="ns.e('spinner')"></div>
        </div>
      </Transition>
      <Transition :name="transitionName" mode="out-in">
        <section :class="ns.e('container')"
                 :key="`${year}-${month}`">
          <div v-for="dayItem in daysList"
               :key="`${dayItem.year}-${dayItem.month}-${String(dayItem.day).padStart(2, '0')}`"
               :class="[
                  ns.e('day'),
                  ns.is('last', dayItem.isPrevMonth),
                  ns.is('cur', !dayItem.isPrevMonth && !dayItem.isNextMonth),
                  ns.is('next', dayItem.isNextMonth),
                  ns.is('weekend', dayItem.isWeekend),
                  ns.is('mode-dot', effectiveDisplayMode === 'dot')
                ]"
               @click="handleClick(dayItem)">
            <div :class="[
              ns.e('label'),
              ns.is('today', dayItem.isToday),
            ]">
              {{ dayItem.day }}
            </div>
            <slot v-if="effectiveDisplayMode === 'default'
                        && getDayData(dayItem)"
                  :name="`${dayItem.year}-${String(dayItem.month).padStart(2, '0')}-${String(dayItem.day).padStart(2, '0')}`"
                  :dataItem="getDayData(dayItem)">
              <slot name="day-cell">
              </slot>
            </slot>
            <div v-if="effectiveDisplayMode === 'dot'
                        && getDayData(dayItem)"
                 :class="ns.e('dot')"></div>
          </div>
        </section>
      </Transition>
    </div>
  </div>
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


  .ca-calendar__loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ca-calendar__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid color-mix(in srgb, var(--color-accent, #3b82f6) 20%, transparent);
    border-top-color: var(--color-accent, #3b82f6);
    border-radius: 50%;
    animation: ca-calendar-spin 0.8s linear infinite;
  }

  @keyframes ca-calendar-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
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

  .ca-calendar__dot {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-accent, #3b82f6);
    pointer-events: none;
  }
</style>