import { isFunction, isNumber, isObject, isString } from '@caldm/utils';

export const filterCore = (
  sort: {
    prop: string, // 根据哪一列进行排序
    by: string | null, // 如果数据是对象，那么根据该字段进行排序
    method: ((a: any, b: any) => number) | null, // 如果存在自定义排序方法，那么采用自定义排序方法
    state: 'ascending' | 'descending' | null // 排序状态
  },
  data: any[],
) => {
  console.log("🚀 ~ filterCore ~ sort: ", sort);
  console.log("🚀 ~ filterCore ~ data: ", data);
  if (!sort) return data;
  // 数据量小于 2，无需进行排序
  if (data.length < 2) return data;
  // 未提供排序依据字段，无法进行排序
  if (isObject(data[0]) && !isString(sort.by)) return data;
  // 恢复为原始顺序
  if (!isString(sort.state)) return data;

  const { by, method, state } = sort;

  const list = [...data];

  const getValue = (item: any) => {
    if (isObject(item) && isString(by)) {
      return item[by];
    }
    return item;
  };

  list.sort((a, b) => {
    const valA = getValue(a);
    const valB = getValue(b);

    // 若配置了自定义排序函数，优先使用自定义排序
    if (isFunction(method)) {
      const customRes = method(valA, valB);
      return state === 'descending' ? -customRes : customRes;
    }

    // 处理 null / undefined 值的排序顺序
    if (valA == null && valB == null) return 0;
    if (valA == null) return state === 'ascending' ? -1 : 1;
    if (valB == null) return state === 'ascending' ? 1 : -1;

    let diff = 0;

    // 数字类型排序
    if (isNumber(valA) && isNumber(valB)) {
      diff = valA - valB;
    }
    // 字符串类型排序
    else if (isString(valA) && isString(valB)) {
      diff = valA.localeCompare(valB);
    }
    // 布尔类型排序 (false < true)
    else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      diff = Number(valA) - Number(valB);
    }
    // 其他混合/未知类型兜底转化为字符串比较
    else {
      diff = String(valA).localeCompare(String(valB));
    }

    // 根据正序 (ascending) 或倒序 (descending) 返回排序结果
    return state === 'descending' ? -diff : diff;
  });
  console.log("🚀 ~ filterCore ~ list: ", list);
  return list;
};

