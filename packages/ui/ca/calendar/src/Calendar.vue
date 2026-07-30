<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';
  import { useCalendar } from './composables/useCalendar.ts';
  import type { CaCalendarEmits, CaCalendarExpose, CaCalendarProps } from './types.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from '@heroicons/vue/24/outline';

  defineOptions({
    name: 'CaCalendar',
  });

  const props = withDefaults(defineProps<CaCalendarProps>(), {
    startDay: () => new Date(),
    firstDayOfWeek: 'Monday',
  });

  const emits = defineEmits<CaCalendarEmits>();

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
    const cls: string[] = [
      ns.b(),
    ];
    return cls;
  });

  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth() + 1);
  const day = computed(() => currentDate.value.getDate());

  defineExpose<CaCalendarExpose>({
    prevYear,
    nextYear,
    prevMonth,
    nextMonth,
    goToday,
  });
</script>

<template>
  <div :class="classes">
    <div :class="ns.e('control')">
      <div :class="ns.e('left')">
        <CaIcon :icon="ChevronDoubleLeftIcon"
                :size="24"
                @click="prevYear" />
        <CaIcon :icon="ChevronLeftIcon"
                :size="24"
                @click="prevMonth" />
      </div>
      <div :class="ns.e('center')"
           @click="goToday">
        {{ year }} / {{ month }} / {{ day }}
      </div>
      <div :class="ns.e('right')">
        <CaIcon :icon="ChevronRightIcon"
                :size="24"
                @click="nextMonth" />
        <CaIcon :icon="ChevronDoubleRightIcon"
                :size="24"
                @click="nextYear" />
      </div>
    </div>
    <header :class="ns.e('header')">
      <div :class="ns.e('header-cell')"
           v-for="item in weekDays"
           :key="item">
        {{ item }}
      </div>
    </header>
    <section :class="ns.e('container')">
      <template v-for="day in daysList" :key="day.date">
        <div
          :class="[
            ns.e('day'),
            ns.is('last', day.isPrevMonth),
            ns.is('cur', !day.isPrevMonth && !day.isNextMonth),
            ns.is('next', day.isNextMonth),
            ns.is('weekend', day.isWeekend),
          ]">
          <div :class="[
            ns.e('label'),
            ns.is('today', day.isToday),
          ]">
            {{ day.day }}
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
  .ca-calendar {
    width: 100%;
    border: 1px solid var(--color-border);
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
  }

  .ca-calendar__header-cell:last-child {
    border-right: unset;
  }

  .ca-calendar__container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-width: 0;
    align-content: center;
    justify-items: center;
  }

  .ca-calendar__day {
    width: 100%;
    min-width: 0;
    padding: 4px 8px;
    aspect-ratio: 8/5;
    display: flex;
    flex-direction: column;
    align-items: start;
    will-change: background-color, color;
    transition: background-color 150ms ease,
    color 150ms ease;
    overflow: hidden;
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
</style>