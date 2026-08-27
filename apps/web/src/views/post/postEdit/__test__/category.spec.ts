import { describe, expect, it } from 'vitest';
import { normalizeCategoryTrees } from '../category';

describe('normalizeCategoryTrees', () => {
  it('保留二维数字路径', () => {
    expect(normalizeCategoryTrees([[1, 2], [3, 4, 5]])).toEqual([
      [1, 2],
      [3, 4, 5],
    ]);
  });

  it('将数字字符串转换为 number', () => {
    expect(normalizeCategoryTrees([['1', '2'], [3, '4']])).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('过滤空路径和包含非法分类 ID 的路径', () => {
    expect(normalizeCategoryTrees([
      [],
      [1, 'invalid'],
      [2, ''],
      [3, null],
      [4, 5],
    ])).toEqual([[4, 5]]);
  });

  it('非数组输入返回空数组', () => {
    expect(normalizeCategoryTrees(null)).toEqual([]);
    expect(normalizeCategoryTrees([1, 2])).toEqual([]);
  });
});
