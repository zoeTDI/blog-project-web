<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  options: { label: string, value: string | number }[];
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'select']);
const popoverRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    emit('update:modelValue', false);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div v-if="modelValue" ref="popoverRef" class="menu-popover">
    <div 
      v-for="opt in options" 
      :key="opt.value" 
      class="menu-item"
      @click="emit('select', opt.value)"
    >
      {{ opt.label }}
    </div>
  </div>
</template>

<style scoped>
.menu-popover {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 120px;
  padding: 4px 0;
}
.menu-item { padding: 8px 16px; cursor: pointer; color: #333; font-size: 14px; }
.menu-item:hover { background: #f5f5f5; }
</style>