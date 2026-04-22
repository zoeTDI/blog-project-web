import axios, {type AxiosRequestConfig} from 'axios';
import type {InternalAxiosRequestConfig, AxiosResponse} from 'axios';

interface Request<T = any> {
    code: number;
    message: string;
    data: T;
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
    (response: AxiosResponse) => {
        if(response.status === 401) {
            const router = (await import('@/router')).default;
            // todo 这里是回到了根目录，实际应回到登录页（登录页暂未实现）
            // router.push('/login');
            router.push('/');
        }
        const res = response.data;
        if (res.code == 200) {
            return res.data;
        }
        console.error('业务错误:', res.message || 'Error');
        return Promise.reject(new Error(res.message || 'Error'));
    },
    (error) => {
        // 处理 HTTP 错误码（401, 404, 500等）
        console.error('网络错误:', error.message);
        return Promise.reject(error);
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
    }
    if (method.toLowerCase() === 'get') {
        // GET 请求：将对象放入 params，Axios 会自动将其转为 ?id=xxx
        config.params = params;
    } else {
        // 非 GET 请求（POST/PUT等）：将对象放入 data，作为请求体发送
        config.data = params;
    }
    return service(config) as unknown as Promise<T>;
}

export const defHttp = {
    get: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) => baseRequest<T>(url, params, 'get', config),
    post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => baseRequest<T>(url, data, 'post', config),
    put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => baseRequest<T>(url, data, 'put', config),
    delete: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) => baseRequest<T>(url, params, 'delete', config),
};