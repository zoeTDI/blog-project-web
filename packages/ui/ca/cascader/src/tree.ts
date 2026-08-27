import type {
  CascadeFieldName,
  CascaderOption,
  CascaderPath,
  CascaderValue,
} from './types';

export interface CascaderCheckState {
  checked: boolean;
  indeterminate: boolean;
}

export const getOptionLabel = (
  option: CascaderOption | undefined,
  fieldNames: CascadeFieldName,
): string => {
  if (!option) return '';
  return option[fieldNames.label] ?? '';
};

export const getOptionValue = (
  option: CascaderOption | undefined,
  fieldNames: CascadeFieldName,
): CascaderValue | undefined => {
  if (!option) return undefined;
  return option[fieldNames.value];
};

export const getOptionChildren = (
  option: CascaderOption | undefined,
  fieldNames: CascadeFieldName,
): CascaderOption[] | undefined => {
  if (!option) return undefined;
  const children = option[fieldNames.children];
  return Array.isArray(children) ? children : undefined;
};

export const isOptionDisabled = (
  option: CascaderOption | undefined,
  fieldNames: CascadeFieldName,
): boolean => {
  if (!option) return false;
  return !!option[fieldNames.disabled];
};

export const getPathValues = (
  path: CascaderOption[],
  fieldNames: CascadeFieldName,
): CascaderPath => (
  path
    .map((option) => getOptionValue(option, fieldNames))
    .filter((value): value is CascaderValue => value !== undefined)
);

export const findOptionPath = (
  options: CascaderOption[],
  values: CascaderPath,
  fieldNames: CascadeFieldName,
  depth = 0,
): CascaderOption[] => {
  if (values.length === 0 || depth >= values.length) return [];

  const option = options.find(
    (item) => Object.is(getOptionValue(item, fieldNames), values[depth]),
  );
  if (!option) return [];

  const children = getOptionChildren(option, fieldNames);
  if (children?.length && depth + 1 < values.length) {
    return [option, ...findOptionPath(children, values, fieldNames, depth + 1)];
  }
  return [option];
};

export const isSamePath = (left: CascaderPath, right: CascaderPath): boolean => (
  left.length === right.length
  && left.every((value, index) => Object.is(value, right[index]))
);

export const hasPath = (paths: CascaderPath[], target: CascaderPath): boolean => (
  paths.some((path) => isSamePath(path, target))
);

export const dedupePaths = (paths: CascaderPath[]): CascaderPath[] => {
  return paths.reduce<CascaderPath[]>((result, path) => {
    if (!hasPath(result, path)) result.push([...path]);
    return result;
  }, []);
};

export const addPaths = (
  paths: CascaderPath[],
  additions: CascaderPath[],
): CascaderPath[] => dedupePaths([...paths, ...additions]);

export const removePaths = (
  paths: CascaderPath[],
  removals: CascaderPath[],
): CascaderPath[] => (
  paths
    .filter((path) => !hasPath(removals, path))
    .map((path) => [...path])
);

export const collectSelectableLeafPaths = (
  option: CascaderOption,
  parentPath: CascaderPath,
  fieldNames: CascadeFieldName,
): CascaderPath[] => {
  if (isOptionDisabled(option, fieldNames)) return [];

  const value = getOptionValue(option, fieldNames);
  if (value === undefined) return [];

  const currentPath = [...parentPath, value];
  const children = getOptionChildren(option, fieldNames);
  if (!children?.length) return [currentPath];

  return children.flatMap((child) => (
    collectSelectableLeafPaths(child, currentPath, fieldNames)
  ));
};

export const getOptionCheckState = (
  option: CascaderOption,
  parentPath: CascaderPath,
  selectedPaths: CascaderPath[],
  fieldNames: CascadeFieldName,
  checkStrictly = false,
): CascaderCheckState => {
  const value = getOptionValue(option, fieldNames);
  if (value === undefined || isOptionDisabled(option, fieldNames)) {
    return { checked: false, indeterminate: false };
  }

  if (checkStrictly) {
    return {
      checked: hasPath(selectedPaths, [...parentPath, value]),
      indeterminate: false,
    };
  }

  const leafPaths = collectSelectableLeafPaths(option, parentPath, fieldNames);
  const selectedCount = leafPaths.filter((path) => hasPath(selectedPaths, path)).length;

  return {
    checked: leafPaths.length > 0 && selectedCount === leafPaths.length,
    indeterminate: selectedCount > 0 && selectedCount < leafPaths.length,
  };
};
