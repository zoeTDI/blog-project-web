import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { createResponseInterceptor, requestInterceptor } from "./interceptors";
import type { HttpConfig } from "./types";

/**
 * 创建 http 请求实例
 */
export function createHttp(options: HttpConfig) {
  const service = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout || 10000,
    withCredentials: true,
  });

  // 请求拦截器
  service.interceptors.request.use(
    requestInterceptor,
    (error) => Promise.reject(error),
  );

  // 响应拦截器
  const { onFulfilled, onRejected } = createResponseInterceptor(
    options,
    service,
  );
  service.interceptors.response.use(onFulfilled, onRejected);

  return {
    instance: service,
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return service.get(url, config) as unknown as Promise<T>;
    },

    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return service.post(url, data, config) as unknown as Promise<T>;
    },

    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      return service.put(url, data, config) as unknown as Promise<T>;
    },

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return service.delete(url, config) as unknown as Promise<T>;
    },
  };
}
