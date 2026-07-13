<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed } from 'vue';

  const ns = useCSSNamespace('select-dropdown');
  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });
</script>

<template>
  <div :class="classes"></div>
</template>

<style scoped>
</style>
