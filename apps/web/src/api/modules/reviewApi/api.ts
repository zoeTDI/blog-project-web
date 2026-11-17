import { defHttp } from "@/utils/request"

const API_PREFIX = "/post/review"

const Api = {
  getReviewingPostPage: `${API_PREFIX}/list`,
  getReviewingDetail: `${API_PREFIX}/detail`,
}

export const fetchReviewingPostPage = (payload: any): Promise<any> => {
  return defHttp.get(Api.getReviewingPostPage, { params: payload });
}
