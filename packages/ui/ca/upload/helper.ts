import type { CoreFileType, UploadFile } from './src/types.ts';
import { generateId, getFileExtension, getFileNameFromUrl } from '@caldm/utils';

/**
 * 根据文件名和 MIME 类型判断文件归类
 */
export const matchFileType = (filename: string, mimeType = ''): CoreFileType => {
  const ext = getFileExtension(filename);

  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return 'image';
  }
  if (mimeType.startsWith('video/') || ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv'].includes(ext)) {
    return 'video';
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) {
    return 'audio';
  }
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
    return 'document';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'archive';
  }
  if (['js', 'ts', 'html', 'css', 'json', 'vue', 'py', 'java', 'c', 'cpp'].includes(ext)) {
    return 'code';
  }
  return 'unknown';
};

/**
 * 标准化外部绑定值 (string[] | UploadFile[]) 统一转换为内部标准的 UploadFile[]
 */
export const normalizeFileList = (val?: UploadFile[] | string[]): UploadFile[] => {
  if (!val || !Array.isArray(val)) return [];

  return val.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `file-url-${index}-${Date.now()}`,
        name: getFileNameFromUrl(item),
        url: item,
        status: 'success',
        percent: 100,
      };
    }
    return {
      ...item,
      id: item.id || generateId(),
      status: item.status || 'success',
      percent: item.percent ?? (item.status === 'success' ? 100 : 0),
    };
  });
};