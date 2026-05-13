/** 原始图片/业务项的数据结构 */
export interface ImageItem {
    id: number | string;
    url: string;
    alt?: string;
    [key: string]: any;
}

/** 虚拟列表计算后传给插槽的位置信息 */
export interface VirtualPosition {
    virtualId: string;
    top: number;
    left: number;
    width: number;
    height: number;
}

/** 组件 Props 定义 */
export interface CaVirtualGridProps {
    list: ImageItem[];
    minWidth?: number;
    aspectRatio?: number;
    buffer?: number;
    /** 是否开启单向循环滚动 (仅向下) */
    isLoop?: boolean;
}