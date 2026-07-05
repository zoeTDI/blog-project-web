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

  const open = () => {
    visible.value = true;
  };

  // 暴露给外部的 close 方法
  const close = () => {
    visible.value = false;
    emits('close'); // 依然触发事件，方便外部可能需要的监听
  };

  watch(visible, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
  });

  onUnmounted(() => {
    document.body.style.overflow = '';
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
      @click.self="close">
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
        class="ca-image-viewer__img" />
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
    animation: zoomIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
