import axios from 'axios';
export function createHttp(options) {
    const service = axios.create({
        baseURL: options.baseURL,
        timeout: options.timeout || 5000,
    });
    service.interceptors.request.use((config) => {
        return config;
    }, (error) => Promise.reject(error));
    service.interceptors.response.use((response) => {
        // Http 状态码处理
        if (response.status === 401) {
            options.onUnauthorized?.();
            return null;
        }
        const res = response.data;
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
    }, (error) => {
        options.onErrorMessage?.('网络错误，请检查网络连接');
        return null;
    });
    function baseRequest(url, params = {}, method = 'get', extraConfig = {}) {
        const config = {
            url,
            method,
            ...extraConfig,
        };
        if (method.toLowerCase() === 'get') {
            config.params = params;
        }
        else {
            config.data = params;
        }
        return service(config);
    }
    return {
        get: (url, data, config) => baseRequest(url, data, 'get', config),
        post: (url, data, config) => baseRequest(url, data, 'post', config),
        put: (url, data, config) => baseRequest(url, data, 'put', config),
        delete: (url, params, config) => baseRequest(url, params, 'delete', config),
    };
}
