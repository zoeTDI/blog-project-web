/**
 * 获取安全的数字
 * @param val 必选 需要处理的值
 * @param max 可选 若val超过max，则返回max，若不传该参数，则直接返回
 * @param min 可选 若val小于min，则返回min，若不传该参数，则直接返回
 */
export function getSafeNumber(val: any, max?: number, min?: number) {
  let num = Number(val);
  if (isNaN(num)) {
    num = 0;
  }
  if (max !== undefined && num > max) {
    num = max;
  }
  if (min !== undefined && num < min) {
    num = min;
  }
  return num;
}
