import { defHttp } from '@/utils/request.ts';
import type { BlogPostSummaryDTO } from '#/blogPost.ts';
import type {
  BlogPostCreatePayload,
  BlogPostEditDTO,
  BlogPostUpdatePayload,
} from '@/api/modules/postApi/types.ts';

const Api = {
  createBlogPost: '/post/blogPost/create',
  currentUserBlogPosts: '/post/blogPost/mine',
  getBlogPostById: '/post/blogPost/edit',
  update: '/post/blogPost/update',
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

export const createBlogPost = (
  payload: BlogPostCreatePayload
): Promise<number> => {
  return defHttp.post<number>(Api.createBlogPost, payload).then((postId) => {
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

export const getPostById = (payload: {
  id: number;
}): Promise<BlogPostEditDTO> => {
  return defHttp.get(Api.getBlogPostById, { params: payload });
};

export const updatePost = (payload: BlogPostUpdatePayload) => {
  return defHttp.post(Api.update, payload).then(resolve => {
    clearCurrentUserBlogPostCache();
    return resolve;
  })
}

