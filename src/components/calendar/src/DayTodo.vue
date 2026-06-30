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
      :key="item.id">
      <div class="label">{{ displayText(item) }}</div>
    </div>
    <div
      class="todo-item"
      v-if="props.todos.length >= 3">
      <div class="context">...</div>
    </div>
  </div>
</template>

<style scoped></style>
