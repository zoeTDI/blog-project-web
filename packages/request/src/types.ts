/**
 * 后端统一响应结构
 */
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * createHttp 的配置项
 */
export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  getToken?: () => string | null | Promise<string | null>;
  onUnauthorized?: () => Promise<void>;
  onRefreshFailed?: () => Promise<void>;
  onErrorMessage?: (msg: string) => Promise<void>;
}
