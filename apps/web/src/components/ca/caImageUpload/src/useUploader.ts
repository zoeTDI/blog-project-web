import type {
  UploadFile,
  UseUploaderOptions,
} from '@/components/ca/caImageUpload';
import { ref } from 'vue';
import { caMessage } from '@/components/ca/caMessage';

const useUploader = (options: UseUploaderOptions = {}) => {
  const { maxCount = 9, maxSize = 5 } = options;
  const files = ref<UploadFile[]>([]);

  // 检验文件大小
  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      caMessage.error(`图片 ${file.name} 超过了 ${maxSize}MB 的限制`);
      return false;
    }
    return true;
  };

  // 添加文件
  const addFiles = (newFiles: File[]) => {
    if (files.value.length + newFiles.length > maxCount) {
      caMessage.error(`最多只能上传 ${maxCount} 张图片`);
      return;
    }
    const processedFiles = newFiles.filter(validateFile).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    files.value.push(...processedFiles);
  };

  // 替换/重新上传
  const replaceFile = (index: number, newFile: File) => {
    if (!validateFile(newFile)) return;
    URL.revokeObjectURL(files.value[index].previewUrl);

    files.value[index] = {
      id: Math.random().toString(36).substr(2, 9),
      file: newFile,
      previewUrl: URL.createObjectURL(newFile),
    };
  };

  // 移除
  const removeFile = (index: number) => {
    URL.revokeObjectURL(files.value[index].previewUrl);
    files.value.splice(index, 1);
  };

  // 清空
  const clearFiles = () => {
    files.value.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    files.value = [];
  };

  return {
    files,
    addFiles,
    replaceFile,
    removeFile,
    clearFiles,
  };
};
export { useUploader };
