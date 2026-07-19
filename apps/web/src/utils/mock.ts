/**
 * 模拟异步请求函数
 * @param data 需要返回的数据
 * @param delay 延迟时间 (ms)
 */
export function mockApiFetch<T>(data: T, delay: number = 1000): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}