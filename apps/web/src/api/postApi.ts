import { defHttp } from "@/utils/request";

const Api = {
  allTagsByAuthor: '/post/getAllTagsByAuthor',
  allCategoriesByAuthor: '/post/getAllCategoriesByAuthor',
  addBlogPost: '/post/blogPost/add'
};

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


export const getAllTagsByAuthor = (): Promise<Tag[]> => {
  return defHttp.get(Api.allTagsByAuthor);
}

export const getAllCategoriesByAuthor = (): Promise<CategoryTreeNode[]> => {
  return defHttp.get(Api.allCategoriesByAuthor);
}

export const addBlogPost = (payload: BlogPostCreatePayload) => {
  return defHttp.post(Api.addBlogPost, payload);
}
