<script setup lang="ts">
  import type { ButtonProps } from '@/components/globalTools';
  import { ref } from 'vue';
  import { CaDrawer } from '@/components/ca/caDrawer';
  import { Cog8ToothIcon } from '@heroicons/vue/24/outline';

  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });
  const caDrawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

  const openDrawer = () => {
    if (!caDrawerRef.value) return;
    caDrawerRef.value.open();
  };
</script>

<template>
  <div class="tool-wrapper">
    <button
      :class="['tool-btn', shape]"
      @click="openDrawer()"
      title="切换语言">
      <cog8-tooth-icon class="icon" />
    </button>
    <ca-drawer ref="caDrawerRef">
      <div class="preferences-setting-container"></div>
    </ca-drawer>
  </div>
</template>

<style scoped>
  @import 'style.css';
  .preferences-setting-container *,
  .preferences-setting-container {
    outline: 1px dashed #aaaaaa;
  }
</style>
