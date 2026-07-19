<script setup lang="ts">
  import {
    type CaImageUploadEmits,
    type CaImageUploadExpose,
    type CaImageUploadProps,
    useUploader,
  } from '@/components/ca/caImageUpload';
  import { computed, ref } from 'vue';
  import CaImagePreviewItem from '@/components/ca/caImageUpload/src/CaImagePreviewItem.vue';
  import CaImageUploaderTrigger from '@/components/ca/caImageUpload/src/CaImageUploaderTrigger.vue';

  const props = withDefaults(defineProps<CaImageUploadProps>(), {
    mode: 'multiple',
    maxCount: 9,
    maxSize: 5,
  });

  const emits = defineEmits<CaImageUploadEmits>();

  const replaceIndex = ref<number | null>(null);
  const replaceInputRef = ref<HTMLInputElement | null>(null);

  const { files, addFiles, replaceFile, removeFile, clearFiles } = useUploader({
    maxCount: props.maxCount,
    maxSize: props.maxSize,
  });

  const showTrigger = computed(() => {
    if (props.mode === 'single') return files.value.length === 0;
    return files.value.length < props.maxCount;
  });

  const handleFilesSelected = (newFiles: File[]) => {
    addFiles(newFiles);
    emits(
      'update:modelValue',
      files.value.map((f) => f.file)
    );
  };

  const handleRemove = (index: number) => {
    removeFile(index);
    emits(
      'update:modelValue',
      files.value.map((f) => f.file)
    );
  };

  const triggerReplace = (index: number) => {
    replaceIndex.value = index;
    replaceInputRef.value?.click();
  };

  const handleReplaceFile = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const selectedFiles = target.files;

    if (
      selectedFiles &&
      selectedFiles.length > 0 &&
      replaceIndex.value !== null
    ) {
      replaceFile(replaceIndex.value, selectedFiles[0]);
      emits(
        'update:modelValue',
        files.value.map((f) => f.file)
      );
      target.value = '';
      replaceIndex.value = null;
    }
  };

  defineExpose<CaImageUploadExpose>({ clearFiles});
</script>

<template>
  <div class="ca-image-upload">
    <input
      type="file"
      ref="replaceInputRef"
      class="hidden-input"
      @change="handleReplaceFile"
      accept="image/*" />
    <transition-group
      name="list"
      tag="div"
      class="upload-list">
      <ca-image-uploader-trigger
        v-if="showTrigger"
        @files-selected="handleFilesSelected" />
      <ca-image-preview-item
        v-for="(item, index) in files"
        :key="item.id"
        :item="item"
        @remove="handleRemove(index)"
        @reupload="triggerReplace(index)" />
    </transition-group>
  </div>
</template>

<style scoped>
  .ca-image-upload {
    width: 100%;
    --upload-bg: var(--color-context-bg);
    --upload-border: var(--color-border);
    --upload-accent: var(--color-border-accent);
  }

  .hidden-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
  }

  .preview-item,
  .upload-trigger {
    background-color: var(--upload-bg);
    border: 1px solid var(--upload-border);
  }

  /* 统一悬浮效果 */
  .preview-item:hover,
  .upload-trigger:hover {
    border-color: var(--upload-accent);
  }

  .upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>
