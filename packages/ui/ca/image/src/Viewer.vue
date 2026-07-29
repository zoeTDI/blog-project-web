<script setup lang="ts">
  import type { CaImageViewEmits, CaImageViewerExpose, CaImageViewProps } from './types.ts';
  import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import CaIcon from '../../../icon/src/Icon.vue';

  defineOptions({
    name: 'CaImageViewer',
  });

  const props = withDefaults(defineProps<CaImageViewProps>(), {
    appendTo: 'body',
  });

  const emits = defineEmits<CaImageViewEmits>();

  const ns = useCSSNamespace('image-viewer');

  const visible = ref(false);
  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const isDragging = ref(false);
  const startX = ref(0);
  const startY = ref(0);

  const isScaling = ref(false);
  let scaleTimeout: ReturnType<typeof setTimeout> | null = null;

  const isAnimating = ref(false);
  let animationTimeout: ReturnType<typeof setTimeout> | null = null;

  let initialPinchDistance = 0;
  let initialScaleForPinch = 1;
  let lastTouchEndTime = 0;
  const DOUBLE_TAP_DELAY = 300;

  const isGlobal = computed(() => {
    return props.appendTo === 'body' || (typeof props.appendTo !== 'string' && props.appendTo === document.body);
  });

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
    emits('close');
  };

  const triggerScaleIndicator = () => {
    isScaling.value = true;
    if (scaleTimeout) clearTimeout(scaleTimeout);
    scaleTimeout = setTimeout(() => {
      isScaling.value = false;
    }, 500);
  };

  const executeDoubleTapAction = () => {
    if (isAnimating.value) return;

    isAnimating.value = true;

    nextTick(() => {
      if (scale.value === 1) {
        scale.value = 1.5;
      } else {
        scale.value = 1;
      }
      translateX.value = 0;
      translateY.value = 0;
      triggerScaleIndicator();
    });

    if (animationTimeout) clearTimeout(animationTimeout);
    animationTimeout = setTimeout(() => {
      isAnimating.value = false;
      animationTimeout = null;
    }, 300);
  };

  const handleDblClick = () => {
    executeDoubleTapAction();
  };

  const handleWheel = (e: WheelEvent) => {
    if (isAnimating.value) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale.value = Math.min(Math.max(scale.value + delta, 0.1), 6);

    triggerScaleIndicator();
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (isAnimating.value) return;
    isDragging.value = true;
    startX.value = e.clientX - translateX.value * scale.value;
    startY.value = e.clientY - translateY.value * scale.value;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || isAnimating.value) return;
    translateX.value = (e.clientX - startX.value) / scale.value;
    translateY.value = (e.clientY - startY.value) / scale.value;
  };

  const handleMouseUp = () => {
    isDragging.value = false;
  };

  const getPinchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (isAnimating.value) return;
    if (e.touches.length === 1) {
      isDragging.value = true;
      const touch = e.touches[0];
      startX.value = touch.clientX - translateX.value * scale.value;
      startY.value = touch.clientY - translateY.value * scale.value;
    } else if (e.touches.length === 2) {
      isDragging.value = false;
      initialPinchDistance = getPinchDistance(e.touches);
      initialScaleForPinch = scale.value;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isAnimating.value) return;
    if (e.touches.length === 1 && isDragging.value) {
      const touch = e.touches[0];
      translateX.value = (touch.clientX - startX.value) / scale.value;
      translateY.value = (touch.clientY - startY.value) / scale.value;
    } else if (e.touches.length === 2 && initialPinchDistance > 0) {
      const currentDistance = getPinchDistance(e.touches);
      const zoomFactor = currentDistance / initialPinchDistance;
      const newScale = Math.min(Math.max(initialScaleForPinch * zoomFactor, 0.1), 6);

      scale.value = newScale;
      triggerScaleIndicator();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDistance = 0;
    }
    if (e.touches.length === 0) {
      // 如果之前处于单指拖拽状态，结束拖拽
      if (isDragging.value) {
        isDragging.value = false;
      } else {
        if (isAnimating.value) return;
        // 移动端点击/轻触结束判定
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTouchEndTime;

        // 如果两次点击间隔在 DOUBLE_TAP_DELAY 以内，且没有发生双指缩放，则判定为移动端双击
        if (timeDiff < DOUBLE_TAP_DELAY && timeDiff > 0) {
          executeDoubleTapAction();
          lastTouchEndTime = 0; // 重置防止三连击触发
          return;
        }
        lastTouchEndTime = currentTime;
      }
    }
  };

  // 仅在 visible 变化时响应式控制 body 滚动
  watch(visible, (val) => {
    if (isGlobal.value) {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  });

  onUnmounted(() => {
    if (isGlobal.value) {
      document.body.style.overflow = '';
    }
    if (scaleTimeout) clearTimeout(scaleTimeout);
  });

  defineExpose<CaImageViewerExpose>({
    open,
    close,
  });
</script>

<template>
  <Teleport :to="props.appendTo || 'body'">
    <div
      v-if="visible"
      :class="[ns.b(), ns.is('local', !isGlobal)]"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div v-if="isScaling" :class="ns.e('scale-indicator')">
        {{ (scale * 100).toFixed(0) }}%
      </div>

      <div :class="ns.e('close')" @click="close">
        <CaIcon :icon="XMarkIcon" :size="24" />
      </div>

      <img
        :src="url"
        alt="Preview"
        :class="ns.e('img')"
        :style="{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transition: isAnimating ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }"
        @wheel="handleWheel"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        @dblclick="handleDblClick"
        @dragstart.prevent
      />
    </div>
  </Teleport>
</template>

<style scoped>
  .ca-image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    background-color: color-mix(in srgb, var(--color-root-bg) 85%, transparent);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .ca-image-viewer.is-local {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .ca-image-viewer__scale-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 20px;
    font-size: 14px;
    pointer-events: none;
    z-index: 10;
    backdrop-filter: blur(4px);
    user-select: none;
  }

  .ca-image-viewer__close {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 48px;
    height: 48px;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    /*防止图片盖住关闭按钮*/
    z-index: 10000;
  }

  .ca-image-viewer__close:hover {
    background-color: var(--color-bg-hover-accent);
    color: var(--color-text-hover-accent);
    border-color: var(--color-border-hover-accent);
    transform: scale(1.1);
  }

  .ca-image-viewer__img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    user-select: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    transform-origin: center center;
  }
</style>