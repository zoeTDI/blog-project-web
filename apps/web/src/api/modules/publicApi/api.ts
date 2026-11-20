import { defHttp } from "@/utils/request";
import type { PageQuery, PageResult } from '@/types/data';
import type { PublishPost } from '#/blogPost';
import type { PublishedPostDetailPayload } from './contract';

const API_PREFIX = "/public/post"

const Api = {
  getPublishedPostPage: `${API_PREFIX}/list`,
  getPublishedPostDetail: `${API_PREFIX}/detail`,
};

export const fetchPublishedPostPage = (payload: PageQuery): Promise<PageResult<PublishPost>> => {
  return defHttp.get(Api.getPublishedPostPage, { params: payload });
}

export const fetchPublishedPostDetail = (payload: PublishedPostDetailPayload): Promise<PublishPost> => {
  return defHttp.get(Api.getPublishedPostDetail, { params: payload });
}
