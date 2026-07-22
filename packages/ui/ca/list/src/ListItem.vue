<script setup lang="ts">
  import type { CursorType } from './types.ts';
  import { computed, inject } from 'vue';
  import { caListKey } from './constants.ts';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaListItem',
  });

  withDefaults(
    defineProps<{
      cursor?: CursorType;
    }>(),
    {
      cursor: 'default',
    },
  );

  const { mode } = inject(caListKey, { mode: computed(() => 'plain') });

  const ns = useCSSNamespace('list-item');

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.s(mode.value)];
    return cls;
  });
</script>

<template>
  <li
    :class="classes"
    :style="{ cursor: cursor || 'default' }">
    <div :class="ns.e('prefix')">
      <slot name="prefix"></slot>
    </div>
    <div :class="ns.e('container')">
      <slot />
    </div>
    <div
      v-if="$slots.suffix"
      :class="ns.e('suffix')">
      <slot name="suffix"></slot>
    </div>
  </li>
</template>

<style scoped>
  .ca-list-item {
    display: flex;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid var(--color-border);
    transition: all 0.3s ease;
    font-family: var(--font-text);
    font-size: 13px;
  }

  .ca-list-item:last-child {
    border-bottom: none;
  }

  .ca-list-item:hover {
    padding-left: 8px;
    color: var(--color-text-hover-accent);
  }

  .ca-list-item__prefix {
  }

  .ca-list-item__container {
    flex: 1;
    margin: 0 8px;
  }

  .ca-list-item__suffix {
  }

  .ca-list-plain {
  }

  .ca-list-item-ordered {
    display: list-item;
  }

  .ca-list-item-ordered > div {
    display: inline-flex;
  }

  .ca-list-item-bullet::before {
    content: '•';
    color: var(--color-accent);
    font-weight: bold;
  }
</style>
