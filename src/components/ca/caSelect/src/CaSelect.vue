<script setup lang="ts">
  import { computed } from 'vue';
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import  { CaSelectDropdown, type CaSelectProps } from '@/components/ca/caSelect';

  const props = withDefaults(defineProps<CaSelectProps>(), {
    placeholder: 'Select',
    size: 'M',
  });

  const model = defineModel({ default: '' });
  const ns = useCSSNamespace('select');

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.m(props.size)];
    return cls;
  });
</script>

<template>
  <div :class="classes">
    <input
      type="text"
      v-bind:value="model"
      :placeholder="props.placeholder" />
    <CaSelectDropdown />
  </div>
</template>

<style scoped>
  @import '../styles/style.css';
</style>
