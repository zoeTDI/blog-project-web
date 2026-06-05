import {isObject} from "@/utils/isFu.ts";

/**
 * 深度合并两个或多个对象（右侧优先覆盖）
 * @param target 目标对象，合并的基础（会被修改）
 * @param sources 一个或多个用于合并的源对象
 * @returns 合并后的深层类型对象
 */
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (key === '__proto__' || key === 'constructor') {
        continue;
      }
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]})
      }
    }
  }
  return deepMerge(target, ...sources);
}