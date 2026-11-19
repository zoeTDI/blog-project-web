import type { blogPostStatus, blogPostType } from '@/api/modules/postApi';
import type { ValueOf } from '@caldm/utils';

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

export type BlogPostType = ValueOf<typeof blogPostType>;
export type BlogPostStatus = ValueOf<typeof blogPostStatus>;

