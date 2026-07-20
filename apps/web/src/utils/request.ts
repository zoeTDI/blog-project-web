import axios, { type AxiosRequestConfig } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ROUTER_NAMES } from '@/router/routerNames.ts';
import type { Router } from 'vue-router';
import { caMessage } from '@/components/ca/caMessage';

interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 1. 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 稍后我们会配置环境变量
  timeout: 5000,
});

// 2. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (response.status === 401) {
      const router = (await import('@/router')).default as unknown as Router;
      router.push({ name: ROUTER_NAMES.LOGIN });
    }
    const res = response.data as ResponseData;
    if (res.code == 200) {
      return res.data;
    }
    console.error('业务错误:', res.message || 'Error');
    caMessage.error("系统开小差了。");

    if (res.code === 401) {
      const router = (await import('@/router')).default as unknown as Router;
      router.push({ name: ROUTER_NAMES.LOGIN });
    }

    return null;
  },
  () => {
    // 处理 HTTP 错误码（401, 404, 500等）
    caMessage.error("网络错误，请检查网络连接");
    return null;
  }
);

function baseRequest<T = any>(
  url: string,
  params: object = {},
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  extraConfig: AxiosRequestConfig = {}
): Promise<T> {
  const config: AxiosRequestConfig = {
    url,
    method,
    ...extraConfig,
  };
  if (method.toLowerCase() === 'get') {
    // GET 请求：将对象放入 params
    config.params = params;
  } else {
    // 非 GET 请求（POST/PUT等）
    config.data = params;
  }
  return service(config) as unknown as Promise<T>;
}

export const defHttp = {
  get: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
    baseRequest<T>(url, data, 'get', config),
  post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
    baseRequest<T>(url, data, 'post', config),
  put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) =>
    baseRequest<T>(url, data, 'put', config),
  delete: <T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ) => baseRequest<T>(url, params, 'delete', config),
};
