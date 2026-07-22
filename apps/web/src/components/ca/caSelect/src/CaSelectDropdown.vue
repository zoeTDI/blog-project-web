<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, inject, ref } from 'vue';
  import { caSelectStyleKey } from '@/components/ca/caSelect';

  const ns = useCSSNamespace('select-dropdown');

  const { selectWidth, placement } = inject(caSelectStyleKey, {
    selectWidth: computed(() => 0),
    placement: ref<'bottom' | 'top'>('bottom'),
  });

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.m(placement.value)];
    return cls;
  });

  const styles = computed(() => {
    return {
      width: `${selectWidth.value}px`,
    };
  });
</script>

<template>
  <div
    :class="classes"
    :style="styles">
    <slot />
  </div>
</template>

<style scoped>
  .ca-select-dropdown {
    position: absolute;
    overflow-y: auto;
    left: 0;

    min-height: 20px;
    max-height: 240px;
    background-color: var(--color-container-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 4px 0;
    z-index: 1000;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
    transition: all 0.2s ease-in-out;
  }

  .ca-select-dropdown--bottom {
    top: calc(100% + 4px);
    bottom: auto;
  }

  .ca-select-dropdown--top {
    bottom: calc(100% + 4px);
    top: auto;
  }
</style>
