interface HeatmapValue {
  date: string; // 日期字符串，格式统一为 "YYYY-MM-DD"
  count: number; // 业务数值（如：打卡次数、提交量）
  level?: number; // 视觉等级（如 0~4），用于映射不同的 fill 颜色（可选）
  [key: string]: any; // 允许携带其他自定义业务字段
}

// 供外部传入的响应式数据源格式
// 推荐使用 Record 键值对存储，查询复杂度为 O(1)，性能最高
type HeatmapData = Record<string, HeatmapValue>;

export type { HeatmapData, HeatmapValue };
