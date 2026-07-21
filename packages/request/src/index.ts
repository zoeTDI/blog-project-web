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
  onUnauthorized?: () => void;
  onErrorMessage?: (msg: string) => void;
}

export function createHttp(options: HttpConfig) {
  const service = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout || 10000,
  });

  // 请求拦截器
  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (options.getToken) {
        const token = await options.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
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
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          options.onUnauthorized?.();
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

