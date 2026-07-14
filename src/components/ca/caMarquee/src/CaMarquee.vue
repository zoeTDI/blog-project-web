<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import {
    caMarqueeIconMap,
    type CaMarqueeProps,
  } from '@/components/ca/caMarquee';
  import { HeroIcon } from '@/components/icon';
  import { XMarkIcon } from '@heroicons/vue/24/outline';

  const props = withDefaults(defineProps<CaMarqueeProps>(), {
    icon: 'info',
    content: '',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
  });

  const visible = ref<boolean>(true);
  let timer: ReturnType<typeof setTimeout> | null = null;
  const ns = useCSSNamespace('marquee');

  const icon = computed(() => {
    return caMarqueeIconMap[props.icon];
  });

  const classes = computed(() => {
    const cls = [ns.b(), ns.is('closeable', props.closeable), ns.m(props.icon)];
    return cls;
  });

  const close = () => {
    visible.value = false;
  };

  onMounted(() => {
    if (!props.closeable) {
      timer = setTimeout(close, props.duration || 10000);
    }
  });

  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
</script>

<template>
  <div
    v-if="visible"
    :class="classes">
    <div
      v-if="props.icon"
      :class="[ns.e('icon')]">
      <HeroIcon
        :icon="icon"
        :size="22" />
    </div>
    <div :class="[ns.e('content')]">
      {{classes}}
      {{ props.content }}
    </div>
    <div
      v-if="props.closeable"
      :class="[ns.e('close-btn')]"
      @click="close">
      <HeroIcon
        :icon="XMarkIcon"
        :size="18" />
    </div>
  </div>
</template>

<style scoped>
  @import '../styles/style.css';
</style>
