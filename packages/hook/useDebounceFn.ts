import { getCurrentInstance, onUnmounted } from 'vue';

/**
 * 为方法添加指定延迟的防抖
 * @param fn 方法
 * @param delay 延迟时间，单位：ms
 */
export const useDebounceFn = <T extends (...args: any[]) => any>(fn: T, delay: number = 150): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  if (getCurrentInstance()) {
    onUnmounted(cancel);
  }
  const debounced = (...args: Parameters<T>) => {
    cancel();
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  debounced.cancel = cancel;

  return debounced;
};