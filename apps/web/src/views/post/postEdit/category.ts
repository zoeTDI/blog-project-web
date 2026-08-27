/**
 * 将级联选择器的运行时值规范化为后端要求的分类路径数组。
 * 任一路径包含空值、非数字或非有限数字时，整条路径都会被忽略。
 */
export const normalizeCategoryTrees = (value: unknown): number[][] => {
  if (!Array.isArray(value)) return [];

  return value.reduce<number[][]>((result, path) => {
    if (!Array.isArray(path) || path.length === 0) return result;

    const normalizedPath = path.map((categoryId) => {
      if (typeof categoryId === 'number') return categoryId;
      if (typeof categoryId === 'string' && categoryId.trim() !== '') {
        return Number(categoryId);
      }
      return Number.NaN;
    });

    if (normalizedPath.every(Number.isFinite)) result.push(normalizedPath);
    return result;
  }, []);
};
