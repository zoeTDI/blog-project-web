/**
 * CaImageViewer 预览组件的 Props 定义
 */
export interface CaImageViewProps {
  /** 预览图片的 URL 地址 */
  url: string;
}

/**
 * CaImageViewer 预览组件触发的事件
 */
export interface CaImageViewEmits {
  (e: 'close'): void;
}

/**
 * CaImageViewer 预览组件暴露的实例方法
 */
export interface CaImageViewerExpose {
  /** 打开图片预览 */
  open: () => void;
  /** 关闭图片预览 */
  close: () => void;
}

/**
 * CaImage 主组件的 Props 定义
 */
export interface CaImageProps {
  /** 图片资源地址 */
  src: string;
  /** 图片替代文本，默认为空字符串 */
  alt?: string;
  /** 是否开启点击预览功能，默认为 true */
  preview?: boolean;
}