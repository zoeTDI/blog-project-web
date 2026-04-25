// 定义基础接口
export interface TimelineValue {
    [key: string]: any;
}

export interface TimelineItem {
    itemTitle?: string;
    values?: TimelineValue[];
}

export interface TimelineGroup {
    title: string;
    items: TimelineItem[];
}