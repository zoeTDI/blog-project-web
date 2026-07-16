<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, ref } from 'vue';

  const ns = useCSSNamespace('side-menu-group');

  const isExpand = ref<boolean>(false);

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.is('expand', isExpand.value)];
    return cls;
  });
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>
  @import '../styles/caSideMenuGroup.css';
</style>
