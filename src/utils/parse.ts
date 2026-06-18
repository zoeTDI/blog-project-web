/**
 * 色值解析函数
 * @param {any} value 待解析的值
 * @returns {string|null} 解析成功返回 #RRGGBB 格式的字符串，失败返回 null
 */
const parseToHexColor = (value: any): string | null => {
  if (value === null || value === undefined) return null;
  let str: string = String(value).trim().toLowerCase();
  const hexRegex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
  const match = str.match(hexRegex);
  if (match) {
    let hex: string = match[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((char: string) => char + char)
        .join('');
    }
    if (hex.length === 8) {
      hex = hex.slice(0, 6);
    }
    return `#${hex}`;
  }
};

export { parseToHexColor };
