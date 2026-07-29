<script setup lang="ts">
  import type { UploadFile } from '../types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';
  import CaIcon from '../../../../icon/src/Icon.vue';
  import {
    EyeIcon,
    TrashIcon,
    ArrowPathIcon,
    ExclamationCircleIcon,
  } from '@heroicons/vue/24/outline';
  import CaUploadProgress from '../components/UploadProgress.vue';
  import CaFileIcon from '../components/FileIcon.vue';

  defineOptions({
    name: 'CaUploadItemCard',
  });

  const props = defineProps<{
    file: UploadFile;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'remove', file: UploadFile): void;
    (e: 'retry', file: UploadFile): void;
    (e: 'preview', file: UploadFile): void;
  }>();

  const { b, e, is } = useCSSNamespace('upload-item-card');

  const isUploading = computed(() => props.file.status === 'uploading');
  const isError = computed(() => props.file.status === 'error');

  const handleRemove = (e: Event) => {
    e.stopPropagation();
    if (props.disabled) return;
    emit('remove', props.file);
  };

  const handleRetry = (e: Event) => {
    e.stopPropagation();
    if (props.disabled) return;
    emit('retry', props.file);
  };

  const handlePreview = (e: Event) => {
    e.stopPropagation();
    emit('preview', props.file);
  };
</script>

<template>
  <div
    :class="[
      b(),
      is('uploading', isUploading),
      is('error', isError),
      is('disabled', disabled),
    ]"
  >
    <!-- 卡片主体：图片预览/图标 -->
    <div :class="e('cover')">
      <img
        v-if="file.url"
        :src="file.url"
        :alt="file.name"
        :class="e('img')"
      />
      <CaFileIcon v-else :file="file" size="36px" />
    </div>

    <!-- 遮罩操作层（上传成功或常规状态时悬浮显示） -->
    <div v-if="!isUploading" :class="e('mask')">
      <button
        v-if="file.url"
        type="button"
        :class="e('action-btn')"
        title="预览"
        @click="handlePreview"
      >
        <CaIcon :icon="EyeIcon" size="18px" />
      </button>

      <button
        v-if="isError && !disabled"
        type="button"
        :class="e('action-btn')"
        title="重试"
        @click="handleRetry"
      >
        <CaIcon :icon="ArrowPathIcon" size="18px" />
      </button>

      <button
        v-if="!disabled"
        type="button"
        :class="e('action-btn')"
        title="删除"
        @click="handleRemove"
      >
        <CaIcon :icon="TrashIcon" size="18px" />
      </button>
    </div>

    <!-- 上传中覆盖层 -->
    <div v-if="isUploading" :class="e('uploading-overlay')">
      <CaUploadProgress
        :percent="file.percent || 0"
        :show-text="true"
        status="default"
        :stroke-width="4"
      />
    </div>

    <!-- 错误状态提示标识 -->
    <div v-if="isError && !isUploading" :class="e('error-badge')" title="上传错误">
      <CaIcon :icon="ExclamationCircleIcon" color="#ef4444" size="20px" />
    </div>
  </div>
</template>

<style scoped>
  .ca-upload-item-card {
    position: relative;
    width: 104px;
    height: 104px;
    border-radius: 8px;
    border: 1px solid var(--color-border, #e5e7eb);
    background-color: var(--color-bg-card, #ffffff);
    overflow: hidden;
    box-sizing: border-box;
  }

  .ca-upload-item-card--error {
    border-color: var(--color-error, #ef4444);
  }

  .ca-upload-item-card__cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ca-upload-item-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ca-upload-item-card__mask {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .ca-upload-item-card:hover .ca-upload-item-card__mask {
    opacity: 1;
  }

  .ca-upload-item-card__action-btn {
    border: none;
    background: transparent;
    color: #ffffff;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, transform 0.2s;
  }

  .ca-upload-item-card__action-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .ca-upload-item-card__uploading-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .ca-upload-item-card__error-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #ffffff;
    border-radius: 50%;
    line-height: 1;
  }
</style>