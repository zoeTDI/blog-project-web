/**
 * 生成唯一标识 ID
 */
export const generateId = (): string => {
  return `upload-file-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;
};

/**
 * 从文件路径或 URL 中提取文件名
 */
export const getFileNameFromUrl = (url: string): string => {
  if (!url) return '';
  try {
    const parsedUrl = new URL(url, window.location.href);
    const pathname = parsedUrl.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1) || 'file';
  } catch {
    return url.substring(url.lastIndexOf('/') + 1) || 'file';
  }
};

/**
 * 格式化字节大小为可读文本 (KB, MB, GB)
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 获取文件的扩展名（小写，不带点）
 */
export const getFileExtension = (filename: string): string => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1).toLowerCase() : '';
};