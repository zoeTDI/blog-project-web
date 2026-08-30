import { defHttp } from '@/utils/request.ts';

const Api = {
  allCategoriesByAuthor: '/post/getAllCategoriesByAuthor',
} as const;

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

export const getAllCategoriesByAuthor = (): Promise<CategoryTreeNode[]> => {
  return defHttp.get(Api.allCategoriesByAuthor);
};
