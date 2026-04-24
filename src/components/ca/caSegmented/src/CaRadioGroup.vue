<script setup lang="ts">
import { provide, computed } from 'vue';
import { RADIO_GROUP_KEY } from './types';
import type {ComponentSize} from "#/component.ts";

const props = withDefaults(defineProps<{
  modelValue: any;
  size?: ComponentSize
}>(), {size: 'M'})

const emit = defineEmits(['update:modelValue']);

const context = {
  modelValue: computed(() => props.modelValue),
  size: computed(() => props.size),
  changeValue: (val: any) => emit('update:modelValue', val)
};

provide(RADIO_GROUP_KEY, context);
</script>

<template>
  <div class="ca-radio-group" :class="[`is-size-${size}`]">
    <slot />
  </div>
</template>

<style scoped>
.ca-radio-group {
  display: inline-flex;
  background-color: var(--border);
  border: 1px solid var(--border);
  gap: 1px;
}
</style>