import { defHttp } from "@/utils/request";
import type { PublishedPostDetailPayload, PublishedPostPagePayload, PublishedPostPageResponse, PublishPost } from "./types";

const API_PREFIX = "/public/post"

const Api = {
  getPublishedPostPage: `${API_PREFIX}/list`,
  getPublishedPostDetail: `${API_PREFIX}/detail`,
};

export const fetchPublishedPostPage = (payload: PublishedPostPagePayload): Promise<PublishedPostPageResponse> => {
  return defHttp.get(Api.getPublishedPostPage, { params: payload });
}

export const fetchPublishedPostDetail = (payload: PublishedPostDetailPayload): Promise<PublishPost> => {
  return defHttp.get(Api.getPublishedPostDetail, { params: payload });
}
