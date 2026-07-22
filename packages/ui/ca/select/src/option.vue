<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, inject, onMounted, watch } from 'vue';
  import type { CaSelectOptionProps } from './types.ts';
  import { caSelectKey } from './constants.ts';

  defineOptions({
    name: 'CaSelectOption',
  });

  const props = defineProps<CaSelectOptionProps>();

  const ns = useCSSNamespace('select-option');
  const selectContext = inject(caSelectKey, null);

  const isSelected = computed(() => {
    if (!selectContext) return false;
    return selectContext.selectedValue.value === props.value;
  });

  const classes = computed(() => {
    const cls = [ns.b(), ns.is('selected', isSelected.value)];
    return cls;
  });

  const handleClick = () => {
    if (!selectContext) return;
    selectContext.selectOption(props.value, props.label);
  };

  const register = () => {
    if (selectContext && selectContext.registerOption) {
      selectContext.registerOption(props.value, props.label);
    }
  };

  watch(
    () => [props.value, props.label],
    () => {
      register();
    },
  );

  onMounted(() => {
    register();
  });
</script>

<template>
  <div
    :class="classes"
    @click="handleClick()">
    {{ props.label }}
  </div>
</template>

<style scoped>
  .ca-select-option {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    color: var(--color-text-primary);
    cursor: pointer;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    font-size: 16px;
    font-weight: 350;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .ca-select-option:hover {
    background-color: var(--color-bg-hover);
    color: var(--color-text-h);
  }

  .ca-select-option.is-selected {
    font-weight: 500;
    color: var(--color-text-hover-accent);
    background-color: var(--color-bg-hover-accent);
  }

  .ca-select-option.is-selected:hover {
    background-color: color-mix(
      in srgb,
      var(--color-bg-hover-accent) 85%,
      var(--color-text-hover-accent) 15%
    );
  }
</style>