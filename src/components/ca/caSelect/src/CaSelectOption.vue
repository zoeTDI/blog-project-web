<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed } from 'vue';

  const ns = useCSSNamespace('select-option');

  const classes = computed(() => {
    const cls = [ns.b()];
    return cls;
  });
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped></style>
