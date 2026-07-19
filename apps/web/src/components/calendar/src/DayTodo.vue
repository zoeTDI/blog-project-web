<script setup lang="ts">
  import type { DayTodoProps, TodoItem } from '@/components/calendar';

  const props = withDefaults(defineProps<DayTodoProps>(), {
    todos: () => [],
  });
  const displayText = (item: TodoItem): string =>
    item.title && item.title.trim() !== '' ? item.title : item.context;
</script>

<template>
  <div class="day-todo">
    <div
      class="todo-item"
      v-for="item in props.todos.slice(0, 3)"
      :key="item.id"
      :style="{ backgroundColor: item.color || 'transparent' }">
      <div class="label">{{ displayText(item) }}</div>
    </div>
    <div
      class="todo-item"
      v-if="props.todos.length >= 3">
      <div class="context">...</div>
    </div>
  </div>
</template>

<style scoped>
  .day-todo {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .todo-item {
    width: 100%;
    padding: 2px 4px;
    border-radius: 4px;
    box-sizing: border-box;

    color: var(--color-text-primary, #333);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ellipsis {
    text-align: center;
    font-weight: bold;
  }
</style>
