import type { BlogPostType, CategoryTreeNode, Tag } from "../postApi";

export interface PublishedPostPagePayload {
  page: number,
  size: number,
};

export interface PublishPostSummary {
  id: number,
  authorId: number,
  author: string;
  title: string,
  subtitle: string,
  contentMd: string,
  contentHtml: string,
  summary: string,
  type: BlogPostType,
  isTop: boolean,
  isOriginal: boolean,
  createTime: string,
  updateTime: string,
  publishedTime: string,
  views: number,
  likes: number,
  collects: number,
  commentCount: number,
  slug: string,
  seoKeywords: string,
  seoDescription: string,
  allowComment: boolean,
  reprintSource: string,
  tags: Tag[],
  categories: CategoryTreeNode[]
}

export interface PublishedPostPageResponse {
  records: PublishPostSummary[],
  total: number,
  size: number,
  page: number,
  pages: number,
}

export interface PublishedPostDetailPayload {
  id: number,
}

export interface PublishedPostDetailResponse {
  id: number,
  authorId: number,
  author: string,
  title: string,
  subtitle: string,
  contentMd: string,
  contentHtml: string,
  summary: string,
  type: BlogPostType,
  isTop: boolean,
  isOriginal: boolean,
  createTime: string,
  publishedTime: string,
  views: number,
  likes: number,
  collects: number,
  commentCount: number,
  slug: string,
  seoKeywords: string,
  seoDescription: string,
  allowComment: boolean,
  reprintSource: string,
  tags: Tag[],
  categories: CategoryTreeNode[],
}
