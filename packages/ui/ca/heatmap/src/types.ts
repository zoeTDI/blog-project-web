export interface HeatmapValue {
  id: number;
  date: string; // 日期字符串，格式统一为 "YYYY-MM-DD"
  count: number; // 业务数值（如：打卡次数、提交量）
  [key: string]: any; // 允许携带其他自定义业务字段
}

export type HeatmapData = Record<string, HeatmapValue>;

export interface CaHeatmapProps {
  data?: HeatmapData;
  rate?: number | null;
  height?: number;
  /* 取值范围：1~100,单位：百分比 */
  bottomHeight?: number;
  firstDayOfWeek?: number;
  levelBy?: [number, number, number, number];
  loading?: boolean;
}

export interface CaHeatmapTipProps {
  x: number;
  y: number;
  data: HeatmapValue | null;
}