<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, inject } from 'vue';
  import { caSelectKey } from '@/components/ca/caSelect';

  const ns = useCSSNamespace('select-dropdown');

  const { inputWidth } = inject(caSelectKey, { inputWidth: computed(() => 0) });

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });

  const styles = computed(() => {
    return {
      width: `${inputWidth.value}px`,
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
    top: calc(100% + 12px);
    left: 0;

    min-height: 20px;
    background-color: var(--color-container-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 1000;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }
</style>
