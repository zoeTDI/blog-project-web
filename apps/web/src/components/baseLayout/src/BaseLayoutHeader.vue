<script setup lang="ts">
  import { preferences } from '@/core/preferences';
  import { computed } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';

  const ns = useCSSNamespace('base-layout-header');

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });

  const styles = computed(() => {
    if (
      !preferences.header.enable ||
      typeof preferences.header.height !== 'number'
    ) {
      return {};
    }
    const varCss = {
      height: preferences.header.height + 'px',
    };
    return ns.cssVarBlock(varCss);
  });
</script>

<template>
  <div
    :class="classes"
    :style="styles">
    <div :class="ns.e('logo')">
      <slot name="logo"></slot>
    </div>
    <div :class="ns.e('actions')">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<style scoped>
  .ca-base-layout-header {
    height: var(--ca-base-layout-header-height, auto);
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ca-base-layout-header__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 0;
  }
</style>
