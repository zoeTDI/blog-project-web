import type { BlogPostStatus, BlogPostType } from '@/api/modules/postApi';

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

