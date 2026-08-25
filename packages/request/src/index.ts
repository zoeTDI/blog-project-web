import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  getToken?: () => string | null | Promise<string | null>;
  onUnauthorized?: () => Promise<void>;
  onRefreshFailed?: () => Promise<void>;
  onErrorMessage?: (msg: string) => Promise<void>;
}

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

export function createHttp(options: HttpConfig) {
  const service = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout || 10000,
    withCredentials: true,
  });

  // 请求拦截器
  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {

      const res = response.data as ResponseData;
      if (res.code === 200) {
        return res.data;
      }

      // 业务状态码处理
      if (res.code === 401) {
        options.onUnauthorized?.();
      }

      const errorMsg = res.message || '系统开小差了。';
      options.onErrorMessage?.(errorMsg);

      return Promise.reject(new Error(errorMsg));
    },
    async (error) => {
      if (error.response) {
        const originalRequest = error.config;

        // 身份验证失败，尝试刷新token
        if (error.response.status === 401) {
          // 自定义特殊状态码，表示刷新token失败
          if (error.response.data.code === 486) {
            isRefreshing = false;
            failedRequestsQueue = [];
            await options.onRefreshFailed?.();
            return Promise.reject(error);
          }
          // 已经在刷新token中了，将请求加入队列，等待重发。
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject, config: originalRequest });
            })
          }
          // 还没有刷新token，加锁，尝试刷新token
          isRefreshing = true;
          try {
            await options.onUnauthorized?.();

            const queueCopy = [...failedRequestsQueue];
            failedRequestsQueue = [];
            queueCopy.forEach(({ resolve, reject, config }) => {
              service(config).then(resolve).catch(reject);
            })
            return service(originalRequest);
          } catch (err) {
            failedRequestsQueue.forEach(({ reject }) => reject(err));
            failedRequestsQueue = [];
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }
        const msg = error.response.data?.message || `网络请求错误 (${error.response.status})`;
        options.onErrorMessage?.(msg);
      } else if (error.message.includes('timeout')) {
        options.onErrorMessage?.('网络请求超时，请稍后重试');
      } else {
        options.onErrorMessage?.('网络错误，请检查网络连接');
      }
      return Promise.reject(error);
    },
  );

  return {
    instance: service,
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return service.get(url, config) as unknown as Promise<T>;
    },

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return service.post(url, data, config) as unknown as Promise<T>;
    },

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return service.put(url, data, config) as unknown as Promise<T>;
    },

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return service.delete(url, config) as unknown as Promise<T>;
    },
  };
}

