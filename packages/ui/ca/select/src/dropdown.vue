<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';
  import type { CaSelectDropdownProps } from './types.ts';

  defineOptions({
    name: 'CaSelectDropdown',
  });

  const props = defineProps<CaSelectDropdownProps>()

  const ns = useCSSNamespace('select-dropdown');

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.placement)
    ];
    return cls;
  });

  const styles = computed(() => ({
    top: props.top + 'px',
    left: props.left + 'px',
    minWidth: props.minWidth + 'px',
    maxHeight: props.maxHeight + 'px',
  }));
</script>

<template>
  <Teleport to="body">
    <div
      :class="classes"
      :style="styles"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
  .ca-select-dropdown {
    position: fixed;
    overflow-y: auto;
    background-color: var(--color-container-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 4px 0;
    z-index: 1000;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
    transition: all 0.2s ease-in-out;
    /* top, left, minWidth, maxHeight 由 JavaScript 动态设置 */
  }
</style>