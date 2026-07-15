<script setup lang="ts">
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import {
    CaSelectDropdown,
    caSelectKey,
    type CaSelectProps,
  } from '@/components/ca/caSelect';

  const props = withDefaults(defineProps<CaSelectProps>(), {
    placeholder: 'Select',
    size: 'M',
  });

  const model = defineModel({ default: '' });
  const ns = useCSSNamespace('select');

  const inputRef = ref<HTMLInputElement | null>(null);

  const visible = ref<boolean>(false);

  const inputWidth = computed(() => {
    if (!inputRef.value) return 0;
    return (inputRef.value as HTMLInputElement).offsetWidth;
  });

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.m(props.size)];
    return cls;
  });

  provide(caSelectKey, { inputWidth });

  const dropdownVisibleControl = (e: Event) => {
    const targetEl = e.target;
    if (!targetEl) return;
    const classes = Array.from((targetEl as HTMLInputElement).classList);
    visible.value = classes.includes(ns.e('input'));
  };

  onMounted(() => {
    window.addEventListener('click', dropdownVisibleControl);
  });

  onUnmounted(() => {
    window.removeEventListener('click', dropdownVisibleControl);
  });
</script>

<template>
  <div :class="classes">
    <input
      ref="inputRef"
      type="text"
      :class="[ns.e('input')]"
      v-bind:value="model"
      :placeholder="props.placeholder" />
    <CaSelectDropdown v-show="visible">
      <slot />
    </CaSelectDropdown>
  </div>
</template>

<style scoped>
  @import '../styles/style.css';
</style>
