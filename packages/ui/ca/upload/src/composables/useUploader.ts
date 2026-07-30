import { ref, watch, onUnmounted } from 'vue';
import type { CaUploadProps, CaUploadEmits, UploadFile } from '../types';
import { normalizeFileList, matchFileType } from '../../helper';
import { generateId } from '@caldm/utils';

export function useUploader(props: CaUploadProps, emits: CaUploadEmits) {
  // 内部统一管理的文件列表
  const fileList = ref<UploadFile[]>(normalizeFileList(props.modelValue));

  // 用于垃圾回收：记录通过 URL.createObjectURL 生成的临时 Blob URL 映射
  const blobUrlMap = new Map<string, string>();

  /**
   * 监听外部 modelValue 变化并同步（支持受控组件）
   */
  watch(
    () => props.modelValue,
    (val) => {
      fileList.value = normalizeFileList(val);
    },
    { deep: true },
  );

  /**
   * 触发外部双向绑定更新 (update:modelValue)
   */
  const emitModelUpdate = () => {
    if (!props.modelValue) {
      emits('update:modelValue', fileList.value);
      return;
    }

    // 若外部传入的是 string[] 格式，导出 URL 列表；否则导出 UploadFile[] 列表
    const isStringArray =
      Array.isArray(props.modelValue) &&
      props.modelValue.length > 0 &&
      typeof props.modelValue[0] === 'string';

    if (isStringArray) {
      const urls = fileList.value
        .map((f) => f.url)
        .filter((url): url is string => Boolean(url));
      emits('update:modelValue', urls);
    } else {
      emits('update:modelValue', fileList.value);
    }
  };

  /**
   * 为 File 对象创建并追踪本地预览 Blob URL
   */
  const createPreviewUrl = (file: File, id: string): string => {
    const url = URL.createObjectURL(file);
    blobUrlMap.set(id, url);
    return url;
  };

  /**
   * 释放指定 ID 关联的 Blob URL 内存资源
   */
  const revokePreviewUrl = (id: string) => {
    if (blobUrlMap.has(id)) {
      const url = blobUrlMap.get(id);
      if (url) {
        URL.revokeObjectURL(url);
      }
      blobUrlMap.delete(id);
    }
  };

  /**
   * 基础校验：验证文件大小与类型限制
   */
  const validateFile = (file: File): boolean => {
    // 校验文件大小 (MB)
    if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
      return false;
    }

    // 校验 Accept 属性匹配
    if (props.accept && props.accept.trim() !== '*') {
      const acceptTypes = props.accept
        .split(',')
        .map((t) => t.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      const isAccepted = acceptTypes.some((accept) => {
        if (accept.startsWith('.')) {
          return fileName.endsWith(accept);
        }
        if (accept.endsWith('/*')) {
          const typePrefix = accept.replace('/*', '');
          return fileType.startsWith(typePrefix);
        }
        return fileType === accept;
      });

      if (!isAccepted) return false;
    }

    return true;
  };

  /**
   * 执行 beforeUpload 拦截/转化逻辑
   */
  const processBeforeUpload = async (rawFile: File): Promise<File | null> => {
    if (!props.beforeUpload) return rawFile;

    try {
      const processedFile = await props.beforeUpload(rawFile);
      if (processedFile === false) return null;
      return processedFile instanceof File ? processedFile : rawFile;
    } catch {
      return null;
    }
  };

  /**
   * 负责纯粹的 UploadFile 数据结构构造
   */
  const createUploadFile = (file: File): UploadFile => {
    const fileId = generateId();
    const isImg = matchFileType(file.name, file.type) === 'image';

    return {
      id: fileId,
      name: file.name,
      size: file.size,
      raw: file,
      status: 'ready',
      percent: 0,
      url: isImg ? createPreviewUrl(file, fileId) : undefined,
    };
  };

  /**
   * 真正将 UploadFile 插入列表并同步状态
   */
  const appendFile = (uploadFile: UploadFile) => {
    fileList.value.push(uploadFile);
    emits('change', uploadFile, fileList.value);
    emitModelUpdate();
  };

  /**
   * 单个文件的核心处理主流程
   */
  const processSingleFile = async (rawFile: File) => {
    // 校验文件格式/大小
    if (!validateFile(rawFile)) return;

    // 执行 beforeUpload 钩子
    const finalFile = await processBeforeUpload(rawFile);
    if (!finalFile) return;

    // 构建并插入文件列表
    const uploadFile = createUploadFile(finalFile);
    appendFile(uploadFile);
  };

  /**
   * 添加选中的原生文件，支持 beforeUpload 拦截/转化
   */
  const addFiles = async (rawFiles: File[]) => {
    if (props.disabled || props.readonly || !rawFiles.length) return;

    const maxCount = props.maxCount ?? Infinity;

    for (let i = 0; i < rawFiles.length; i++) {
      if (fileList.value.length >= maxCount) {
        const exceededFiles = rawFiles.slice(i);
        emits('exceed', exceededFiles);
        break;
      }

      await processSingleFile(rawFiles[i]);
    }
  };

  /**
   * 移除文件，支持 beforeRemove 钩子
   */
  const removeFile = async (file: UploadFile) => {
    if (props.disabled || props.readonly) return;

    if (props.beforeRemove) {
      try {
        const canRemove = await props.beforeRemove(file, fileList.value);
        if (canRemove === false) return;
      } catch {
        return;
      }
    }

    const index = fileList.value.findIndex((f) => f.id === file.id);
    if (index !== -1) {
      revokePreviewUrl(file.id);
      fileList.value.splice(index, 1);
      emits('remove', file);
      emits('change', file, fileList.value);
      emitModelUpdate();
    }
  };

  /**
   * 清空所有文件列表与内存资源
   */
  const clearFiles = () => {
    fileList.value.forEach((file) => revokePreviewUrl(file.id));
    fileList.value = [];
    emitModelUpdate();
  };

  /**
   * 组件卸载时释放所有 Blob 引用，防止内存泄漏
   */
  onUnmounted(() => {
    blobUrlMap.forEach((url) => URL.revokeObjectURL(url));
    blobUrlMap.clear();
  });

  return {
    fileList,
    addFiles,
    removeFile,
    clearFiles,
    triggerUpdate: emitModelUpdate,
  };
}