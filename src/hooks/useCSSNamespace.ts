import type { Ref } from 'vue';

export const useCSSNamespace = (
  block: string,
  namespaceOverride?: Ref<string | undefined>
) => {
  const getNamespace = (
    namespaceOverride: Ref<string | undefined> | undefined
  ) => {
    if (
      namespaceOverride &&
      typeof namespaceOverride.value === 'string' &&
      namespaceOverride.value.trim() !== ''
    ) {
      return namespaceOverride.value;
    } else {
      return 'ca';
    }
  };

  const namespace = getNamespace(namespaceOverride);
  const statePrefix = 'is-';

  /**
   * 生成 BEM 标准类名的核心内部方法
   * @param block 块名 (Block) - 组件的最外层容器名称 (e.g., 'button')
   * @param suffix 后缀 - 用于生成 block-suffix 格式的特殊变体 (e.g., 'close' -> 'dialog-close')
   * @param element 元素名 (Element) - 块的子元素，使用双下划线连接 (e.g., 'header' -> 'button__header')
   * @param modifier 修饰符 (Modifier) - 块或元素的状态/变体，使用双连字符连接 (e.g., 'primary' -> 'button--primary')
   * @returns 拼接完成的 CSS 类名字符串
   */
  const _bem = (
    block: string,
    suffix: string,
    element: string,
    modifier: string
  ) => {
    let cls = `${namespace}-${block}`;
    if (suffix) cls += `-${suffix}`;
    if (element) cls += `__${element}`;
    if (modifier) cls += `--${modifier}`;
    return cls;
  };

  // 生成块名
  const b = () => _bem(block, '', '', '');
  // 生成后缀名
  const s = (suffix: string) => _bem(block, suffix, '', '');
  // 生成元素名
  const e = (element: string) => _bem(block, '', element, '');
  // 添加修饰符
  const m = (modifier?: string) =>
    modifier ? _bem(block, '', '', modifier) : '';

  // 生成修饰符
  const is = (name: string, state: boolean | undefined = true) =>
    name && state ? `${statePrefix}${name}` : '';

  // Element + Modifier 的组合简写
  const em = (element: string, modifier: string) =>
    element && modifier ? _bem(block, '', element, modifier) : '';

  // Block + Suffix (用于特殊独立子部件，如 dialog-close)
  const se = (suffix: string, element: string) =>
    suffix && element ? _bem(block, suffix, element, '') : '';

  const sm = (suffix: string, modifier: string) =>
    suffix && modifier ? _bem(block, suffix, '', modifier) : '';

  const sem = (suffix: string, element: string, modifier: string) =>
    suffix && element && modifier ? _bem(block, suffix, element, modifier) : '';

  const cssVarName = (name: string): string => `--${namespace}-${name}`;
  const cssVar = (obj: Record<string, string>) => {
    const style: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key]) {
        style[`--${namespace}-${key}`] = obj[key];
      }
    }
    return style;
  };

  const cssVarBlockName = (name: string): string =>
    `--${namespace}-${block}-${name}`;
  const cssVarBlock = (obj: Record<string, string>) => {
    const style: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key]) {
        style[`--${namespace}-${block}-${key}`] = obj[key];
      }
    }
    return style;
  };

  return {
    b,
    s,
    e,
    m,
    is,
    em,
    se,
    sm,
    sem,
    cssVarName,
    cssVar,
    cssVarBlockName,
    cssVarBlock,
  };
};
