import { defHttp } from "@/utils/request";
import type { ReviewPayload, PublishedPayload, RejectPayload } from "./types";

const API_PREFIX = '/post';

const Api = {
  review: `${API_PREFIX}/status/review`,
  toPublished: `${API_PREFIX}/status/published`,
  reject: `${API_PREFIX}/status/reject`,
}

/**
 * 文章审核
 */
export const review = (payload: ReviewPayload) => {
  return defHttp.post(Api.review, null, { params: payload });
}

/**
 * 发布文章
 */
export const toPublished = (payload: PublishedPayload): Promise<any> => {
  return defHttp.post(Api.toPublished, null, { params: payload });
}

/**
 * 文章审核不通过
 */
export const reject = (payload: RejectPayload): Promise<any> => {
  return defHttp.post(Api.reject, null, { params: payload });
}
