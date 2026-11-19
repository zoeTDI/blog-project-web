import { defHttp } from "@/utils/request"
import type { PageQuery, PageResult } from "@/types/data";
import type { BlogPostSummaryDTO } from "@/types/blogPost";

const API_PREFIX = "/post/review"

const Api = {
  getReviewingPostPage: `${API_PREFIX}/list`,
  getReviewingDetail: `${API_PREFIX}/detail`,
}

export const fetchReviewingPostPage = (payload: PageQuery): Promise<PageResult<BlogPostSummaryDTO>> => {
  return defHttp.get(Api.getReviewingPostPage, { params: payload });
}
