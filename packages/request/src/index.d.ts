import type { AxiosRequestConfig } from 'axios';
export interface HttpConfig {
    baseURL: string;
    timeout?: number;
    onUnauthorized?: () => void;
    onErrorMessage?: (msg: string) => void;
}
export declare function createHttp(options: HttpConfig): {
    get: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => Promise<any>;
    post: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => Promise<T>;
    put: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => Promise<T>;
    delete: <T = any>(url: string, params?: object, config?: AxiosRequestConfig) => Promise<T>;
};
//# sourceMappingURL=index.d.ts.map