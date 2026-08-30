import type {
  BlogPostCreatePayload,
  BlogPostStatus,
  BlogPostType,
  BlogPostUpdatePayload,
} from '@/api';

export interface PostEditForm {
  id: number | null;
  authorId: number;
  creator: string;
  updater: string;
  title: string;
  subtitle: string;
  contentMd: string;
  contentHtml: string;
  summary: string;
  type: BlogPostType;
  status: BlogPostStatus;
  isTop: boolean;
  isOriginal: boolean;
  createTime: string;
  updateTime: string;
  publishedTime: string;
  slug: string;
  seoKeywords: string;
  seoDescription: string;
  password: string;
  allowComment: boolean;
  reprintSource: string;
  sortWeight: number;
  category: number[][];
  tags: number[]
}

export interface _CategoryNode {
  value: number;
  label: string;
  children: _CategoryNode[];
}

export type _NewPostPayload = BlogPostCreatePayload;
export type _SavePostPayload = BlogPostUpdatePayload;
