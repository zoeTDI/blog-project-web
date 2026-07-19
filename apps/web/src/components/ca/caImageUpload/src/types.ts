interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
}

interface UseUploaderOptions {
  maxCount?: number;
  maxSize?: number;
}

/**
 * CaImagePreviewItem
 */

interface CaImagePreviewItemProps {
  item: UploadFile;
}
interface CaImagePreviewItemEmits {
  (e: 'remove'): void;
  (e: 'reupload'): void;
}

/**
 * CaImageUploaderTrigger
 */
interface CaImageUploaderTriggerEmits {
  (e: 'files-selected', files: File[]): void;
}

interface CaImageUploadProps {
  modelValue: File[];
  mode?: 'single'|'multiple';
  maxCount?: number;
  /**
   * 单位：mb
   */
  maxSize?: number;
}

interface CaImageUploadEmits {
  (e: 'update:modelValue', files: File[]): void;
}

interface CaImageUploadExpose {
  /**
   * 清空所有已选择/已上传的图片
   */
  clearFiles: () => void;
}

export type {
  UploadFile,
  CaImagePreviewItemProps,
  CaImagePreviewItemEmits,
  CaImageUploaderTriggerEmits,
  UseUploaderOptions,
  CaImageUploadProps,
  CaImageUploadEmits,
  CaImageUploadExpose,
};
