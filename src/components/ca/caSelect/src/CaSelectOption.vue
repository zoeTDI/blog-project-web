<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, inject } from 'vue';
  import {
    caSelectKey,
    type CaSelectOptionProps,
  } from '@/components/ca/caSelect';

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
</script>

<template>
  <div
    :class="classes"
    @click="handleClick()">
    {{ props.label }}
  </div>
</template>

<style scoped></style>
