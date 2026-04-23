// 定义完整的文章数据接口（包含未来扩展字段）
export interface Article {
    id: number;
    title: string;
    summary: string;
    date: string;
    tags: string[];
    cover?: string;
    views?: number;
    likes?: number;
    comments?: number;
    favorites?: number;
    author?: string;
    updatedDate?: string;
}

// 文章卡片 元数据配置接口
export interface MetaConfig {
    showDate?: boolean;
    showTags?: boolean;
    showViews?: boolean;
    showLikes?: boolean;
    showComments?: boolean;
    showFavorites?: boolean;
    showAuthor?: boolean;
    showUpdatedDate?: boolean;
}

