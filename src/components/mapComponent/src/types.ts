import type { Position } from 'geojson';

// 基础城市信息接口
export interface CityInfo {
  id: number;
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
  adcodes: number[];
  style?: { color?: string };
}

export interface MarkedCityFeatureGroup extends MarkedCityGroup {
  features: Feature[];
}
