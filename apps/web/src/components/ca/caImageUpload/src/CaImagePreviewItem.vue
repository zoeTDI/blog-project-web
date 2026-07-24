<script setup lang="ts">
  import type {
    CaImagePreviewItemEmits,
    CaImagePreviewItemProps,
  } from '@/components/ca/caImageUpload';
  import {
    ArrowUpTrayIcon,
    EyeIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';
  import { CaImage, CaImageViewer } from '@caldm/ui';
  import { ref } from 'vue';

  defineProps<CaImagePreviewItemProps>();
  defineEmits<CaImagePreviewItemEmits>();

  const viewerRef = ref<any>(null);
  const openPreview = () => viewerRef.value?.open();
</script>

<template>
  <div class="preview-item">
    <ca-image
      :src="item.previewUrl"
      :preview="false"
      class="image-core" />

    <div class="mask">
      <div class="actions">
        <button
          class="action-btn"
          @click.stop="$emit('reupload')">
          <span class="icon-wrapper">
            <ArrowUpTrayIcon class="icon" />
          </span>
        </button>
        <button
          class="action-btn"
          @click.stop="openPreview">
          <span class="icon-wrapper">
            <EyeIcon class="icon" />
          </span>
        </button>
      </div>
    </div>

    <div
      class="remove-btn"
      @click.stop="$emit('remove')">
      <div class="icon-wrapper">
        <XMarkIcon class="icon" />
      </div>
    </div>

    <ca-image-viewer
      ref="viewerRef"
      :url="item.previewUrl" />
  </div>
</template>

<style scoped>
  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-border);
  }

  .image-core {
    width: 100%;
    height: 100%;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .preview-item:hover .mask {
    opacity: 1;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid transparent;
    border-radius: 50%;
    padding: 6px;
    color: white;
    cursor: pointer;
    width: 28px;
    height: 28px;
    aspect-ratio: 1/1;
    transition: all 0.3s ease;
    display: flex;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    padding: 2px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
  }

  .remove-btn:hover {
    background: rgba(239, 68, 68, 0.9);
    transform: scale(1.15);
  }

  .icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
