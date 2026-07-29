<script setup lang="ts">
  import type { UploadFile, UploadListType } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';
  import CaUploadItemCard from './items/UploadItemCard.vue';
  import CaUploadItemText from './items/UploadItemText.vue';

  defineOptions({
    name: 'CaUploadList',
  });

  const props = withDefaults(
    defineProps<{
      files?: UploadFile[];
      listType?: UploadListType;
      disabled?: boolean;
    }>(),
    {
      files: () => [],
      listType: 'text',
      disabled: false,
    },
  );

  const emit = defineEmits<{
    (e: 'remove', file: UploadFile): void;
    (e: 'retry', file: UploadFile): void;
    (e: 'preview', file: UploadFile): void;
  }>();

  const { b, m } = useCSSNamespace('upload-list');

  const isCardType = computed(() => props.listType === 'picture-card');

  const handleRemove = (file: UploadFile) => {
    emit('remove', file);
  };

  const handleRetry = (file: UploadFile) => {
    emit('retry', file);
  };

  const handlePreview = (file: UploadFile) => {
    emit('preview', file);
  };
</script>

<template>
  <div :class="[b(), m(listType)]">
    <!-- 照片墙卡片网格渲染 -->
    <template v-if="isCardType">
      <CaUploadItemCard
        v-for="file in files"
        :key="file.id"
        :file="file"
        :disabled="disabled"
        @remove="handleRemove"
        @retry="handleRetry"
        @preview="handlePreview"
      />
    </template>

    <!-- 文本 / 单图列表渲染 -->
    <template v-else>
      <CaUploadItemText
        v-for="file in files"
        :key="file.id"
        :file="file"
        :disabled="disabled"
        @remove="handleRemove"
        @retry="handleRetry"
        @preview="handlePreview"
      />
    </template>
  </div>
</template>

<style scoped>
  .ca-upload-list {
    box-sizing: border-box;
  }

  .ca-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .ca-upload-list--text,
  .ca-upload-list--picture {
    display: flex;
    flex-direction: column;
  }
</style>