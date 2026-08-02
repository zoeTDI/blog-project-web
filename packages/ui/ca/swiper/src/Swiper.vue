<script setup lang="ts">
  import type { CaSwiperEmits, CaSwiperExpose, CaSwiperOption, CaSwiperProps } from './types.ts';
  import { caSwiperImageFitMode, caSwiperMode } from './constants.ts';
  import { isString } from '@caldm/utils';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import CaIcon from '../../../icon/src/Icon.vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

  defineOptions({
    name: 'CaSwiper',
  });

  const props = withDefaults(defineProps<CaSwiperProps>(), {
    options: () => [],
    mode: caSwiperMode.unset,
    disabled: false,
    delay: 3000,
    changeable: false,
    btnSize: 20,
    imageFitMode: caSwiperImageFitMode.contain,
  });

  const emits = defineEmits<CaSwiperEmits>();

  const ns = useCSSNamespace('swiper');

  const containerRef = ref<HTMLDivElement | null>(null);
  const optionWidth = ref('100%');
  let resizeObserver: ResizeObserver | null = null;

  const internalActiveIndex = ref(1);
  const isDragging = ref(false);
  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const touchDeltaX = ref(0);
  const transitionEnabled = ref(true);

  // 自动轮播相关变量与状态
  let timer: ReturnType<typeof setInterval> | null = null;
  const isFirstImageLoaded = ref(false); // 标记首张图片是否加载完成
  const isHovered = ref(false);         // 标记鼠标是否悬浮在轮播图上

  const originalLen = computed(() => props.options?.length ?? 0);
  const displayOptions = computed(() => {
    if (!props.options || props.options.length === 0) return [];
    const last = props.options[props.options.length - 1];
    const first = props.options[0];
    return [last, ...props.options, first];
  });

  const changeable = computed(() => {
    if (!props.delay || props.delay <= 0) {
      return true;
    } else {
      return props.changeable;
    }
  });

  const wrapperStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.height) {
      style.height = isString(props.height) ? props.height : `${props.height}px`;
    }
    if (props.aspectRatio) {
      style.aspectRatio = String(props.aspectRatio);
    }
    return style;
  });

  const trackTransform = computed(() => {
    if (isDragging.value) {
      return `translateX(calc(-${internalActiveIndex.value * 100}% + ${touchDeltaX.value}px))`;
    }
    return `translateX(-${internalActiveIndex.value * 100}%)`;
  });

  const updateWidth = () => {
    if (!containerRef.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    optionWidth.value = rect.width + 'px';
  };

  const handleTransitionEnd = (e: TransitionEvent) => {
    const targetEl = e.target as HTMLElement;
    if (
      !targetEl.classList.contains(ns.e('option-container')) ||
      e.propertyName !== 'transform'
    ) {
      return;
    }

    const len = originalLen.value;
    if (len === 0) return;

    const current = internalActiveIndex.value;

    // 滑动到了克隆的最后一项（视觉上的第一项）
    if (current === len + 1) {
      transitionEnabled.value = false;
      internalActiveIndex.value = 1;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          transitionEnabled.value = true;
        });
      });
      return;
    }

    // 滑动到了克隆的第一项（视觉上的最后一项）
    if (current === 0) {
      transitionEnabled.value = false;
      internalActiveIndex.value = len;

      nextTick(() => {
        void targetEl.offsetHeight;
        transitionEnabled.value = true;
      });
      return;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (props.disabled) return;
    stopAutoplay();
    isDragging.value = true;
    touchStartX.value = e.touches[0].clientX;
    touchStartY.value = e.touches[0].clientY;
    touchDeltaX.value = 0;
    transitionEnabled.value = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value || props.disabled) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.value;
    const diffY = currentY - touchStartY.value;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (e.cancelable) e.preventDefault();
    } else {
      return;
    }

    touchDeltaX.value = diffX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.value || props.disabled) return;
    isDragging.value = false;

    transitionEnabled.value = true;

    const swipeThreshold = 50;

    if (touchDeltaX.value > swipeThreshold) {
      prev();
    } else if (touchDeltaX.value < -swipeThreshold) {
      next();
    }

    touchDeltaX.value = 0;
    // 只有在鼠标没有悬浮时才恢复自动轮播
    if (!isHovered.value) {
      startAutoplay();
    }
  };

  const getOriginalInfo = (internalIdx: number) => {
    const len = originalLen.value;
    if (len === 0) {
      return { index: 0, option: undefined };
    }
    let originalIdx: number;
    if (internalIdx === 0) {
      originalIdx = len - 1;
    } else if (internalIdx === len + 1) {
      originalIdx = 0;
    } else {
      originalIdx = internalIdx - 1;
    }
    const option = props.options?.[originalIdx];
    return { index: originalIdx, option };
  };

  const getKey = (option: CaSwiperOption | string, index: number): string | number => {
    if (isString(option)) return `${index}-${option}`;
    return option.id;
  };

  const getUrl = (option: CaSwiperOption | string): string => {
    if (isString(option)) return option;
    return option.url;
  };

  const getAlt = (option: CaSwiperOption | string): string | undefined => {
    if (isString(option)) return;
    return option.alt || '';
  };

  const isActiveInternal = (index: number): boolean => {
    return index === internalActiveIndex.value;
  };

  const handleOptionClick = (internalIdx: number) => {
    if (props.disabled || touchDeltaX.value !== 0) return;

    const len = originalLen.value;
    if (len === 0) return;
    let targetInternal = internalIdx;
    if (internalIdx === 0) {
      targetInternal = len;
    } else if (internalIdx === len + 1) {
      targetInternal = 1;
    }

    const { index: originalIdx, option } = getOriginalInfo(targetInternal);
    if (option !== undefined) {
      emits('click', originalIdx, option);
    }

    if (targetInternal === internalActiveIndex.value) return;
    goToInternal(targetInternal);
  };

  const handleIndicatorClick = (originalIndex: number) => {
    if (props.disabled) return;
    const len = originalLen.value;
    if (len === 0) return;
    const targetInternal = originalIndex + 1;
    if (targetInternal === internalActiveIndex.value) return;

    resetAutoplay();
    goToInternal(targetInternal);
  };

  const goToInternal = (internalIdx: number, emitEvent = true) => {
    const len = displayOptions.value.length;
    if (len === 0) return;
    const target = ((internalIdx % len) + len) % len;
    if (target === internalActiveIndex.value && emitEvent) return;
    internalActiveIndex.value = target;
    if (emitEvent) {
      const { index: originalIdx, option } = getOriginalInfo(target);
      if (option !== undefined) {
        emits('change', originalIdx, option);
      }
    }
  };

  const prev = () => {
    const len = displayOptions.value.length;
    if (len === 0) return;
    const newIdx = (internalActiveIndex.value - 1 + len) % len;
    resetAutoplay();
    goToInternal(newIdx);
  };

  const next = () => {
    const len = displayOptions.value.length;
    if (len === 0) return;
    const newIdx = (internalActiveIndex.value + 1) % len;
    resetAutoplay();
    goToInternal(newIdx);
  };

  // --- 自动轮播与悬浮控制逻辑 ---

  const startAutoplay = () => {
    stopAutoplay();
    // 满足条件：delay <= 0 禁用，或者首图未加载完，或者当前鼠标正处于悬浮状态，则不启动
    if (!props.delay || props.delay <= 0 || !isFirstImageLoaded.value || isHovered.value) return;

    timer = setInterval(() => {
      next();
    }, props.delay);
  };

  const stopAutoplay = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // 鼠标移入事件：暂停轮播
  const handleMouseEnter = () => {
    isHovered.value = true;
    stopAutoplay();
  };

  // 鼠标移出事件：恢复轮播
  const handleMouseLeave = () => {
    isHovered.value = false;
    startAutoplay();
  };

  const handleFirstImageLoad = () => {
    if (!isFirstImageLoaded.value) {
      isFirstImageLoaded.value = true;
      startAutoplay();
    }
  };

  watch(
    () => props.delay,
    (newVal) => {
      if (!newVal || newVal <= 0) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  watch(
    () => props.options,
    () => {
      isFirstImageLoaded.value = false;
      stopAutoplay();
    },
    { deep: true }
  );

  defineExpose<CaSwiperExpose>({
    prev,
    next,
  });

  onMounted(() => {
    if (!containerRef.value) return;
    updateWidth();
    resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(containerRef.value);
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    stopAutoplay();
  });
</script>

<template>
  <!-- 在根部或者容器上绑定 mouseenter 和 mouseleave 事件 -->
  <div
    :class="ns.b()"
    :style="wrapperStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div :class="ns.e('container')"
         ref="containerRef"
         @touchstart="handleTouchStart"
         @touchmove="handleTouchMove"
         @touchend="handleTouchEnd">
      <!-- 控制按钮 -->
      <div :class="ns.e('control')" v-if="changeable">
        <div
          :class="ns.e('btn')"
          :style="{ width: (btnSize || 20) + 8 + 'px', height: (btnSize || 20) + 8 + 'px' }"
          @click.stop="prev"
        >
          <CaIcon :icon="ChevronLeftIcon" :size="btnSize || 20" />
        </div>
        <div
          :class="ns.e('btn')"
          :style="{ width: (btnSize || 20) + 8 + 'px', height: (btnSize || 20) + 8 + 'px' }"
          @click.stop="next"
        >
          <CaIcon :icon="ChevronRightIcon" :size="btnSize || 20" />
        </div>
      </div>

      <!-- 轮播轨道 -->
      <div
        :class="[
          ns.e('option-container'),
          ns.is('disabled', props.disabled),
          !transitionEnabled ? ns.m('no-transition') : '',
        ]"
        :style="{ transform: trackTransform }"
        @transitionend="handleTransitionEnd"
      >
        <div
          :class="[ns.e('option'), ns.is('active', isActiveInternal(i))]"
          v-for="(opt, i) in displayOptions"
          :key="`${i}-${getKey(opt, i)}`"
          :style="{ width: optionWidth, minWidth: optionWidth, flexShrink: 0 }"
          @click="handleOptionClick(i)"
        >
          <img
            v-if="i === 1"
            :style="{ objectFit: imageFitMode }"
            :src="getUrl(opt)"
            :alt="getAlt(opt)"
            @load="handleFirstImageLoad"
          />
          <img
            v-else
            :style="{ objectFit: imageFitMode }"
            :src="getUrl(opt)"
            :alt="getAlt(opt)"
          />
        </div>
      </div>

      <!-- 指示器 -->
      <div :class="ns.e('indicator')" v-if="mode !== 'unset' && originalLen > 0">
        <template v-if="mode === 'dot'">
          <div
            :class="[ns.e('dot'), ns.is('active', i === getOriginalInfo(internalActiveIndex).index)]"
            v-for="(opt, i) in options"
            :key="`dot-${i}-${getKey(opt, i)}`"
            @click="handleIndicatorClick(i)"
          ></div>
        </template>
        <template v-if="mode === 'number'">
          <div
            :class="[ns.e('number'), ns.is('active', i === getOriginalInfo(internalActiveIndex).index)]"
            v-for="(opt, i) in options"
            :key="`num-${i}-${getKey(opt, i)}`"
            @click="handleIndicatorClick(i)"
          >
            {{ i + 1 }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes ca-skeleton-loading {
    0% { background-color: #e2e8f0; }
    50% { background-color: #cbd5e1; }
    100% { background-color: #e2e8f0; }
  }

  .ca-swiper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .ca-swiper__container {
    height: 100%;
    overflow: hidden;
  }

  .ca-swiper__control {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 300;
    pointer-events: none;
  }

  .ca-swiper__btn {
    width: 28px;
    height: 28px;
    border-radius: 1000em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
    pointer-events: auto;
  }

  .ca-swiper__option-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    will-change: transform;
    transition: transform 300ms ease;
  }

  .ca-swiper--no-transition {
    transition: none !important;
  }

  .ca-swiper__option {
    width: 100%;
    height: 100%;
    background-color: #e2e8f0;
    animation: ca-skeleton-loading 1.5s infinite ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .is-disabled .ca-swiper__option {
    cursor: default;
  }

  .ca-swiper__option img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  .ca-swiper__indicator {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 12px;
    pointer-events: none;
  }

  .ca-swiper__dot {
    background-color: var(--color-text-primary, #1ea7fd);
    width: 6px;
    height: 6px;
    aspect-ratio: 1/1;
    border-radius: 1000em;
    z-index: 1000;
    pointer-events: auto;
    cursor: pointer;
  }

  .ca-swiper__dot.is-active {
    background-color: var(--color-accent, #aa3bff);
  }

  .ca-swiper__number {
    color: white;
    pointer-events: auto;
    cursor: pointer;
  }

  .ca-swiper__number.is-active {
    color: var(--color-accent, #aa3bff);
  }
</style>