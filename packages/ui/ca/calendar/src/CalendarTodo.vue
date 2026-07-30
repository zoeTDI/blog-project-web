<script setup lang="ts">
  import type { CaDayTodoProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { isArray } from '@caldm/utils';
  import { computed } from 'vue';

  defineOptions({
    name: 'CaCalendarTodo',
  });

  const props = withDefaults(defineProps<CaDayTodoProps>(), {
    items: () => [],
    maxVisible: 2,
    mode: 'default',
  });

  const ns = useCSSNamespace('calendar-todo');

  const visibleItems = computed(() => {
    if (!props.items) return [];
    return props.items.slice(0, props.maxVisible);
  });

  const remainingCount = computed(() => {
    if (!props.items) return 0;
    return Math.max(0, props.items.length - props.maxVisible);
  });
</script>

<template>
  <template v-if="isArray(items) && items.length > 0">

    <div v-if="mode === 'dot'" :class="ns.e('dot')" />
    <div v-else :class="ns.b()">
      <div v-for="item in visibleItems"
           :key="item.id"
           :class="ns.e('item')"
           :style="{ backgroundColor: item.color || 'var(--color-bg-hover, #f3f4f6)' }"
           :title="item.title ? `${item.title}: ${item.context}` : item.context">
        <span v-if="item.title" :class="ns.e('title')">
          <slot name="title">{{ item.title }}</slot>
        </span>
        <span :class="ns.e('context')">
          <slot>{{ item.context }}</slot>
        </span>
      </div>
      <div
        v-if="remainingCount > 0"
        :class="[ns.e('item'), ns.e('more')]"
      >
        +{{ remainingCount }} 更多
      </div>
    </div>
  </template>
</template>

<style scoped>
  .ca-calendar-todo {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
    margin-top: 2px;
    pointer-events: none;
  }

  .ca-calendar-todo__item {
    width: 100%;
    box-sizing: border-box;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 11px;
    line-height: 1.3;
    display: flex;
    align-items: center;
    gap: 4px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition: filter 150ms ease;
  }

  .ca-calendar-todo__item:hover {
    filter: brightness(0.92);
  }

  .ca-calendar-todo__title {
    font-weight: 600;
    flex-shrink: 0;
    max-width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ca-calendar-todo__context {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .ca-calendar-todo__more {
    background-color: transparent;
    color: var(--color-text-secondary, #6b7280);
    font-weight: 500;
    font-size: 10px;
    padding: 1px 4px;
    justify-content: flex-start;
  }

  .ca-calendar-todo__dot {position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-accent, #3b82f6);
    pointer-events: none;
  }

  @media screen and (max-width: 768px) {
    .ca-calendar-todo__dot {
      bottom: 4px;
      width: 5px;
      height: 5px;
    }
  }
</style>