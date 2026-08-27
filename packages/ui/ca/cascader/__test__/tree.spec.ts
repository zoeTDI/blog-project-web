import { describe, expect, it } from 'vitest';
import { DEFAULT_FIELD_NAMES } from '../src/constants';
import {
  addPaths,
  collectSelectableLeafPaths,
  dedupePaths,
  findOptionPath,
  getOptionCheckState,
  getOptionChildren,
  getOptionLabel,
  getOptionValue,
  getPathValues,
  hasPath,
  isOptionDisabled,
  isSamePath,
  removePaths,
} from '../src/tree';
import type { CascadeFieldName, CascaderOption } from '../src/types';

const options: CascaderOption[] = [
  {
    value: 'a',
    label: '节点 A',
    children: [
      { value: 'a-1', label: '节点 A-1' },
      { value: 'a-2', label: '节点 A-2', disabled: true },
      {
        value: 'a-3',
        label: '节点 A-3',
        children: [{ value: 'a-3-1', label: '节点 A-3-1' }],
      },
    ],
  },
  { value: 1, label: '数字节点' },
];

describe('Cascader 树结构工具函数', () => {
  it('根据字段映射读取节点属性', () => {
    const fieldNames: CascadeFieldName = {
      label: 'name',
      value: 'id',
      children: 'items',
      disabled: 'locked',
    };
    const option = {
      id: 1,
      name: '自定义节点',
      items: [{ id: 2, name: '子节点' }],
      locked: true,
    };

    expect(getOptionLabel(option, fieldNames)).toBe('自定义节点');
    expect(getOptionValue(option, fieldNames)).toBe(1);
    expect(getOptionChildren(option, fieldNames)).toEqual(option.items);
    expect(isOptionDisabled(option, fieldNames)).toBe(true);
  });

  it('根据值路径查找节点路径', () => {
    const path = findOptionPath(
      options,
      ['a', 'a-3', 'a-3-1'],
      DEFAULT_FIELD_NAMES,
    );

    expect(path.map((option) => option.label)).toEqual([
      '节点 A',
      '节点 A-3',
      '节点 A-3-1',
    ]);
    expect(getPathValues(path, DEFAULT_FIELD_NAMES)).toEqual(['a', 'a-3', 'a-3-1']);
  });

  it('路径不存在时只返回能够匹配的前缀', () => {
    const path = findOptionPath(options, ['a', 'missing'], DEFAULT_FIELD_NAMES);

    expect(getPathValues(path, DEFAULT_FIELD_NAMES)).toEqual(['a']);
    expect(findOptionPath(options, ['missing'], DEFAULT_FIELD_NAMES)).toEqual([]);
  });

  it('按值和类型严格比较路径', () => {
    expect(isSamePath(['a', 1], ['a', 1])).toBe(true);
    expect(isSamePath(['a', 1], ['a', '1'])).toBe(false);
    expect(isSamePath(['a'], ['a', 1])).toBe(false);
    expect(hasPath([['a'], ['b', 1]], ['b', 1])).toBe(true);
  });

  it('对路径集合执行去重、添加和删除且不修改原数组', () => {
    const source = [['a', 'a-1']] as Array<Array<string | number>>;
    const additions = [['a', 'a-1'], ['a', 'a-3', 'a-3-1']];

    expect(dedupePaths([...source, ...additions])).toEqual([
      ['a', 'a-1'],
      ['a', 'a-3', 'a-3-1'],
    ]);
    expect(addPaths(source, additions)).toEqual([
      ['a', 'a-1'],
      ['a', 'a-3', 'a-3-1'],
    ]);
    expect(removePaths(additions, [['a', 'a-1']])).toEqual([
      ['a', 'a-3', 'a-3-1'],
    ]);
    expect(source).toEqual([['a', 'a-1']]);
  });

  it('收集后代叶子路径时排除禁用节点', () => {
    expect(collectSelectableLeafPaths(options[0], [], DEFAULT_FIELD_NAMES)).toEqual([
      ['a', 'a-1'],
      ['a', 'a-3', 'a-3-1'],
    ]);
    expect(collectSelectableLeafPaths(options[0].children[1], ['a'], DEFAULT_FIELD_NAMES)).toEqual([]);
  });

  it('计算父节点的未选、半选和全选状态', () => {
    expect(getOptionCheckState(
      options[0],
      [],
      [],
      DEFAULT_FIELD_NAMES,
    )).toEqual({ checked: false, indeterminate: false });

    expect(getOptionCheckState(
      options[0],
      [],
      [['a', 'a-1']],
      DEFAULT_FIELD_NAMES,
    )).toEqual({ checked: false, indeterminate: true });

    expect(getOptionCheckState(
      options[0],
      [],
      [['a', 'a-1'], ['a', 'a-3', 'a-3-1']],
      DEFAULT_FIELD_NAMES,
    )).toEqual({ checked: true, indeterminate: false });
  });

  it('严格模式只判断当前节点路径且不产生半选状态', () => {
    expect(getOptionCheckState(
      options[0],
      [],
      [['a']],
      DEFAULT_FIELD_NAMES,
      true,
    )).toEqual({ checked: true, indeterminate: false });

    expect(getOptionCheckState(
      options[0],
      [],
      [['a', 'a-1']],
      DEFAULT_FIELD_NAMES,
      true,
    )).toEqual({ checked: false, indeterminate: false });
  });
});
