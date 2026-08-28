import { defHttp } from '@/utils/request';
import type {
  BlogPostStatus,
  BlogPostSummaryDTO,
  BlogPostType,
} from '#/blogPost.ts';

const Api = {
  allTagsByAuthor: '/post/getAllTagsByAuthor',
  allCategoriesByAuthor: '/post/getAllCategoriesByAuthor',
  addBlogPost: '/post/blogPost/add',
  currentUserBlogPosts: '/post/blogPost/mine',
  getBlogPostById: '/post/blogPost',
};

// 过期时间
const BLOG_POST_PAGE_CACHE_TTL = 5 * 60 * 1000;
// 缓存实体
interface BlogPostPageCacheEntry {
  expiresAt: number;
  value: PageResult<BlogPostSummaryDTO>;
}

const blogPostPageCache = new Map<string, BlogPostPageCacheEntry>();
const blogPostPageRequests = new Map<
  string,
  Promise<PageResult<BlogPostSummaryDTO>>
>();

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

export interface Category {
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
  category: Category;
  children: CategoryTreeNode[];
}

export interface BlogPostCreatePayload {
  /** 标题（长度 ≤ 200） */
  title: string;
  /** 置顶状态 */
  isTop: boolean;
  /** 原创状态 */
  isOriginal: boolean;
  /** 评论开关 */
  allowComment: boolean;
  /** 排序权重 */
  sortWeight: number;

  /** 副标题（长度 ≤ 200） */
  subtitle?: string;
  /** Markdown 内容 */
  contentMd?: string;
  /** HTML 内容 */
  contentHtml?: string;
  /** 摘要（长度 ≤ 500） */
  summary?: string;
  /** 文章类型 */
  type?: number;
  /** 文章状态 */
  status?: number;
  /** 发布时间（ISO 8601 格式，如 "2026-08-26T10:30:00"） */
  publishedTime?: string;
  /** URL 别名 */
  slug?: string;
  /** SEO 关键词 */
  seoKeywords?: string;
  /** SEO 描述 */
  seoDescription?: string;
  /** 访问密码 */
  password?: string | null;
  /** 转载来源 */
  reprintSource?: string | null;
  /** 关联标签 ID 列表 */
  tagIds?: number[];
  /** 分类树结构 */
  categoryTrees?: number[][];
}

export interface BlogPostPageQueryDTO {
  page: number;
  size: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface BlogPostEditDTO {
  id: number;
  authorId: number;
  creator: string;
  updater: string;
  title: string;
  subtitle: string;
  contentMd: string;
  contentHtml: string;
  summary: string;
  tags: number[];
  categories: number[][];
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
}

export const getAllTagsByAuthor = (): Promise<Tag[]> => {
  return defHttp.get(Api.allTagsByAuthor);
};

export const getAllCategoriesByAuthor = (): Promise<CategoryTreeNode[]> => {
  return defHttp.get(Api.allCategoriesByAuthor);
};

export const addBlogPost = (payload: BlogPostCreatePayload) => {
  return defHttp.post<number>(Api.addBlogPost, payload).then((postId) => {
    clearCurrentUserBlogPostCache();
    return postId;
  });
};

export const clearCurrentUserBlogPostCache = () => {
  blogPostPageCache.clear();
};

export const getCurrentUserPosts = (
  query: BlogPostPageQueryDTO,
  forceRefresh = false
): Promise<PageResult<BlogPostSummaryDTO>> => {
  const cacheKey = `${query.page}:${query.size}`;
  const cached = blogPostPageCache.get(cacheKey);

  if (
    !forceRefresh && // 不刷新缓存
    cached && // 存在缓存
    cached.expiresAt > Date.now() // 缓存没有过期
  ) {
    // 返回缓存
    return Promise.resolve(cached.value);
  }

  const pendingRequest = blogPostPageRequests.get(cacheKey);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = defHttp
    .get<PageResult<BlogPostSummaryDTO>>(Api.currentUserBlogPosts, {
      params: query,
    })
    .then((result) => {
      blogPostPageCache.set(cacheKey, {
        expiresAt: Date.now() + BLOG_POST_PAGE_CACHE_TTL,
        value: result,
      });
      return result;
    })
    .finally(() => {
      blogPostPageRequests.delete(cacheKey);
    });

  blogPostPageRequests.set(cacheKey, request);
  return request;
};

export const getPostById = (payload: { id: number }): Promise<BlogPostEditDTO> => {
  return defHttp.get(Api.getBlogPostById + `/${payload.id}`);
};
