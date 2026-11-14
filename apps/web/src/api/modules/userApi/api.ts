import { defHttp } from '@/utils/request.ts';
import type {
  BanUserPayload,
  CreateUserPayload,
  CreateUserResponse,
  PagePayload,
  SoftDeletePayload,
  UserPageResponse,
} from '@/api/modules/userApi/types.ts';

const Api = {
  page: '/user/page',
  create: '/user/create',
  ban: '/user/ban',
  softDelete: '/user/softDelete',
};

export const page = (payload: PagePayload = { page: 1, size: 10 }): Promise<UserPageResponse> => {
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
