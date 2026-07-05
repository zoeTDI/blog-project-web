<script setup lang="ts">
  type CursorType = 'pointer' | 'default' | 'text' | 'not-allowed' | '';
  withDefaults(
    defineProps<{
      cursor?: CursorType;
    }>(),
    {
      cursor: 'default',
    }
  );
</script>

<template>
  <li
    class="ca-list-item"
    :style="{ cursor: cursor || 'default' }">
    <div class="ca-list-item_prefix">
      <slot name="prefix"></slot>
    </div>
    <div class="ca-list-item_container">
      <slot />
    </div>
    <div
      v-if="$slots.suffix"
      class="ca-list-item_suffix">
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

  .ca-list-item_prefix {
  }

  .ca-list-item_container {
    flex: 1;
    margin: 0 8px;
  }

  .ca-list-item_suffix {
  }
</style>
