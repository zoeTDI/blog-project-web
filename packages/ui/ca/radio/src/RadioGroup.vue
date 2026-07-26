<script setup lang="ts">
  import type { CaRadioGroupProps } from './types.ts';
  import { computed, provide } from 'vue';
  import { type CaRadioGroupContext, caRadioGroupKey } from './constants.ts';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaRadioGroup',
  });

  const props = withDefaults(defineProps<CaRadioGroupProps>(), {
    size: 'M',
    layout: 'list',
    disabled: false,
  });

  const model = defineModel();

  const ns = useCSSNamespace('radio-group');

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.layout),
      ns.m(props.size),
    ];
    return cls;
  });

  const handleChange = (val: any) => {
    model.value = val;
  };

  provide(caRadioGroupKey, {
    modelValue: computed(() => model),
    size: computed(() => props.size),
    layout: computed(() => props.layout),
    disabled: computed(() => props.disabled),
    changeEvent: handleChange,
  });
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>

</style>