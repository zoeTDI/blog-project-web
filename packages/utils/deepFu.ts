import { isObject } from './isFu.ts';

/**
 * 深度合并两个或多个对象（右侧优先覆盖）
 * @param target 目标对象，合并的基础（会被修改）
 * @param sources 一个或多个用于合并的源对象
 * @returns 合并后的深层类型对象
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T => {
  // 👈 显式声明返回类型为 T，解决 TS7023
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (key === '__proto__' || key === 'constructor') {
        continue;
      }

      // 使用类型断言安全地在泛型对象上读写键值
      const targetObj = target as Record<string, any>;
      const sourceObj = source as Record<string, any>;

      if (isObject(sourceObj[key])) {
        if (!targetObj[key]) {
          Object.assign(targetObj, { [key]: {} });
        }
        deepMerge(targetObj[key], sourceObj[key]);
      } else {
        Object.assign(targetObj, { [key]: sourceObj[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
};
