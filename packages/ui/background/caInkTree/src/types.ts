export interface CaInkTreeProps {
  /** 最大同时存在的树数量[cite: 1] */
  maxTrees?: number;
  /** 最大分枝代数[cite: 1] */
  maxGenerations?: number;
  /** 单个分枝最小长度[cite: 1] */
  minBranchLen?: number;
  /** 单个分枝最大长度[cite: 1] */
  maxBranchLen?: number;
  /** 生成新树的时间间隔(ms)[cite: 1] */
  spawnInterval?: number;
  /** CSS 变量名，用于动态提取主题颜色 */
  colorVarName?: string;
  /** 自定义树枝颜色获取函数（优先级高于 colorVarName） */
  colorGetter?: (alpha: number) => string;
}