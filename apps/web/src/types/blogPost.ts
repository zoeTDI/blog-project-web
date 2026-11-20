import type { ValueOf } from '@caldm/utils';

export const blogPostType = {
  normal: '普通文章',
  techPost: '技术笔记',
  essay: '生活随笔',
  other: '其他',
} as const;

export const blogPostStatus = {
  draft: '草稿',
  published: '已发布',
  reviewing: '审核中',
} as const;

export type BlogPostType = ValueOf<typeof blogPostType>;

export type BlogPostStatus = ValueOf<typeof blogPostStatus>;

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

export interface BlogPostEditDTO {
  id: number;
  authorId: number;
  creator: string;
  updater: string;
  /** 标题（长度 ≤ 200） */
  title: string;
  /** 副标题（长度 ≤ 200） */
  subtitle: string;
  contentMd: string;
  contentHtml: string;
  /** 摘要（长度 ≤ 500） */
  summary: string;
  tags: number[];
  categories: number[][];
  type: BlogPostType;
  status: BlogPostStatus;
  /** 置顶状态 */
  isTop: boolean;
  /** 原创状态 */
  isOriginal: boolean;
  createTime: string;
  updateTime: string;
  publishedTime: string;
  /** URL 别名 */
  slug: string;
  /** SEO 关键词 */
  seoKeywords: string;
  /** SEO 描述 */
  seoDescription: string;
  password: string;
  /** 评论开关 */
  allowComment: boolean;
  /** 转载来源 */
  reprintSource: string;
  /** 排序权重 */
  sortWeight: number;
}

export interface BaseCategory {
  id: number;
  userId: number;
  parentId: number;
  name: string;
  slug: string;
  description: string;
  sortWeight: number;
  status: 0 | 1;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
  /* true 删除 false 未删除 */
  deleted: boolean;
}

export interface CategoryTreeNode {
  category: BaseCategory;
  children: CategoryTreeNode[];
}

export interface Tag {
  id: number;
  authorId: number;
  name: string;
  postCount: number;
  creator: string;
  updater: string;
  createTime: string;
  updateTime: string;
  /* true 删除 false 未删除 */
  deleted: boolean;
}

export interface PublishPost {
  id: number;
  authorId: number;
  author: string;
  title: string;
  subtitle: string;
  contentMd: string;
  contentHtml: string;
  summary: string;
  type: BlogPostType;
  isTop: boolean;
  isOriginal: boolean;
  createTime: string;
  updateTime: string;
  publishedTime: string;
  views: number;
  likes: number;
  collects: number;
  commentCount: number;
  slug: string;
  seoKeywords: string;
  seoDescription: string;
  allowComment: boolean;
  reprintSource: string;
  tags: { id: number; name: string }[];
  categories: CategoryTreeNode[];
}
