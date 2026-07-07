<script setup lang="ts">
  import type {
    CaImageViewEmits,
    CaImageViewerExpose,
    CaImageViewProps,
  } from '@/components/ca/caImage';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { XMarkIcon } from '@heroicons/vue/24/outline';

  withDefaults(defineProps<CaImageViewProps>(), {});

  const visible = ref(false);

  const emits = defineEmits<CaImageViewEmits>();

  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const isDragging = ref(false);
  const startX = ref(0);
  const startY = ref(0);

  const isScaling = ref(false);
  let scaleTimeout: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
    emits('close');
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale.value = Math.min(Math.max(scale.value + delta, 0.1), 6);

    isScaling.value = true;
    if (scaleTimeout) clearTimeout(scaleTimeout);

    scaleTimeout = setTimeout(() => {
      isScaling.value = false;
    }, 500);
  };

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.value = true;
    startX.value = e.clientX - translateX.value * scale.value;
    startY.value = e.clientY - translateY.value * scale.value;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    translateX.value = (e.clientX - startX.value) / scale.value;
    translateY.value = (e.clientY - startY.value) / scale.value;
  };

  const handleMouseUp = () => {
    isDragging.value = false;
  };

  const resetTransform = () => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;

    isScaling.value = true;
    if (scaleTimeout) clearTimeout(scaleTimeout);
    scaleTimeout = setTimeout(() => {
      isScaling.value = false;
    }, 500);
  };

  watch(visible, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
  });

  onUnmounted(() => {
    document.body.style.overflow = '';
    if (scaleTimeout) clearTimeout(scaleTimeout);
  });

  defineExpose<CaImageViewerExpose>({
    open,
    close,
  });

  onMounted(() => {
    document.body.style.overflow = 'hidden';
  });
  onUnmounted(() => {
    document.body.style.overflow = '';
  });
</script>

<template>
  <Teleport to="body">
    <div
      class="ca-image-viewer"
      v-if="visible"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp">
      <div
        class="ca-image-viewer__scale-indicator"
        v-if="isScaling">
        {{ (scale * 100).toFixed(0) }}%
      </div>
      <div
        class="ca-image-viewer__close"
        @click="close">
        <div class="icon">
          <x-mark-icon />
        </div>
      </div>
      <img
        :src="url"
        alt="Preview"
        class="ca-image-viewer__img"
        :style="{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }"
        @wheel="handleWheel"
        @mousedown="handleMouseDown"
        @dblclick="resetTransform"
        @dragstart.prevent />
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
  }

  .ca-image-viewer__close:hover {
    background-color: var(--color-bg-hover-accent);
    color: var(--color-text-hover-accent);
    border-color: var(--color-border-hover-accent);
    transform: scale(1.1);
  }

  .ca-image-viewer__close .icon {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
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
