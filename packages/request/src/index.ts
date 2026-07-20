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
  onUnauthorized?: () => void;
  onErrorMessage?: (msg: string) => void;
}

export function createHttp(options: HttpConfig) {
  const service = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout || 5000,
  });

  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error) => Promise.reject(error),
  );

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      // Http 状态码处理
      if (response.status === 401) {
        options.onUnauthorized?.();
        return null;
      }

      const res = response.data as ResponseData;

      if (res.code === 200) {
        return res.data;
      }

      console.error('业务错误:', res.message || 'Error');
      options.onErrorMessage?.(res.message || '系统开小差了。');

      // 业务状态码处理
      if (res.code === 401) {
        options.onUnauthorized?.();
      }

      return null;
    },
    (error) => {
      options.onErrorMessage?.('网络错误，请检查网络连接');
      return null;
    },
  );

  function baseRequest<T = any>(
    url: string,
    params: object = {},
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    extraConfig: AxiosRequestConfig = {},
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      ...extraConfig,
    };
    if (method.toLowerCase() === 'get') {
      config.params = params;
    } else {
      config.data = params;
    }
    return service(config) as unknown as Promise<T>;
  }

  return {
    get: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
      baseRequest(url, data, 'get', config),
    post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
      baseRequest<T>(url, data, 'post', config),
    put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
      baseRequest<T>(url, data, 'put', config),
    delete: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) =>
      baseRequest<T>(url, params, 'delete', config),
  };
}

