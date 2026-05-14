/**
 * 城市足迹信息
 */
export interface Footprint {
    adcode: number;
    name: string;
    articleCount: number;
    visited: boolean;
    articles?: string[];
}

/**
 * 旅途连线（从哪里出发，到哪里去）
 */
export interface TravelRoute {
    id: string | number;
    fromAdcode: number;   // 出发地 adcode
    toAdcode: number;     // 目的地 adcode
}

/**
 * 后端接口返回的完整数据结构
 */
export interface TravelDataResponse {
    footprints: Footprint[];
    routes: TravelRoute[];
}

/**
 * 计算属性用：城市 adcode 与数据的快速映射表
 */
export type FootprintMap = Record<number, Footprint>;