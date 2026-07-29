<script setup lang="ts">
  import type { UploadFile } from '../types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';
  import {
    ArrowPathIcon,
    TrashIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
  } from '@heroicons/vue/24/outline';
  import CaIcon from '../../../../icon/src/Icon.vue';
  import CaUploadProgress from '../components/UploadProgress.vue';
  import CaFileIcon from '../components/FileIcon.vue';

  defineOptions({
    name: 'CaUploadItemText',
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

  const { b, e, is } = useCSSNamespace('upload-item-text');

  const isUploading = computed(() => props.file.status === 'uploading');
  const isError = computed(() => props.file.status === 'error');
  const isSuccess = computed(() => props.file.status === 'success');

  const handleRemove = () => {
    if (props.disabled) return;
    emit('remove', props.file);
  };

  const handleRetry = () => {
    if (props.disabled) return;
    emit('retry', props.file);
  };

  const handlePreview = () => {
    emit('preview', props.file);
  };
</script>

<template>
  <div
    :class="[
      b(),
      is('uploading', isUploading),
      is('error', isError),
      is('success', isSuccess),
      is('disabled', disabled),
    ]"
  >
    <div :class="e('info')" @click="handlePreview">
      <div :class="e('thumbnail')">
        <img
          v-if="file.url"
          :src="file.url"
          :alt="file.name"
          :class="e('img')"
        />
        <CaFileIcon v-else :file="file" size="20px" />
      </div>
      <span :class="e('name')" :title="file.name">
        {{ file.name }}
      </span>
    </div>

    <div :class="e('actions')">
      <template v-if="isUploading">
        <CaUploadProgress
          :percent="file.percent || 0"
          :show-text="false"
          :stroke-width="3"
          :class="e('progress')"
        />
      </template>

      <span v-if="isSuccess" :class="e('status-icon')">
        <CaIcon :icon="DocumentCheckIcon" color="var(--color-success, #10b981)" />
      </span>

      <span v-if="isError" :class="e('status-icon')" title="上传失败">
        <CaIcon :icon="ExclamationCircleIcon" color="var(--color-error, #ef4444)" />
      </span>

      <button
        v-if="isError && !disabled"
        type="button"
        :class="e('btn-retry')"
        title="重试"
        @click="handleRetry"
      >
        <CaIcon :icon="ArrowPathIcon" size="16px" />
      </button>

      <button
        v-if="!disabled"
        type="button"
        :class="e('btn-remove')"
        title="删除"
        @click="handleRemove"
      >
        <CaIcon :icon="TrashIcon" size="16px" />
      </button>
    </div>
  </div>
</template>

<style scoped>
  .ca-upload-item-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: 6px;
    background-color: var(--color-bg-secondary, #f9fafb);
    transition: background-color 0.2s ease;
    margin-bottom: 8px;
    gap: 12px;
  }

  .ca-upload-item-text:hover {
    background-color: var(--color-bg-hover, #f3f4f6);
  }

  .ca-upload-item-text__info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
    cursor: pointer;
  }

  .ca-upload-item-text__thumbnail {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
  }

  .ca-upload-item-text__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ca-upload-item-text__name {
    font-size: 14px;
    color: var(--color-text-main, #374151);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-upload-item-text__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .ca-upload-item-text__progress {
    width: 80px;
  }

  .ca-upload-item-text__btn-retry,
  .ca-upload-item-text__btn-remove {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
    color: var(--color-text-muted, #9ca3af);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: color 0.2s, background-color 0.2s;
  }

  .ca-upload-item-text__btn-retry:hover {
    color: var(--color-primary, #3b82f6);
    background-color: var(--color-bg-active, #e5e7eb);
  }

  .ca-upload-item-text__btn-remove:hover {
    color: var(--color-error, #ef4444);
    background-color: var(--color-bg-active, #e5e7eb);
  }
</style>