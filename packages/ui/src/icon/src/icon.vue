<script setup lang="ts">
  import type { CaIconProps, IconType } from '@/icon';
  import { computed } from 'vue';
  import { getIconComponent } from '@/icon/src/registry.ts';

  defineOptions({
    name: 'CaIcon',
  });
  const props = defineProps<CaIconProps>();

  const iconType = computed<IconType | string>(() => {
    if (props.type) {
      return props.type;
    }
    if (props.icon) {
      if (typeof props.icon === 'object' && 'path' in props.icon) {
        return 'simple';
      }
      return 'hero';
    }
    return 'hero';
  });

  const currentComponent = computed(() => {
    const comp = getIconComponent(iconType.value);
    if (!comp) {
      console.warn(`[CaIcon]: Unregistered icon type "${iconType.value}"`);
    }
    return comp;
  });
</script>

<template>
  <component
    :is="currentComponent"
    v-if="currentComponent"
    v-bind="$props" />
</template>

<style scoped>

</style>