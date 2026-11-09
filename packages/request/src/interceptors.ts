import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { HttpConfig, ResponseData } from "./types";

/**
 * 是否正在刷新 token(全局锁)
 */
let isRefreshing = false;

/**
 * 刷新 token 期间挂起的请求队列,刷新完成后重放
 */
let failedRequestsQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

/**
 * 请求拦截器
 */
export async function requestInterceptor(config: InternalAxiosRequestConfig) {
  return config;
}

/**
 * 创建响应拦截器(成功回调 + 失败回调)
 * - 统一处理业务状态码:非 200 走 onErrorMessage / onUnauthorized
 * - 403 时刷新 token 并重放队列中的请求
 */
export function createResponseInterceptor(
  options: HttpConfig,
  service: AxiosInstance,
) {
  const onFulfilled = (response: AxiosResponse) => {
    const res = response.data as ResponseData;
    if (res.code === 200) {
      return res.data;
    }

    // 业务状态码处理
    if (res.code === 401) {
      options.onUnauthorized?.();
    }

    const errorMsg = res.message || "系统开小差了。";
    options.onErrorMessage?.(errorMsg);

    return Promise.reject(new Error(errorMsg));
  };

  const onRejected = async (error: any) => {
    if (error.response) {
      const originalRequest = error.config;

      // 身份验证失败，尝试刷新token
      if (error.response.status === 403) {
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
            failedRequestsQueue.push({
              resolve,
              reject,
              config: originalRequest,
            });
          });
        }
        // 还没有刷新token，加锁，尝试刷新token
        isRefreshing = true;
        try {
          await options.onUnauthorized?.();

          const queueCopy = [...failedRequestsQueue];
          failedRequestsQueue = [];
          queueCopy.forEach(({ resolve, reject, config }) => {
            service(config).then(resolve).catch(reject);
          });
          return service(originalRequest);
        } catch (err) {
          failedRequestsQueue.forEach(({ reject }) => reject(err));
          failedRequestsQueue = [];
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      const msg =
        error.response.data?.message ||
        `网络请求错误 (${error.response.status})`;
      options.onErrorMessage?.(msg);
    } else if (error.message.includes("timeout")) {
      options.onErrorMessage?.("网络请求超时，请稍后重试");
    } else {
      options.onErrorMessage?.("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  };

  return { onFulfilled, onRejected };
}
