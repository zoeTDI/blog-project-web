<script setup lang="ts">
  import { provide, computed } from 'vue';
  interface RowProps {
    gap?: number;
  }

  const props = withDefaults(defineProps<RowProps>(), {
    gap: 0,
    offset: 0,
  });

  provide(
    'CaRowGap',
    computed(() => props.gap)
  );

  const rowStyles = computed(() => ({
    gap: `${props.gap}px`,
  }));
</script>

<template>
  <div
    class="ca-row"
    :style="rowStyles">
    <slot />
  </div>
</template>

<style scoped>
  .ca-row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    /* 确保 gap 产生的额外宽度不会撑破容器（在特定 flex 模式下有用） */
  }
</style>