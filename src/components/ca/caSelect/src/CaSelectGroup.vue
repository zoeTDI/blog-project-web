<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed } from 'vue';
  import type { CaSelectGroupProps } from '@/components/ca/caSelect';

  const props = withDefaults(defineProps<CaSelectGroupProps>(), {
    label: '',
  });

  const ns = useCSSNamespace('select-group');

  const classes = computed(() => {
    const cls = [ns.b()];
    return cls;
  });
</script>

<template>
  <div :class="classes">
    <div :class="[ns.e('select-group-label')]">
      {{ props.label }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .ca-select-group {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: scroll;
  }
</style>
