<script setup lang="ts">
  import { computed } from 'vue';
  import type { CoreFileType, UploadFile } from '../types';
  import { matchFileType } from '../../helper';
  import {
    DocumentIcon,
    DocumentTextIcon,
    FilmIcon,
    MusicalNoteIcon,
    ArchiveBoxIcon,
    CodeBracketIcon,
    PhotoIcon,
  } from '@heroicons/vue/24/outline';
  import { useCSSNamespace } from '@caldm/hook';
  import CaIcon from '../../../../icon/src/Icon.vue';

  defineOptions({
    name: 'CaFileIcon',
  });

  const props = defineProps<{
    file?: UploadFile;
    type?: CoreFileType;
    size?: string | number;
  }>();

  const { b, e, m } = useCSSNamespace('file-icon');

  // 计算文件最终的通用归类类型
  const fileType = computed<CoreFileType>(() => {
    if (props.type) return props.type;
    if (props.file) {
      return matchFileType(props.file.name, props.file.raw?.type);
    }
    return 'unknown';
  });

  // 根据类型映射对应的 HeroIcon 组件
  const iconComponent = computed(() => {
    switch (fileType.value) {
      case 'image':
        return PhotoIcon;
      case 'video':
        return FilmIcon;
      case 'audio':
        return MusicalNoteIcon;
      case 'document':
        return DocumentTextIcon;
      case 'archive':
        return ArchiveBoxIcon;
      case 'code':
        return CodeBracketIcon;
      case 'unknown':
      default:
        return DocumentIcon;
    }
  });
</script>

<template>
  <div :class="[b(), m(fileType)]">
    <CaIcon :icon="iconComponent" :size="size || '1em'" />
  </div>
</template>

<style scoped>
  .ca-file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: 24px;
    color: var(--color-text-secondary, #6b7280);
    flex-shrink: 0;
  }

  .ca-file-icon--image {
    color: var(--color-file-image, #10b981);
  }

  .ca-file-icon--video {
    color: var(--color-file-video, #8b5cf6);
  }

  .ca-file-icon--audio {
    color: var(--color-file-audio, #ec4899);
  }

  .ca-file-icon--document {
    color: var(--color-file-document, #3b82f6);
  }

  .ca-file-icon--archive {
    color: var(--color-file-archive, #f59e0b);
  }

  .ca-file-icon--code {
    color: var(--color-file-code, #6366f1);
  }
</style>