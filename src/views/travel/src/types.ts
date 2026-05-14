/**
 * 城市足迹信息
 */
export interface Footprint {
    adcode: number;       // 行政区划代码（用于匹配 China.json 中的 properties.adcode）
    name: string;         // 城市名称
    articleCount: number; // 关联文章数量
    visited: boolean;     // 是否已去过（业务标识）
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