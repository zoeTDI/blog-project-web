<script setup lang="ts">
  import type { CaImageUploaderTriggerEmits } from '@/components/ca/caImageUpload';
  import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline';
  import { ref } from 'vue';

  const emits = defineEmits<CaImageUploaderTriggerEmits>();

  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);

  const openPicker = () => {
    fileInputRef.value?.click();
  };
  const onFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      emits('files-selected', Array.from(files));
      (e.target as HTMLInputElement).value = '';
    }
  };
  const onDrop = (e: DragEvent) => {
    isDragging.value = false;
    const files = e.dataTransfer?.files;
    if (files) {
      emits('files-selected', Array.from(files));
    }
  };
</script>

<template>
  <div
    class="upload-trigger"
    :class="{ 'is-dragging': isDragging }"
    @click="openPicker"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop">
    <input
      type="file"
      ref="fileInputRef"
      class="hidden-input"
      accept="image/*"
      multiple
      @change="onFileChange" />
    <div class="trigger-content">
      <arrow-up-tray-icon class="icon" />
      <span class="text">上传图片</span>
    </div>
  </div>
</template>

<style scoped>
  .upload-trigger {
    width: 100px;
    height: 100px;
    border: 2px dashed var(--color-border);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: var(--color-context-bg);
    color: var(--color-text-primary);
  }

  .upload-trigger:hover {
    border-color: var(--color-border-accent);
    background-color: var(--color-bg-hover-accent);
  }

  .upload-trigger.is-dragging {
    border-color: var(--color-border-accent);
    background-color: var(--color-bg-hover-accent);
    transform: scale(1.02);
  }

  .hidden-input {
    display: none;
  }

  .trigger-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: var(--color-text-primary);
  }
</style>
