import { defHttp } from '@/utils/request.ts';
import type { PageQuery, PageResult } from '@/types/data';
import type { CreateUserResponse, UserPageItem } from '#/user';
import type {
  BanUserPayload,
  CreateUserPayload,
  SoftDeletePayload,
} from './contract';

const Api = {
  page: '/user/page',
  create: '/user/create',
  ban: '/user/ban',
  softDelete: '/user/softDelete',
};

export const page = (
  payload: PageQuery = { page: 1, size: 10 }
): Promise<PageResult<UserPageItem>> => {
  return defHttp.get(Api.page, { params: payload });
}

export const createUser = (
  payload: CreateUserPayload
): Promise<CreateUserResponse> => {
  return defHttp.post(Api.create, payload);
};

export const banUser = (payload: BanUserPayload): Promise<void> => {
  return defHttp.post(Api.ban, payload);
};

export const softDeleteUser = (payload: SoftDeletePayload): Promise<void> => {
  return defHttp.post(Api.softDelete, payload);
};
