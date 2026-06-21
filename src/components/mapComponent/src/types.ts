import type { Position } from 'geojson';

// 基础城市信息接口
export interface CityInfo {
  adcode: number;
  name: string;
  center: [number, number];
  properties?: any;
}

// 地图当前视口变换状态
export interface MapTransformState {
  scale: number;
  offset: { x: number; y: number };
}

// 投影函数类型定义：输入 [lng, lat]，输出平面 [x, y]
export type ProjectionFn = (coord: Position) => [number, number];

// 动态样式函数定义：接收城市信息，返回 CSS 样式对象或字符串
export type CityStyleFn = (city: CityInfo) => Record<string, string | number>;

export interface Feature {
  info: CityInfo;
  pathData: string;
  customStyle: Record<string, string | number>;
}

export interface MarkedCityGroup {
  id: number;
  style?: { color?: string };
  nodes: Record<number, number[]>;
}

export interface MarkedCityGraphFeature {
  id: number;
  style?: { color?: string };
  // 缓存匹配到的全量 Feature，方便 O(1) 查找
  featureMap: Record<string, Feature>;
  // 独立提取出所有需要绘制的边，供 v-for 渲染
  edges: { from: Feature; to: Feature }[];
}
