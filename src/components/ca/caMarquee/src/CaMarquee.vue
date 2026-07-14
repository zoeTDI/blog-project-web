<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
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

  const containerRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);

  const scrollbable = ref<boolean>(false);
  const visible = ref<boolean>(true);

  const textWidth = ref<number>(0);
  const containerWidth = ref<number>(0);

  let timer: ReturnType<typeof setTimeout> | null = null;
  const ns = useCSSNamespace('marquee');

  const icon = computed(() => {
    return caMarqueeIconMap[props.icon];
  });

  const classes = computed(() => {
    const cls = [ns.b(), ns.is('closeable', props.closeable), ns.m(props.icon)];
    return cls;
  });

  const animationDuration = computed(() => {
    if (!textWidth.value || !props.speed) return '0s';
    const totalDistance = textWidth.value + containerWidth.value;
    return `${totalDistance / props.speed}s`;
  });

  const contentStyle = computed(() => {
    if (!scrollbable.value) return {};
    return ns.cssVarBlock({
      'text-width': `${textWidth.value}px`,
      'container-width': `${containerWidth.value}px`,
      duration: animationDuration.value,
    });
  });

  const checkScroll = async () => {
    if (!props.scrollable) {
      scrollbable.value = false;
      return;
    }
    await nextTick();
    if (containerRef.value && contentRef.value) {
      const cw = containerRef.value.offsetWidth;
      const tw = contentRef.value.offsetWidth;

      containerWidth.value = cw;
      textWidth.value = tw;
      scrollbable.value = tw > cw;
    }
  };

  const close = () => {
    visible.value = false;
  };

  watch(() => props.content, checkScroll);

  onMounted(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    if (!props.closeable) {
      timer = setTimeout(close, props.duration || 10000);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkScroll);
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

    <div
      ref="containerRef"
      :class="[ns.e('content-wrapper')]">
      <div
        ref="contentRef"
        :class="[ns.e('content'), ns.is('scrolling', scrollbable)]"
        :style="contentStyle">
        {{ contentStyle }}
        {{ props.content }}
      </div>
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
