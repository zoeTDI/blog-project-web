<script setup lang="ts">
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import {
    CaSelectDropdown,
    caSelectKey,
    caSelectStyleKey,
    type CaSelectProps,
  } from '@/components/ca/caSelect';

  const props = withDefaults(defineProps<CaSelectProps>(), {
    disabled: false,
    placeholder: 'Select',
    size: 'M',
  });

  const model = defineModel({ default: '' });
  const ns = useCSSNamespace('select');

  const selectRef = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);

  const visible = ref<boolean>(false);
  const displayLabel = ref<string>('');

  const selectWidth = computed(() => {
    if (!selectRef.value) return 0;
    return (selectRef.value as HTMLInputElement).offsetWidth;
  });

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.size),
      ns.is('disabled', props.disabled),
    ];
    return cls;
  });

  const selectOption = (value: any, label: string) => {
    model.value = value;
    displayLabel.value = label;
    visible.value = false;
  };

  provide(caSelectKey, { selectOption, selectedValue: model });
  provide(caSelectStyleKey, { selectWidth });

  const dropdownVisibleControl = (e: Event) => {
    const targetEl = e.target as HTMLElement;
    if (!targetEl || !selectRef.value) return;
    const isClickInside = selectRef.value.contains(targetEl);
    if (isClickInside) {
      if (targetEl.classList.contains(ns.e('input'))) {
        visible.value = true;
      }
    } else {
      visible.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', dropdownVisibleControl);
  });

  onUnmounted(() => {
    window.removeEventListener('click', dropdownVisibleControl);
  });
</script>

<template>
  <div
    ref="selectRef"
    :class="classes">
    <input
      :disabled="props.disabled"
      ref="inputRef"
      type="text"
      :class="[ns.e('input')]"
      v-bind:value="model"
      :placeholder="props.placeholder" />
    <CaSelectDropdown v-show="visible && !props.disabled">
      <slot />
    </CaSelectDropdown>
  </div>
</template>

<style scoped>
  @import '../styles/style.css';
</style>
