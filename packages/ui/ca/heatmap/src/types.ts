export interface LayoutMetrics {
  size: number;   // 格子边长
  gap: number;    // 格子间距
  cols: number;   // 总列数
}

export interface ColumnDateRange {
  colFirstDay: Date;
  colLastDay: Date;
  isLastCol: boolean;
}

export interface HeatmapRect {
  id: string;
  x: number;
  y: number;
  size: number;
  data?: HeatmapValue;
}

export interface LabelResult {
  text: string;
  monthKey: string;
}

export interface LabelItem {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface GridConfigResult {
  rects: HeatmapRect[];
  labels: LabelItem[];
  size: number;
  gap: number;
  earliestDate: Date;
}

export type WeekdayFormat = 'full' | 'short' | 'numeric' | 'chinese';

export interface HeatmapValue {
  id: number;
  date: string; // 日期字符串，格式统一为 "YYYY-MM-DD"
  count: number; // 业务数值（如：打卡次数、提交量）
  [key: string]: any; // 允许携带其他自定义业务字段
}

export type HeatmapData = Record<string, HeatmapValue>;

export interface CaHeatmapProps {
  year?: number;
  data?: HeatmapData;
  rate?: number | null;
  height?: number;
  /* 取值范围：1~100,单位：百分比 */
  bottomHeight?: number;
  firstDayOfWeek?: number;
  levelBy?: [number, number, number, number];
  loading?: boolean;
  weekdayFormat?: WeekdayFormat;
  /* key: 1~7 (1=周一) */
  customWeekdayLabels?: Record<number, string>;
}

export interface CaHeatmapEmits {
  (e: 'update:year', year: number): void;
}

export interface CaHeatmapTipProps {
  x: number;
  y: number;
  data: HeatmapValue | null;
}
