import type { VNode } from 'vue';

/**
 * 文件列表展现模式：
 * - 'text': 文本列表模式
 * - 'picture': 图文结合列表模式
 * - 'picture-card': 照片墙卡片模式
 */
export type UploadListType = 'text' | 'picture' | 'picture-card';

/**
 * 上传文件状态
 */
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error';

/**
 * 通用文件识别类型
 */
export type CoreFileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'code'
  | 'unknown';

/**
 * 统一的文件数据模型
 */
export interface UploadFile {
  /** 唯一标识 */
  id: string;
  /** 文件名 */
  name: string;
  /**
   * 文件 MIME 类型 (例如: 'image/png', 'text/csv', 'application/pdf')
   * 后端返回已上传/初始化文件列表时必须提供该字段，用于预览与文件图标分发
   */
  mimeType?: string;
  /** 文件大小 (bytes) */
  size?: number;
  /** 文件访问/预览 URL */
  url?: string;
  /** 上传进度 (0 - 100) */
  percent?: number;
  /** 上传状态 */
  status?: UploadStatus;
  /** 原始 File 对象（本地选择时存在） */
  raw?: File;
  /** 服务端响应结果 */
  response?: any;
  /** 错误信息 */
  error?: any;
}

/**
 * 自定义上传请求的入参选项
 */
export interface CustomRequestOptions {
  file: File;
  action: string;
  headers?: Record<string, string>;
  data?: Record<string, any>;
  name?: string;
  onProgress: (percent: number) => void;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

/**
 * CaUpload 组件 Props 规范
 */
export interface CaUploadProps {
  /** 绑定数据，支持 UploadFile[] 或纯 URL 数组 string[] */
  modelValue?: UploadFile[] | string[];
  /** 展现类型，默认为 'text' */
  listType?: UploadListType;
  /** 接受的文件 MIME 类型或扩展名，如 'image/*', '.pdf,.doc' */
  accept?: string;
  /** 是否开启多选 */
  multiple?: boolean;
  /** 是否允许拖拽上传 */
  drag?: boolean;
  /** 最大上传数量 */
  maxCount?: number;
  /** 单文件最大限制，单位：MB */
  maxSize?: number;
  /** 是否自动上传 */
  autoUpload?: boolean;
  /** 上传接口 URL */
  action?: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 额外附带的请求参数 */
  data?: Record<string, any>;
  /** 上传文件的字段名，默认 'file' */
  name?: string;
  /** 自定义上传逻辑重写 */
  customRequest?: (options: CustomRequestOptions) => Promise<any> | void;
  /** 是否禁用组件交互 */
  disabled?: boolean;
  /** 是否为只读模式（仅展示/预览，隐藏触发器与操作按钮） */
  readonly?: boolean;
  /** 是否显示已上传文件列表，默认为 true */
  showFileList?: boolean;
  /** 上传前的钩子，若返回 false 或 rejected Promise 则停止上传 */
  beforeUpload?: (file: File) => boolean | Promise<boolean | File>;
  /** 移除文件前的钩子，若返回 false 或 rejected Promise 则中断移除 */
  beforeRemove?: (
    file: UploadFile,
    fileList: UploadFile[]
  ) => boolean | Promise<boolean>;
}

/**
 * CaUpload 组件 Emits 声明
 */
export interface CaUploadEmits {
  (e: 'update:modelValue', files: UploadFile[] | string[]): void;
  (e: 'change', file: UploadFile, fileList: UploadFile[]): void;
  (e: 'success', response: any, file: UploadFile, fileList: UploadFile[]): void;
  (e: 'error', error: any, file: UploadFile, fileList: UploadFile[]): void;
  (e: 'progress', percent: number, file: UploadFile): void;
  (e: 'preview', file: UploadFile): void;
  (e: 'remove', file: UploadFile): void;
  (e: 'exceed', files: File[]): void;
}

/**
 * CaUpload 组件 暴露的 API
 */
export interface CaUploadExpose {
  /** 手动触发文件选择器 */
  openPicker: () => void;
  /** 清空文件列表并释放相关资源 */
  clearFiles: () => void;
  /** 中止指定文件或所有正在进行的上传请求 */
  abort: (file?: UploadFile) => void;
}

/**
 * CaUpload 组件 Slots 定义
 */
export interface CaUploadSlots {
  default?: () => VNode[];
  trigger?: () => VNode[];
  file?: (props: { file: UploadFile; index: number }) => VNode[];
  icon?: (props: { file: UploadFile; type: CoreFileType }) => VNode[];
  tip?: () => VNode[];
}