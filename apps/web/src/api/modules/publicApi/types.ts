import type { BlogPostType } from "@/types/blogPost";
import type { CategoryTreeNode } from "../postApi";

export interface PublishedPostPagePayload {
  page: number,
  size: number,
};

export interface PublishPost {
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
  tags: { id: number, name: string }[],
  categories: CategoryTreeNode[]
}

export interface PublishedPostPageResponse {
  records: PublishPost[],
  total: number,
  size: number,
  page: number,
  pages: number,
}

export interface PublishedPostDetailPayload {
  id: number,
}
