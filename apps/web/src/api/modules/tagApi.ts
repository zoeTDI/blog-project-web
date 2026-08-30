import { defHttp } from '@/utils/request.ts';

const Api = {
  allTagsByAuthor: '/post/getAllTagsByAuthor',
} as const;

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

export const getAllTagsByAuthor = (): Promise<Tag[]> => {
  return defHttp.get(Api.allTagsByAuthor);
};
