export type BlogPostType = '普通文章' | '技术笔记' | '生活随笔' | '其他';

export type BlogPostStatus = '草稿' | '已发布' | '审核中' | '回收站' | '私密';

export interface BlogPostSummaryDTO {
  id: number;
  title: string;
  subtitle: string | null;
  summary: string | null;
  type: BlogPostType;
  status: BlogPostStatus;
  isTop: boolean;
  isOriginal: boolean;
  createTime: string;
  updateTime: string;
  publishedTime: string | null;
  views: number;
  likes: number;
  collects: number;
  commentCount: number;
  slug: string | null;
  allowComment: boolean;
  sortWeight: number;
}

