<script setup lang="ts">
  import type { CaDayTodoEmits, CaDayTodoProps, TodoItem } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { isArray } from '@caldm/utils';
  import { computed } from 'vue';

  defineOptions({
    name: 'CaCalendarTodo',
  });

  const props = withDefaults(defineProps<CaDayTodoProps>(), {
    items: () => [],
    maxVisible: 2,
  });

  const emits = defineEmits<CaDayTodoEmits>();

  const ns = useCSSNamespace('calendar-todo');

  const visibleItems = computed(() => {
    if (!props.items) return [];
    return props.items.slice(0, props.maxVisible);
  });

  const remainingCount = computed(() => {
    if (!props.items) return 0;
    return Math.max(0, props.items.length - props.maxVisible);
  });

  const remainingItems = computed(() => {
    if (!props.items || remainingCount.value === 0) return [];
    return props.items.slice(props.maxVisible);
  });

  const handleItemClick = (item: TodoItem, e: MouseEvent) => {
    e.stopPropagation();
    emits('click-item', item, e);
  };

  const handleMoreClick = (e: MouseEvent) => {
    e.stopPropagation();
    emits('click-more', remainingItems.value, e);
  };
</script>

<template>
  <div v-if="isArray(items) && items.length > 0"
       :class="ns.b()">
    <div v-for="item in visibleItems"
         :key="item.id"
         :class="ns.e('item')"
         :style="{ backgroundColor: item.color || 'var(--color-bg-hover, #f3f4f6)' }"
         :title="item.title ? `${item.title}: ${item.context}` : item.context"
         @click="handleItemClick(item, $event)">
      <span v-if="item.title"
            :class="ns.e('title')">
        <slot name="title">{{ item.title }}</slot>
      </span>
      <span :class="ns.e('context')">
        <slot>{{ item.context }}</slot>
      </span>
    </div>
    <div
      v-if="remainingCount > 0"
      :class="[ns.e('item'), ns.e('more')]"
      @click="handleMoreClick($event)"
    >
      +{{ remainingCount }} 更多
    </div>
  </div>
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
  }

  .ca-calendar-todo__item {
    width: 100%;
    box-sizing: border-box;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 11px;
    line-height: 1.3;
    cursor: pointer;
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
    /* 标题超长截断 */
    max-width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ca-calendar-todo__context {
    /* 正文内容超长截断 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0; /* 配合 flex 子项实现文本截断必备 */
  }

  /* "+N 更多" 截断标签样式 */
  .ca-calendar-todo__more {
    background-color: transparent;
    color: var(--color-text-secondary, #6b7280);
    font-weight: 500;
    font-size: 10px;
    padding: 1px 4px;
    justify-content: flex-start;
  }

  .ca-calendar-todo__more:hover {
    color: var(--color-accent, #3b82f6);
    background-color: rgba(59, 130, 246, 0.08);
  }
</style>