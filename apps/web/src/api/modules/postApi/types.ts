import type { ValueOf } from '@caldm/utils';
import {
  blogPostStatus,
  type blogPostType,
} from '@/api/modules/postApi/constants.ts';

export type BlogPostType = ValueOf<typeof blogPostType>;

export type BlogPostStatus = ValueOf<typeof blogPostStatus>;

export interface BlogPostCreatePayload {
  /** 标题（长度 ≤ 200） */
  title: string;
  /** 副标题（长度 ≤ 200） */
  subtitle?: string;
  /** Markdown 内容 */
  contentMd?: string;
  /** HTML 内容 */
  contentHtml?: string;
  /** 摘要（长度 ≤ 500） */
  summary?: string;
  /** 文章类型 */
  type?: BlogPostType;
  /** 文章状态 */
  status?: BlogPostStatus;
  /** 置顶状态 */
  isTop: boolean;
  /** 原创状态 */
  isOriginal: boolean;
  /** URL 别名 */
  slug?: string;
  /** SEO 关键词 */
  seoKeywords?: string;
  /** SEO 描述 */
  seoDescription?: string;
  /** 访问密码 */
  password?: string;
  /** 评论开关 */
  allowComment: boolean;
  /** 转载来源 */
  reprintSource?: string;
  /** 排序权重 */
  sortWeight: number;
  /** 关联标签 ID 列表 */
  tagIds?: number[];
  /** 分类树结构 */
  categoryTrees?: number[][];
}

export interface BlogPostUpdatePayload {
  targetPostId: number;
  /** 标题（长度 ≤ 200） */
  title: string;
  /** 副标题（长度 ≤ 200） */
  subtitle?: string;
  contentMd: string;
  contentHtml: string;
  /** 摘要（长度 ≤ 500） */
  summary?: string;
  type: BlogPostType;
  status: BlogPostStatus;
  /** 置顶状态 */
  isTop: boolean;
  /** 原创状态 */
  isOriginal: boolean;
  publishedTime: string;
  /** URL 别名 */
  slug?: string;
  /** SEO 关键词 */
  seoKeywords?: string;
  /** SEO 描述 */
  seoDescription?: string;
  /** 评论开关 */
  allowComment: boolean;
  /** 转载来源 */
  reprintSource?: string;
  /** 排序权重 */
  sortWeight: number;
  /** 关联标签 ID 列表 */
  tagIds?: number[];
  /** 分类树结构 */
  categoryTrees?: number[][];
}
