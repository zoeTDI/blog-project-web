<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { CaIcon } from '@caldm/ui';
  import { caMarqueeIconMap } from './constants';
  import type { CaMarqueeEmits, CaMarqueeExpose, CaMarqueeProps } from './types';

  defineOptions({
    name: 'CaMarquee',
  });

  const props = withDefaults(defineProps<CaMarqueeProps>(), {
    icon: 'info',
    content: '',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
    teleportTo: 'body',
  });

  const emit = defineEmits<CaMarqueeEmits>();

  const containerRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);

  const isScrollable = ref<boolean>(false);
  const visible = ref<boolean>(true);

  const textWidth = ref<number>(0);
  const containerWidth = ref<number>(0);

  let timer: ReturnType<typeof setTimeout> | null = null;
  const ns = useCSSNamespace('marquee');

  const icon = computed(() => {
    return caMarqueeIconMap[props.icon];
  });

  const classes = computed(() => {
    return [ns.b(), ns.is('closeable', props.closeable), ns.m(props.icon)];
  });

  const animationDuration = computed(() => {
    if (!textWidth.value || !props.speed) return '0s';
    const totalDistance = textWidth.value + containerWidth.value;
    return `${totalDistance / props.speed}s`;
  });

  const contentStyle = computed(() => {
    if (!isScrollable.value) return {};
    return ns.cssVarBlock({
      'text-width': `${textWidth.value}px`,
      'container-width': `${containerWidth.value}px`,
      duration: animationDuration.value,
    });
  });

  const checkScroll = async () => {
    if (!props.scrollable) {
      isScrollable.value = false;
      return;
    }
    await nextTick();
    if (containerRef.value && contentRef.value) {
      const cw = containerRef.value.offsetWidth;
      const tw = contentRef.value.offsetWidth;

      containerWidth.value = cw;
      textWidth.value = tw;
      isScrollable.value = tw > cw;
    }
  };

  const close = () => {
    if (!visible.value) return;
    visible.value = false;
    emit('close');
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

  defineExpose<CaMarqueeExpose>({
    close,
  });
</script>

<template>
  <Teleport
    :to="props.teleportTo || 'body'"
    :disabled="!props.teleportTo">
    <div
      v-if="visible"
      :class="classes">
      <div
        v-if="props.icon"
        :class="[ns.e('icon')]">
        <CaIcon
          :icon="icon"
          :size="22" />
      </div>

      <div
        ref="containerRef"
        :class="[ns.e('content-wrapper')]">
        <div
          ref="contentRef"
          :class="[ns.e('content'), ns.is('scrolling', isScrollable)]"
          :style="contentStyle">
          {{ props.content }}
        </div>
      </div>

      <div
        v-if="props.closeable"
        :class="[ns.e('close-btn')]"
        @click="close">
        <CaIcon
          :icon="XMarkIcon"
          :size="18" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
  .ca-marquee {
    position: absolute;
    top: 0;
    left: 0;

    width: 100svw;

    padding: 4px 0;

    font-size: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
  }

  .ca-marquee.ca-marquee--info {
    background-color: #fff4a1;
  }

  .ca-marquee.ca-marquee--success {
    background-color: #abffa7;
    color: #545454;
  }

  .ca-marquee.ca-marquee--warning {
    background-color: #ffa744;
    color: #fff;
  }

  .ca-marquee.ca-marquee--error {
    background-color: #fd8484;
    color: #fff;
  }

  .ca-marquee .ca-marquee__icon {
    margin-left: 16px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .ca-marquee__content-wrapper {
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
  }

  .ca-marquee__content {
    white-space: nowrap;
  }

  .ca-marquee__content.is-scrolling {
    padding-left: 100%;
    animation: ca-marquee-scroll var(--ca-marquee-duration) linear infinite;
  }

  .ca-marquee__content.is-scrolling:hover {
    animation-play-state: paused;
  }

  .ca-marquee .ca-marquee__close-btn {
    margin-left: auto;
    padding-right: 16px;
    cursor: pointer;
    flex-shrink: 0;
  }

  @keyframes ca-marquee-scroll {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(calc(-1 * (var(--ca-marquee-text-width) + var(--ca-marquee-container-width))), 0, 0);
    }
  }
</style>