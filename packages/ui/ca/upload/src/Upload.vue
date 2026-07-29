<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { CaUploadEmits, CaUploadProps, UploadFile } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { useUploadRequest } from './composables/useUploadRequest.ts';
  import { useUploader } from './composables/useUploader.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline';
  import CaUploadList from './UploadList.vue';
  import CaImageViewer from '../../image/src/Viewer.vue';

  defineOptions({
    name: 'CaUpload',
  });

  const props = withDefaults(defineProps<CaUploadProps>(), {
    modelValue: () => [],
    listType: 'text',
    autoUpload: true,
    disabled: false,
    multiple: false,
    drag: false,
    showFileList: true,
  });

  const emits = defineEmits<CaUploadEmits>();

  const { b, e, m, is } = useCSSNamespace('upload');

  const viewerRef = ref<InstanceType<typeof CaImageViewer> | null>(null);
  const previewUrl = ref('');
  const inputRef = ref<HTMLInputElement | null>(null);
  const isDragOver = ref(false);

  const { uploadFile, abort } = useUploadRequest(props, emits);

  const { fileList, addFiles, removeFile, triggerUpdate } = useUploader(
    props,
    emits,
  );

  // 处理文件选择/拖拽添加
  const handleSelectFiles = async (rawFiles: File[]) => {
    await addFiles(rawFiles);

    // 若开启自动上传，对处于 ready 状态的新文件触发上传
    if (props.autoUpload) {
      fileList.value.forEach((file) => {
        if (file.status === 'ready') {
          uploadFile(file, fileList.value, triggerUpdate);
        }
      });
    }
  };

  // 是否达到最大文件数限制
  const isExceeded = computed(() => {
    return !!(props.maxCount && fileList.value.length >= props.maxCount);
  });

  // 点击触发文件选择框
  const handleClick = () => {
    if (props.disabled) return;
    inputRef.value?.click();
  };

  // 文件选择框 Change 事件处理
  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const rawFiles = Array.from(target.files);
    handleSelectFiles(rawFiles);

    // 重置 input 以允许再次选择相同文件
    target.value = '';
  };

  // 拖拽相关事件处理
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (props.disabled || !props.drag) return;
    isDragOver.value = true;
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    isDragOver.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragOver.value = false;
    if (props.disabled || !props.drag) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const rawFiles = Array.from(e.dataTransfer.files);
      handleSelectFiles(rawFiles);
    }
  };

  // 重试上传
  const handleRetry = (file: UploadFile) => {
    uploadFile(file, fileList.value, triggerUpdate);
  };

  const isImageFile = (mimeType: string) => mimeType.startsWith('image/');

  const isVideoFile = (mimeType: string) => mimeType.startsWith('video/');

  const isExcelFile = (mimeType: string) => {
    return (
      mimeType.includes('csv') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType.includes('vnd.ms-excel') ||
      mimeType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    );
  };

  // 预览事件触发
  const handlePreview = (file: UploadFile) => {
    const mimeType = file.mimeType || file.raw?.type || '';
    const urlToPreview = file.url || (file.raw ? URL.createObjectURL(file.raw) : '');
    // 图片类型
    if (isImageFile(mimeType)) {
      if (urlToPreview) {
        previewUrl.value = urlToPreview;
        viewerRef.value?.open();
      }
    }
    // 视频类型
    else if (isVideoFile(mimeType)) {
      // TODO: videoViewerRef.value?.open(urlToPreview)
    }
    // Excel / CSV 类型
    else if (isExcelFile(mimeType)) {
      // TODO: excelViewerRef.value?.open(file)
    }
    // 其他类型：根据需要继续扩展...
    emits('preview', file);
  };

  // 手动触发文件上传暴露方法
  const submit = () => {
    fileList.value.forEach((file) => {
      if (file.status === 'ready' || file.status === 'error') {
        uploadFile(file, fileList.value, triggerUpdate);
      }
    });
  };

  // 暴露组件 API
  defineExpose({
    submit,
    abort,
    clearFiles: () => {
      fileList.value.forEach((f) => removeFile(f));
    },
    fileList,
  });
</script>

<template>
  <div :class="[b(), m(listType), is('disabled', disabled)]">
    <!-- 隐藏的真实 input[type=file] -->
    <input
      ref="inputRef"
      type="file"
      :class="e('input')"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleFileChange"
    />

    <!-- 卡片模式布局 (`picture-card`) -->
    <template v-if="listType === 'picture-card'">
      <div :class="e('card-wrapper')">
        <CaUploadList
          v-if="showFileList"
          :files="fileList"
          :list-type="listType"
          :disabled="disabled"
          @remove="removeFile"
          @retry="handleRetry"
          @preview="handlePreview"
        />

        <!-- 触发上传卡片（未达到 max limit 时显示） -->
        <div
          v-if="!isExceeded"
          :class="[e('trigger'), is('dragover', isDragOver)]"
          @click="handleClick"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <slot>
            <div :class="e('card-trigger-inner')">
              <CaIcon :icon="PlusIcon" size="24px" />
              <span :class="e('text')">上传图片</span>
            </div>
          </slot>
        </div>
      </div>
    </template>

    <!-- 文本/图片列表模式布局 (`text` | `picture`) -->
    <template v-else>
      <div
        :class="[
          e('trigger'),
          is('drag', drag),
          is('dragover', isDragOver),
        ]"
        @click="handleClick"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <slot>
          <div v-if="drag" :class="e('dragger')">
            <CaIcon :icon="ArrowUpTrayIcon" size="36px" :class="e('drag-icon')" />
            <div :class="e('drag-text')">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </div>
          <button v-else type="button" :class="e('btn')" :disabled="disabled">
            <CaIcon :icon="ArrowUpTrayIcon" size="16px" />
            <span>选择文件</span>
          </button>
        </slot>
      </div>

      <!-- 提示信息插槽 -->
      <div v-if="$slots.tip" :class="e('tip')">
        <slot name="tip" />
      </div>

      <!-- 文件列表展示 -->
      <CaUploadList
        v-if="showFileList && fileList.length > 0"
        :files="fileList"
        :list-type="listType"
        :disabled="disabled"
        @remove="removeFile"
        @retry="handleRetry"
        @preview="handlePreview"
      />
    </template>
    <CaImageViewer ref="viewerRef"
                   :url="previewUrl" />
  </div>
</template>

<style scoped>
  .ca-upload {
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
  }

  .ca-upload__input {
    display: none !important;
  }

  .ca-upload__trigger {
    display: inline-flex;
    cursor: pointer;
  }

  .ca-upload.is-disabled .ca-upload__trigger {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ca-upload__btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid var(--color-border, #d1d5db);
    background-color: var(--color-bg-button, #ffffff);
    color: var(--color-text-main, #374151);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ca-upload__btn:hover:not(:disabled) {
    border-color: var(--color-primary, #3b82f6);
    color: var(--color-primary, #3b82f6);
  }

  .ca-upload__trigger.is-drag {
    display: flex;
    width: 100%;
  }

  .ca-upload__dragger {
    width: 100%;
    padding: 24px 16px;
    border: 2px dashed var(--color-border, #d1d5db);
    border-radius: 8px;
    background-color: var(--color-bg-secondary, #f9fafb);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: border-color 0.2s, background-color 0.2s;
  }

  .ca-upload__trigger.is-dragover .ca-upload__dragger {
    border-color: var(--color-primary, #3b82f6);
    background-color: var(--color-bg-active, #eff6ff);
  }

  .ca-upload__drag-icon {
    color: var(--color-text-muted, #9ca3af);
  }

  .ca-upload__drag-text {
    font-size: 14px;
    color: var(--color-text-secondary, #6b7280);
  }

  .ca-upload__drag-text em {
    color: var(--color-primary, #3b82f6);
    font-style: normal;
  }

  .ca-upload__card-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .ca-upload--picture-card .ca-upload__trigger {
    width: 104px;
    height: 104px;
    border: 1px dashed var(--color-border, #d1d5db);
    border-radius: 8px;
    background-color: var(--color-bg-secondary, #f9fafb);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background-color 0.2s;
  }

  .ca-upload--picture-card .ca-upload__trigger:hover {
    border-color: var(--color-primary, #3b82f6);
    color: var(--color-primary, #3b82f6);
  }

  .ca-upload__card-trigger-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--color-text-muted, #9ca3af);
  }

  .ca-upload__text {
    font-size: 12px;
  }

  /* 提示文案 */
  .ca-upload__tip {
    font-size: 12px;
    color: var(--color-text-muted, #9ca3af);
    margin-top: 4px;
  }
</style>